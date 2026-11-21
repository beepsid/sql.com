---
title: Each customer's biggest order
difficulty: medium
tags: window functions, RANK, top 1 per group, ties
tables: orders, order_items
output: customer_id, order_id, order_total
---

For every registered customer, find their **biggest completed order** by order total (sum of `quantity * unit_price`).

If a customer has two or more orders tied for their biggest, return all of them. Guest orders are skipped.

## hints

- get order totals first (one row per order), then rank them inside each customer.
- `RANK()` gives tied rows the same number, `ROW_NUMBER()` breaks ties randomly. Which one keeps every tied order?

## explanation

"Top 1 per group" is the most common window function question there is.

```sql
RANK() OVER (PARTITION BY customer_id ORDER BY total DESC)
```

`PARTITION BY` restarts the numbering for each customer, `ORDER BY total DESC` puts the biggest first. Then keep `rank = 1`.

The question says ties should all come back, so `ROW_NUMBER()` is wrong here, it would pick one tied order at random. Always check what the question wants for ties: `ROW_NUMBER` (exactly one), `RANK` (all ties, gaps after), `DENSE_RANK` (all ties, no gaps).
