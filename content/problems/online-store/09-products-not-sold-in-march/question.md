---
title: Products not sold in March
difficulty: easy
tags: anti-join, NOT EXISTS, date ranges
tables: products, order_items, orders
output: product_id, product_name
---

Which products had **no completed sale in March 2026**?

A product counts as sold in March if it's on a completed order placed any time from `2026-03-01 00:00:00` up to the end of March 31. Return every product that wasn't, including products that were never ordered at all.

## hints

- "rows in A with no match in B" is an anti-join. `NOT EXISTS (...)` is the cleanest way to write it.
- the status and the date both belong *inside* the subquery, they describe which sales count.
- `order_ts <= '2026-03-31'` stops at midnight on the 31st. Use `order_ts < '2026-04-01'` instead.

## explanation

The idea: for each product, check if there's a matching completed March sale, and keep it only when there isn't.

```sql
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
  WHERE oi.product_id = p.product_id
    AND o.status = 'completed'
    AND o.order_ts >= '2026-03-01' AND o.order_ts < '2026-04-01'
)
```

The classic trap is the date range. `order_ts` is a timestamp, so `BETWEEN '2026-03-01' AND '2026-03-31'` ends at `2026-03-31 00:00:00` and quietly drops a whole day of sales. A half-open range (`>=` start, `<` next month) is always right, whatever the time part is.
