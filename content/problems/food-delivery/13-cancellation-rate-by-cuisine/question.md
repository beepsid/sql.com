---
title: Cancellation rate by cuisine
difficulty: easy
tags: conditional aggregation, percentages
tables: orders, restaurants
output: cuisine, orders, cancelled, cancel_pct
---

For each cuisine, count all orders, the cancelled ones, and the cancellation rate (`100 * cancelled / orders`, rounded to 1 decimal place).

Only cuisines with at least one order.

## hints

- `SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)` counts cancellations inside the same GROUP BY.
- multiply by `100.0`, not `100`, to dodge integer division.

## explanation

Conditional aggregation again: one group, two counts with different conditions. Once this pattern clicks you'll write rates, funnels and pivots with it without thinking.
