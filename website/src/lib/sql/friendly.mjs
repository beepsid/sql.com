// Turns raw postgres error messages into plain english for people who are new
// to sql. Returns { title, tip } or null when there's nothing better to say.
// `tables` and `columns` are the names that exist, used for "did you mean".

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT', 'RIGHT',
  'INNER', 'OUTER', 'FULL', 'CROSS', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'ILIKE',
  'BETWEEN', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION',
  'ALL', 'EXCEPT', 'INTERSECT', 'WITH', 'OVER', 'PARTITION', 'DESC', 'ASC', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'EXISTS', 'ROUND', 'COALESCE', 'USING', 'RECURSIVE',
];

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function closest(word, options) {
  if (!word || !options?.length) return null;
  const w = word.toLowerCase();
  const limit = w.length <= 4 ? 1 : 2;
  let best = null;
  let bestD = Infinity;
  for (const o of new Set(options)) {
    const d = distance(w, String(o).toLowerCase());
    if (d < bestD) {
      bestD = d;
      best = o;
    }
  }
  return bestD > 0 && bestD <= limit ? best : null;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ORDER = 'SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT';

export function explainError(message, { sql = '', tables = [], columns = [] } = {}) {
  const m = String(message || '');
  let r;

  if (/took longer than/.test(m)) {
    return {
      title: 'Your query is too slow',
      tip: 'It works but takes too long on the big dataset. Common causes: a join without an ON condition (every row matched with every row), a subquery that runs once per row, or filtering after a huge join instead of before it.',
    };
  }

  if ((r = m.match(/syntax error at or near "(.+?)"/))) {
    const tok = r[1];
    const upper = tok.toUpperCase();
    if (/^[a-z_]+$/i.test(tok) && !KEYWORDS.includes(upper)) {
      const kw = closest(upper, KEYWORDS);
      if (kw) return { title: `Looks like a typo: "${tok}"`, tip: `Did you mean **${kw}**? SQL keywords have to be spelled exactly.` };
    }
    if (upper === 'FROM' && /,\s*FROM\b/i.test(sql)) {
      return {
        title: 'Extra comma before FROM',
        tip: "The last column in SELECT shouldn't have a comma after it. Delete the comma right before `FROM`.",
      };
    }
    if (['WHERE', 'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'JOIN', 'ON', 'FROM'].includes(upper)) {
      return {
        title: `Something's off right before ${upper}`,
        tip: `Clauses have to come in this order: ${ORDER}. Also check the line before it for a stray comma, a missing column, or a bracket that isn't closed.`,
      };
    }
    if (tok === ',') {
      return { title: 'Unexpected comma', tip: 'There is a comma where SQL expected something else. Check for two commas in a row, or a comma right after SELECT.' };
    }
    if (tok === ')' || tok === '(') {
      return { title: 'Brackets don’t line up', tip: 'Every `(` needs a matching `)`. Count them, and check there is something between them.' };
    }
    return {
      title: `SQL got confused near "${tok}"`,
      tip: 'Look at what comes right before it: a missing comma between columns, a misspelled keyword, a missing bracket, or clauses in the wrong order.',
    };
  }

  if (/syntax error at end of input/.test(m)) {
    return {
      title: 'The query ends too early',
      tip: 'Something is unfinished: a bracket or quote that was opened but never closed, or a clause with nothing after it (like `WHERE` with no condition).',
    };
  }

  if (/unterminated quoted (string|identifier)/.test(m)) {
    return { title: 'A quote is never closed', tip: "Text values start and end with a single quote: `'Delhi'`. One of yours is missing its closing `'`." };
  }

  if ((r = m.match(/relation "(.+?)" does not exist/))) {
    const name = r[1];
    const guess = closest(name, tables);
    return {
      title: `There's no table called "${name}"`,
      tip: guess
        ? `Did you mean **${guess}**? (postgres calls tables "relations", that's what the message means.)`
        : 'Check the spelling. The tables you can use are listed in the tables tab or on the sample data page. (postgres calls tables "relations".)',
    };
  }

  if ((r = m.match(/column "(.+?)" does not exist/))) {
    const name = r[1];
    if (new RegExp(`"${esc(name)}"`).test(sql) && !/^[a-z_][a-z0-9_]*$/.test(name)) {
      return {
        title: `"${name}" is in double quotes`,
        tip: `Text values go in **single quotes**: \`'${name}'\`. Double quotes mean "a column called this", so SQL went looking for a column named ${name}.`,
      };
    }
    if (new RegExp(`"${esc(name)}"`).test(sql) && new RegExp(`=\\s*"${esc(name)}"`).test(sql)) {
      return {
        title: `"${name}" is in double quotes`,
        tip: `Text values go in **single quotes**: \`'${name}'\`. Double quotes mean a column name.`,
      };
    }
    const bare = name.split('.').pop();
    if (new RegExp(`\\bAS\\s+"?${esc(bare)}"?\\b`, 'i').test(sql)) {
      return {
        title: `"${bare}" is a name you made up in SELECT`,
        tip: 'WHERE, GROUP BY and HAVING run before SELECT, so they can’t see aliases yet. Repeat the full expression there, or put the query in a subquery or CTE and filter outside it. ORDER BY is the one place an alias works.',
      };
    }
    const guess = closest(bare, columns);
    return {
      title: `There's no column called "${name}"`,
      tip: guess
        ? `Did you mean **${guess}**?`
        : 'Check the spelling, and that it belongs to a table in your FROM or JOIN. The tables tab lists every column.',
    };
  }

  if ((r = m.match(/column "(.+?)" must appear in the GROUP BY clause/))) {
    return {
      title: `"${r[1]}" needs to be in GROUP BY`,
      tip: 'When a query groups rows (GROUP BY, or COUNT/SUM/AVG on their own), every column in SELECT must either be listed in GROUP BY or be inside an aggregate like `COUNT()`, `SUM()` or `MAX()`. Add it to GROUP BY, or wrap it in an aggregate.',
    };
  }

  if (/aggregate functions are not allowed in WHERE/.test(m)) {
    return {
      title: 'COUNT / SUM / AVG can’t go in WHERE',
      tip: 'WHERE filters single rows before they are grouped. To filter on a total or a count, use `HAVING` after GROUP BY, e.g. `HAVING COUNT(*) > 2`.',
    };
  }

  if (/window functions are not allowed in (WHERE|HAVING|GROUP BY)/.test(m)) {
    return {
      title: 'Window functions can’t be filtered directly',
      tip: 'Functions like `ROW_NUMBER()` and `RANK()` are calculated after WHERE. Compute them in a subquery or CTE, then filter on them in the outer query: `WHERE rn = 1`.',
    };
  }

  if ((r = m.match(/column reference "(.+?)" is ambiguous/))) {
    return {
      title: `More than one table has a "${r[1]}" column`,
      tip: `SQL doesn't know which one you mean. Put the table (or its alias) in front: \`c.${r[1]}\` or \`o.${r[1]}\`.`,
    };
  }

  if ((r = m.match(/missing FROM-clause entry for table "(.+?)"/))) {
    return {
      title: `"${r[1]}" isn't in your FROM or JOIN`,
      tip: `You wrote \`${r[1]}.something\`, but no table called (or nicknamed) ${r[1]} is in FROM / JOIN. If you gave the table a short alias, use that alias everywhere.`,
    };
  }

  if ((r = m.match(/operator does not exist: (.+?) ([=<>!~+\-*/|&]+) (.+)/))) {
    return {
      title: `Can't compare ${r[1]} with ${r[3]}`,
      tip: 'The two sides are different types, like a number and text. Numbers go without quotes (`price > 100`), text with single quotes (`city = \'Delhi\'`). If you really need to, convert one side with `::int` or `::text`.',
    };
  }

  if ((r = m.match(/invalid input syntax for type (\w[\w ]*): "(.*)"/))) {
    const type = r[1];
    const isDate = /date|time/.test(type);
    return {
      title: `"${r[2]}" isn't a valid ${type}`,
      tip: isDate ? "Write dates as `'YYYY-MM-DD'`, like `'2024-03-01'`." : `This column holds ${type} values, so compare it with a ${type}, not text.`,
    };
  }

  if (/division by zero/.test(m)) {
    return { title: 'Dividing by zero', tip: 'Something you divide by is 0 for at least one row. `x / NULLIF(y, 0)` gives NULL instead of an error.' };
  }

  if (/more than one row returned by a subquery used as an expression/.test(m)) {
    return {
      title: 'Your subquery returns more than one row',
      tip: 'Comparing with `=` needs exactly one value. Use `IN (subquery)` to compare with a list, or make the subquery return one row (with `MAX()`, `MIN()` or `LIMIT 1`).',
    };
  }

  if (/subquery (must|has too many columns|has too few columns)|subquery must return only one column/.test(m)) {
    return { title: 'Your subquery returns the wrong number of columns', tip: 'A subquery used with `IN` or `=` must select exactly one column.' };
  }

  if (/each (UNION|INTERSECT|EXCEPT) query must have the same number of columns/.test(m)) {
    return { title: 'Both sides need the same columns', tip: 'With UNION / INTERSECT / EXCEPT, every SELECT must have the same number of columns, in the same order, with matching types.' };
  }

  if ((r = m.match(/function (.+?)\((.*?)\) does not exist/))) {
    return {
      title: `Postgres doesn't have ${r[1]}() for these values`,
      tip: 'Either the function is called something else in postgres (the functions cheat sheet has the name in every database), or you passed it the wrong type of value. Check the spelling and the brackets.',
    };
  }

  if (/duplicate key value violates unique constraint/.test(m)) {
    return { title: 'That value already exists', tip: 'This column must be unique (like an id or an email), and a row with that value is already there.' };
  }
  if (/violates foreign key constraint/.test(m)) {
    return { title: 'That points at something that doesn’t exist', tip: 'A foreign key makes sure, say, an order’s customer_id is a real customer. The id you used isn’t in the other table.' };
  }
  if (/violates check constraint/.test(m)) {
    return { title: 'That value isn’t allowed', tip: 'The table has a rule (a CHECK constraint) about what values are allowed in this column, and this one breaks it.' };
  }
  if (/violates not-null constraint/.test(m)) {
    return { title: 'A required column is empty', tip: 'This column can’t be NULL, so you have to give it a value.' };
  }

  return null;
}
