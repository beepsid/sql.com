-- UNION / INTERSECT / EXCEPT
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT city FROM customers
UNION
SELECT city FROM addresses;

SELECT city FROM customers
UNION ALL
SELECT city FROM addresses;

SELECT first_name AS name, 'customer' AS type FROM customers
UNION ALL
SELECT name, 'employee' FROM employees
ORDER BY name;

SELECT customer_id FROM orders INTERSECT SELECT customer_id FROM addresses;

SELECT customer_id FROM customers EXCEPT SELECT customer_id FROM orders;

SELECT status, COUNT(*) AS orders FROM orders GROUP BY status
UNION ALL
SELECT 'TOTAL', COUNT(*) FROM orders;


-- practice ---------------------------------------------------------

-- 1. one list of all cities that appear anywhere (customers or addresses), no repeats, no NULL
-- 2. product_ids that exist in products but were never ordered
-- 3. customers who have an address in a city different from their own customer city
--    (hint: think about what EXCEPT gives you on (customer_id, city) pairs)
-- 4. a report: revenue per category, and a final row 'ALL' with total revenue
--    (use order_items quantity * price)


-- answers ----------------------------------------------------------

-- 1
SELECT city FROM customers WHERE city IS NOT NULL
UNION
SELECT city FROM addresses
ORDER BY city;

-- 2
SELECT product_id FROM products
EXCEPT
SELECT product_id FROM order_items;
-- empty, everything sold

-- 3
SELECT customer_id, city FROM addresses
EXCEPT
SELECT customer_id, city FROM customers;
-- Aman in Gurgaon, Neha in Pune

-- 4
SELECT p.category, SUM(oi.quantity * p.price) AS revenue
FROM order_items oi JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category
UNION ALL
SELECT 'ALL', SUM(oi.quantity * p.price)
FROM order_items oi JOIN products p ON oi.product_id = p.product_id;
