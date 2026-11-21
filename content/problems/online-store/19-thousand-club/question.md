---
title: The order that hit 1000
difficulty: hard
tags: running totals, window frames, ties
tables: orders, order_items
output: customer_id, order_id, running_total
---

Every customer joins the "1000 club" the moment their lifetime spend on completed orders reaches **1000 or more**.

For each registered customer who made it, return the completed order that took them over the line, and their running total right after that order.

- go through a customer's completed orders by `order_ts`. If two orders have the exact same `order_ts`, the smaller `order_id` comes first.
- an order's value is the sum of `quantity * unit_price` over its lines
- customers who never reach 1000 don't appear

## hints

- order totals first, then `SUM(total) OVER (PARTITION BY customer_id ORDER BY order_ts, order_id)` for a running total.
- the default window frame is `RANGE`, which lumps rows with the same ORDER BY value together. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` adds one row at a time.
- once you have running totals, keep the first row per customer where it's `>= 1000`.

## explanation

Running totals are `SUM() OVER (... ORDER BY ...)`. The subtle part is the **frame**.

When you write `SUM(x) OVER (ORDER BY order_ts)` the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. "Current row" in RANGE mode means *every row with the same order_ts*, so two orders at the same second both get the combined total. That makes the earlier one look like it crossed 1000 when it didn't.

Two fixes, use both:

- order by something unique: `ORDER BY order_ts, order_id`
- say what you mean: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`

Then filter to `running_total >= 1000` and take the first one per customer with `ROW_NUMBER()`.
