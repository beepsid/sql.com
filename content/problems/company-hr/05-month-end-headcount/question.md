---
title: Headcount at every month end
difficulty: hard
tags: date spine, non-equi join, point in time
tables: employees
output: month_end, headcount
---

For each month of **2024**, count how many people were employed on the **last day** of that month.

Someone counts on a given day if they were hired on or before that day, and either haven't left or left **after** that day. Leaving on the last day of the month means they're not counted at that month end.

Return 12 rows, `month_end` as a date (`2024-01-31`, `2024-02-29`, ...), even for months where the headcount is 0.

## hints

- make the 12 month ends yourself with `generate_series` so empty months still show up.
- join employees to each month end with a *condition*, not an `=`: hired on or before, and not yet left.
- "left after that day" is `termination_date > month_end`. Leaving on the last day doesn't count.

## explanation

Point-in-time questions ("how many on date X") are a **non-equi join** against a date spine:

```sql
FROM month_ends me
LEFT JOIN employees e
  ON e.hire_date <= me.month_end
 AND (e.termination_date IS NULL OR e.termination_date > me.month_end)
```

Two details make or break it: `COUNT(e.emp_id)` (not `COUNT(*)`) so empty months show 0, and getting the boundary right on the termination date. Month ends are easiest as `month_start + interval '1 month - 1 day'`, which handles Feb 29 for free.
