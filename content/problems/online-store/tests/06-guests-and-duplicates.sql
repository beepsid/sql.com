-- name: guest orders and customers with several laptops
-- for: 05-laptops-without-accessories

INSERT INTO customers VALUES
(1, 'Three laptops', 'IN', '2026-01-01'),
(2, 'Laptop then sleeve', 'IN', '2026-01-01'),
(3, 'Cancelled laptop', 'IN', '2026-01-01'),
(4, 'Refunded sleeve', 'IN', '2026-01-01');

INSERT INTO products VALUES
(1, 'Laptop X', 'Laptops',     1000.00),
(2, 'Laptop Y', 'Laptops',     1200.00),
(3, 'Sleeve',   'Accessories', 20.00);

INSERT INTO orders VALUES
(1, 1, '2026-01-02 10:00:00', 'completed'),
(2, 1, '2026-01-03 10:00:00', 'completed'),
(3, 2, '2026-01-04 10:00:00', 'completed'),
(4, 2, '2026-05-01 10:00:00', 'completed'),
(5, 3, '2026-01-05 10:00:00', 'cancelled'),
(6, 4, '2026-01-06 10:00:00', 'completed'),
(7, 4, '2026-01-07 10:00:00', 'refunded'),
-- guest orders: an accessory bought with no customer.
-- a NOT IN (SELECT customer_id ...) would see this NULL and return nothing.
(8, NULL, '2026-01-08 10:00:00', 'completed'),
(9, NULL, '2026-01-09 10:00:00', 'completed');

INSERT INTO order_items VALUES
(1, 1, 2, 1000.00),
(2, 2, 1, 1200.00),
(3, 1, 1, 1000.00),
(4, 3, 1, 20.00),
(5, 2, 1, 1200.00),
(6, 1, 1, 1000.00),
(7, 3, 1, 20.00),
(8, 3, 1, 20.00),
(9, 1, 1, 1000.00);
