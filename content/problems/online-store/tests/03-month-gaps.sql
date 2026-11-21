-- name: months with no sales in between
-- for: 02-monthly-revenue-growth

INSERT INTO customers VALUES (1, 'G1', 'IN', '2025-10-01');
INSERT INTO products VALUES (1, 'Thing', 'Misc', 100.00);

-- nov, dec, jan, nothing in feb, then mar and apr.
-- dec -> jan crosses a year. mar's previous calendar month (feb) is empty, so mar is NULL.
INSERT INTO orders VALUES
(1, 1, '2025-11-15 10:00:00', 'completed'),
(2, 1, '2025-12-01 00:00:00', 'completed'),
(3, 1, '2025-12-31 23:59:59', 'completed'),
(4, 1, '2026-01-31 12:00:00', 'cancelled'),
(8, 1, '2026-01-15 12:00:00', 'completed'),
(5, 1, '2026-03-01 09:00:00', 'completed'),
(6, 1, '2026-04-30 20:00:00', 'completed'),
(7, NULL, '2026-04-02 10:00:00', 'completed');

INSERT INTO order_items VALUES
(1, 1, 3, 100.00),
(2, 1, 2, 100.00),
(3, 1, 2, 100.00),
(4, 1, 9, 100.00),
(5, 1, 1, 100.00),
(6, 1, 1, 100.00),
(7, 1, 2, 100.00),
(8, 1, 5, 100.00);
