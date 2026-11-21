-- name: exactly 45 minutes, zero tips, unrated orders and back-to-back deliveries

INSERT INTO restaurants VALUES
(50, 'R50', 'Pune', 'Indian'),
(51, 'R51', 'Pune', 'Chinese'),
(52, 'Never ordered from', 'Pune', 'Italian');

INSERT INTO couriers VALUES
(70, 'C70', 'Pune'),
(71, 'Never tipped', 'Pune'),
(72, 'Idle', 'Pune');

INSERT INTO orders VALUES
-- exactly 45 minutes is not late. a tip of 0 is not a tip.
(900, 1, 50, 70, '2026-03-01 10:00:00', '2026-03-01 10:45:00', 'delivered', 100.00, 0.00,  5),
-- starts the minute 900 ends: back to back, not overlapping
(901, 1, 50, 70, '2026-03-01 10:45:00', '2026-03-01 11:20:00', 'delivered', 100.00, 5.00,  4),
-- 46 minutes is late
(902, 2, 51, 71, '2026-03-01 10:00:00', '2026-03-01 10:46:00', 'delivered', 100.00, NULL,  NULL),
-- exactly 30 days after customer 2's first order
(903, 2, 51, 71, '2026-03-31 10:00:00', '2026-03-31 10:20:00', 'delivered', 100.00, NULL,  NULL),
-- customer 3's first order was cancelled, their first delivered one is 905
(904, 3, 50, 70, '2026-03-02 09:00:00', NULL,                  'cancelled', 100.00, NULL,  NULL),
(905, 3, 50, 70, '2026-03-20 09:00:00', '2026-03-20 09:30:00', 'delivered', 100.00, 10.00, 3),
-- 907 happens completely inside 906
(906, 4, 51, 71, '2026-03-05 12:00:00', '2026-03-05 12:50:00', 'delivered', 100.00, NULL,  2),
(907, 4, 51, 71, '2026-03-05 12:10:00', '2026-03-05 12:20:00', 'delivered', 100.00, NULL,  NULL),
(908, 5, 50, 70, '2026-03-10 12:00:00', '2026-03-10 12:30:00', 'delivered', 100.00, 0.00,  NULL);
