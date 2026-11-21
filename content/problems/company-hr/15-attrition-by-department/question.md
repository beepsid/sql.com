---
title: Attrition by department
difficulty: medium
tags: conditional counts, COUNT(column), percentages
tables: employees, departments
output: dept_name, hired, leavers, attrition_pct
---

For each department, how many people were ever hired into it, how many of them have left, and what's the attrition rate?

- `leavers` are people with a `termination_date`
- `attrition_pct = 100 * leavers / hired`, rounded to 1 decimal place
- departments that never had anyone don't appear

## hints

- `COUNT(termination_date)` only counts rows where it isn't NULL, which is exactly the leavers.
- careful with integer division, multiply by `100.0`.

## explanation

`COUNT(column)` is a quiet superpower: it counts non-NULL values. Since `termination_date` is NULL for people still here, `COUNT(termination_date)` is the leaver count, no CASE needed.

Same idea as `COUNT(*) FILTER (WHERE ...)` or `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`, pick whichever reads best to you.
