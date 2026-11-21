-- name: gaps of exactly 30 minutes, same timestamps, midnight
-- for: 04-sessions

INSERT INTO users VALUES
(1, '2026-03-01', 'IN', 'ios'),
(2, '2026-03-01', 'IN', 'ios'),
(3, '2026-03-01', 'IN', 'ios');

INSERT INTO events VALUES
-- 30 min exactly stays together, 30 min 1 sec splits.
-- sessions: [10:00, 10:30, 11:00] = 60 min, [11:30:01] = 0 min -> 2 sessions, avg 30.0
(1, 1, '2026-03-01 10:00:00', 'app_open'),
(2, 1, '2026-03-01 10:30:00', 'view_item'),
(3, 1, '2026-03-01 11:00:00', 'view_item'),
(4, 1, '2026-03-01 11:30:01', 'app_open'),
-- a session that crosses midnight, then two events at the same moment after a long gap.
-- sessions: [23:50, 00:10] = 20 min, [09:00, 09:00, 09:15] = 15 min -> 2, avg 17.5
(5, 2, '2026-03-01 23:50:00', 'app_open'),
(6, 2, '2026-03-02 00:10:00', 'view_item'),
(7, 2, '2026-03-02 09:00:00', 'app_open'),
(8, 2, '2026-03-02 09:00:00', 'view_item'),
(9, 2, '2026-03-02 09:15:00', 'add_to_cart'),
-- three single event sessions -> 3, avg 0.0
(10, 3, '2026-03-01 08:00:00', 'app_open'),
(11, 3, '2026-03-01 12:00:00', 'app_open'),
(12, 3, '2026-03-01 18:00:00', 'app_open');
