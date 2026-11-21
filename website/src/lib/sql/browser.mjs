'use client';

import { stripTrailingSemicolons } from './engine.mjs';
import { testsFor, timeoutFor } from './tests.mjs';

export class TimeoutError extends Error {}

// one worker for the whole tab. if a query times out the worker is killed
// and a fresh one is started next time (datasets get rebuilt as needed).
let worker = null;
let loadedKeys = new Set();
let nextId = 1;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker.mjs', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id);
    if (!p) return;
    pending.delete(data.id);
    clearTimeout(p.timer);
    if (data.ok) p.resolve(data);
    else {
      const err = new Error(data.error);
      err.names = data.names;
      p.reject(err);
    }
  };
  worker.onerror = (e) => {
    for (const p of pending.values()) p.reject(new Error(e.message || 'the sql engine crashed'));
    pending.clear();
    resetWorker();
  };
  return worker;
}

function resetWorker() {
  worker?.terminate();
  worker = null;
  loadedKeys = new Set();
}

function request(msg, timeoutMs) {
  const w = getWorker();
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = timeoutMs
      ? setTimeout(() => {
          pending.delete(id);
          resetWorker();
          reject(new TimeoutError(`took longer than ${Math.round(timeoutMs / 1000)}s, so it was stopped`));
        }, timeoutMs)
      : null;
    pending.set(id, { resolve, reject, timer });
    w.postMessage({ ...msg, id });
  });
}

async function ensureLoaded(set, tests, onProgress) {
  const missing = tests.filter((t) => !loadedKeys.has(t.key));
  for (const t of missing) {
    onProgress?.(t);
    await request({ type: 'load', datasets: [{ key: t.key, schema: set.schema, data: t.data }] });
    loadedKeys.add(t.key);
  }
}

async function toPostgres(sql, dialect) {
  const clean = stripTrailingSemicolons(sql);
  if (!clean) throw new Error('write a query first.');
  if (dialect === 'postgres') return { sql: clean, translated: false };
  const { translate } = await import('./dialects.mjs');
  return translate(clean, dialect);
}

export async function runOnSample(set, questionSlug, sql, dialect) {
  const pg = await toPostgres(sql, dialect);
  const sample = testsFor(set, questionSlug)[0];
  await ensureLoaded(set, [sample]);
  const r = await request({ type: 'run', key: sample.key, sql: pg.sql, wantRows: true }, timeoutFor(set, sample));
  return { ...r, ranAs: pg.translated ? pg.sql : null };
}

// runs every test and reports as it goes. onUpdate gets the full list each time.
export async function submit(set, question, sql, dialect, onUpdate) {
  const pg = await toPostgres(sql, dialect);
  const tests = testsFor(set, question.slug).filter((t) => question.expected?.[t.id]);
  const results = tests.map((t) => ({ id: t.id, name: t.name, kind: t.kind, status: 'waiting' }));
  const update = () => onUpdate?.(results.map((r) => ({ ...r })));
  update();

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const expected = question.expected[t.id];
    const res = results[i];

    if (!loadedKeys.has(t.key)) {
      res.status = 'preparing';
      update();
      await ensureLoaded(set, [t]);
    }

    res.status = 'running';
    update();
    try {
      const r = await request(
        { type: 'run', key: t.key, sql: pg.sql, wantRows: t.kind === 'sample' },
        timeoutFor(set, t)
      );
      Object.assign(res, {
        status: r.hash === expected.hash ? 'pass' : 'fail',
        ms: r.ms,
        rows: r.rowCount,
        expectedRows: expected.rowCount,
        columns: r.columns,
        expectedColumns: expected.columns,
        result: r.result,
      });
    } catch (e) {
      if (e instanceof TimeoutError) {
        res.status = 'timeout';
        res.error = e.message;
      } else {
        res.status = 'error';
        res.error = String(e.message).split('\n')[0];
      }
      // an error on one dataset will be an error on all of them
      if (res.status === 'error') {
        results.slice(i + 1).forEach((r) => (r.status = 'skipped'));
        update();
        break;
      }
    }
    update();
  }

  return { results, ranAs: pg.translated ? pg.sql : null };
}

export async function describeTables(set, questionSlug) {
  const sample = testsFor(set, questionSlug)[0];
  await ensureLoaded(set, [sample]);
  const { tables } = await request({ type: 'describe', key: sample.key }, 20000);
  return tables;
}

// the topic pages: run any sql on the shared sample database. every run is
// undone afterwards, so examples can't break each other.
export async function runPlayground(dataset, sql) {
  const clean = sql.trim();
  if (!clean.replace(/--.*$/gm, '').trim()) throw new Error('write a query first.');
  // the first run downloads the database engine (~10 MB). that can take a while on
  // a slow connection, so it happens without a time limit, only the query is timed.
  if (!loadedKeys.has(dataset.key)) {
    await (loading.get(dataset.key) ??
      loading
        .set(
          dataset.key,
          request({ type: 'load', datasets: [dataset] }).finally(() => loading.delete(dataset.key))
        )
        .get(dataset.key));
    loadedKeys.add(dataset.key);
  }
  return request({ type: 'play', dataset, sql: clean }, 15000);
}

const loading = new Map();

export function isReady(key) {
  return loadedKeys.has(key);
}
