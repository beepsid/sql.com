---
title: Average salary by department
difficulty: easy
tags: JOIN, AVG, ROUND
tables: employees, departments
output: dept_name, avg_salary
---

What's the average salary of **current** employees in each department? Round it to 2 decimal places.

Departments with no current employees don't appear.

## hints

- join employees to departments to get the name, filter to current people, group by department.
- `ROUND(AVG(salary), 2)`

## explanation

Straightforward, but notice one thing if you write SQL Server at work: there `AVG` of an INT column returns an INT, so `AVG(salary)` of 70000 and 70001 is `70000`, not `70000.5`. Postgres and MySQL give you decimals. `AVG(salary * 1.0)` is the portable way to be safe.
