-- subqueries
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT product_name, price FROM products
WHERE price > (SELECT AVG(price) FROM products);

SELECT first_name FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'delivered');

SELECT product_name, category, price FROM products p
WHERE price > (SELECT AVG(price) FROM products p2 WHERE p2.category = p.category);

SELECT first_name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS order_count
FROM customers c;

SELECT AVG(order_count) FROM (
  SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id
) t;


-- practice ---------------------------------------------------------

-- 1. employees who earn more than the company average
-- 2. the most recent order (the full row), using a subquery with MAX
-- 3. employees who earn the most in their own department
-- 4. customers who bought the Mechanical Keyboard (use IN, nested twice)
-- 5. each order with its amount and how much above or below the average order it is
-- 6. the highest total spend by any single customer (aggregate of aggregate)


-- answers ----------------------------------------------------------

-- 1
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 2
SELECT * FROM orders WHERE order_date = (SELECT MAX(order_date) FROM orders);

-- 3
SELECT name, department, salary FROM employees e
WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department = e.department);

-- 4
SELECT first_name FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM orders
  WHERE order_id IN (
    SELECT order_id FROM order_items
    WHERE product_id = (SELECT product_id FROM products WHERE product_name = 'Mechanical Keyboard')
  )
);

-- 5
SELECT order_id, amount,
  ROUND(amount - (SELECT AVG(amount) FROM orders), 2) AS diff_from_avg
FROM orders;

-- 6
SELECT MAX(total) FROM (
  SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id
) t;
