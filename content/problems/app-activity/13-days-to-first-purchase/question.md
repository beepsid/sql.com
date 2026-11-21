---
title: Days to first purchase
difficulty: medium
tags: aggregation, date math
tables: users, events
output: user_id, days_to_first_purchase
---

For every user who has purchased, how many calendar days passed between their `signup_date` and the **date** of their first purchase?

Buying on the signup day is 0. Users who never purchased don't appear.

## hints

- `MIN(event_ts)` over purchase events gives the first purchase.
- turn it into a date (`::date` or `CAST(... AS DATE)`) before subtracting, otherwise you're mixing timestamps and dates.

## explanation

"Calendar days" means dates, not 24 hour chunks. A purchase at 23:59 on signup day plus one is 1 day, even though only a minute might have passed.

So cast the timestamp to a date first, then subtract: `MIN(e.event_ts)::date - u.signup_date`. MySQL: `DATEDIFF(MIN(e.event_ts), u.signup_date)`. SQL Server: `DATEDIFF(day, u.signup_date, MIN(e.event_ts))`.
