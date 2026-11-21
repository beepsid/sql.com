-- window functions
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT name, department, salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;

SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK()       OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;

WITH ranked AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn = 1;

SELECT order_id, order_date, amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

SELECT order_id, order_date, amount,
  LAG(amount) OVER (ORDER BY order_date) AS prev_amount
FROM orders;


-- practice ---------------------------------------------------------

-- 1. each order with its amount and the customer's total spend next to it
-- 2. rank products by price within each category (most expensive = 1)
-- 3. the 2 cheapest products in each category
-- 4. for each customer's orders, the number of days since their previous order
-- 5. monthly revenue, and the % change from the previous month
-- 6. each employee's salary and the difference from the highest salary in their department
-- 7. each customer's first ever order (full row), using ROW_NUMBER


-- answers ----------------------------------------------------------

-- 1
SELECT order_id, customer_id, amount,
  SUM(amount) OVER (PARTITION BY customer_id) AS customer_total
FROM orders;

-- 2
SELECT product_name, category, price,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products;

-- 3
WITH r AS (
  SELECT product_name, category, price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price) AS rn
  FROM products
)
SELECT * FROM r WHERE rn <= 2;

-- 4
SELECT customer_id, order_id, order_date,
  order_date - LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS days_since_prev
FROM orders
ORDER BY customer_id, order_date;

-- 5
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date)::date AS month, SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month, revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
        / LAG(revenue) OVER (ORDER BY month), 1) AS pct_change
FROM monthly
ORDER BY month;

-- 6
SELECT name, department, salary,
  MAX(salary) OVER (PARTITION BY department) - salary AS below_top
FROM employees;

-- 7
WITH r AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders
)
SELECT * FROM r WHERE rn = 1;
