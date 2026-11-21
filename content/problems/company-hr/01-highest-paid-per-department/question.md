---
title: Highest paid per department
difficulty: easy
tags: window functions, ties
tables: employees, departments
output: dept_name, name, salary
---

For each department, return the **current** employee (or employees, if there's a tie) with the highest salary.

Departments with no current employees don't appear.

## hints

- rank current employees inside each department by salary, highest first.
- ties must all come back, so `RANK()` (or `DENSE_RANK()`), not `ROW_NUMBER()`.
- filter to current employees *before* ranking.

## explanation

Top 1 per group with ties. Two common alternatives that are also right:

```sql
-- compare against the department max
WHERE e.salary = (SELECT MAX(salary) FROM employees x
                  WHERE x.dept_id = e.dept_id AND x.termination_date IS NULL)
```

The thing to watch is *when* you filter. Rank first and filter to current employees later, and someone who left (but used to be the best paid) takes rank 1, so the department ends up with nobody.
