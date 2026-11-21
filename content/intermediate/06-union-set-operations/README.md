# UNION, INTERSECT & EXCEPT

Joins put tables side by side (more columns). Set operations stack results on top of each other (more rows). Different tool, different job.

## the rules

Both queries need:
- the same number of columns
- matching types in the same positions

Column names come from the first query. Names in the second one don't matter at all, only position.

## UNION vs UNION ALL

```sql
SELECT city FROM customers
UNION
SELECT city FROM addresses;
```

UNION removes duplicates, so you get each city once.

```sql
SELECT city FROM customers
UNION ALL
SELECT city FROM addresses;
```

UNION ALL keeps everything, duplicates included.

Use UNION ALL by default. It's faster because it doesn't have to check for duplicates, and most of the time you either know there aren't any or you actually want them. Only use UNION when you specifically want dedup.

## a real use: combining different kinds of things

Say you want one list of "everyone we know" with a type label:

```sql
SELECT first_name AS name, 'customer' AS type FROM customers
UNION ALL
SELECT name, 'employee' FROM employees
ORDER BY name;
```

ORDER BY goes at the very end and sorts the whole combined result. You can't put ORDER BY on each piece (well you can with brackets and LIMIT, but usually don't need to).

## INTERSECT

Rows that are in both.

```sql
-- customer ids that have both an order and an address
SELECT customer_id FROM orders
INTERSECT
SELECT customer_id FROM addresses;
```

## EXCEPT

Rows in the first, but not in the second. (oracle calls it MINUS.)

```sql
-- customers who never ordered
SELECT customer_id FROM customers
EXCEPT
SELECT customer_id FROM orders;
```

Order matters here, `A EXCEPT B` is not `B EXCEPT A`.

INTERSECT and EXCEPT also remove duplicates by default. There's INTERSECT ALL and EXCEPT ALL if you need them, rarely used.

## set operations treat NULLs as equal

Unlike `=`, set ops consider two NULLs to be the same. So `SELECT NULL UNION SELECT NULL` gives one row. Different from joins, where NULL never matches NULL.

## building a little report with UNION ALL

Summary rows on top of detail rows:

```sql
SELECT status, COUNT(*) AS orders FROM orders GROUP BY status
UNION ALL
SELECT 'TOTAL', COUNT(*) FROM orders;
```

## stuff that trips people up

- different number of columns, instant error.
- columns in different order, it won't error if types match, you'll just get wrong data under wrong headings. Sneaky.
- using UNION when you wanted UNION ALL and losing legit duplicate rows (like two orders with the same amount).
- expecting the second query's column names to show up.

## practice

Check [`queries.sql`](queries.sql).
