-- name: tied salaries and people who left
-- for: 01-highest-paid-per-department, 03-second-highest-salary, 04-median-salary, 07-headcount-per-department, 12-salary-rank-in-department, 16-gap-to-department-top

INSERT INTO departments VALUES
(1, 'Design'),
(2, 'Support'),
(3, 'Research'),
(4, 'Empty dept'),
(5, 'Only leavers');

INSERT INTO employees VALUES
-- design: two people tie at the top, then 80 -> top is both, second highest is 80
(1, 'D1', 1, NULL, 100, '2020-01-01', NULL),
(2, 'D2', 1, 1,    100, '2020-01-01', NULL),
(3, 'D3', 1, 1,    80,  '2020-01-01', NULL),
(4, 'D4', 1, 1,    70,  '2020-01-01', NULL),
-- the best paid person in support left, so they don't count
(5, 'S1', 2, NULL, 500, '2020-01-01', '2023-01-01'),
(6, 'S2', 2, 5,    60,  '2020-01-01', NULL),
(7, 'S3', 2, 5,    60,  '2020-01-01', NULL),
-- research: one current person, so no second highest
(8, 'R1', 3, NULL, 90,  '2020-01-01', NULL),
(9, 'R2', 3, 8,    95,  '2020-01-01', '2024-05-01'),
-- only leavers
(10, 'L1', 5, NULL, 70, '2020-01-01', '2022-01-01');
