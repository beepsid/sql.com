-- advanced aggregation
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT customer_id,
  COUNT(*) AS all_orders,
  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered
FROM orders
GROUP BY customer_id;

SELECT p.category, p.product_name, SUM(oi.quantity) AS units
FROM order_items oi JOIN products p ON oi.product_id = p.product_id
GROUP BY ROLLUP (p.category, p.product_name)
ORDER BY p.category, p.product_name;

SELECT AVG(salary) AS mean,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median
FROM employees;

SELECT customer_id, SUM(amount) AS total,
  ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 1) AS pct_of_revenue
FROM orders
GROUP BY customer_id
ORDER BY total DESC;


-- practice ---------------------------------------------------------

-- 1. one row per department with columns: headcount, hired before 2021, hired 2021 or later
-- 2. revenue by category and status, with category subtotals and a grand total (ROLLUP)
-- 3. median order amount, and the 90th percentile order amount
-- 4. each customer's name and a list of the products they've bought (comma separated, no repeats)
-- 5. each department's share of the total salary bill, as a %
-- 6. customer count per city with a final 'ALL' row, and show the NULL city as 'unknown'


-- answers ----------------------------------------------------------

-- 1
SELECT department,
  COUNT(*) AS headcount,
  COUNT(*) FILTER (WHERE hire_date <  '2021-01-01') AS before_2021,
  COUNT(*) FILTER (WHERE hire_date >= '2021-01-01') AS from_2021
FROM employees
GROUP BY department;

-- 2
SELECT p.category, o.status, SUM(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
GROUP BY ROLLUP (p.category, o.status)
ORDER BY p.category, o.status;

-- 3
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY amount) AS p90
FROM orders;

-- 4
SELECT c.first_name, STRING_AGG(DISTINCT p.product_name, ', ') AS products
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY c.customer_id, c.first_name;

-- 5
SELECT department, SUM(salary) AS total,
  ROUND(100.0 * SUM(salary) / SUM(SUM(salary)) OVER (), 1) AS pct
FROM employees
GROUP BY department;

-- 6
SELECT
  CASE WHEN GROUPING(city) = 1 THEN 'ALL' ELSE COALESCE(city, 'unknown') END AS city,
  COUNT(*)
FROM customers
GROUP BY ROLLUP (city);
