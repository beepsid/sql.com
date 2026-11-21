-- what is sql
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- every column of the customers table
SELECT * FROM customers;

-- just two columns
SELECT first_name, city FROM customers;

-- every product
SELECT * FROM products;


-- practice ---------------------------------------------------------
-- try these on your own first, answers are at the bottom

-- 1. show every column of the orders table
-- 2. show just the product_name and price of every product
-- 3. show the first_name and email of every customer


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM orders;

-- 2
SELECT product_name, price FROM products;

-- 3
SELECT first_name, email FROM customers;
