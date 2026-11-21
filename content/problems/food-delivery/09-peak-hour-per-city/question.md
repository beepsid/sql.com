---
title: Peak hour in every city
difficulty: medium
tags: EXTRACT, top 1 per group, ties
tables: orders, restaurants
output: city, order_hour, orders
---

For each city, which hour of the day (0 to 23, from `placed_ts`) gets the most orders? Count all orders, delivered or cancelled.

If hours tie for the top spot, return all of them.

## hints

- `EXTRACT(HOUR FROM placed_ts)` (or `HOUR(placed_ts)` in MySQL, `DATEPART(hour, placed_ts)` in SQL Server).
- count per (city, hour), then rank inside each city.

## explanation

Same top-per-group shape as before, with a computed group key. Pulling a part out of a timestamp (hour, weekday, month) and grouping by it is how you find patterns like "lunch rush" or "Friday nights", and it shows up in nearly every ops dashboard.
