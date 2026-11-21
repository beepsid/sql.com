// Reads content/problems, runs each solution.sql on every test dataset
// (sample, named cases, random, large) and writes src/generated/problems.json
// with hashes of the expected results. Solutions never go into the website.
//
// expected.json remembers a fingerprint of everything that went into it
// (schema, test data, solution, grading code). If nothing changed, the
// question is skipped, so `npm run dev` starts fast.
//
// If a question has no solution.sql (it's kept out of git), the expected.json
// written on a previous run is used instead, and the build complains loudly
// if the test data changed since then. `--strict` turns that into an error
// (used before a deploy so a stale answer can never ship).
//
// Optional wrong*.sql files next to a solution are common mistakes. Each one
// has to fail at least one test, otherwise the tests are too weak.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { PGlite } from '@electric-sql/pglite';
import { marked } from 'marked';
import { createEngine, loadDataset, runQuery, stripTrailingSemicolons } from '../src/lib/sql/engine.mjs';
import { canonicalize, hashResult } from '../src/lib/sql/grading.mjs';
import { testsFor, DEFAULTS } from '../src/lib/sql/tests.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(here, '..', '..', 'content', 'problems');
const OUT_FILE = path.join(here, '..', 'src', 'generated', 'problems.json');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const force = args.includes('--force');
const only = args.find((a) => !a.startsWith('--'));
const SAMPLE_ROWS = 100;

const sha = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
// grading code is part of the fingerprint, change it and everything rebuilds
const ENGINE_HASH = sha(
  ['engine.mjs', 'grading.mjs', 'tests.mjs']
    .map((f) => fs.readFileSync(path.join(here, '..', 'src', 'lib', 'sql', f), 'utf8'))
    .join('\n') + 'v2'
);

// "learn this first" links: a question's tags point at the topics that teach them.
// a question can also list topics itself with `learn: beginner/02-where-filtering`.
const CONTENT_DIR = path.join(here, '..', '..', 'content');
const TOPIC_TITLES = {};
for (const level of ['beginner', 'intermediate', 'advanced']) {
  const dir = path.join(CONTENT_DIR, level);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    const readme = path.join(dir, slug, 'README.md');
    if (fs.existsSync(readme)) TOPIC_TITLES[`${level}/${slug}`] = fs.readFileSync(readme, 'utf8').match(/^# (.+)$/m)?.[1].trim();
  }
}
const TAG_TOPICS = [
  [/^(aggregation|count|sum|avg|min|max|count\(column\))$/, 'beginner/07-aggregation-basics'],
  [/group by|having/, 'intermediate/05-group-by-having'],
  [/distinct/, 'beginner/08-distinct-values'],
  [/case when|conditional (counts|aggregation)/, 'beginner/10-case-when'],
  [/null|coalesce/, 'beginner/04-null-handling'],
  [/^join$/, 'intermediate/01-inner-join'],
  [/left join/, 'intermediate/02-left-right-joins'],
  [/self join/, 'intermediate/03-self-joins'],
  [/on vs where/, 'intermediate/04-join-predicates'],
  [/subquer/, 'intermediate/07-subqueries'],
  [/^ctes?$/, 'intermediate/08-ctes'],
  [/date|timestamp|interval|extract|age$/, 'intermediate/10-date-functions'],
  [/fan-out/, 'intermediate/11-join-fan-out'],
  [/anti-join|not exists|not in/, 'intermediate/12-anti-joins'],
  [/percentages|round|share of total/, 'intermediate/13-numeric-functions'],
  [/window|rank|row_number|lag|lead|running|top (n|1) per group|first per group|over$/, 'advanced/01-window-functions'],
  [/performance/, 'advanced/03-query-optimization'],
  [/non-equi|interval overlap/, 'advanced/05-non-equi-joins'],
  [/recursive|hierarchy/, 'advanced/09-recursive-ctes'],
  [/percentile|statistics/, 'advanced/10-advanced-aggregation'],
  [/gaps|islands|session|retention|cohort|funnel|spine|period over period|rolling/, 'advanced/12-cte-patterns'],
];
function learnLinks(meta, tags) {
  const ids = meta.learn
    ? list(meta.learn)
    : [...new Set(tags.flatMap((t) => TAG_TOPICS.filter(([re]) => re.test(t.toLowerCase())).map(([, id]) => id)))];
  return ids
    .filter((id) => TOPIC_TITLES[id])
    .slice(0, 4)
    .map((id) => ({ id, href: `/${id}/`, title: TOPIC_TITLES[id] }));
}

const problems = [];
const warn = (msg) => {
  problems.push(msg);
  console.warn('  ! ' + msg);
};

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2] };
}

// question.md can end with "## hints" (a list, shown one at a time) and
// "## explanation" (shown once you solve it, or if you ask for it).
function splitSections(body) {
  const parts = body.split(/^##\s+(hints|explanation)\s*$/im);
  const out = { question: parts[0].trim(), hints: [], explanation: '' };
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].toLowerCase();
    const text = (parts[i + 1] || '').trim();
    if (name === 'hints') {
      out.hints = text
        .split(/\r?\n(?=\s*[-*]\s)/)
        .map((h) => h.replace(/^\s*[-*]\s+/, '').trim())
        .filter(Boolean)
        .map((h) => marked.parseInline(h));
    } else {
      out.explanation = marked.parse(text);
    }
  }
  return out;
}

function parseCase(file, text) {
  const header = (key) => text.match(new RegExp(`^--\\s*${key}:\\s*(.+)$`, 'mi'))?.[1].trim();
  return {
    id: 'case-' + path.basename(file, '.sql'),
    name: header('name') || path.basename(file, '.sql'),
    for: list(header('for')),
    data: text,
  };
}

const list = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const numberOpts = (meta) =>
  Object.fromEntries(Object.keys(DEFAULTS).filter((k) => meta[k]).map((k) => [k, Number(meta[k])]));

// the solution's output on the sample data, so people can compare against it
function sampleOutput(result) {
  const fields = result.fields.map((f) => ({ name: f.name }));
  const rows = result.rows.slice(0, SAMPLE_ROWS).map((row) => {
    const o = {};
    for (const f of result.fields) {
      const v = row[f.name];
      o[f.name] = v === null || v === undefined ? null : typeof v === 'object' ? JSON.stringify(v) : String(v);
    }
    return o;
  });
  return { fields, rows, total: result.rows.length };
}

async function buildSet(slug) {
  const dir = path.join(PROBLEMS_DIR, slug);
  const { meta, body } = parseFrontmatter(read(path.join(dir, 'set.md')));
  const testsDir = path.join(dir, 'tests');
  const cases = fs.existsSync(testsDir)
    ? fs
        .readdirSync(testsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort()
        .map((f) => parseCase(f, read(path.join(testsDir, f))))
    : [];

  const set = {
    slug,
    title: meta.title || slug,
    tags: list(meta.tags),
    introHtml: marked.parse(body.trim()),
    schema: read(path.join(dir, 'schema.sql')),
    sample: read(path.join(dir, 'sample.sql')),
    cases,
    generator: read(path.join(dir, 'generate.sql')) || null,
    options: numberOpts(meta),
    order: meta.order !== undefined ? Number(meta.order) : undefined,
    beginner: meta.beginner === 'true',
  };

  const questionSlugs = fs
    .readdirSync(dir)
    .filter((n) => fs.existsSync(path.join(dir, n, 'question.md')))
    .sort();

  for (const c of cases) {
    for (const q of c.for) {
      if (!questionSlugs.includes(q)) warn(`${slug}/tests: "${c.name}" is for "${q}", which doesn't exist`);
    }
  }

  let db = null;
  const loaded = new Set();
  const questions = [];

  const ensure = async (t) => {
    db ??= await createEngine(PGlite);
    if (loaded.has(t.key)) return;
    const started = Date.now();
    await loadDataset(db, t.key, { schema: set.schema, data: t.data });
    if (t.kind === 'large') console.log(`  ${slug}: built large dataset in ${Date.now() - started} ms`);
    loaded.add(t.key);
  };

  for (const q of questionSlugs) {
    const qdir = path.join(dir, q);
    const { meta: qm, body: qbody } = parseFrontmatter(read(path.join(qdir, 'question.md')));
    const sections = splitSections(qbody);
    const solution = stripTrailingSemicolons(read(path.join(qdir, 'solution.sql')));
    const wrongFiles = fs.readdirSync(qdir).filter((f) => /^wrong.*\.sql$/i.test(f)).sort();
    const expectedPath = path.join(qdir, 'expected.json');
    const tests = testsFor(set, q);
    const dataHash = sha(ENGINE_HASH + set.schema + tests.map((t) => t.id + '\n' + t.data).join('\n'));
    const solutionHash = solution ? sha(solution) : null;
    const wrongHash = sha(wrongFiles.map((f) => read(path.join(qdir, f))).join('\n'));
    const previous = fs.existsSync(expectedPath) ? JSON.parse(read(expectedPath)) : null;
    const selected = !only || slug.includes(only) || q.includes(only);
    let expected = previous;

    const upToDate =
      previous?._meta?.data === dataHash &&
      previous?._meta?.solution === solutionHash &&
      previous?._meta?.wrong === wrongHash;

    if (solution && selected && (force || !upToDate)) {
      expected = { _meta: { data: dataHash, solution: solutionHash, wrong: wrongHash } };
      for (const t of tests) {
        await ensure(t);
        const started = Date.now();
        let result;
        try {
          result = await runQuery(db, t.key, solution);
        } catch (e) {
          throw new Error(`${slug}/${q} solution failed on "${t.name}": ${e.message}`);
        }
        const canonical = canonicalize(result);
        expected[t.id] = {
          hash: await hashResult(canonical),
          rowCount: canonical.rows.length,
          columns: canonical.columns,
          ms: Date.now() - started,
        };
        if (t.kind === 'sample') expected[t.id].output = sampleOutput(result);
        if (t.kind !== 'large' && canonical.rows.length === 0 && t.kind !== 'case') {
          warn(`${slug}/${q}: the solution returns no rows on "${t.name}", that test can't tell answers apart`);
        }
      }

      // every common mistake has to be caught by at least one test
      for (const f of wrongFiles) {
        const sql = stripTrailingSemicolons(read(path.join(qdir, f)));
        let caughtBy = null;
        for (const t of tests) {
          if (t.kind === 'large') continue;
          await ensure(t);
          try {
            const canonical = canonicalize(await runQuery(db, t.key, sql));
            if ((await hashResult(canonical)) !== expected[t.id].hash) caughtBy = t.name;
          } catch {
            caughtBy = 'an error';
          }
          if (caughtBy) break;
        }
        if (caughtBy) console.log(`  ${slug}/${q}/${f}: caught by ${caughtBy}`);
        else warn(`${slug}/${q}/${f} passes every test, add a test case that catches it`);
      }

      fs.writeFileSync(expectedPath, JSON.stringify(expected, null, 2) + '\n');
    } else if (!expected) {
      warn(`${slug}/${q} has no solution.sql or expected.json, it can't be graded`);
    } else if (expected._meta?.data !== dataHash) {
      warn(`${slug}/${q}: the schema or test data changed but there's no solution.sql to recompute expected.json, grading is stale`);
    } else {
      const missing = tests.filter((t) => !expected[t.id]).map((t) => t.name);
      if (missing.length) warn(`${slug}/${q}: expected.json is missing ${missing.join(', ')}`);
    }

    const { _meta, ...shipped } = expected || {};
    questions.push({
      slug: q,
      number: questions.length + 1,
      title: qm.title || q,
      difficulty: (qm.difficulty || 'medium').toLowerCase(),
      tags: list(qm.tags),
      learn: learnLinks(qm, list(qm.tags)),
      tables: list(qm.tables),
      output: list(qm.output),
      html: marked.parse(sections.question),
      hints: sections.hints,
      explanation: sections.explanation,
      expected: expected ? shipped : null,
    });
  }

  await db?.close();
  return { ...set, questions };
}

const started = Date.now();
const sets = [];
if (fs.existsSync(PROBLEMS_DIR)) {
  for (const slug of fs.readdirSync(PROBLEMS_DIR).sort()) {
    if (fs.existsSync(path.join(PROBLEMS_DIR, slug, 'schema.sql'))) {
      sets.push(await buildSet(slug));
    }
  }
}
// `order: 0` in set.md puts a set first (the warmup), the rest stay alphabetical
sets.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.slug.localeCompare(b.slug));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({ sets }));
const n = sets.reduce((a, s) => a + s.questions.length, 0);
console.log(`problems: ${sets.length} set(s), ${n} question(s) -> src/generated/problems.json (${Date.now() - started} ms)`);

if (strict && problems.length) {
  console.error(`\n${problems.length} problem(s) found, fix them before deploying.`);
  process.exit(1);
}
