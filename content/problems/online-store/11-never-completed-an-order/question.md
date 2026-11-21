---
title: Customers who never completed an order
difficulty: easy
tags: anti-join, NOT IN vs NOT EXISTS, NULL traps
tables: customers, orders
output: customer_id, name
---

Find every customer who has **never completed an order**. That includes customers who only have cancelled or refunded orders, and customers with no orders at all.

## hints

- you want customers with *no* matching completed order. That's an anti-join.
- remember `orders.customer_id` can be NULL for guest checkouts. What does `x NOT IN (1, 2, NULL)` return?

## explanation

The famous trap. This looks right:

```sql
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE status = 'completed')
```

but guest orders have `customer_id = NULL`. `5 NOT IN (1, 2, NULL)` means `5 <> 1 AND 5 <> 2 AND 5 <> NULL`, and `5 <> NULL` is *unknown*, so the whole thing is never true. One guest order and the query returns **nothing**.

`NOT EXISTS` doesn't have this problem because it only asks "is there a matching row?". Use it (or `LEFT JOIN ... WHERE o.order_id IS NULL`) for anti-joins and you'll never get bitten.
