---
title: Comebacks
difficulty: hard
tags: gaps, LAG, DISTINCT days
tables: events
output: user_id, comeback_date, previous_active_date
---

A **comeback** is a day a user was active after being away for at least a full week: their previous active day was **8 or more days earlier** (so 7 or more full days with no activity in between).

Return every comeback: the user, the comeback date, and the previous day they were active.

- "day" is the calendar date of `event_ts`, several events on one day are one active day
- a user can have more than one comeback

## hints

- first reduce events to distinct (user, day) pairs.
- `LAG(day) OVER (PARTITION BY user_id ORDER BY day)` gives the previous active day.
- active Mar 1 and then Mar 8 is a difference of 7 days, but only 6 empty days in between. That's not a comeback.

## explanation

Gaps between activity are just `day - LAG(day)` once you have one row per active day. The two places people slip:

1. **not deduping days.** Without `DISTINCT user_id, event_ts::date`, a busy day gives several rows and LAG compares a day with itself (gap 0).
2. **off by one.** "a full week away" means 7 *empty* days, so the difference between the two active dates is 8. Draw a tiny calendar when a question talks about gaps, it saves you every time.
