-- name: days with no activity at all
-- for: 06-rolling-7-day-dau

INSERT INTO users VALUES
(1, '2026-03-01', 'IN', 'ios'),
(2, '2026-03-01', 'IN', 'ios');

-- active on mar 1, 2, 3, then nothing until mar 7, then mar 8 and mar 12.
-- the rolling window has to treat mar 4, 5, 6, 9, 10, 11 as 0.
INSERT INTO events VALUES
(1, 1, '2026-03-01 10:00:00', 'app_open'),
(2, 2, '2026-03-01 11:00:00', 'app_open'),
(3, 1, '2026-03-02 10:00:00', 'app_open'),
(4, 1, '2026-03-03 10:00:00', 'app_open'),
(5, 1, '2026-03-03 10:05:00', 'view_item'),
(6, 2, '2026-03-07 10:00:00', 'app_open'),
(7, 1, '2026-03-08 10:00:00', 'app_open'),
(8, 2, '2026-03-08 10:00:00', 'app_open'),
(9, 2, '2026-03-12 23:00:00', 'app_open');
