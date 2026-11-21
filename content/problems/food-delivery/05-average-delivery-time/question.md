---
title: Average delivery time per restaurant
difficulty: easy
tags: timestamps, intervals, AVG
tables: orders, restaurants
output: restaurant_id, name, avg_minutes
---

For each restaurant with at least one delivered order, what's the average delivery time in minutes (from `placed_ts` to `delivered_ts`)? Round to 1 decimal place.

## hints

- postgres: `EXTRACT(EPOCH FROM delivered_ts - placed_ts) / 60` turns the interval into minutes.
- MySQL: `TIMESTAMPDIFF(MINUTE, placed_ts, delivered_ts)`. SQL Server: `DATEDIFF(minute, placed_ts, delivered_ts)`.

## explanation

Subtracting two timestamps gives an **interval** in postgres, like `00:35:00`. You can't average or compare intervals with numbers directly in most tools, so convert to a number first: `EXTRACT(EPOCH FROM interval)` is seconds, divide by 60 for minutes.

Every database spells this differently, it's one of the things worth keeping in a cheat sheet.
