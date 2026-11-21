-- name: cohorts where few or no users came back
-- for: 03-day-7-retention

INSERT INTO users VALUES
-- cohort mar 1: 3 users, 1 retained -> 33.3
(1, '2026-03-01', 'IN', 'ios'),
(2, '2026-03-01', 'IN', 'ios'),
(3, '2026-03-01', 'IN', 'ios'),
-- cohort mar 2: nobody retained, one user never did anything at all
(4, '2026-03-02', 'IN', 'ios'),
(5, '2026-03-02', 'IN', 'ios'),
-- cohort mar 3: 1 user, retained with many events on day 7
(6, '2026-03-03', 'IN', 'ios');

INSERT INTO events VALUES
(1, 1, '2026-03-08 23:59:59', 'app_open'),
-- day 6 and day 8, but not day 7
(2, 2, '2026-03-07 10:00:00', 'app_open'),
(3, 2, '2026-03-09 10:00:00', 'app_open'),
-- day 7 of someone else's cohort
(4, 3, '2026-03-09 10:00:00', 'app_open'),
(5, 4, '2026-03-08 10:00:00', 'app_open'),
(6, 6, '2026-03-10 08:00:00', 'app_open'),
(7, 6, '2026-03-10 09:00:00', 'view_item'),
(8, 6, '2026-03-10 10:00:00', 'purchase');
