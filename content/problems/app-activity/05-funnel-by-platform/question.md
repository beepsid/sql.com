---
title: Funnel by platform
difficulty: hard
tags: funnels, ordering of events, conditional counts
tables: users, events
output: platform, viewed, carted, purchased
---

Build a 3 step funnel per platform, counting **users** (not events):

1. `viewed`, users with at least one `view_item`
2. `carted`, users who had an `add_to_cart` strictly **after** their first `view_item`
3. `purchased`, users who had a `purchase` strictly after their first add_to_cart that counted in step 2

Steps have to happen in order. Adding to cart before ever viewing an item doesn't count for step 2, and buying before that qualifying add to cart doesn't count for step 3.

Use the platform from `users`. Only include platforms that have at least one viewer.

## hints

- work out each user's first `view_item` time first.
- step 2 is the first add_to_cart *after* that view. Step 3 is any purchase after that cart time.
- count users, not events: one row per user per step, then LEFT JOIN the steps and count non-NULLs.

## explanation

Ordered funnels are harder than they look because each step depends on *when* the previous step happened. Build it one step at a time:

```
first_view  = MIN(ts) of view_item per user
first_cart  = MIN(ts) of add_to_cart AFTER first_view
bought      = any purchase AFTER first_cart
```

Each CTE has at most one row per user, so joining them never fans out, and `COUNT(column)` of each step is the number of users who made it that far. Counting events instead (`COUNT(*)` after joining events) is the most common way this question goes wrong.
