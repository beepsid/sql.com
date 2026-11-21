-- ON vs WHERE
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- all 8 customers, only delivered orders matched
SELECT c.first_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered'
ORDER BY c.customer_id;

-- only customers with delivered orders
SELECT c.first_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered'
ORDER BY c.customer_id;

-- left table filter in ON, still returns all 8
SELECT c.first_name, c.city, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND c.city = 'Delhi';


-- practice ---------------------------------------------------------

-- 1. all customers, with only their orders above 1000 (keep customers who have none)
-- 2. only Mumbai customers, with all their orders (keep them even if no orders)
-- 3. all products, and how many units were sold in orders placed in 2024-06 or later (0 if none)
-- 4. predict before running: how many rows does this return, and why?
--    SELECT c.first_name, o.order_id FROM customers c
--    LEFT JOIN orders o ON c.customer_id = o.customer_id
--    WHERE o.amount > 1000 OR o.amount IS NULL;


-- answers ----------------------------------------------------------

-- 1
SELECT c.first_name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.amount > 1000
ORDER BY c.customer_id;

-- 2
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.city = 'Mumbai';

-- 3
SELECT p.product_name, COALESCE(SUM(oi.quantity), 0) AS units
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_date >= '2024-06-01'
GROUP BY p.product_id, p.product_name;
-- careful, this one is wrong! the second LEFT JOIN only nulls out o, oi rows still count.
-- correct version, filter inside a subquery first:
SELECT p.product_name, COALESCE(SUM(x.quantity), 0) AS units
FROM products p
LEFT JOIN (
  SELECT oi.product_id, oi.quantity
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.order_id
  WHERE o.order_date >= '2024-06-01'
) x ON p.product_id = x.product_id
GROUP BY p.product_id, p.product_name;

-- 4
-- 7 rows. Aman twice (101 and 102), Rahul (104), Sneha (106), Neha (108), plus Karan and Arjun with NULL.
-- the IS NULL keeps the no-match customers, but Priya and Riya (who have orders, just small ones)
-- get dropped completely. so it's NOT the same as putting amount > 1000 in ON.
SELECT c.first_name, o.order_id FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.amount > 1000 OR o.amount IS NULL;
