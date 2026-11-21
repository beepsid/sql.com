-- date & time functions (postgres)
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT CURRENT_DATE, NOW();

SELECT order_date, EXTRACT(YEAR FROM order_date) AS yr, EXTRACT(MONTH FROM order_date) AS mon
FROM orders;

SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount)
FROM orders GROUP BY 1 ORDER BY 1;

SELECT order_date, order_date + INTERVAL '1 month' AS next_month FROM orders;

SELECT first_name, CURRENT_DATE - signup_date AS days_since_signup FROM customers;

SELECT TO_CHAR(order_date, 'DD Mon YYYY') FROM orders;


-- practice ---------------------------------------------------------

-- 1. orders placed in April 2024 (use the >= / < pattern)
-- 2. number of customers who signed up per month
-- 3. how many days after signing up did each customer place their FIRST order?
-- 4. employees with how many full years they've worked here
-- 5. orders placed on a weekend
-- 6. revenue per quarter, shown like '2024-Q2'


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM orders WHERE order_date >= '2024-04-01' AND order_date < '2024-05-01';

-- 2
SELECT DATE_TRUNC('month', signup_date)::date AS month, COUNT(*)
FROM customers GROUP BY 1 ORDER BY 1;

-- 3
SELECT c.first_name, MIN(o.order_date) - c.signup_date AS days_to_first_order
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name, c.signup_date;

-- 4
SELECT name, hire_date, EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) AS years
FROM employees;

-- 5
SELECT order_id, order_date, TO_CHAR(order_date, 'Day') AS day
FROM orders
WHERE EXTRACT(DOW FROM order_date) IN (0, 6);

-- 6
SELECT TO_CHAR(order_date, 'YYYY') || '-Q' || EXTRACT(QUARTER FROM order_date) AS quarter,
       SUM(amount)
FROM orders
GROUP BY 1
ORDER BY 1;
