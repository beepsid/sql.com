-- GROUP BY & HAVING
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2;

SELECT customer_id, SUM(amount) AS spent
FROM orders
WHERE status = 'delivered'
GROUP BY customer_id
HAVING SUM(amount) > 2000;

SELECT DATE_TRUNC('month', order_date) AS month, COUNT(*), SUM(amount)
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 1;


-- practice ---------------------------------------------------------

-- 1. departments with more than 2 employees
-- 2. departments where the average salary is above 100000
-- 3. categories where the cheapest product costs more than 200
-- 4. customers (show their name) who spent more than 1000 total on non-cancelled orders
-- 5. months in 2024 that had more than 1 order
-- 6. customers who have ordered from more than one category


-- answers ----------------------------------------------------------

-- 1
SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 2;

-- 2
SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 100000;

-- 3
SELECT category, MIN(price) FROM products GROUP BY category HAVING MIN(price) > 200;

-- 4
SELECT c.first_name, SUM(o.amount) AS spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status <> 'cancelled'
GROUP BY c.customer_id, c.first_name
HAVING SUM(o.amount) > 1000;

-- 5
SELECT DATE_TRUNC('month', order_date) AS month, COUNT(*)
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
GROUP BY 1
HAVING COUNT(*) > 1
ORDER BY 1;

-- 6
SELECT o.customer_id, COUNT(DISTINCT p.category) AS categories
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY o.customer_id
HAVING COUNT(DISTINCT p.category) > 1;
