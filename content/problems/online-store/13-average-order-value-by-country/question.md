---
title: Average order value by country
difficulty: medium
tags: CTEs, join fan-out, AVG
tables: customers, orders, order_items
output: country, orders, avg_order_value
---

For each country, how many completed orders were there and what was the **average order value**?

- an order's value is the sum of `quantity * unit_price` over its lines
- `avg_order_value` is rounded to 2 decimal places
- skip guest orders (they don't belong to a country), and countries with no completed orders

## hints

- the average has to be over *orders*, not over order lines. An order with 3 lines is still one order.
- work out each order's total in a CTE first, then join to customers and average those totals.

## explanation

This is the join fan-out trap. If you do

```sql
SELECT country, AVG(oi.quantity * oi.unit_price) ...
```

you're averaging **lines**, not orders. An order with a laptop and a cable becomes two small numbers instead of one big one.

Fix: collapse to one row per order first, then average.

```sql
WITH totals AS (
  SELECT o.order_id, o.customer_id, SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY o.order_id, o.customer_id
)
SELECT c.country, COUNT(*), ROUND(AVG(total), 2) FROM totals JOIN customers c ...
```

Rule of thumb: aggregate at the grain you're asked about *before* joining to the next level up.
