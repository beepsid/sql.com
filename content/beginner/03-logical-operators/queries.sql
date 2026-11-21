-- logical operators
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT * FROM products WHERE category = 'Electronics' AND price < 1000;

SELECT * FROM customers WHERE city = 'Delhi' OR city = 'Chennai';

SELECT * FROM orders WHERE NOT status = 'delivered';

-- wrong, AND runs first so you get all electronics
SELECT * FROM products
WHERE category = 'Electronics' OR category = 'Stationery' AND price < 200;

-- right
SELECT * FROM products
WHERE (category = 'Electronics' OR category = 'Stationery') AND price < 200;


-- practice ---------------------------------------------------------

-- 1. delivered orders with amount above 1000
-- 2. employees in Engineering earning less than 100000
-- 3. customers from Delhi or Mumbai who have a phone number
-- 4. products that are NOT Electronics and cost more than 200
-- 5. orders that are pending or shipped, placed after 2024-04-01
-- 6. employees who are either in Sales, or earn more than 140000


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM orders WHERE status = 'delivered' AND amount > 1000;

-- 2
SELECT * FROM employees WHERE department = 'Engineering' AND salary < 100000;

-- 3
SELECT * FROM customers
WHERE (city = 'Delhi' OR city = 'Mumbai') AND phone IS NOT NULL;

-- 4
SELECT * FROM products WHERE NOT category = 'Electronics' AND price > 200;

-- 5
SELECT * FROM orders
WHERE (status = 'pending' OR status = 'shipped') AND order_date > '2024-04-01';

-- 6
SELECT * FROM employees WHERE department = 'Sales' OR salary > 140000;
