-- name: deep chains and more than one top boss
-- for: 06-org-depth

INSERT INTO departments VALUES (1, 'Ops');

INSERT INTO employees VALUES
-- a chain 6 deep: 1 > 2 > 3 > 4 > 5 > 6
(1, 'A', 1, NULL, 10, '2020-01-01', NULL),
(2, 'B', 1, 1,    10, '2020-01-01', NULL),
(3, 'C', 1, 2,    10, '2020-01-01', '2023-01-01'),
(4, 'D', 1, 3,    10, '2020-01-01', NULL),
(5, 'E', 1, 4,    10, '2020-01-01', NULL),
(6, 'F', 1, 5,    10, '2020-01-01', NULL),
-- B also has a second branch
(7, 'G', 1, 2,    10, '2020-01-01', NULL),
(8, 'H', 1, 7,    10, '2020-01-01', NULL),
-- a second top boss with a small team, ids out of order
(20, 'Z', 1, NULL, 10, '2020-01-01', NULL),
(15, 'Y', 1, 20,   10, '2020-01-01', NULL),
(12, 'X', 1, 15,   10, '2020-01-01', NULL),
-- someone alone at the top
(30, 'Solo', 1, NULL, 10, '2020-01-01', NULL);
