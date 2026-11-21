---
title: Salary rank inside each department
difficulty: medium
tags: window functions, DENSE_RANK
tables: employees, departments
output: emp_id, dept_name, salary, salary_rank
---

Rank every **current** employee by salary inside their department. The highest salary is rank 1.

Equal salaries share a rank, and the next salary gets the very next number. So salaries 100, 100, 80 get ranks 1, 1, 2.

## hints

- `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)`
- `RANK()` would give 1, 1, 3. Which one matches the example?

## explanation

The three ranking functions only differ on ties:

| salary | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 100 | 1 | 1 | 1 |
| 100 | 2 | 1 | 1 |
| 80 | 3 | 3 | 2 |

Interviewers love asking which one to use. Read the tie rule in the question, it always tells you.
