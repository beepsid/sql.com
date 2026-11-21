---
title: Products bought together
difficulty: hard
tags: self join, pairs, DISTINCT, market basket
tables: order_items, orders
output: product_a, product_b, orders
---

Which products get bought together? For every pair of different products that appear in the same **completed** order, count how many completed orders contain both.

- list each pair once, with the smaller product id as `product_a`
- a product can appear on two lines of the same order. That order still counts once for the pair.
- only pairs that were bought together at least once

## hints

- join the order lines to themselves on `order_id` to get every pair inside an order.
- `a.product_id < b.product_id` gets rid of (x, x) and of the (y, x) duplicate of (x, y).
- dedupe to one row per (order, product) *before* pairing, or the repeated line gets counted twice.

## explanation

Market basket analysis in one query. Pairing rows of the same table is a **self join**:

```sql
FROM lines a
JOIN lines b ON a.order_id = b.order_id AND a.product_id < b.product_id
```

The `<` does two jobs: it stops a product pairing with itself and it keeps only one of (1, 2) and (2, 1).

The trap is duplicate lines. If order 7 has product 3 on two lines, a naive self join makes the pair (3, 5) twice from that one order. Take `DISTINCT order_id, product_id` first, or count `DISTINCT a.order_id`.
