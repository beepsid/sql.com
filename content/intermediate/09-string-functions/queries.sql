-- string functions (postgres)
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT first_name || ' ' || last_name AS full_name FROM customers;

SELECT UPPER(first_name), LOWER(email), LENGTH(first_name) FROM customers;

SELECT email, SPLIT_PART(email, '@', 2) AS domain FROM customers;

SELECT LPAD(order_id::text, 6, '0') FROM orders;

SELECT city, STRING_AGG(first_name, ', ' ORDER BY first_name) AS people
FROM customers
GROUP BY city;


-- practice ---------------------------------------------------------

-- 1. show customers' initials, like "AS" for Aman Sharma
-- 2. show the username part of each email (before the @)
-- 3. show phone numbers masked like XXXXXX0001 (only last 4 visible), 'no phone' if NULL
-- 4. products whose name is longer than 10 characters
-- 5. for each category, a comma separated list of its product names
-- 6. turn 'Wireless Mouse' into 'wireless-mouse' (a url slug) for every product


-- answers ----------------------------------------------------------

-- 1
SELECT LEFT(first_name, 1) || LEFT(last_name, 1) AS initials FROM customers;

-- 2
SELECT SPLIT_PART(email, '@', 1) AS username FROM customers;
-- or SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1)

-- 3
SELECT first_name, COALESCE('XXXXXX' || RIGHT(phone, 4), 'no phone') AS masked FROM customers;

-- 4
SELECT product_name FROM products WHERE LENGTH(product_name) > 10;

-- 5
SELECT category, STRING_AGG(product_name, ', ') FROM products GROUP BY category;

-- 6
SELECT LOWER(REPLACE(product_name, ' ', '-')) AS slug FROM products;
