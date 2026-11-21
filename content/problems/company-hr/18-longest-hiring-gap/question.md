---
title: Longest hiring gap
difficulty: medium
tags: LAG, date math
tables: employees, departments
output: dept_name, longest_gap_days
---

For each department, find the longest stretch between two **consecutive** hires, in days. Everyone ever hired counts, including people who left.

Two people hired on the same day have a gap of 0. Departments with fewer than two hires don't appear.

## hints

- `LAG(hire_date) OVER (PARTITION BY dept_id ORDER BY hire_date)` gives the previous hire's date on each row.
- in postgres, subtracting two dates gives a number of days. The first hire in a department has no previous one (NULL), skip it.

## explanation

`LAG()` looks one row back inside the window, so "gap since the previous thing" is just `hire_date - LAG(hire_date) OVER (...)`. Then it's a normal `MAX` per department.

The first row in each partition has no previous row, so `LAG` returns NULL. `MAX` ignores NULLs, and filtering `gap IS NOT NULL` makes departments with a single hire drop out.
