-- name: even and odd sized departments
-- for: 04-median-salary

INSERT INTO departments VALUES
(1, 'Even'),
(2, 'Odd'),
(3, 'Single'),
(4, 'Halves');

INSERT INTO employees VALUES
-- 70, 80, 90, 100 -> 85.00 (and a leaver with a huge salary that must not count)
(1, 'E1', 1, NULL, 70,  '2020-01-01', NULL),
(2, 'E2', 1, 1,    100, '2020-01-01', NULL),
(3, 'E3', 1, 1,    80,  '2020-01-01', NULL),
(4, 'E4', 1, 1,    90,  '2020-01-01', NULL),
(5, 'E5', 1, 1,    999, '2020-01-01', '2021-01-01'),
-- 10, 20, 1000 -> 20.00, not the average
(6, 'O1', 2, NULL, 1000, '2020-01-01', NULL),
(7, 'O2', 2, 6,    10,   '2020-01-01', NULL),
(8, 'O3', 2, 6,    20,   '2020-01-01', NULL),
-- one person -> their salary
(9, 'S1', 3, NULL, 55, '2020-01-01', NULL),
-- 1, 2 -> 1.50
(10, 'H1', 4, NULL, 1, '2020-01-01', NULL),
(11, 'H2', 4, 10,   2, '2020-01-01', NULL);
