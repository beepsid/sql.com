import fs from 'fs';
import path from 'path';
import { Marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';

hljs.registerLanguage('sql', sql);
hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);

const CONTENT_DIR = path.join(process.cwd(), '..', 'content');

export const LEVELS = [
  { slug: 'beginner', name: 'Beginner', blurb: 'the stuff every single query is built on.' },
  { slug: 'intermediate', name: 'Intermediate', blurb: 'joins, grouping, subqueries, the everyday work.' },
  { slug: 'advanced', name: 'Advanced', blurb: 'window functions, performance, and the patterns interviews love.' },
];

export function highlight(code, lang = 'sql') {
  const language = hljs.getLanguage(lang) ? lang : 'sql';
  return hljs.highlight(code, { language, ignoreIllegals: true }).value;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

// "the trap: WHERE on the right table" -> "the-trap-where-on-the-right-table"
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z0-9#]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// every page gets its own Marked so heading ids restart and stay unique per page
function createMarked() {
  const seen = new Map();
  return new Marked({
    renderer: {
      heading(text, level, raw) {
        let id = slugify(raw) || 'section';
        const n = seen.get(id) || 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        // headings start with a capital letter on the page, whatever the markdown says
        const shown = text.replace(/^(\s*)([a-z])/, (_, space, ch) => space + ch.toUpperCase());
        return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${shown}</h${level}>\n`;
      },
      code(code, lang) {
        const language = (lang || '').trim();
        if (!language) {
          return `<pre><code>${escapeHtml(code)}</code></pre>`;
        }
        return `<pre><code class="hljs language-${language}">${highlight(code, language)}</code></pre>`;
      },
    },
  });
}

// links in the markdown point at repo files so they work on github, the site needs its own urls
function rewriteLinks(md, fromRoot = false) {
  let out = md
    .replace(/\]\(queries\.sql\)/g, '](#practice)')
    .replace(/\]\((\.\.\/)*sample-data\.sql\)/g, `](${BASE}/sample-data/)`)
    .replace(/\]\((\.\.\/)*functions\.md\)/g, `](${BASE}/sql-functions/)`);
  // ../../intermediate/01-inner-join (from a topic) or intermediate/01-inner-join (from content root)
  const levels = LEVELS.map((l) => l.slug).join('|');
  const prefix = fromRoot ? '(?:\\./)?' : '(?:\\.\\./)+';
  const re = new RegExp(`\\]\\(${prefix}(${levels})/([\\w-]+)/?(?:README\\.md)?\\)`, 'g');
  out = out.replace(re, `](${BASE}/$1/$2/)`);
  return out;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function readTopic(level, slug) {
  const dir = path.join(CONTENT_DIR, level, slug);
  const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
  const title = readme.match(/^# (.+)$/m)?.[1].trim() ?? slug;
  const intro = readme
    .replace(/^# .+$/m, '')
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/[`*]/g, '')
    .trim();
  return { readme, title, intro };
}

export function getTopics(level) {
  const dir = path.join(CONTENT_DIR, level);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => fs.existsSync(path.join(dir, name, 'README.md')))
    .sort()
    .map((slug, i) => {
      const { title, intro } = readTopic(level, slug);
      return { level, slug, title, intro, number: i + 1, updated: lastEdited(path.join(dir, slug)) };
    });
}

export function getAllTopics() {
  return LEVELS.flatMap((l) => getTopics(l.slug));
}

export function getTopic(level, slug) {
  const dir = path.join(CONTENT_DIR, level, slug);
  if (!fs.existsSync(path.join(dir, 'README.md'))) return null;

  const { readme, title, intro } = readTopic(level, slug);
  const body = rewriteLinks(readme.replace(/^# .+$/m, ''));

  const queriesPath = path.join(dir, 'queries.sql');
  const queries = fs.existsSync(queriesPath) ? fs.readFileSync(queriesPath, 'utf8') : '';

  const topics = getTopics(level);
  const i = topics.findIndex((t) => t.slug === slug);

  return {
    level,
    slug,
    title,
    intro,
    html: createMarked().parse(body),
    queries,
    queriesHtml: queries ? highlight(queries) : '',
    practice: queries ? parsePractice(queries) : null,
    prev: topics[i - 1] ?? null,
    next: topics[i + 1] ?? null,
  };
}

// queries.sql has three parts: examples, numbered practice questions, and
// numbered answers. Answer markers are "-- 1", "-- 2"... in order, so a lone
// number that's really a result note ("-- 120000") isn't mistaken for one.
export function parsePractice(text) {
  const lines = text.split(/\r?\n/);
  const at = (re) => lines.findIndex((l) => re.test(l));
  const ex = at(/^--\s*examples\s*-/i);
  const pr = at(/^--\s*practice\s*-/i);
  const an = at(/^--\s*answers\s*-/i);
  if (pr < 0 || an < 0) return null;

  const examples = ex >= 0 ? lines.slice(ex + 1, pr).join('\n').trim() : '';

  const questions = [];
  for (const line of lines.slice(pr + 1, an)) {
    const q = line.match(/^--\s*(\d+)\.\s+(.*)$/);
    if (q) questions.push({ n: Number(q[1]), text: q[2].trim(), answer: '' });
    else if (questions.length && /^--\s+\S/.test(line)) questions[questions.length - 1].text += ' ' + line.replace(/^--\s+/, '').trim();
  }

  let current = null;
  let expect = 1;
  const answers = {};
  for (const line of lines.slice(an + 1)) {
    const m = line.match(/^--\s*(\d+)\s*$/);
    if (m && Number(m[1]) === expect) {
      current = expect++;
      answers[current] = [];
      continue;
    }
    if (current) answers[current].push(line);
  }
  for (const q of questions) q.answer = (answers[q.n] || []).join('\n').trim();
  return { examples, questions: questions.filter((q) => q.answer) };
}

export function getSampleData() {
  const sqlText = fs.readFileSync(path.join(CONTENT_DIR, 'sample-data.sql'), 'utf8');
  return { sql: sqlText, html: highlight(sqlText) };
}

// newest edit time of the files in a topic folder, used for the sitemap
function lastEdited(dir) {
  return fs
    .readdirSync(dir)
    .map((f) => fs.statSync(path.join(dir, f)).mtime)
    .reduce((a, b) => (a > b ? a : b), new Date(0));
}

export function getFunctionsPage() {
  const file = path.join(CONTENT_DIR, 'functions.md');
  const md = fs.readFileSync(file, 'utf8');
  const title = md.match(/^# (.+)$/m)?.[1].trim() ?? 'SQL Functions Cheat Sheet';
  const body = md.replace(/^# .+$/m, '');
  const intro = body.trim().split(/\n\s*\n/)[0].replace(/[`*]/g, '').trim();
  const sections = [...body.matchAll(/^## (.+)$/gm)].map((m) => ({ title: m[1].trim(), id: slugify(m[1]) }));
  const rows = (body.match(/^\|(?!---|\s*name\s*\|).+\|$/gm) || []).length;
  return {
    title,
    intro,
    sections,
    rows,
    html: createMarked().parse(rewriteLinks(body, true)),
    updated: fs.statSync(file).mtime,
  };
}

export function getGlossaryPage() {
  const file = path.join(CONTENT_DIR, 'glossary.md');
  const md = fs.readFileSync(file, 'utf8');
  const title = md.match(/^# (.+)$/m)?.[1].trim() ?? 'Glossary';
  const body = md.replace(/^# .+$/m, '');
  const intro = body.trim().split(/\n\s*\n/)[0].replace(/[`*]/g, '').trim();
  return { title, intro, html: createMarked().parse(rewriteLinks(body, true)), updated: fs.statSync(file).mtime };
}

// plain text version of markdown, good enough for searching
function plain(md) {
  return md
    .replace(/```[a-z]*\n?/gi, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\\\|/g, '|')
    .replace(/`|\*\*/g, '')
    .replace(/(^|[\s(])\*(\S(?:[^*\n]*\S)?)\*(?=[\s.,;:!?)]|$)/gm, '$1$2')
    .replace(/^> /gm, '')
    .replace(/^\|?\s*-{3,}.*$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// cut a markdown file into one chunk per heading
function chunks(md) {
  const out = [];
  const seen = new Map();
  let cur = { heading: '', id: '', text: '' };
  let inCode = false;
  for (const line of md.replace(/^# .+$/m, '').split('\n')) {
    if (line.startsWith('```')) inCode = !inCode;
    const h = !inCode && line.match(/^#{2,3} (.+)$/);
    if (h) {
      if (cur.text.trim()) out.push(cur);
      let id = slugify(h[1]) || 'section';
      const n = seen.get(id) || 0;
      seen.set(id, n + 1);
      if (n) id = `${id}-${n}`;
      cur = { heading: plain(h[1]), id, text: '' };
    } else {
      cur.text += line + '\n';
    }
  }
  if (cur.text.trim()) out.push(cur);
  return out.map((c) => ({ h: c.heading, id: c.id, x: plain(c.text) }));
}

export function getSearchIndex() {
  const pages = getAllTopics().map((t) => {
    const dir = path.join(CONTENT_DIR, t.level, t.slug);
    const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
    const sections = chunks(readme).filter((c) => c.id !== 'practice');
    const qp = path.join(dir, 'queries.sql');
    if (fs.existsSync(qp)) {
      sections.push({ h: 'practice', id: 'practice', x: fs.readFileSync(qp, 'utf8').replace(/\s+/g, ' ').trim() });
    }
    return { t: t.title, u: `/${t.level}/${t.slug}/`, l: t.level, i: t.intro, s: sections };
  });
  const fn = getFunctionsPage();
  pages.push({ t: fn.title, u: '/sql-functions/', l: 'reference', i: fn.intro, s: functionRows() });
  return pages;
}

// one search entry per row of the cheat sheet: "string functions › LENGTH", "postgres: LENGTH() · mysql: ..."
function functionRows() {
  const md = fs.readFileSync(path.join(CONTENT_DIR, 'functions.md'), 'utf8');
  const out = [];
  let section = null;
  let cols = null;
  for (const line of md.split('\n')) {
    const h = line.match(/^## (.+)$/);
    if (h) {
      section = { title: h[1].trim(), id: slugify(h[1]) };
      cols = null;
      continue;
    }
    if (!section || !line.startsWith('|') || /^\|\s*-{3}/.test(line)) continue;
    const cells = line
      .slice(1, -1)
      .split(/(?<!\\)\|/)
      .map((c) => plain(c));
    if (!cols) {
      cols = cells;
      continue;
    }
    const [name, what, ...dialects] = cells;
    out.push({
      h: `${section.title} › ${name}`,
      id: section.id,
      x: `${what}. ${dialects.map((d, i) => `${cols[i + 2]}: ${d}`).join(' · ')}`,
    });
  }
  return out;
}
