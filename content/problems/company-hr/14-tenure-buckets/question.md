---
title: Tenure buckets
difficulty: medium
tags: CASE WHEN, date math, AGE
tables: employees
output: bucket, employees
---

Group **current** employees by how long they've been here as of **2026-06-30**, counted in **full years** (like an age: someone hired on 2023-06-30 has exactly 3 full years, someone hired on 2023-07-01 has 2).

| full years | bucket |
|---|---|
| less than 1 | `0-1 years` |
| 1 or 2 | `1-3 years` |
| 3 or 4 | `3-5 years` |
| 5 or more | `5+ years` |

Only return buckets that have at least one person.

## hints

- postgres: `EXTRACT(YEAR FROM AGE(DATE '2026-06-30', hire_date))` gives full years. MySQL: `TIMESTAMPDIFF(YEAR, hire_date, '2026-06-30')`.
- dividing days by 365 goes wrong around leap years and anniversaries.
- make the bucket with `CASE WHEN`, then group by it.

## explanation

`days / 365` *feels* right but drifts: from 2021-07-01 to 2026-06-30 is 1825 days, and 1825 / 365 is exactly 5.0, but that person's 5th anniversary is tomorrow. Leap days make it worse.

Use a real calendar difference: `AGE()` in postgres, `TIMESTAMPDIFF(YEAR, ...)` in MySQL. In SQL Server `DATEDIFF(year, ...)` only counts year boundaries crossed, so you'd adjust it by one when the anniversary hasn't happened yet.

Then `CASE WHEN` maps the number to a label. Checks run top to bottom and the first true one wins, so you can write `WHEN y < 1 ... WHEN y < 3 ...` without repeating lower bounds.
