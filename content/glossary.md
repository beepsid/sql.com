# Glossary

Every word that shows up on this site and in SQL interviews, one or two lines each. If something in a topic or an error message sounds like jargon, it's probably here.

## the basics

- **database**: where an app stores its data. Made of tables.
- **table**: data in rows and columns, like a spreadsheet. Postgres error messages sometimes call it a **relation**, same thing.
- **row**: one entry in a table, like one customer or one order. Also called a *record*.
- **column**: one piece of info every row has, like `city` or `price`. Also called a *field*.
- **SQL**: the language you use to ask a database for data or change it.
- **query**: one question written in SQL, like `SELECT * FROM customers`.
- **result**: the table you get back from a query. Also called a *result set*.
- **keyword**: a word with a special meaning in SQL, like `SELECT`, `FROM`, `WHERE`. Usually written in CAPS, but case doesn't matter.
- **clause**: one part of a query that starts with a keyword: the `WHERE` clause, the `ORDER BY` clause.
- **statement**: one complete SQL command, usually ending with `;`.
- **NULL**: "no value / unknown". Not zero, not empty text. Has its own rules, see [NULL handling](beginner/04-null-handling).
- **data type**: what kind of value a column holds: text, whole numbers, decimals, dates, true/false.

## databases and dialects

- **postgres / PostgreSQL**: the free, open source database this site uses.
- **MySQL, SQL Server, SQLite, Oracle**: other databases. They all speak SQL, but some function names and small details differ.
- **dialect**: one database's flavour of SQL. "That's postgres syntax" means it might be written differently elsewhere.
- **schema**: the design of a database, which tables exist and what columns they have. In postgres it's also a folder that groups tables.

## keys and rules

- **primary key**: a column that uniquely identifies each row, like `customer_id`. No two rows can share it.
- **foreign key**: a column that points at another table's primary key, like `orders.customer_id`. It's how tables are connected.
- **constraint**: a rule a table enforces, like "this column can't be NULL" or "price must be positive".
- **index**: a lookup structure that makes finding rows fast, like the index at the back of a book. See [indexes](advanced/02-indexing-strategies).

## reading and shaping data

- **filter**: keep only some rows, done with `WHERE`.
- **alias**: a nickname you give a column or table with `AS`, like `price * 1.18 AS price_with_gst`.
- **expression**: anything that calculates a value, like `price * 2` or `UPPER(city)`.
- **function**: a built-in tool that takes values and returns one, like `ROUND()`, `UPPER()`, `NOW()`. See the [functions cheat sheet](functions.md).
- **operator**: a symbol that compares or calculates: `=`, `>`, `+`, `||`.
- **predicate**: a fancy word for a condition that's true or false, like `price > 100`.
- **aggregate**: a function that squashes many rows into one value: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. See [aggregation basics](beginner/07-aggregation-basics).
- **group**: rows that share the same value, made by `GROUP BY`. Aggregates then run once per group.
- **sort**: order the result with `ORDER BY`. Without it, row order is not guaranteed.

## combining tables

- **join**: put rows from two tables side by side when they match, like each order next to its customer. See [INNER JOIN](intermediate/01-inner-join).
- **inner join**: keeps only rows that have a match on both sides.
- **left join**: keeps every row from the left table, with NULLs where there's no match.
- **self join**: joining a table to itself, like employees to their managers.
- **anti-join**: finding rows with *no* match, like customers who never ordered. See [anti-joins](intermediate/12-anti-joins).
- **fan-out**: when a join repeats rows and your totals come out too big. See [join fan-out](intermediate/11-join-fan-out).
- **union**: stacking the results of two queries on top of each other.

## queries inside queries

- **subquery**: a query inside another query, in brackets. See [subqueries](intermediate/07-subqueries).
- **CTE**: a named subquery written at the top with `WITH`. Same power, easier to read. See [CTEs](intermediate/08-ctes).
- **recursive CTE**: a CTE that refers to itself, used for trees like org charts.
- **window function**: calculates across related rows without squashing them, like a rank or a running total. See [window functions](advanced/01-window-functions).
- **partition**: the group a window function works within, set with `PARTITION BY`.

## changing data

- **INSERT / UPDATE / DELETE**: add rows, change rows, remove rows.
- **transaction**: a group of changes that either all happen or none do, between `BEGIN` and `COMMIT`. See [transactions](advanced/07-transactions-acid).
- **commit / rollback**: save the changes in a transaction / throw them away.

## interview words

- **top N per group**: "the 3 best products in each category", usually solved with a window function.
- **gaps and islands**: finding streaks or runs of consecutive values, like login streaks.
- **cohort**: a group of users who started at the same time, used for retention.
- **funnel**: steps users go through in order (view → cart → buy) and how many make each step.
- **edge case**: an unusual input that breaks naive queries, like ties, NULLs or empty groups.
