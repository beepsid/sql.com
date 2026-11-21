// Shared by the build script (node) and the browser, so expected and actual
// results are canonicalized and hashed exactly the same way.

const NUMERIC_TYPES = new Set([20, 21, 23, 700, 701, 1700]);
const DATE_TYPES = new Set([1082, 1114, 1184]);

export function canonValue(value, typeId) {
  if (value === null || value === undefined) return null;
  if (NUMERIC_TYPES.has(typeId)) {
    const n = Number(value);
    return Number.isFinite(n) ? String(Math.round(n * 1e6) / 1e6) : String(value);
  }
  if (DATE_TYPES.has(typeId)) {
    // a timestamp at midnight counts the same as a plain date
    return String(value).replace(/[ T]00:00:00(\.0+)?(\+00(:00)?)?$/, '');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function canonicalize(result) {
  const columns = result.fields.map((f) => f.name.toLowerCase());
  const rows = result.rows
    .map((row) => result.fields.map((f) => canonValue(row[f.name], f.dataTypeID)))
    .map((r) => JSON.stringify(r))
    .sort();
  return { columns, rows };
}

export async function hashResult(canonical) {
  const text = JSON.stringify(canonical);
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
