// Runs PGlite off the main thread so a slow or endless query can be killed
// (by terminating the worker) without freezing the page.

import { PGlite } from '@electric-sql/pglite';
import { createEngine, loadDataset, runQuery, schemaName, RAW_PARSERS } from './engine.mjs';
import { canonicalize, hashResult, canonValue } from './grading.mjs';

let enginePromise = null;
const loaded = new Set();
const MAX_ROWS_BACK = 500;

// table and column names in a dataset, so errors can say "did you mean ..."
async function namesIn(db, key) {
  try {
    const { rows } = await db.query(
      `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = $1`,
      [schemaName(key)]
    );
    return {
      tables: [...new Set(rows.map((r) => r.table_name))],
      columns: [...new Set(rows.map((r) => r.column_name))],
    };
  } catch {
    return { tables: [], columns: [] };
  }
}

function stripComments(sql) {
  return sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

async function handle(db, msg) {
  if (msg.type === 'load') {
    for (const ds of msg.datasets) {
      if (loaded.has(ds.key)) continue;
      await loadDataset(db, ds.key, ds);
      loaded.add(ds.key);
    }
    return {};
  }

  if (msg.type === 'run') {
    const started = performance.now();
    const result = await runQuery(db, msg.key, msg.sql);
    const ms = Math.round(performance.now() - started);
    const canonical = canonicalize(result);
    return {
      ms,
      hash: await hashResult(canonical),
      rowCount: canonical.rows.length,
      columns: canonical.columns,
      result: msg.wantRows ? { fields: result.fields, rows: result.rows.slice(0, MAX_ROWS_BACK) } : null,
    };
  }

  // free-form sql for the topic pages: several statements allowed, changes are
  // always undone so the sample data never drifts.
  if (msg.type === 'play') {
    const ds = msg.dataset;
    if (!loaded.has(ds.key)) {
      await loadDataset(db, ds.key, ds);
      loaded.add(ds.key);
    }
    const ownsTransaction = /\b(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;/i.test(stripComments(msg.sql) + ';');
    const started = performance.now();
    let results;
    try {
      await db.exec(`SET search_path TO ${schemaName(ds.key)}, public;`);
      if (!ownsTransaction) await db.exec('BEGIN');
      results = await db.exec(msg.sql, { parsers: RAW_PARSERS });
    } finally {
      try {
        await db.exec('ROLLBACK');
      } catch {}
      await db.exec('SET search_path TO public;');
      // the query ran its own transaction and may have committed changes: rebuild the data
      if (ownsTransaction) await loadDataset(db, ds.key, ds);
    }
    const ms = Math.round(performance.now() - started);
    const sets = results.filter((r) => r.fields?.length);
    const last = sets[sets.length - 1];
    let rowsHash = null;
    let cols = null;
    if (last) {
      // one fingerprint per column (its values, sorted), so a practice check can
      // tell "extra column" or "missing column" apart from "wrong values"
      cols = await Promise.all(
        last.fields.map(async (f) => ({
          name: f.name,
          sig: await hashResult(last.rows.map((r) => canonValue(r[f.name], f.dataTypeID)).sort()),
        }))
      );
      // compare rows only, so people can name their columns however they like
      const canonical = canonicalize(last);
      rowsHash = await hashResult({ columns: canonical.columns.length, rows: canonical.rows });
    }
    return {
      ms,
      rowsHash,
      cols,
      rowCount: last ? last.rows.length : 0,
      results: sets.slice(-5).map((r) => ({ fields: r.fields, rows: r.rows.slice(0, MAX_ROWS_BACK), total: r.rows.length })),
      affected: results.reduce((n, r) => n + (r.affectedRows || 0), 0),
    };
  }

  if (msg.type === 'describe') {
    const schema = schemaName(msg.key);
    const { rows: cols } = await db.query(
      `SELECT table_name, column_name, data_type
       FROM information_schema.columns
       WHERE table_schema = $1
       ORDER BY table_name, ordinal_position`,
      [schema]
    );
    const tables = {};
    for (const c of cols) (tables[c.table_name] ??= { columns: [], rows: null }).columns.push(c);
    for (const name of Object.keys(tables)) {
      const r = await runQuery(db, msg.key, `SELECT * FROM "${name}"`);
      tables[name].rows = { fields: r.fields, rows: r.rows };
    }
    return { tables };
  }

  throw new Error(`unknown message ${msg.type}`);
}

self.onmessage = async ({ data: msg }) => {
  const db = await (enginePromise ??= createEngine(PGlite));
  try {
    self.postMessage({ id: msg.id, ok: true, ...(await handle(db, msg)) });
  } catch (e) {
    const key = msg.key || msg.dataset?.key;
    const names = key ? await namesIn(db, key) : null;
    self.postMessage({ id: msg.id, ok: false, error: String(e?.message || e), names });
  }
};
