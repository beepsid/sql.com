-- name: cancelled and refunded orders

INSERT INTO customers VALUES
(1, 'Only cancelled', 'IN', '2026-01-01'),
(2, 'One good one bad', 'IN', '2026-01-01'),
(3, 'Refunded accessory', 'US', '2026-01-01'),
(4, 'Two good', 'US', '2026-01-01');

INSERT INTO products VALUES
(1, 'Laptop X',   'Laptops',     1000.00),
(2, 'Sleeve',     'Accessories', 20.00),
(3, 'Only refunded', 'Audio',    50.00),
(4, 'Speaker',    'Audio',       60.00);

INSERT INTO orders VALUES
(1, 1, '2026-01-02 10:00:00', 'cancelled'),
(2, 1, '2026-01-03 10:00:00', 'cancelled'),
(3, 2, '2026-01-04 10:00:00', 'cancelled'),
(4, 2, '2026-02-20 10:00:00', 'completed'),
(5, 3, '2026-01-05 10:00:00', 'completed'),
(6, 3, '2026-01-06 10:00:00', 'refunded'),
(7, 4, '2026-03-01 10:00:00', 'completed'),
(8, 4, '2026-03-04 10:00:00', 'completed'),
-- a whole month with only cancelled orders
(9, 4, '2026-04-10 10:00:00', 'cancelled');

INSERT INTO order_items VALUES
(1, 1, 1, 1000.00),
(2, 4, 1, 60.00),
(3, 1, 1, 1000.00),
(4, 4, 2, 60.00),
(5, 1, 1, 950.00),
(6, 2, 1, 20.00),
(6, 3, 1, 50.00),
(7, 4, 1, 60.00),
(8, 1, 1, 1000.00),
(9, 4, 5, 60.00);
