-- SQL injection & security
-- run sample-data.sql first

-- examples ---------------------------------------------------------

-- what a glued-together query turns into when the input is: ' OR '1'='1
SELECT * FROM customers WHERE email = '' OR '1'='1';
-- every row. that's the attack.

-- parameterized version in plain sql
PREPARE find_customer(TEXT) AS
  SELECT * FROM customers WHERE email = $1;

EXECUTE find_customer('aman@mail.com');       -- 1 row
EXECUTE find_customer(''' OR ''1''=''1');     -- 0 rows, input stayed as data

DEALLOCATE find_customer;


-- practice ---------------------------------------------------------

-- 1. what does this become if the input is:  1 OR 1=1
--    "SELECT * FROM orders WHERE order_id = " + input
-- 2. write a prepared statement that finds orders for a customer_id and a status
-- 3. create a read-only role 'report_reader' that can only SELECT from orders and products
-- 4. create a role 'app' that can read and insert orders but not delete them
-- 5. clean up the roles


-- answers ----------------------------------------------------------

-- 1
SELECT * FROM orders WHERE order_id = 1 OR 1=1;
-- every order. no quotes needed for numeric injection, so "it's just a number" isn't safe either.

-- 2
PREPARE orders_for(INT, TEXT) AS
  SELECT * FROM orders WHERE customer_id = $1 AND status = $2;
EXECUTE orders_for(1, 'delivered');
DEALLOCATE orders_for;

-- 3
CREATE ROLE report_reader;
GRANT SELECT ON orders, products TO report_reader;

-- 4
CREATE ROLE app;
GRANT SELECT, INSERT ON orders TO app;

-- 5
REVOKE ALL ON orders, products FROM report_reader, app;
DROP ROLE report_reader;
DROP ROLE app;
