---
title: Day 7 retention by cohort
difficulty: medium
tags: retention, cohorts, LEFT JOIN, percentages
tables: users, events
output: signup_date, cohort_size, retained, retention_pct
---

Group users into cohorts by `signup_date`. For each cohort:

- `cohort_size` is the number of users who signed up that day
- `retained` is how many of them had at least one event **exactly 7 days** after signing up (signup on Mar 1 means an event on Mar 8)
- `retention_pct = 100 * retained / cohort_size`, rounded to 1 decimal place

Every cohort must appear, including ones where nobody came back.

## hints

- start from `users` so every cohort shows up, even with 0 retained.
- "exactly 7 days after" means `event_ts::date = signup_date + 7`.
- a user with 5 events on day 7 should count once. Make a list of retained user ids first, then LEFT JOIN it.

## explanation

Retention = "of the people who started on day X, how many came back on day X + N".

The two traps:

1. **losing empty cohorts.** If you inner join to events, a cohort where nobody came back has no rows and disappears. Start from users and LEFT JOIN.
2. **fan-out.** Joining users straight to day-7 events gives one row per event, so a busy user is counted several times. Reduce to `DISTINCT user_id` first, then join.
