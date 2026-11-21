-- LIMIT & OFFSET
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT product_name, price FROM products ORDER BY price DESC LIMIT 3;

SELECT product_name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 3;

-- keyset pagination
SELECT * FROM orders ORDER BY order_id LIMIT 3;
SELECT * FROM orders WHERE order_id > 103 ORDER BY order_id LIMIT 3;

-- second highest salary
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;


-- practice ---------------------------------------------------------

-- 1. the 3 most recent orders
-- 2. the cheapest product
-- 3. the 3 newest customers by signup_date
-- 4. page 2 of products sorted by name, with 3 products per page
-- 5. the third highest salary in the company


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM orders ORDER BY order_date DESC LIMIT 3;

-- 2
SELECT * FROM products ORDER BY price LIMIT 1;

-- 3
SELECT * FROM customers ORDER BY signup_date DESC LIMIT 3;

-- 4
SELECT * FROM products ORDER BY product_name LIMIT 3 OFFSET 3;

-- 5
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2;
-- 120000
