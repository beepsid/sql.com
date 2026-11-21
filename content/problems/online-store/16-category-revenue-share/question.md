---
title: Revenue share by category
difficulty: medium
tags: LEFT JOIN, COALESCE, share of total
tables: products, order_items, orders
output: category, revenue, share_pct
---

For **every** product category, show its revenue from completed orders and what percentage of total completed revenue that is.

- `share_pct = 100 * revenue / total revenue`, rounded to 1 decimal place
- a category with no completed sales still shows up, with `revenue = 0` and `share_pct = 0`
- guest orders are sales too, include them

## hints

- start from the list of categories (`SELECT DISTINCT category FROM products`), not from the sales, so empty categories survive.
- a LEFT JOIN gives NULL for categories with no sales, `COALESCE(revenue, 0)` turns that into 0.
- `SUM(revenue) OVER ()` gives the grand total on every row.

## explanation

The interesting part is "every category". If you start from `order_items` and join to products, a category with no sales has no rows at all, so it can't appear.

Flip it around: start from the thing you want one row per (categories), LEFT JOIN the sales, and patch NULLs with `COALESCE`.

Also watch where the `status = 'completed'` filter goes. If you LEFT JOIN orders and then put the status in the WHERE, you turn the LEFT JOIN back into an inner join and lose the empty categories again. Filter inside the sales subquery (or in the ON clause).
