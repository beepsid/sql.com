-- name: hired or left right on a month end
-- for: 05-month-end-headcount

INSERT INTO departments VALUES (1, 'Ops');

INSERT INTO employees VALUES
-- hired on jan 31 -> counts for jan
(1, 'Hired jan 31',   1, NULL, 50, '2024-01-31', NULL),
-- hired feb 1 -> first counts in feb
(2, 'Hired feb 1',    1, 1,    50, '2024-02-01', NULL),
-- left on mar 31 -> counts in feb, not in mar
(3, 'Left mar 31',    1, 1,    50, '2023-06-01', '2024-03-31'),
-- left apr 1 -> still counts for mar
(4, 'Left apr 1',     1, 1,    50, '2023-06-01', '2024-04-01'),
-- feb 29 exists in 2024
(5, 'Hired feb 29',   1, 1,    50, '2024-02-29', '2024-02-29'),
-- hired and gone before 2024
(6, 'Before 2024',    1, 1,    50, '2020-01-01', '2023-12-31'),
-- hired in 2025, never counts
(7, 'After 2024',     1, 1,    50, '2025-01-01', NULL),
-- left on dec 31 2024 -> counts through nov
(8, 'Left dec 31',    1, 1,    50, '2022-01-01', '2024-12-31');
