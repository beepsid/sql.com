---
title: Hires per year
difficulty: easy
tags: dates, EXTRACT, GROUP BY
tables: employees
output: hire_year, hires
---

How many people were hired each year? Count everyone who was ever hired, including people who left since.

`hire_year` is a plain number like `2023`.

## hints

- `EXTRACT(YEAR FROM hire_date)` (or `YEAR(hire_date)` in MySQL / SQL Server) pulls the year out of a date.
- you can `GROUP BY` an expression, or by its position: `GROUP BY 1`.

## explanation

Grouping by a piece of a date is everyday SQL. `EXTRACT(YEAR FROM ...)` works in postgres and MySQL, `YEAR(...)` in MySQL and SQL Server, `DATE_PART('year', ...)` in postgres.

Only years with at least one hire show up. If you ever need *every* year, even empty ones, you'd generate a list of years first (a "date spine") and LEFT JOIN onto it.
