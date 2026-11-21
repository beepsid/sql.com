---
title: Courier earnings
difficulty: medium
tags: LEFT JOIN, COALESCE, NULL math
tables: couriers, orders
output: courier_id, name, deliveries, earnings
---

Couriers earn **30** per delivered order plus whatever tip came with it.

Return **every** courier with their number of delivered orders and total earnings. Couriers with no deliveries show `0` and `0`. A NULL tip adds nothing.

## hints

- start from `couriers` and LEFT JOIN orders, so idle couriers stay.
- put `status = 'delivered'` in the ON clause. In the WHERE it would throw idle couriers away.
- `30 + NULL` is NULL and `SUM` of only NULLs is NULL. `COALESCE` both.

## explanation

NULL is contagious in arithmetic: `30 + NULL` is `NULL`, not 30. So `SUM(30 + tip)` silently drops every untipped delivery's 30, and `SUM(tip)` for a courier who never got a tip is NULL, not 0.

```sql
COUNT(o.order_id)                          AS deliveries,
COALESCE(SUM(30 + COALESCE(o.tip, 0)), 0)  AS earnings
```

The inner COALESCE fixes the NULL tip, the outer one fixes couriers with no rows at all. Pair that with a LEFT JOIN filtered in the ON clause and every courier shows up with honest numbers.
