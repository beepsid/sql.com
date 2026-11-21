-- name: orders entered out of order and same-day orders
-- for: 06-days-between-orders

INSERT INTO customers VALUES
(1, 'Out of order', 'IN', '2026-01-01'),
(2, 'Same day',     'IN', '2026-01-01'),
(3, 'Thirds',       'IN', '2026-01-01'),
(4, 'One completed','IN', '2026-01-01');

INSERT INTO orders VALUES
-- order_id order doesn't match time order. by time: jan 1, jan 2, jan 4, jan 7 -> gaps 1, 2, 3 -> 2.0
(10, 1, '2026-01-07 09:00:00', 'completed'),
(11, 1, '2026-01-01 09:00:00', 'completed'),
(12, 1, '2026-01-04 09:00:00', 'completed'),
(13, 1, '2026-01-02 09:00:00', 'completed'),
-- two orders the same day, one the next -> gaps 0, 1 -> 0.5
(20, 2, '2026-02-01 08:00:00', 'completed'),
(21, 2, '2026-02-01 22:00:00', 'completed'),
(22, 2, '2026-02-02 01:00:00', 'completed'),
-- gaps 1, 1, 2 -> 1.333 -> 1.3, plus a cancelled one in the middle that must be ignored
(30, 3, '2026-03-01 10:00:00', 'completed'),
(31, 3, '2026-03-02 10:00:00', 'completed'),
(32, 3, '2026-03-02 18:00:00', 'cancelled'),
(33, 3, '2026-03-03 10:00:00', 'completed'),
(34, 3, '2026-03-05 10:00:00', 'completed'),
-- only one completed order, must not appear
(40, 4, '2026-03-01 10:00:00', 'completed'),
(41, 4, '2026-03-09 10:00:00', 'cancelled');
