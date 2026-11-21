-- LEFT / RIGHT / FULL joins
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT c.first_name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.customer_id;

SELECT c.first_name, COUNT(o.order_id) AS orders, COALESCE(SUM(o.amount), 0) AS spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name
ORDER BY c.customer_id;

-- trap: becomes an inner join
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered';

-- fixed
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered';


-- practice ---------------------------------------------------------

-- 1. every product and how many times it was ordered, including products never ordered (show 0)
-- 2. products that have never been ordered
-- 3. every customer and the number of addresses they have, 0 if none
-- 4. every customer and their total delivered spend, 0 if nothing delivered
-- 5. every employee and their manager's name ('no manager' for the top boss)
--    hint: you're joining employees to itself, there's a topic on that next


-- answers ----------------------------------------------------------

-- 1
SELECT p.product_name, COUNT(oi.order_id) AS times_ordered
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.product_name
ORDER BY times_ordered DESC;

-- 2
SELECT p.product_name
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL;
-- empty! every product has been ordered at least once. not every query has an interesting answer lol

-- 3
SELECT c.first_name, COUNT(a.address_id) AS addresses
FROM customers c
LEFT JOIN addresses a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, c.first_name;

-- 4
SELECT c.first_name, COALESCE(SUM(o.amount), 0) AS delivered_spend
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered'
GROUP BY c.customer_id, c.first_name
ORDER BY delivered_spend DESC;

-- 5
SELECT e.name, COALESCE(m.name, 'no manager') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
