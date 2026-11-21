---
title: Order status breakdown
difficulty: easy
tags: GROUP BY, percentages, window over aggregate
tables: orders
output: status, orders, pct_of_orders
---

For every order `status`, count the orders and work out what percentage of **all** orders that is.

- `pct_of_orders = 100 * orders / total orders`, rounded to 1 decimal place
- guest orders count too, every row in `orders` is an order

## hints

- get the count per status first with `GROUP BY status`.
- the total can come from a subquery `(SELECT COUNT(*) FROM orders)` or from `SUM(COUNT(*)) OVER ()`.
- watch out for integer division: `100 * 3 / 7` is `42` in postgres, `100.0 * 3 / 7` is `42.857...`

## explanation

Two things are going on here.

1. **a total next to a group.** `SUM(COUNT(*)) OVER ()` looks weird but it's just a window function running *after* the GROUP BY: it adds up the per-status counts across all the groups.
2. **integer division.** `COUNT(*)` is an integer. Integer divided by integer stays an integer in postgres and SQL Server, so the decimals silently disappear. Multiplying by `100.0` first turns the whole thing into a decimal.

This "share of total" pattern shows up in interviews all the time, usually as "what % of revenue comes from each category".
