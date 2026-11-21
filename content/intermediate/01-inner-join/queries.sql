-- INNER JOIN
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT o.order_id, o.amount, c.first_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;

SELECT o.order_id, c.first_name, p.product_name, oi.quantity
FROM orders o
JOIN customers   c  ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id    = oi.order_id
JOIN products    p  ON oi.product_id = p.product_id
ORDER BY o.order_id;

SELECT c.first_name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name
ORDER BY total_spent DESC;


-- practice ---------------------------------------------------------

-- 1. every order with the customer's full name and city
-- 2. all delivered orders from customers in Delhi
-- 3. every product that has been ordered, with the order_id and order_date
-- 4. how many units of each product have been sold (product_name + total quantity)
-- 5. revenue per category, using order_items quantity * product price
-- 6. customers who bought something from the Electronics category, no duplicates


-- answers ----------------------------------------------------------

-- 1
SELECT o.order_id, c.first_name || ' ' || c.last_name AS customer, c.city
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id;

-- 2
SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.city = 'Delhi' AND o.status = 'delivered';

-- 3
SELECT p.product_name, o.order_id, o.order_date
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders   o ON oi.order_id   = o.order_id
ORDER BY o.order_date;

-- 4
SELECT p.product_name, SUM(oi.quantity) AS units_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.product_id, p.product_name
ORDER BY units_sold DESC;

-- 5
SELECT p.category, SUM(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category;

-- 6
SELECT DISTINCT c.first_name
FROM customers c
JOIN orders      o  ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id    = oi.order_id
JOIN products    p  ON oi.product_id = p.product_id
WHERE p.category = 'Electronics';
-- DISTINCT is fine here, we actually want unique people, not hiding a bug
