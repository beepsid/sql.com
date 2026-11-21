# Recursive CTEs

A recursive CTE is a CTE that refers to itself. It's how sql walks through trees and chains when you don't know how deep they go, org charts, category trees, folder structures, "who referred who".

It looks scary but there are only two parts.

## the shape

```sql
WITH RECURSIVE name AS (
  -- 1. anchor: where to start
  SELECT ...

  UNION ALL

  -- 2. recursive part: how to get the next level from the previous one
  SELECT ...
  FROM some_table
  JOIN name ON ...   -- refers to itself
)
SELECT * FROM name;
```

How it runs:
1. run the anchor, that's level 1
2. run the recursive part using only the rows from the last step, that's level 2
3. repeat with the new rows
4. stop when a step returns nothing

## warm up: counting to 5

```sql
WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 5
)
SELECT * FROM nums;
```

Starts with 1, keeps adding 1, the WHERE stops it at 5. Without that WHERE it'd run forever (well, until postgres runs out of memory).

## the org chart

Start at the boss, then keep finding people whose manager is someone we already found.

```sql
WITH RECURSIVE org AS (
  SELECT employee_id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL                 -- Vikram

  UNION ALL

  SELECT e.employee_id, e.name, e.manager_id, o.level + 1
  FROM employees e
  JOIN org o ON e.manager_id = o.employee_id
)
SELECT * FROM org ORDER BY level, name;
```

| name | level |
|---|---|
| Vikram | 1 |
| Anita | 2 |
| Sameer | 2 |
| Dev | 3 |
| Meera | 3 |
| Pooja | 3 |
| Rohit | 3 |
| Isha | 4 |

Works whether the tree is 4 levels or 40.

## showing the path

Build up a string as you go:

```sql
WITH RECURSIVE org AS (
  SELECT employee_id, name, name::text AS path
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, o.path || ' > ' || e.name
  FROM employees e
  JOIN org o ON e.manager_id = o.employee_id
)
SELECT path FROM org ORDER BY path;
```

`Vikram > Anita > Rohit > Isha`. The `::text` cast in the anchor matters, the column type is decided by the anchor, and VARCHAR(50) would overflow on long paths.

## going up instead of down

All of Isha's bosses, start at Isha and follow manager_id upward:

```sql
WITH RECURSIVE chain AS (
  SELECT employee_id, name, manager_id FROM employees WHERE name = 'Isha'
  UNION ALL
  SELECT e.employee_id, e.name, e.manager_id
  FROM employees e
  JOIN chain c ON e.employee_id = c.manager_id
)
SELECT name FROM chain;
```

## generating dates

Super practical, filling gaps in reports. Every month from jan to jul, even ones with no orders:

```sql
WITH RECURSIVE months AS (
  SELECT DATE '2024-01-01' AS month
  UNION ALL
  SELECT (month + INTERVAL '1 month')::date FROM months WHERE month < '2024-07-01'
)
SELECT m.month, COALESCE(SUM(o.amount), 0) AS revenue
FROM months m
LEFT JOIN orders o ON DATE_TRUNC('month', o.order_date) = m.month
GROUP BY m.month
ORDER BY m.month;
```

January shows 0 instead of just missing. (postgres also has `generate_series` for this, which is easier, but the recursive way works in other databases too.)

## infinite loops

If your data has a cycle (A manages B, B manages A), the recursion never ends. Protect yourself:

- add a depth limit, `WHERE o.level < 20`
- or track visited ids in an array and stop if you've seen one: `WHERE NOT e.employee_id = ANY(o.visited)`
- postgres 14+ has a `CYCLE` clause that does this for you

## stuff that trips people up

- forgetting the word RECURSIVE (needed in postgres and mysql).
- no stopping condition.
- type mismatch between anchor and recursive part, especially for strings that grow.
- using UNION instead of UNION ALL, works but slower, and it changes the cycle behaviour.

## practice

Check [`queries.sql`](queries.sql).
