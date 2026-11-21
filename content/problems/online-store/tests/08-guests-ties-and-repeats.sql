-- name: guest orders, same-second orders, tied totals and repeated lines
-- for: 11-never-completed-an-order, 13-average-order-value-by-country, 15-biggest-order-per-customer, 16-category-revenue-share, 18-bought-together, 19-thousand-club

INSERT INTO customers VALUES
(41, 'Never completed', 'IN', '2026-01-01'),
(42, 'Big spender',     'US', '2026-01-01'),
(43, 'Tied orders',     'US', '2026-01-01'),
(44, 'No orders',       'GB', '2026-01-01');

INSERT INTO products VALUES
(61, 'Laptop A',  'Laptops',     600.00),
(62, 'Cable',     'Accessories', 10.00),
(63, 'Mouse',     'Accessories', 20.00),
(64, 'Old phone', 'Phones',      100.00);

INSERT INTO orders VALUES
-- a completed guest order: breaks NOT IN, still counts as revenue
(801, NULL, '2026-02-01 10:00:00', 'completed'),
(802, 41,   '2026-02-02 10:00:00', 'cancelled'),
-- two orders at the exact same second, 600 each: the second one crosses 1000
(803, 42,   '2026-02-03 10:00:00', 'completed'),
(804, 42,   '2026-02-03 10:00:00', 'completed'),
(805, 43,   '2026-02-05 10:00:00', 'completed'),
(806, 43,   '2026-02-06 10:00:00', 'completed'),
(807, 42,   '2026-02-10 10:00:00', 'completed'),
(808, 41,   '2026-02-11 10:00:00', 'refunded');

INSERT INTO order_items VALUES
(801, 61, 1, 600.00), (801, 62, 1, 10.00),
-- the only phone sale was cancelled, so Phones has no revenue
(802, 64, 1, 100.00),
(803, 61, 1, 600.00),
(804, 61, 1, 600.00),
-- cable on two lines of the same order
(805, 62, 1, 10.00), (805, 63, 1, 20.00), (805, 62, 2, 10.00),
(806, 63, 1, 50.00),
(807, 62, 1, 10.00), (807, 63, 1, 20.00),
(808, 63, 1, 20.00);
