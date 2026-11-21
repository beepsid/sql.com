---
title: Same salary, same department
difficulty: easy
tags: GROUP BY, HAVING
tables: employees, departments
output: dept_name, salary, employees
---

Find salaries that are shared by **two or more current employees in the same department**.

Return the department, the salary and how many current employees in that department earn exactly that.

## hints

- group by department *and* salary.
- `WHERE` filters rows before grouping, `HAVING` filters groups after. "two or more" is about the group.

## explanation

`HAVING` is the WHERE for groups. The order SQL actually runs things in:

`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`

so `COUNT(*) > 1` can only go in HAVING, the groups don't exist yet when WHERE runs. This exact pattern also finds duplicate rows in any table.
