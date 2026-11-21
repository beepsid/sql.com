---
title: Restaurants with no orders
difficulty: easy
tags: anti-join, NOT EXISTS, LEFT JOIN
tables: restaurants, orders
output: restaurant_id, name
---

Which restaurants have never received a single order, delivered or cancelled?

## hints

- LEFT JOIN orders and keep the rows where the order side is NULL, or use `NOT EXISTS`.

## explanation

The two standard anti-join shapes:

```sql
-- 1
SELECT r.* FROM restaurants r
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.restaurant_id = r.restaurant_id);

-- 2
SELECT r.* FROM restaurants r
LEFT JOIN orders o ON o.restaurant_id = r.restaurant_id
WHERE o.order_id IS NULL;
```

For #2, check a column that's never NULL on a real match (like the primary key), not something optional like `tip`.
