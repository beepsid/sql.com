-- SELECT & basic queries
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- everything from customers
SELECT * FROM customers;

-- just names and emails
SELECT first_name, email FROM customers;

-- renaming columns
SELECT first_name AS name, email AS contact FROM customers;

-- full name in one column
SELECT first_name || ' ' || last_name AS full_name FROM customers;

-- price with 18% gst
SELECT product_name, price, price * 1.18 AS price_with_gst FROM products;


-- practice ---------------------------------------------------------
-- try these on your own first, answers are at the bottom

-- 1. get product_name and price from products
-- 2. get every column from orders
-- 3. get order_id and amount, but call amount "order_value"
-- 4. show each product with its price after a 10% discount, name that column discounted_price
-- 5. show customers as "Sharma, Aman" in one column called display_name
-- 6. show each employee's name and their yearly salary divided into monthly, call it monthly_salary


-- answers ----------------------------------------------------------

-- 1
SELECT product_name, price FROM products;

-- 2
SELECT * FROM orders;

-- 3
SELECT order_id, amount AS order_value FROM orders;

-- 4
SELECT product_name, price, price * 0.9 AS discounted_price FROM products;

-- 5
SELECT last_name || ', ' || first_name AS display_name FROM customers;

-- 6
SELECT name, salary / 12 AS monthly_salary FROM employees;
-- heads up, salary is an INT so 250000 / 12 gives 20833 not 20833.33
-- if you want decimals do salary / 12.0
