-- name: repeat rates that aren't round numbers
-- for: 04-repeat-buyers-by-country

INSERT INTO customers VALUES
(1, 'A', 'FR', '2026-01-01'),
(2, 'B', 'FR', '2026-01-01'),
(3, 'C', 'FR', '2026-01-01'),
(4, 'D', 'DE', '2026-01-01'),
(5, 'E', 'DE', '2026-01-01'),
(6, 'F', 'DE', '2026-01-01'),
(7, 'G', 'DE', '2026-01-01'),
(8, 'H', 'IT', '2026-01-01');

-- FR: 3 buyers, 1 repeat -> 33.3
-- DE: 3 buyers (G only has a cancelled one), 2 repeat -> 66.7
-- IT: H has 1 completed + 1 cancelled, not a repeat -> 0.0
INSERT INTO orders VALUES
(1, 1, '2026-02-01 10:00:00', 'completed'),
(2, 1, '2026-02-05 10:00:00', 'completed'),
(3, 1, '2026-02-09 10:00:00', 'completed'),
(4, 2, '2026-02-01 10:00:00', 'completed'),
(5, 3, '2026-02-01 10:00:00', 'completed'),
(6, 4, '2026-02-01 10:00:00', 'completed'),
(7, 4, '2026-02-02 10:00:00', 'completed'),
(8, 5, '2026-02-01 10:00:00', 'completed'),
(9, 5, '2026-02-01 10:00:00', 'completed'),
(10, 6, '2026-02-01 10:00:00', 'completed'),
(11, 7, '2026-02-01 10:00:00', 'cancelled'),
(12, 8, '2026-02-01 10:00:00', 'completed'),
(13, 8, '2026-02-03 10:00:00', 'cancelled'),
(14, NULL, '2026-02-03 10:00:00', 'completed');
