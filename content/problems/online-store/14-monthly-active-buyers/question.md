---
title: Monthly active buyers
difficulty: easy
tags: dates, DATE_TRUNC, COUNT DISTINCT
tables: orders
output: month, buyers
---

For each month, how many **different** customers placed at least one completed order?

- `month` is the first day of the month, like `2026-01-01`
- guest orders don't count, and months with no registered buyers don't appear

## hints

- `DATE_TRUNC('month', order_ts)` turns any timestamp into the start of its month.
- someone who bought 3 times in a month is still one buyer, so you need `COUNT(DISTINCT customer_id)`.

## explanation

Two building blocks you'll use forever:

- **bucketing time** with `DATE_TRUNC('month', ts)` (MySQL: `DATE_FORMAT(ts, '%Y-%m-01')`, SQL Server: `DATEFROMPARTS(YEAR(ts), MONTH(ts), 1)`)
- **counting people, not rows** with `COUNT(DISTINCT ...)`

`COUNT(DISTINCT customer_id)` already skips NULLs, but filtering guests out in the WHERE also makes sure a month that only had guest orders doesn't show up with 0.
