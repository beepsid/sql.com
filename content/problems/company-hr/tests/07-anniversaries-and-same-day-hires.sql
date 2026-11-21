-- name: work anniversaries, same-day hires and a department of only leavers
-- for: 07-headcount-per-department, 14-tenure-buckets, 16-gap-to-department-top, 18-longest-hiring-gap, 19-record-setting-hires

INSERT INTO departments VALUES
(31, 'Ops'),
(32, 'Only leavers'),
(33, 'Nobody ever');

INSERT INTO employees VALUES
-- 4 full years on 2026-06-30, but 1825 days / 365 says 5
(301, 'A', 31, NULL, 100, '2021-07-01', NULL),
(302, 'B', 31, 301,  100, '2021-07-01', NULL),
-- exactly 3 full years
(303, 'C', 31, 301,  150, '2023-06-30', NULL),
-- 2 full years, one day short
(304, 'D', 31, 301,  150, '2023-07-01', NULL),
(305, 'E', 31, 301,  90,  '2026-01-01', NULL),
-- same day as C and G, much higher salary, already left
(306, 'F', 32, NULL, 500, '2023-06-30', '2024-01-01'),
-- hired the same day as F: still a record, F doesn't count against G
(307, 'G', 31, 301,  200, '2023-06-30', NULL);
