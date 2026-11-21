---
title: Rolling 7 day average DAU
difficulty: hard
tags: date spine, window frames, rolling average
tables: events
output: activity_date, dau, avg_7d
---

Return one row for **every calendar date** from the first event date to the last event date, including days where nobody did anything.

- `dau` is the number of distinct users active that day (0 on empty days)
- `avg_7d` is the average `dau` over that day and the 6 days before it, rounded to 2 decimal places. Empty days count as 0 in the average.
- for the first 6 dates there isn't a full week yet, so `avg_7d` is NULL there

## hints

- days with no events don't exist in `events`, but they must exist in your output. Generate a calendar with `generate_series`.
- LEFT JOIN daily DAU onto the calendar and `COALESCE` empty days to 0.
- `AVG(dau) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` is the 7 day average.

## explanation

A rolling window only works if every day is a row. If a day with no activity is missing, `6 PRECEDING` reaches back 7 *rows*, which is more than 7 days, and the average is wrong without any error.

So: build a **date spine** (`generate_series(first_day, last_day, interval '1 day')`), LEFT JOIN the real data onto it, fill gaps with 0, and only then run the window. Use `ROWS`, not `RANGE`, and blank out the first 6 days where there isn't a full week yet.
