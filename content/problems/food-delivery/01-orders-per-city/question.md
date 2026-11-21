---
title: Orders per city
difficulty: easy
tags: JOIN, GROUP BY
tables: orders, restaurants
output: city, orders
---

How many orders (delivered or cancelled) did each city get? An order belongs to the city of its restaurant.

Only cities with at least one order.

## hints

- `orders` doesn't have a city, `restaurants` does. Join them on `restaurant_id`.
- then it's a plain `GROUP BY city`.

## explanation

Most real questions need a join before the GROUP BY because the thing you group by (city) lives in a different table from the thing you count (orders). Join first, group second.
