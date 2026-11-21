---
title: App activity
tags: product analytics
large: 3000
---

A mobile / web app that logs every user action as an event. This is the classic product analytics setup: daily actives, streaks, retention, sessions, funnels. Big tech data and analyst interviews are full of these.

- `event_type` is one of `app_open`, `view_item`, `add_to_cart`, `purchase`
- a user can have many events per day, and two events can have the exact same timestamp
- "day" always means the calendar date of `event_ts`

Answers are checked on the sample data, named test cases, random data and a large dataset, so don't hardcode anything you see in the sample.
