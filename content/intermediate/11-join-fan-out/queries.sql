-- join fan-out
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- Neha's one order shows up 3 times
SELECT c.first_name, o.order_id, o.amount, a.city
FROM customers c
JOIN orders    o ON c.customer_id = o.customer_id
JOIN addresses a ON c.customer_id = a.customer_id
WHERE c.customer_id = 6;

-- wrong totals
SELECT c.first_name, SUM(o.amount) AS total_spent, COUNT(a.address_id) AS addresses
FROM customers c
JOIN orders    o ON c.customer_id = o.customer_id
JOIN addresses a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, c.first_name;

-- right totals
WITH spend AS (
  SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id
),
addr AS (
  SELECT customer_id, COUNT(*) AS addresses FROM addresses GROUP BY customer_id
)
SELECT c.first_name, COALESCE(s.total_spent, 0) AS total_spent, COALESCE(a.addresses, 0) AS addresses
FROM customers c
LEFT JOIN spend s ON c.customer_id = s.customer_id
LEFT JOIN addr  a ON c.customer_id = a.customer_id;


-- practice ---------------------------------------------------------

-- 1. run this and explain why it's wrong:
--    SELECT SUM(o.amount) FROM orders o JOIN order_items oi ON o.order_id = oi.order_id;
-- 2. per customer: number of orders and number of items bought (sum of quantity). do it without fan-out.
-- 3. per customer: total spent and number of distinct cities in their addresses
-- 4. per order: amount, number of line items. check that the amount is not repeated.


-- answers ----------------------------------------------------------

-- 1
-- 29498 instead of 23082. orders with 2 items (101, 105, 108, 110) get their amount added twice.
SELECT SUM(amount) FROM orders;  -- the real total

-- 2
WITH order_counts AS (
  SELECT customer_id, COUNT(*) AS orders FROM orders GROUP BY customer_id
),
item_counts AS (
  SELECT o.customer_id, SUM(oi.quantity) AS items
  FROM orders o JOIN order_items oi ON o.order_id = oi.order_id
  GROUP BY o.customer_id
)
SELECT c.first_name, COALESCE(oc.orders, 0) AS orders, COALESCE(ic.items, 0) AS items
FROM customers c
LEFT JOIN order_counts oc ON c.customer_id = oc.customer_id
LEFT JOIN item_counts  ic ON c.customer_id = ic.customer_id;

-- 3
SELECT c.first_name,
  (SELECT COALESCE(SUM(amount), 0) FROM orders o WHERE o.customer_id = c.customer_id) AS spent,
  (SELECT COUNT(DISTINCT city) FROM addresses a WHERE a.customer_id = c.customer_id) AS cities
FROM customers c;

-- 4
SELECT o.order_id, o.amount, COUNT(oi.product_id) AS line_items
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.amount;
-- grouping by order_id puts the copies back into one row, so amount isn't summed here
