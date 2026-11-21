---
title: Purchase conversion by country
difficulty: medium
tags: LEFT JOIN, join fan-out, percentages
tables: users, events
output: country, users, purchasers, conversion_pct
---

For each country, how many users signed up, how many of them made at least one purchase, and what's the conversion rate?

- every user counts in `users`, even ones with no events
- `conversion_pct = 100 * purchasers / users`, rounded to 1 decimal place

## hints

- joining users straight to events gives one row per *event*, so `COUNT(*)` stops counting users.
- make a list of purchasers first (`SELECT DISTINCT user_id FROM events WHERE event_type = 'purchase'`), then LEFT JOIN users to it.

## explanation

This is join fan-out again. Users and events are one-to-many, so after joining them every user is repeated once per event and `COUNT(*)` counts events.

Fix it by shrinking the many side down to one row per user *before* the join:

```sql
WITH purchasers AS (SELECT DISTINCT user_id FROM events WHERE event_type = 'purchase')
SELECT u.country, COUNT(*) AS users, COUNT(p.user_id) AS purchasers ...
FROM users u LEFT JOIN purchasers p ON p.user_id = u.user_id
```

Now it's one-to-one, so both counts are honest.
