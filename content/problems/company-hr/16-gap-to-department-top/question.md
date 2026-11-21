---
title: Gap to the top earner
difficulty: medium
tags: window functions, MAX OVER
tables: employees, departments
output: emp_id, dept_name, salary, gap
---

For every **current** employee, how far is their salary below the highest salary among **current** employees of the same department?

`gap = department top salary - their salary`, so the top earner has `gap = 0`.

## hints

- `MAX(salary) OVER (PARTITION BY dept_id)` puts the department max on every row, without collapsing rows like GROUP BY.
- window functions run after WHERE. Filter to current employees in the same query level (or before) so people who left can't be the max.

## explanation

A window aggregate is GROUP BY that keeps every row:

```sql
MAX(salary) OVER (PARTITION BY dept_id) - salary
```

Where the filter sits decides what the window sees. If you compute the window over *all* employees in a subquery and filter to current people outside it, a highly paid person who left last year is still the "top", and everyone's gap is wrong.
