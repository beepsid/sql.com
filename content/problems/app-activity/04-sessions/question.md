---
title: Sessions per user
difficulty: hard
tags: sessionization, LAG, running sum
tables: events
output: user_id, sessions, avg_session_minutes
---

Split each user's events into sessions. A new session starts when an event comes **more than 30 minutes** after that user's previous event. A gap of exactly 30 minutes stays in the same session. The first event of a user always starts a session.

For every user with events, return:

- `sessions`, how many sessions they had
- `avg_session_minutes`, the average session length in minutes, where a session's length is the time from its first event to its last event (a session with one event is 0 minutes). Round to 1 decimal place.

## hints

- `LAG(event_ts) OVER (PARTITION BY user_id ORDER BY event_ts, event_id)` gives the previous event's time.
- flag a new session with 1 when there's no previous event or the gap is `> INTERVAL '30 minutes'`, else 0.
- a running `SUM` of that flag numbers the sessions. Then group by (user, session number).

## explanation

Sessionization is gaps and islands with a time threshold:

1. **flag** each event that starts a new session (first event, or gap over 30 minutes)
2. **running sum** the flags, so every event gets its session number
3. **group** by user + session number to get each session's start and end

Running sums need a deterministic order. Two events with the same timestamp are common, so order by `event_ts, event_id` and use a `ROWS` frame. With the default `RANGE` frame, tied timestamps get summed together and session numbers jump.
