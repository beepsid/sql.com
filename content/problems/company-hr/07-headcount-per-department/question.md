---
title: Headcount per department
difficulty: easy
tags: LEFT JOIN, COUNT, ON vs WHERE
tables: departments, employees
output: dept_name, headcount
---

How many **current** employees does every department have?

Every department must appear, including ones with nobody in them (`headcount = 0`).

## hints

- "every department" means you start from `departments` and LEFT JOIN employees.
- `COUNT(*)` counts the NULL row a LEFT JOIN makes for an empty department. `COUNT(e.emp_id)` doesn't.
- put `termination_date IS NULL` in the ON clause, not the WHERE.

## explanation

Two classic LEFT JOIN traps in one question.

1. **`COUNT(*)` vs `COUNT(column)`.** An empty department still produces one row from the LEFT JOIN, full of NULLs. `COUNT(*)` counts that row (you get 1), `COUNT(e.emp_id)` skips NULLs (you get 0).
2. **ON vs WHERE.** If the "current" filter goes in the WHERE, a department where everyone left gets all its rows thrown away *after* the join, so it vanishes. In the ON clause it only decides which employees get matched, and the department row stays.

```sql
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id AND e.termination_date IS NULL
```
