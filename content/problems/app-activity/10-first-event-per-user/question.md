---
title: First thing every user did
difficulty: medium
tags: ROW_NUMBER, tie breaking
tables: events
output: user_id, first_event_ts, first_event_type
---

For every user with at least one event, return the timestamp and type of their **first** event.

If several events share that first timestamp, the one with the smallest `event_id` counts as first.

## hints

- `MIN(event_ts)` gets the time, but `MIN(event_type)` picks the alphabetically smallest type, not the type of that event.
- `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_ts, event_id)` and keep row 1.

## explanation

You can't get "the other columns of the min row" from GROUP BY alone. `MIN(event_ts), MIN(event_type)` mixes two different rows together.

`ROW_NUMBER()` with a full tiebreak (`ORDER BY event_ts, event_id`) picks exactly one real row per user, so every column comes from the same event. In postgres `DISTINCT ON (user_id) ... ORDER BY user_id, event_ts, event_id` is a neat shortcut for the same thing.
