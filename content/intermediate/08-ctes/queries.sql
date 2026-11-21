-- CTEs
-- run sample-data.sql first

-- examples ---------------------------------------------------------

WITH order_counts AS (
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
)
SELECT AVG(order_count) FROM order_counts;

WITH customer_spend AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE status <> 'cancelled'
  GROUP BY customer_id
),
avg_spend AS (
  SELECT AVG(total) AS avg_total FROM customer_spend
)
SELECT c.first_name, cs.total
FROM customer_spend cs
JOIN customers c ON c.customer_id = cs.customer_id
CROSS JOIN avg_spend a
WHERE cs.total > a.avg_total;


-- practice ---------------------------------------------------------

-- 1. with a CTE, get department average salaries, then list employees earning above their dept average
-- 2. with a CTE, monthly revenue, then show only months above the average month
-- 3. two CTEs: one for units sold per product, one for the max units.
--    then show the best selling product(s)
-- 4. rewrite this using a CTE:
--    SELECT * FROM (SELECT category, MAX(price) mp FROM products GROUP BY category) t WHERE mp > 1000;


-- answers ----------------------------------------------------------

-- 1
WITH dept_avg AS (
  SELECT department, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department
)
SELECT e.name, e.department, e.salary, ROUND(d.avg_salary) AS dept_avg
FROM employees e
JOIN dept_avg d ON e.department = d.department
WHERE e.salary > d.avg_salary;

-- 2
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT * FROM monthly
WHERE revenue > (SELECT AVG(revenue) FROM monthly)
ORDER BY month;

-- 3
WITH units AS (
  SELECT product_id, SUM(quantity) AS sold
  FROM order_items
  GROUP BY product_id
),
top AS (
  SELECT MAX(sold) AS max_sold FROM units
)
SELECT p.product_name, u.sold
FROM units u
JOIN top t ON u.sold = t.max_sold
JOIN products p ON p.product_id = u.product_id;
-- Gel Pen Pack, 3 units

-- 4
WITH category_max AS (
  SELECT category, MAX(price) AS max_price FROM products GROUP BY category
)
SELECT * FROM category_max WHERE max_price > 1000;
