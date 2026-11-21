-- WHERE & filtering
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT * FROM products WHERE price > 1000;

SELECT * FROM customers WHERE city = 'Delhi';

SELECT * FROM orders WHERE status <> 'cancelled';

SELECT * FROM products WHERE price BETWEEN 100 AND 500;

SELECT * FROM customers WHERE city IN ('Delhi', 'Mumbai');

SELECT * FROM customers WHERE first_name LIKE 'A%';

SELECT * FROM products WHERE product_name ILIKE '%mouse%';

SELECT * FROM customers WHERE phone IS NULL;


-- practice ---------------------------------------------------------

-- 1. all products in the Electronics category
-- 2. all orders with amount less than 500
-- 3. customers who signed up in March 2024
-- 4. products whose name ends with "Pack"
-- 5. employees not in the Sales department
-- 6. orders that are either pending or shipped (use IN)
-- 7. customers whose city is missing
-- 8. products with a price after 18% gst above 1000 (no aliases in WHERE, remember)


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM products WHERE category = 'Electronics';

-- 2
SELECT * FROM orders WHERE amount < 500;

-- 3
SELECT * FROM customers WHERE signup_date BETWEEN '2024-03-01' AND '2024-03-31';

-- 4
SELECT * FROM products WHERE product_name LIKE '%Pack';

-- 5
SELECT * FROM employees WHERE department <> 'Sales';

-- 6
SELECT * FROM orders WHERE status IN ('pending', 'shipped');

-- 7
SELECT * FROM customers WHERE city IS NULL;

-- 8
SELECT product_name, price * 1.18 AS with_gst
FROM products
WHERE price * 1.18 > 1000;
