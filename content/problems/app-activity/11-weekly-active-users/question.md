---
title: Weekly active users
difficulty: easy
tags: DATE_TRUNC, COUNT DISTINCT
tables: events
output: week_start, wau
---

For each week, how many different users had at least one event?

Weeks start on **Monday**. `week_start` is the Monday's date. Weeks with no activity don't appear.

## hints

- in postgres `DATE_TRUNC('week', event_ts)` already snaps to Monday.
- a user active on 5 days of a week is still one weekly active user.

## explanation

DAU, WAU and MAU are the same query with a different bucket. `DATE_TRUNC('week', ...)` uses ISO weeks, which start on Monday. In MySQL you'd write `DATE_SUB(DATE(event_ts), INTERVAL WEEKDAY(event_ts) DAY)`.

Notice that WAU is not the sum of DAU: someone active Monday and Tuesday is 2 in the daily numbers but 1 in the weekly one. That's why you always recount distinct users per bucket instead of adding up smaller buckets.
