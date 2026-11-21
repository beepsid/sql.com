-- name: managers who left, equal salaries, no manager
-- for: 02-earns-more-than-manager, 10-team-size, 17-skip-level-manager

INSERT INTO departments VALUES (1, 'Ops');

INSERT INTO employees VALUES
-- top of the org, no manager
(1, 'Boss',      1, NULL, 90,  '2019-01-01', NULL),
-- earns more than the boss
(2, 'Star',      1, 1,    120, '2020-01-01', NULL),
-- same salary as the boss, not more
(3, 'Equal',     1, 1,    90,  '2020-01-01', NULL),
-- earns more than their manager, but already left
(4, 'Gone',      1, 1,    150, '2020-01-01', '2024-01-01'),
-- their manager (Gone) left, still compare against them
(5, 'Under gone', 1, 4,   160, '2021-01-01', NULL),
(6, 'Under gone 2', 1, 4, 100, '2021-01-01', NULL);
