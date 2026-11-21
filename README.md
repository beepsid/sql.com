# sql.notes

SQL explained topic by topic, from your first SELECT to window functions and query plans. Every topic is a short explanation, examples, and practice questions with answers, and every query runs on the same small sample database so you can actually try stuff instead of just reading.

## how to use this

Easiest way: use [the website](https://sqlnote.pages.dev). Every example has a **run** button and the practice questions check your answer, all on real postgres in your browser, nothing to install.

Reading it here on github instead:

1. run [`content/sample-data.sql`](content/sample-data.sql) once in postgres. No postgres? paste it into [db-fiddle](https://www.db-fiddle.com), pick postgres, done.
2. open a topic, read the `README.md`, run the examples.
3. try the practice questions in `queries.sql` before scrolling down to the answers.

New to sql? go in order. Prepping for interviews? start at intermediate, then window functions and real world patterns.

## beginner

the stuff every single query is built on.

0. [What is SQL? (start here)](content/beginner/00-what-is-sql)
1. [SELECT & Basic Queries](content/beginner/01-select-basics)
2. [WHERE & Filtering](content/beginner/02-where-filtering)
3. [Logical Operators (AND, OR, NOT)](content/beginner/03-logical-operators)
4. [NULL Handling](content/beginner/04-null-handling)
5. [Sorting with ORDER BY](content/beginner/05-sorting-ordering)
6. [LIMIT & OFFSET](content/beginner/06-limit-offset)
7. [Aggregation Basics (COUNT, SUM, AVG, MIN, MAX)](content/beginner/07-aggregation-basics)
8. [DISTINCT](content/beginner/08-distinct-values)
9. [Data Types](content/beginner/09-data-types)
10. [CASE WHEN (If/Else in SQL)](content/beginner/10-case-when)

## intermediate

joins, grouping, subqueries, the everyday work.

1. [INNER JOIN](content/intermediate/01-inner-join)
2. [LEFT, RIGHT & FULL OUTER JOIN](content/intermediate/02-left-right-joins)
3. [Self Joins](content/intermediate/03-self-joins)
4. [ON vs WHERE (Join Predicates)](content/intermediate/04-join-predicates)
5. [GROUP BY & HAVING](content/intermediate/05-group-by-having)
6. [UNION, INTERSECT & EXCEPT](content/intermediate/06-union-set-operations)
7. [Subqueries](content/intermediate/07-subqueries)
8. [CTEs (the WITH Clause)](content/intermediate/08-ctes)
9. [String Functions](content/intermediate/09-string-functions)
10. [Date & Time Functions](content/intermediate/10-date-functions)
11. [Join Fan-Out (Why Your Totals Are Wrong)](content/intermediate/11-join-fan-out)
12. [Anti-Joins (Finding What's Missing)](content/intermediate/12-anti-joins)
13. [Numeric Functions](content/intermediate/13-numeric-functions)

## advanced

window functions, performance, and the patterns interviews love.

1. [Window Functions](content/advanced/01-window-functions)
2. [Indexes](content/advanced/02-indexing-strategies)
3. [Query Optimization](content/advanced/03-query-optimization)
4. [Expression Indexes](content/advanced/04-expression-indexes)
5. [Non-Equi Joins](content/advanced/05-non-equi-joins)
6. [Database Design & Normalization](content/advanced/06-database-design)
7. [Transactions & ACID](content/advanced/07-transactions-acid)
8. [SQL Injection & Security](content/advanced/08-sql-security)
9. [Recursive CTEs](content/advanced/09-recursive-ctes)
10. [Advanced Aggregation](content/advanced/10-advanced-aggregation)
11. [JSON in SQL](content/advanced/11-json-semistructured)
12. [Real World Patterns](content/advanced/12-cte-patterns)
13. [System & Misc Functions](content/advanced/13-system-and-misc-functions)

## functions cheat sheet

Every function from a typical sql cheat sheet, with the postgres, mysql and sql server name side by side: [`content/functions.md`](content/functions.md).

## the website

Same content, nicer to read on a phone. It lives in [`website/`](website) and reads straight from `content/`, so you only ever edit the markdown and sql files.

```bash
cd website
npm install
npm run dev
```

Then open http://localhost:3000. The first start builds the problem fingerprints (a few seconds), after that it only redoes questions you changed.

## problems

The site also has a `/problems` page, datalemur style: 77 questions (38 easy, 25 medium, 14 hard) across five datasets: a beginner warmup on a movies table, an online store, a company's HR data, app activity and food delivery. You get a question, write the query in PostgreSQL, MySQL or SQL Server, run it, compare with the expected output, submit, and it tells you if it's right. Stuck? there are hints, and once you solve it you get the explanation of the trick behind it. Every submission is graded on named edge cases, random data and a large dataset with a time limit. Queries run in the browser on real postgres, so there's no server to host. To add your own questions see [`content/problems`](content/problems).

## deploying

`npm run build` in `website/` writes a plain static site to `website/out`. No server, no database, every visitor runs their own postgres in the browser, so it doesn't matter how many people use it at once.

It's hosted on **cloudflare pages** (free plan). No server code runs, it's just files. The repo can stay private, only the built site gets uploaded.

live at **https://sqlnote.pages.dev**

first time only:

```bash
cd website
npx wrangler login
```

then every time you want to publish:

```bash
cd website
npm run deploy
```

That builds the site and uploads `out/` to the `sqlnote` pages project (settings in `website/wrangler.jsonc`). Your `solution.sql` files never leave your machine.

> heads up: if you ever create a *new* pages project from the command line, newer wrangler versions try to convert the next.js app to "OpenNext" (a server setup this site doesn't need). Add `--force` to `wrangler pages project create` to skip that. Deploying to the existing project with `npm run deploy` is fine.

## beginner friendly bits

- every runnable example in a topic gets **run** and **edit & try your own** buttons. Blocks that are templates (`SELECT columns FROM table`) or written for another database (a `-- mysql` / `-- sql server` comment) are skipped automatically.
- practice questions are read from `queries.sql`: `-- 1. question` lines under `-- practice ---`, and `-- 1` markers under `-- answers ---`. Keep that format and they become interactive. An answer that's only comments is shown as a "thinking question" with no automatic check.
- errors are explained in plain english by default (`website/src/lib/sql/friendly.mjs`), people can switch to the raw postgres message.
- the [glossary](content/glossary.md) explains every term in one line.

## adding a topic

Make a folder like `content/intermediate/14-whatever/` with a `README.md` (first line `# title`) and a `queries.sql`. Number prefix decides the order. The site picks it up on its own.

## found a mistake?

Open an issue or a PR, all queries are written for postgres.
