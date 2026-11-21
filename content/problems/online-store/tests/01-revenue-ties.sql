-- name: products tied on revenue
-- for: 01-top-products-per-category

INSERT INTO customers VALUES (1, 'T1', 'IN', '2026-01-01');

INSERT INTO products VALUES
(1, 'Kite',   'Toys',  10.00),
(2, 'Yo-yo',  'Toys',  10.00),
(3, 'Puzzle', 'Toys',  10.00),
(4, 'Blocks', 'Toys',  10.00),
(5, 'Ball',   'Toys',  10.00),
(6, 'Novel A', 'Books', 10.00),
(7, 'Novel B', 'Books', 10.00),
(8, 'Novel C', 'Books', 10.00),
(9, 'Novel D', 'Books', 10.00),
(10, 'Never sold', 'Books', 10.00);

INSERT INTO orders VALUES
(1, 1, '2026-02-01 10:00:00', 'completed'),
(2, 1, '2026-02-02 10:00:00', 'completed');

-- toys: 500, 300, 300, 200, 100 -> ranks 1, 2, 2, 4, 5
-- books: four products all on 100 -> all rank 1
INSERT INTO order_items VALUES
(1, 1, 5, 100.00),
(1, 2, 3, 100.00),
(1, 3, 1, 300.00),
(2, 4, 2, 100.00),
(2, 5, 1, 100.00),
(2, 6, 1, 100.00),
(2, 7, 2, 50.00),
(2, 8, 4, 25.00),
(2, 9, 1, 100.00);
