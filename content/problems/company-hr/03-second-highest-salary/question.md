---
title: Second highest salary per department
difficulty: medium
tags: DENSE_RANK, distinct values, LEFT JOIN
tables: employees, departments
output: dept_name, second_highest
---

For **every** department, find the second highest **distinct** salary among its current employees.

- if two people share the top salary, the second highest is the next salary below that, not the same number again. So salaries 100, 100, 80 give 80.
- if a department has fewer than two distinct salaries (or no current employees at all), `second_highest` is NULL. The department still appears.

## hints

- `DENSE_RANK()` makes 100, 100, 80 into 1, 1, 2, so rank 2 is the second highest *distinct* salary.
- every department must appear, even empty ones. Start from `departments`.
- a department with no rank 2 should give NULL, not disappear.

## explanation

"Second highest" questions are really about ties and empty groups.

- `DENSE_RANK` handles ties: equal salaries share a rank and the next salary gets the next number
- starting from `departments` and pulling the value with a LEFT JOIN or a scalar subquery keeps departments that have no second salary (they get NULL)

Another classic way: `MAX(salary) WHERE salary < (SELECT MAX(salary) ...)` per department.
