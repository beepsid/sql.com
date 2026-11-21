---
title: Restaurant ratings
difficulty: medium
tags: HAVING, NULLs in aggregates
tables: orders, restaurants
output: restaurant_id, name, rated_orders, avg_rating
---

For each restaurant with **at least 3 rated orders**, return how many rated orders it has and its average rating rounded to 2 decimal places.

Orders with a NULL `rating` weren't rated and don't count anywhere.

## hints

- `AVG(rating)` already ignores NULLs.
- but `COUNT(*)` doesn't. The "at least 3" check needs `COUNT(rating)`.

## explanation

Aggregates handle NULLs differently and it's easy to mix them up:

- `AVG(rating)`, `SUM`, `MIN`, `MAX`, `COUNT(rating)` all skip NULLs
- `COUNT(*)` counts rows, NULL or not

So `HAVING COUNT(*) >= 3` lets in a restaurant with 3 orders where only 1 was rated, and its "average" is just that one rating. Count the thing you actually care about.
