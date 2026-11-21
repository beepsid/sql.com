---
title: Users who never purchased
difficulty: easy
tags: anti-join, NOT EXISTS
tables: users, events
output: user_id, platform
---

Find every user who has **never** had a `purchase` event. Users with no events at all count too.

## hints

- you want users with no matching purchase event: an anti-join.
- `WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.user_id = u.user_id AND e.event_type = 'purchase')`

## explanation

Anti-joins come in three flavours:

- `NOT EXISTS (subquery)`, the safest and usually the fastest
- `LEFT JOIN ... WHERE right.id IS NULL`, fine too, just put the `event_type` filter in the ON clause
- `NOT IN (subquery)`, works here but breaks the moment the subquery can return a NULL

Pick NOT EXISTS by default and you'll never have to think about it.
