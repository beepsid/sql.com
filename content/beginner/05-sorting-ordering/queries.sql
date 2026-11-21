-- ORDER BY
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT product_name, price FROM products ORDER BY price;

SELECT product_name, price FROM products ORDER BY price DESC;

SELECT name, department, salary FROM employees ORDER BY department, salary DESC;

SELECT product_name, price * 1.18 AS final_price FROM products ORDER BY final_price DESC;

SELECT first_name, city FROM customers ORDER BY city NULLS FIRST;

SELECT order_id, status
FROM orders
ORDER BY CASE status
  WHEN 'pending'   THEN 1
  WHEN 'shipped'   THEN 2
  WHEN 'delivered' THEN 3
  ELSE 4
END;


-- practice ---------------------------------------------------------

-- 1. customers sorted by first name A to Z
-- 2. orders newest first
-- 3. employees by salary high to low, and if two earn the same, by name A to Z
-- 4. products sorted by category, then cheapest first inside each category
-- 5. customers sorted by city, with the missing city at the top


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM customers ORDER BY first_name;

-- 2
SELECT * FROM orders ORDER BY order_date DESC;

-- 3
SELECT name, salary FROM employees ORDER BY salary DESC, name;

-- 4
SELECT product_name, category, price FROM products ORDER BY category, price;

-- 5
SELECT first_name, city FROM customers ORDER BY city NULLS FIRST;
