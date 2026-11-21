-- name: tied first events and comebacks right on the one week line
-- for: 10-first-event-per-user, 13-days-to-first-purchase, 14-comeback-users

INSERT INTO users VALUES
(71, '2026-03-01', 'IN', 'ios'),
(72, '2026-03-01', 'US', 'web');

INSERT INTO events VALUES
-- two events at the same first second: the smaller event_id (a view) is first
(9001, 71, '2026-03-01 09:00:00', 'view_item'),
(9002, 71, '2026-03-01 09:00:00', 'app_open'),
-- 7 days later: only 6 empty days, not a comeback
(9003, 71, '2026-03-08 10:00:00', 'app_open'),
-- 8 days later: a comeback
(9004, 71, '2026-03-16 10:00:00', 'purchase'),
-- one second before midnight on the day after signup: 1 day to first purchase
(9005, 72, '2026-03-02 23:59:59', 'purchase'),
(9006, 72, '2026-03-10 00:00:00', 'app_open');
