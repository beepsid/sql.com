-- aggregation basics
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT COUNT(*) AS total_orders, SUM(amount) AS revenue, AVG(amount) AS avg_order,
       MIN(amount) AS smallest, MAX(amount) AS biggest
FROM orders;

SELECT COUNT(*), COUNT(city), COUNT(DISTINCT city) FROM customers;

SELECT SUM(amount) AS delivered_revenue FROM orders WHERE status = 'delivered';

SELECT category, COUNT(*) AS products, ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category;


-- practice ---------------------------------------------------------

-- 1. how many products are there?
-- 2. what's the highest salary in the company?
-- 3. total amount of all orders that weren't cancelled
-- 4. number of customers in each city (include the NULL city group too, see what happens)
-- 5. average salary per department, rounded to 0 decimals, highest first
-- 6. number of orders per status
-- 7. for each customer_id: how many orders and how much they spent in total


-- answers ----------------------------------------------------------

-- 1
SELECT COUNT(*) FROM products;

-- 2
SELECT MAX(salary) FROM employees;

-- 3
SELECT SUM(amount) FROM orders WHERE status <> 'cancelled';

-- 4
SELECT city, COUNT(*) AS customers FROM customers GROUP BY city;
-- NULL shows up as its own group, GROUP BY treats all NULLs as one pile

-- 5
SELECT department, ROUND(AVG(salary)) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;

-- 6
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- 7
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY total_spent DESC;
