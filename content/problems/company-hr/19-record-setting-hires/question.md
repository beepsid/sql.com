---
title: Record-setting hires
difficulty: hard
tags: running max, window frames, same-day ties
tables: employees
output: emp_id, name, hire_date, salary
---

Going through hires in date order, find every **record-setting hire**: someone whose salary was strictly higher than everyone hired on an **earlier date**.

- people hired on the same day don't compete with each other, they're only compared against earlier days
- the very first hire date has nobody before it, so everyone hired that day counts
- include people who left since

## hints

- you need "the highest salary of everyone hired before this date". A correlated subquery works but gets slow on big data.
- a running max window with `ROWS ... 1 PRECEDING` over employees would compare same-day hires to each other. Aggregate to one row per hire date first.
- per date: `MAX(salary)`. Then `MAX(...) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING)` is the best salary on any earlier day.

## explanation

The tricky part is "earlier date", not "earlier row". If you run a window over employees ordered by `hire_date`, two people hired on the same day are different rows, so the second one gets compared against the first.

Clean fix: collapse to one row per date, then the previous rows *are* the earlier dates.

```sql
WITH per_day AS (SELECT hire_date, MAX(salary) AS best FROM employees GROUP BY hire_date),
before AS (
  SELECT hire_date,
         MAX(best) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS best_before
  FROM per_day
)
```

Join that back to employees and keep `best_before IS NULL OR salary > best_before`. On the large dataset this is one sort instead of a subquery per employee.
