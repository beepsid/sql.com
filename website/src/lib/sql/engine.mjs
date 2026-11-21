// Runs queries on PGlite (real postgres compiled to wasm). Shared by the build
// script (to compute expected results) and the browser worker (to grade).
// Every dataset lives in its own postgres schema inside one database.

const raw = (v) => v;
export const RAW_PARSERS = { 20: raw, 1082: raw, 1114: raw, 1184: raw, 1700: raw };

// postgres versions of common sql server / mysql functions so translated
// queries still run, plus a deterministic random helper for data generators.
const SHIMS = `
CREATE FUNCTION isnull(anycompatible, anycompatible) RETURNS anycompatible
  LANGUAGE sql IMMUTABLE AS 'SELECT COALESCE($1, $2)';
CREATE FUNCTION ifnull(anycompatible, anycompatible) RETURNS anycompatible
  LANGUAGE sql IMMUTABLE AS 'SELECT COALESCE($1, $2)';
CREATE FUNCTION nvl(anycompatible, anycompatible) RETURNS anycompatible
  LANGUAGE sql IMMUTABLE AS 'SELECT COALESCE($1, $2)';
CREATE FUNCTION getdate() RETURNS timestamp LANGUAGE sql AS 'SELECT LOCALTIMESTAMP';
CREATE FUNCTION curdate() RETURNS date LANGUAGE sql AS 'SELECT CURRENT_DATE';
CREATE FUNCTION len(text) RETURNS int LANGUAGE sql IMMUTABLE AS 'SELECT LENGTH(RTRIM($1))';
CREATE FUNCTION charindex(text, text) RETURNS int LANGUAGE sql IMMUTABLE AS 'SELECT STRPOS($2, $1)';
CREATE FUNCTION year(timestamp) RETURNS int LANGUAGE sql IMMUTABLE AS 'SELECT EXTRACT(YEAR FROM $1)::int';
CREATE FUNCTION month(timestamp) RETURNS int LANGUAGE sql IMMUTABLE AS 'SELECT EXTRACT(MONTH FROM $1)::int';
CREATE FUNCTION day(timestamp) RETURNS int LANGUAGE sql IMMUTABLE AS 'SELECT EXTRACT(DAY FROM $1)::int';
CREATE FUNCTION eomonth(timestamp) RETURNS date LANGUAGE sql IMMUTABLE
  AS 'SELECT (DATE_TRUNC(''month'', $1) + INTERVAL ''1 month - 1 day'')::date';
CREATE FUNCTION dateadd(text, numeric, timestamp) RETURNS timestamp LANGUAGE sql IMMUTABLE
  AS 'SELECT $3 + ($2 || '' '' || $1)::interval';
CREATE FUNCTION datediff(text, timestamp, timestamp) RETURNS int LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE lower($1)
    WHEN 'year'  THEN EXTRACT(YEAR FROM $3)::int - EXTRACT(YEAR FROM $2)::int
    WHEN 'month' THEN (EXTRACT(YEAR FROM $3)::int - EXTRACT(YEAR FROM $2)::int) * 12
                      + EXTRACT(MONTH FROM $3)::int - EXTRACT(MONTH FROM $2)::int
    WHEN 'hour'  THEN FLOOR(EXTRACT(EPOCH FROM $3 - $2) / 3600)::int
    WHEN 'minute' THEN FLOOR(EXTRACT(EPOCH FROM $3 - $2) / 60)::int
    WHEN 'second' THEN FLOOR(EXTRACT(EPOCH FROM $3 - $2))::int
    ELSE $3::date - $2::date
  END $$;
CREATE FUNCTION datediff(timestamp, timestamp) RETURNS int LANGUAGE sql IMMUTABLE
  AS 'SELECT $1::date - $2::date';
CREATE DOMAIN datetime AS timestamp;
CREATE DOMAIN datetime2 AS timestamp;
CREATE DOMAIN smalldatetime AS timestamp;
CREATE FUNCTION gen_rand(text) RETURNS double precision LANGUAGE sql IMMUTABLE
  AS 'SELECT (hashtext($1) & 2147483647)::double precision / 2147483648';
`;

export async function createEngine(PGlite) {
  const db = await PGlite.create();
  await db.exec(SHIMS);
  return db;
}

export function schemaName(key) {
  return ('ds_' + key.toLowerCase().replace(/[^a-z0-9]+/g, '_')).slice(0, 60);
}

export async function loadDataset(db, key, { schema, data }) {
  const name = schemaName(key);
  await db.exec(`DROP SCHEMA IF EXISTS ${name} CASCADE; CREATE SCHEMA ${name};`);
  await db.exec(`SET search_path TO ${name}, public;`);
  try {
    await db.exec(schema);
    if (data) await db.exec(data);
    const { rows } = await db.query('SELECT tablename FROM pg_tables WHERE schemaname = $1', [name]);
    for (const r of rows) await db.exec(`ANALYZE ${name}."${r.tablename}"`);
  } finally {
    await db.exec('SET search_path TO public;');
  }
}

export async function runQuery(db, key, sql) {
  // rollback after every run so a stray UPDATE/DELETE can't change the data
  await db.exec(`BEGIN; SET LOCAL search_path TO ${schemaName(key)}, public;`);
  try {
    return await db.query(sql, [], { parsers: RAW_PARSERS });
  } finally {
    await db.exec('ROLLBACK');
  }
}

export function stripTrailingSemicolons(sql) {
  return sql.trim().replace(/;\s*$/g, '').trim();
}
