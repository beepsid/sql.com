// Decides whether a code block in a topic is a real postgres query someone can
// run on the sample data, or a template / other-database snippet that would
// only produce a confusing error.

const STARTS = /^(SELECT|WITH|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|EXPLAIN|BEGIN|START|VALUES|TABLE|ANALYZE|TRUNCATE|PREPARE|EXECUTE|DO)\b/i;

export function isRunnable(code) {
  const lines = String(code).split('\n');
  // examples written for another database
  if (lines.some((l) => /^\s*--\s*(mysql|sql ?server|oracle|sqlite|t-?sql|bigquery|snowflake)\b/i.test(l))) return false;
  const body = lines
    .filter((l) => !/^\s*--/.test(l))
    .join('\n')
    .trim();
  if (!body) return false;
  // templates with placeholders
  if (/\.\.\.|…|\btable_name\b|\bcolumn[12]\b|\bcondition\d?\b|\bname_of_it\b|\bFROM\s+table\b|\bSELECT\s+columns\b|<[a-z_ ]+>/i.test(body)) return false;
  if (/\bTOP\s+\d/i.test(body)) return false;
  return STARTS.test(body);
}
