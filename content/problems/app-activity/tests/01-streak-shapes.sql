-- name: streaks across month ends and busy days
-- for: 01-daily-active-users, 02-longest-streak

INSERT INTO users VALUES
(1, '2026-02-01', 'IN', 'ios'),
(2, '2026-02-01', 'IN', 'ios'),
(3, '2026-02-01', 'IN', 'ios'),
(4, '2026-02-01', 'IN', 'ios');

INSERT INTO events VALUES
-- feb 27 -> mar 2 is 4 days in a row across a month end (feb has 28 days in 2026)
(1,  1, '2026-02-27 10:00:00', 'app_open'),
(2,  1, '2026-02-28 23:59:59', 'app_open'),
(3,  1, '2026-03-01 00:00:00', 'app_open'),
(4,  1, '2026-03-02 12:00:00', 'app_open'),
-- lots of events on the middle day still count as one day: streak of 3.
-- forgetting to dedupe days splits this into pieces and gives 2.
(5,  2, '2026-03-09 08:00:00', 'app_open'),
(6,  2, '2026-03-10 09:00:00', 'view_item'),
(7,  2, '2026-03-10 10:00:00', 'view_item'),
(8,  2, '2026-03-10 11:00:00', 'view_item'),
(9,  2, '2026-03-11 08:00:00', 'app_open'),
-- streaks of 3, then 1, then 2 -> longest is the first one
(10, 3, '2026-03-01 10:00:00', 'app_open'),
(11, 3, '2026-03-02 10:00:00', 'app_open'),
(12, 3, '2026-03-03 10:00:00', 'app_open'),
(13, 3, '2026-03-05 10:00:00', 'app_open'),
(14, 3, '2026-03-07 10:00:00', 'app_open'),
(15, 3, '2026-03-08 10:00:00', 'app_open'),
-- a single day
(16, 4, '2026-03-20 10:00:00', 'app_open'),
(17, 4, '2026-03-20 10:00:00', 'app_open');
