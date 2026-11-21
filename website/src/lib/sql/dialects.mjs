// Translates MySQL / SQL Server queries into postgres so they can run on PGlite.
// Structure (TOP, LIMIT x,y, brackets, backticks) is rewritten through the AST,
// dialect-only functions are handled by shims in engine.mjs.

import pkg from 'node-sql-parser';

const { Parser } = pkg;
const parser = new Parser();

export const DIALECTS = [
  { id: 'postgres', label: 'PostgreSQL', parserDb: null },
  { id: 'mysql', label: 'MySQL', parserDb: 'MySQL' },
  { id: 'sqlserver', label: 'SQL Server', parserDb: 'TransactSQL' },
];

const UNIT_FUNCTIONS = new Set(['DATEADD', 'DATEDIFF', 'DATEPART', 'DATENAME', 'DATETRUNC']);

function functionName(node) {
  const n = node.name;
  if (typeof n === 'string') return n.toUpperCase();
  const parts = n?.name;
  if (Array.isArray(parts)) return String(parts[parts.length - 1]?.value ?? '').toUpperCase();
  return '';
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, visit));
    return;
  }
  visit(node);
  for (const key of Object.keys(node)) {
    if (key !== 'loc') walk(node[key], visit);
  }
}

function rewrite(ast, dialect) {
  walk(ast, (node) => {
    // SELECT TOP n  ->  LIMIT n
    if (node.type === 'select' && node.top?.value != null) {
      node.limit = { seperator: '', value: [{ type: 'number', value: node.top.value }] };
      node.top = null;
    }
    // mysql LIMIT offset, count  ->  LIMIT count OFFSET offset
    if (node.limit?.seperator === ',' && node.limit.value?.length === 2) {
      const [offset, count] = node.limit.value;
      node.limit = { seperator: 'offset', value: [count, offset] };
    }
    // DATEADD(month, ...)  ->  DATEADD('month', ...)
    if (node.type === 'function' && UNIT_FUNCTIONS.has(functionName(node))) {
      const first = node.args?.value?.[0];
      if (first?.type === 'column_ref' && !first.table) {
        node.args.value[0] = { type: 'single_quote_string', value: String(first.column).toLowerCase() };
      }
    }
    // mysql "/" always returns decimals, postgres truncates integers
    if (dialect === 'mysql' && node.type === 'binary_expr' && node.operator === '/') {
      node.left = { type: 'binary_expr', operator: '*', left: node.left, right: { type: 'number', value: '1.0' } };
    }
  });
}

// mysql and sql server treat identifiers case-insensitively, postgres folds
// unquoted ones to lowercase. the sqlifier quotes everything, so lowercase it.
function lowercaseQuotedIdentifiers(sql) {
  let out = '';
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === "'") {
      const end = findClose(sql, i, "'");
      out += sql.slice(i, end + 1);
      i = end + 1;
    } else if (c === '"') {
      const end = findClose(sql, i, '"');
      out += sql.slice(i, end + 1).toLowerCase();
      i = end + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

function findClose(s, start, quote) {
  let i = start + 1;
  while (i < s.length) {
    if (s[i] === quote) {
      if (s[i + 1] === quote) {
        i += 2;
        continue;
      }
      return i;
    }
    i++;
  }
  return s.length - 1;
}

export function translate(sql, dialectId) {
  const dialect = DIALECTS.find((d) => d.id === dialectId);
  if (!dialect?.parserDb) return { sql, translated: false };

  let ast;
  try {
    ast = parser.astify(sql, { database: dialect.parserDb });
  } catch (e) {
    const msg = String(e.message || e).split('\n')[0];
    throw new Error(`couldn't read this as ${dialect.label}: ${msg}`);
  }
  const statements = Array.isArray(ast) ? ast : [ast];
  if (statements.length !== 1) throw new Error('write a single statement (one SELECT or WITH ... SELECT).');
  if (statements[0].type !== 'select') throw new Error('only SELECT queries are allowed here.');

  rewrite(statements[0], dialect.id);
  const out = parser.sqlify(statements[0], { database: 'PostgresQL' });
  return { sql: lowercaseQuotedIdentifiers(out), translated: true };
}
