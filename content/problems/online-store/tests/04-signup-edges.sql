-- name: orders right around the 7 day mark
-- for: 03-first-purchase-within-7-days

INSERT INTO customers VALUES
(1, 'Same day',          'IN', '2026-03-01'),
(2, 'Day 7 late night',  'IN', '2026-03-01'),
(3, 'Day 8 just after',  'IN', '2026-03-01'),
(4, 'Cancelled early',   'IN', '2026-03-01'),
(5, 'Second order early','IN', '2026-03-01'),
(6, 'Never ordered',     'IN', '2026-03-01'),
(7, 'Legacy import',     'IN', '2026-03-01');

INSERT INTO orders VALUES
(1, 1, '2026-03-01 23:00:00', 'completed'),
(2, 2, '2026-03-08 23:30:00', 'completed'),
(3, 3, '2026-03-09 00:10:00', 'completed'),
-- cancelled on day 2, first completed is day 9
(4, 4, '2026-03-03 10:00:00', 'cancelled'),
(5, 4, '2026-03-10 10:00:00', 'completed'),
-- first completed on day 20, a later one would be "within 7" only if you ignore order
(6, 5, '2026-03-21 10:00:00', 'completed'),
(7, 5, '2026-03-02 10:00:00', 'refunded'),
-- imported from an old system: first completed order is 2 days before signup, so it's
-- not within 0-7 days even though they also ordered on day 3
(8, 7, '2026-02-27 10:00:00', 'completed'),
(9, 7, '2026-03-04 10:00:00', 'completed');

INSERT INTO order_items VALUES
(1, 1, 1, 10.00), (2, 1, 1, 10.00), (3, 1, 1, 10.00), (4, 1, 1, 10.00),
(5, 1, 1, 10.00), (6, 1, 1, 10.00), (7, 1, 1, 10.00), (8, 1, 1, 10.00), (9, 1, 1, 10.00);
INSERT INTO products VALUES (1, 'Thing', 'Misc', 10.00);
