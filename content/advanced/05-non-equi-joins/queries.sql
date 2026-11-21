-- non-equi joins
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT o.order_id, o.order_date, COALESCE(d.discount_code, 'none') AS discount
FROM orders o
LEFT JOIN discounts d ON o.order_date BETWEEN d.valid_from AND d.valid_to;

WITH grades AS (
  SELECT * FROM (VALUES ('L1', 0, 80000), ('L2', 80001, 130000), ('L3', 130001, 1000000))
    AS g(grade, min_salary, max_salary)
)
SELECT e.name, e.salary, g.grade
FROM employees e
JOIN grades g ON e.salary BETWEEN g.min_salary AND g.max_salary;

SELECT d1.discount_code, d2.discount_code
FROM discounts d1
JOIN discounts d2
  ON d1.discount_code < d2.discount_code
 AND d1.valid_from <= d2.valid_to
 AND d2.valid_from <= d1.valid_to;


-- practice ---------------------------------------------------------

-- 1. each order's amount after its discount (full amount if no discount)
-- 2. customers who placed an order within 30 days of signing up (join customers to orders with a range)
-- 3. for each product, how many products are cheaper than it
-- 4. add a discount 'MONSOON' 25% from 2024-06-20 to 2024-07-10 and rerun the overlap query.
--    then: for orders matching more than one discount, keep only the biggest discount
-- 5. remove MONSOON again


-- answers ----------------------------------------------------------

-- 1
SELECT o.order_id, o.amount,
  ROUND(o.amount * (1 - COALESCE(d.discount_percent, 0) / 100.0), 2) AS final_amount
FROM orders o
LEFT JOIN discounts d ON o.order_date BETWEEN d.valid_from AND d.valid_to;

-- 2
SELECT DISTINCT c.first_name
FROM customers c
JOIN orders o
  ON o.customer_id = c.customer_id
 AND o.order_date <= c.signup_date + 30;

-- 3
SELECT a.product_name, a.price, COUNT(b.product_id) AS cheaper_products
FROM products a
LEFT JOIN products b ON b.price < a.price
GROUP BY a.product_id, a.product_name, a.price
ORDER BY a.price;

-- 4
INSERT INTO discounts VALUES ('MONSOON', 25, '2024-06-20', '2024-07-10');

SELECT d1.discount_code, d2.discount_code
FROM discounts d1
JOIN discounts d2
  ON d1.discount_code < d2.discount_code
 AND d1.valid_from <= d2.valid_to
 AND d2.valid_from <= d1.valid_to;
-- MONSOON overlaps SUMMER

WITH matches AS (
  SELECT o.order_id, o.order_date, d.discount_code, d.discount_percent,
    ROW_NUMBER() OVER (PARTITION BY o.order_id ORDER BY d.discount_percent DESC) AS rn
  FROM orders o
  JOIN discounts d ON o.order_date BETWEEN d.valid_from AND d.valid_to
)
SELECT order_id, order_date, discount_code, discount_percent FROM matches WHERE rn = 1;
-- order 108 (june 25) gets MONSOON 25% instead of SUMMER 20%

-- 5
DELETE FROM discounts WHERE discount_code = 'MONSOON';
