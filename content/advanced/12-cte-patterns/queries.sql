-- real world patterns
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- top 2 per department
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, department, salary FROM ranked WHERE rn <= 2;

-- gaps and islands
WITH activity AS (
  SELECT * FROM (VALUES
    (1, DATE '2024-03-01'), (1, '2024-03-02'), (1, '2024-03-03'),
    (1, '2024-03-07'), (1, '2024-03-08'), (2, '2024-03-05')
  ) AS t(user_id, day)
),
grp AS (
  SELECT user_id, day,
    day - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day))::int AS island
  FROM activity
)
SELECT user_id, MIN(day) AS streak_start, MAX(day) AS streak_end, COUNT(*) AS days
FROM grp GROUP BY user_id, island ORDER BY user_id, streak_start;

-- funnel
SELECT
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'page_view')   AS viewed,
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'add_to_cart') AS added,
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'purchase')    AS bought
FROM events;


-- practice ---------------------------------------------------------

-- 1. the best selling product (by units) in each category
-- 2. each customer's most recent order, with the product names in it
-- 3. the customer who spent the most in each city
-- 4. the longest gap in days between any two consecutive orders (store wide), and which orders
-- 5. what % of customers who ordered, ordered more than once?
-- 6. daily revenue for june 2024 including days with 0, plus a 7-day moving average


-- answers ----------------------------------------------------------

-- 1
WITH units AS (
  SELECT p.category, p.product_name, SUM(oi.quantity) AS sold
  FROM order_items oi JOIN products p ON oi.product_id = p.product_id
  GROUP BY p.category, p.product_name
),
ranked AS (
  SELECT *, DENSE_RANK() OVER (PARTITION BY category ORDER BY sold DESC) AS rnk FROM units
)
SELECT category, product_name, sold FROM ranked WHERE rnk = 1;

-- 2
WITH latest AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders
)
SELECT c.first_name, l.order_id, l.order_date, STRING_AGG(p.product_name, ', ') AS products
FROM latest l
JOIN customers c ON l.customer_id = c.customer_id
JOIN order_items oi ON l.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE l.rn = 1
GROUP BY c.first_name, l.order_id, l.order_date;

-- 3
WITH spend AS (
  SELECT c.city, c.first_name, SUM(o.amount) AS total
  FROM customers c JOIN orders o ON c.customer_id = o.customer_id
  GROUP BY c.customer_id, c.city, c.first_name
),
ranked AS (
  SELECT *, RANK() OVER (PARTITION BY city ORDER BY total DESC) AS rnk FROM spend
)
SELECT city, first_name, total FROM ranked WHERE rnk = 1;

-- 4
WITH gaps AS (
  SELECT order_id, order_date,
    LAG(order_id)   OVER (ORDER BY order_date) AS prev_order,
    order_date - LAG(order_date) OVER (ORDER BY order_date) AS gap_days
  FROM orders
)
SELECT * FROM gaps WHERE gap_days IS NOT NULL ORDER BY gap_days DESC LIMIT 1;

-- 5
WITH counts AS (
  SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id
)
SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE n > 1) / COUNT(*), 1) AS pct_repeat FROM counts;
-- 3 out of 6, so 50.0

-- 6
WITH days AS (
  SELECT d::date AS day FROM generate_series(DATE '2024-06-01', DATE '2024-06-30', INTERVAL '1 day') d
),
daily AS (
  SELECT days.day, COALESCE(SUM(o.amount), 0) AS revenue
  FROM days LEFT JOIN orders o ON o.order_date = days.day
  GROUP BY days.day
)
SELECT day, revenue,
  ROUND(AVG(revenue) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS moving_avg_7d
FROM daily
ORDER BY day;
