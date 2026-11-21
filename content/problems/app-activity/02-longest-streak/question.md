---
title: Longest activity streak
difficulty: hard
tags: gaps and islands, window functions
tables: events
output: user_id, longest_streak
---

For every user who has at least one event, find their longest streak: the most **consecutive calendar days** in a row on which they had at least one event.

A user active on Mar 1, 2, 3, 5 and 6 has streaks of 3 and 2, so their longest streak is 3. Several events on the same day still count as one day.

## hints

- first get one row per (user, active day). Several events on one day must not break things.
- number each user's days with `ROW_NUMBER()`. For consecutive days, `day - row_number` stays the same.
- group by that constant to get each streak, count its days, then take the max per user.

## explanation

This is the famous **gaps and islands** trick. Number the days per user and subtract the number from the date:

| day | row_number | day - row_number |
|---|---|---|
| Mar 1 | 1 | Feb 28 |
| Mar 2 | 2 | Feb 28 |
| Mar 3 | 3 | Feb 28 |
| Mar 5 | 4 | Mar 1 |

Consecutive days move together with the row number, so the difference stays constant inside a streak and jumps when there's a gap. Group by it and every group is one streak.

The bit everybody forgets: dedupe to `DISTINCT user_id, event_ts::date` first. Three events on one day give three row numbers for the same date and split the streak.
