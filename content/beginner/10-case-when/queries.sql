-- CASE WHEN
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT product_name, price,
  CASE
    WHEN price >= 3000 THEN 'expensive'
    WHEN price >= 500  THEN 'mid'
    ELSE 'cheap'
  END AS price_band
FROM products;

SELECT customer_id,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
  SUM(CASE WHEN status <> 'delivered' THEN 1 ELSE 0 END) AS not_delivered
FROM orders
GROUP BY customer_id
ORDER BY customer_id;


-- practice ---------------------------------------------------------

-- 1. label employees as 'senior' if salary >= 100000, otherwise 'junior'
-- 2. show each customer's first_name and 'has phone' / 'no phone'
-- 3. count how many products fall in each price band (cheap/mid/expensive from above)
-- 4. one row, three columns: number of delivered, pending and cancelled orders
-- 5. per department: total employees, and how many were hired in 2022 or later


-- answers ----------------------------------------------------------

-- 1
SELECT name, salary,
  CASE WHEN salary >= 100000 THEN 'senior' ELSE 'junior' END AS level
FROM employees;

-- 2
SELECT first_name,
  CASE WHEN phone IS NULL THEN 'no phone' ELSE 'has phone' END AS phone_status
FROM customers;

-- 3
SELECT
  CASE
    WHEN price >= 3000 THEN 'expensive'
    WHEN price >= 500  THEN 'mid'
    ELSE 'cheap'
  END AS price_band,
  COUNT(*)
FROM products
GROUP BY 1;
-- GROUP BY 1 means group by the first column in SELECT, saves repeating the whole CASE

-- 4
SELECT
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
  SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM orders;

-- 5
SELECT department,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE hire_date >= '2022-01-01') AS hired_2022_plus
FROM employees
GROUP BY department;
