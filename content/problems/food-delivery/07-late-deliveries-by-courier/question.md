---
title: Late deliveries per courier
difficulty: medium
tags: conditional counts, intervals, boundaries
tables: orders
output: courier_id, deliveries, late, late_pct
---

A delivery is **late** if it arrived **more than 45 minutes** after the order was placed. Exactly 45 minutes is on time.

For every courier with at least one delivered order, count their deliveries, their late ones, and the late percentage rounded to 1 decimal place.

## hints

- compare timestamps directly: `delivered_ts > placed_ts + INTERVAL '45 minutes'`.
- "more than" is `>`, not `>=`. There are deliveries that take exactly 45 minutes.

## explanation

Boundaries are where SLA metrics go wrong. "More than 45" means 46 is late and 45 is not. One character (`>` vs `>=`) changes the late rate a lot when lots of deliveries land right on the target, which is exactly what happens in real life because people work towards the target.

Comparing timestamps with `placed_ts + INTERVAL '45 minutes'` also avoids converting to minutes and rounding.
