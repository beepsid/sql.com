-- DISTINCT
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT DISTINCT city FROM customers;

-- unique pairs, not unique customers
SELECT DISTINCT customer_id, status FROM orders ORDER BY customer_id;

SELECT COUNT(DISTINCT customer_id) FROM orders;

-- latest order per customer (postgres)
SELECT DISTINCT ON (customer_id) customer_id, order_id, order_date
FROM orders
ORDER BY customer_id, order_date DESC;


-- practice ---------------------------------------------------------

-- 1. list every product category, no repeats
-- 2. list every order status, no repeats, sorted A to Z
-- 3. how many different departments are there?
-- 4. how many different products have ever been ordered? (order_items table)
-- 5. the most expensive product in each category, one row per category (use DISTINCT ON)


-- answers ----------------------------------------------------------

-- 1
SELECT DISTINCT category FROM products;

-- 2
SELECT DISTINCT status FROM orders ORDER BY status;

-- 3
SELECT COUNT(DISTINCT department) FROM employees;

-- 4
SELECT COUNT(DISTINCT product_id) FROM order_items;

-- 5
SELECT DISTINCT ON (category) category, product_name, price
FROM products
ORDER BY category, price DESC;
