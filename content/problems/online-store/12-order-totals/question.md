---
title: Order totals
difficulty: easy
tags: JOIN, GROUP BY, SUM
tables: orders, order_items
output: order_id, customer_id, order_total
---

For every **completed** order, return its total: the sum of `quantity * unit_price` over all of its lines.

Guest orders are included, their `customer_id` is just NULL.

## hints

- join `orders` to `order_items` on `order_id`, then group by the order.
- `SUM(quantity * unit_price)` multiplies first, per line, then adds the lines up.

## explanation

An order lives in two tables: the header (`orders`) and the lines (`order_items`). Join them, filter on the header's status, then fold the lines back into one row per order with `GROUP BY`.

You'll reuse this "order totals" step as a CTE in a lot of harder questions, so it's worth getting comfortable with it.
