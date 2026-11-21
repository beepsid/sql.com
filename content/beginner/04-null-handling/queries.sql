-- NULL handling
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- returns nothing, never use = NULL
SELECT * FROM customers WHERE phone = NULL;

-- right way
SELECT * FROM customers WHERE phone IS NULL;

-- default value
SELECT first_name, COALESCE(phone, 'not given') AS phone FROM customers;

-- Karan is missing here because his city is NULL
SELECT * FROM customers WHERE city <> 'Delhi';

-- now he's in
SELECT * FROM customers WHERE city IS DISTINCT FROM 'Delhi';

-- 8 vs 5
SELECT COUNT(*) AS total, COUNT(phone) AS with_phone FROM customers;


-- practice ---------------------------------------------------------

-- 1. customers who do have a city
-- 2. show first_name and city, but show 'unknown' when city is missing
-- 3. how many customers are missing a phone number? (one number as answer)
-- 4. all customers who are not from Mumbai, including the one with no city
-- 5. show first_name and a contact column: phone if they have it, otherwise email


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM customers WHERE city IS NOT NULL;

-- 2
SELECT first_name, COALESCE(city, 'unknown') AS city FROM customers;

-- 3
SELECT COUNT(*) - COUNT(phone) AS missing_phone FROM customers;
-- or
SELECT COUNT(*) FROM customers WHERE phone IS NULL;

-- 4
SELECT * FROM customers WHERE city <> 'Mumbai' OR city IS NULL;

-- 5
SELECT first_name, COALESCE(phone, email) AS contact FROM customers;
