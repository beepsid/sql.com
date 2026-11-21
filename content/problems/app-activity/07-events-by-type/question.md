---
title: Events by type
difficulty: easy
tags: GROUP BY, COUNT DISTINCT
tables: events
output: event_type, events, users
---

For each `event_type`, how many events were logged and how many **different users** did that event at least once?

## hints

- `COUNT(*)` counts events, `COUNT(DISTINCT user_id)` counts people.
- both can go in the same SELECT.

## explanation

`COUNT(*)` vs `COUNT(DISTINCT user_id)` is the difference between "how much" and "how many people". In product analytics you almost always want both: 1000 purchases from 10 people is a very different story from 1000 purchases from 1000 people.
