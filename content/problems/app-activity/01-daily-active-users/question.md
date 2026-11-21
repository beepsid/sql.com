---
title: Daily active users
difficulty: easy
tags: aggregation, COUNT DISTINCT, dates
tables: events
output: activity_date, dau
---

For every day that has at least one event, count the number of **distinct users** who did anything that day.

`activity_date` is a date, `dau` is the user count.

## hints

- `event_ts::date` (or `CAST(event_ts AS DATE)`) drops the time so all events of a day land in one group.
- a user with 10 events in a day is still one active user: `COUNT(DISTINCT user_id)`.

## explanation

DAU is the hello world of product analytics: bucket by day, count distinct people. Two things to get right every time:

- group by the **date**, not the timestamp, or every event gets its own group
- count **distinct** users, not events
