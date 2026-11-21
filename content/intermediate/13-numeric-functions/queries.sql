-- numeric functions
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT 10 / 3, 10 / 3.0, 10 % 3;

SELECT ROUND(1234.5678, 2), ROUND(1234.5678, -2), CEIL(4.1), FLOOR(4.9), TRUNC(4.987, 1);

SELECT GREATEST(10, 50, 30), LEAST(10, 50, 30);

SELECT order_id, amount, LEAST(amount * 0.2, 500) AS discount FROM orders;

SELECT status, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM orders), 1) AS pct
FROM orders GROUP BY status;

SELECT 10 / NULLIF(0, 0);


-- practice ---------------------------------------------------------

-- 1. each product's price rounded to the nearest 100
-- 2. what % of customers have a phone number? one decimal place
-- 3. each employee's salary as a % of their department's total salary
-- 4. how many pages to show all orders if each page shows 3 orders?
-- 5. orders with an even order_id
-- 6. each product's price, and how far it is from the average price (always positive)


-- answers ----------------------------------------------------------

-- 1
SELECT product_name, price, ROUND(price, -2) AS rounded FROM products;

-- 2
SELECT ROUND(100.0 * COUNT(phone) / COUNT(*), 1) AS pct_with_phone FROM customers;
-- 62.5

-- 3
SELECT e.name, e.department,
  ROUND(100.0 * e.salary / (SELECT SUM(salary) FROM employees e2 WHERE e2.department = e.department), 1) AS pct
FROM employees e;

-- 4
SELECT CEIL(COUNT(*) / 3.0) AS pages FROM orders;
-- 4

-- 5
SELECT * FROM orders WHERE order_id % 2 = 0;

-- 6
SELECT product_name, price,
  ROUND(ABS(price - (SELECT AVG(price) FROM products)), 2) AS distance_from_avg
FROM products;
