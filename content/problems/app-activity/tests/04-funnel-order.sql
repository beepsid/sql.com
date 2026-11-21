-- name: funnel steps done out of order
-- for: 05-funnel-by-platform

INSERT INTO users VALUES
(1, '2026-03-01', 'IN', 'ios'),
(2, '2026-03-01', 'IN', 'ios'),
(3, '2026-03-01', 'IN', 'ios'),
(4, '2026-03-01', 'IN', 'android'),
(5, '2026-03-01', 'IN', 'android'),
(6, '2026-03-01', 'IN', 'web'),
(7, '2026-03-01', 'IN', 'web');

INSERT INTO events VALUES
-- clean funnel, with repeat views and carts (counts once)
(1,  1, '2026-03-01 10:00:00', 'view_item'),
(2,  1, '2026-03-01 10:01:00', 'view_item'),
(3,  1, '2026-03-01 10:02:00', 'add_to_cart'),
(4,  1, '2026-03-01 10:03:00', 'add_to_cart'),
(5,  1, '2026-03-01 10:04:00', 'purchase'),
-- cart before the first view, then never again -> viewed only
(6,  2, '2026-03-01 09:00:00', 'add_to_cart'),
(7,  2, '2026-03-01 10:00:00', 'view_item'),
-- view, cart, but the purchase happened before the cart -> viewed + carted
(8,  3, '2026-03-01 08:00:00', 'view_item'),
(9,  3, '2026-03-01 08:30:00', 'purchase'),
(10, 3, '2026-03-01 09:00:00', 'add_to_cart'),
-- view and cart at the exact same time -> not strictly after, viewed only
(11, 4, '2026-03-01 10:00:00', 'view_item'),
(12, 4, '2026-03-01 10:00:00', 'add_to_cart'),
-- purchase with no cart at all -> viewed only
(13, 5, '2026-03-01 10:00:00', 'view_item'),
(14, 5, '2026-03-01 11:00:00', 'purchase'),
-- web: one user never viewed, they only opened the app
(15, 6, '2026-03-01 10:00:00', 'app_open'),
(16, 6, '2026-03-01 10:01:00', 'add_to_cart'),
(17, 6, '2026-03-01 10:02:00', 'purchase'),
-- web: a second cart after the first qualifying one, purchase in between them still counts
(18, 7, '2026-03-01 10:00:00', 'view_item'),
(19, 7, '2026-03-01 10:05:00', 'add_to_cart'),
(20, 7, '2026-03-01 10:06:00', 'purchase'),
(21, 7, '2026-03-01 10:07:00', 'add_to_cart');
