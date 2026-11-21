-- transactions
-- run sample-data.sql first

-- setup ------------------------------------------------------------

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (account_id INT PRIMARY KEY, owner TEXT, balance NUMERIC(10,2) CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'Aman', 1000), (2, 'Priya', 500);


-- examples ---------------------------------------------------------

BEGIN;
  UPDATE accounts SET balance = balance - 300 WHERE account_id = 1;
  UPDATE accounts SET balance = balance + 300 WHERE account_id = 2;
COMMIT;
SELECT * FROM accounts;  -- 700, 800

-- this fails the CHECK, whole thing is undone
BEGIN;
  UPDATE accounts SET balance = balance + 5000 WHERE account_id = 2;
  UPDATE accounts SET balance = balance - 5000 WHERE account_id = 1;  -- would go negative, error
ROLLBACK;
SELECT * FROM accounts;  -- still 700, 800

BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
  SAVEPOINT s1;
  UPDATE accounts SET balance = balance - 100000 WHERE account_id = 2;  -- error
  ROLLBACK TO s1;
  UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;
SELECT * FROM accounts;  -- 600, 900


-- practice ---------------------------------------------------------

-- 1. write a transaction that places order 111 for customer 7 with 2 Notebooks.
--    the amount should match the price. then check orders and order_items.
-- 2. now try placing order 112 with product_id 999 (doesn't exist) inside a transaction.
--    what's left in orders after the error + rollback?
-- 3. (two tabs) tab A: BEGIN; UPDATE accounts SET balance = 0 WHERE account_id = 1;
--    tab B: SELECT * FROM accounts;   what does B see? why?
--    tab A: COMMIT;  now what does B see?
-- 4. (two tabs) tab A: BEGIN; SELECT * FROM accounts WHERE account_id = 2 FOR UPDATE;
--    tab B: UPDATE accounts SET balance = 1 WHERE account_id = 2;   what happens to B?
--    tab A: COMMIT;
-- 5. clean up: delete order 111 and the accounts table


-- answers ----------------------------------------------------------

-- 1
BEGIN;
  INSERT INTO orders VALUES (111, 7, '2024-08-01', 'pending', 240);
  INSERT INTO order_items VALUES (111, 4, 2);
COMMIT;
SELECT * FROM orders WHERE order_id = 111;
SELECT * FROM order_items WHERE order_id = 111;

-- 2
BEGIN;
  INSERT INTO orders VALUES (112, 7, '2024-08-02', 'pending', 100);
  INSERT INTO order_items VALUES (112, 999, 1);  -- foreign key error
ROLLBACK;
SELECT * FROM orders WHERE order_id = 112;  -- nothing, the order got undone too

-- 3
-- before A commits, B still sees the old balance (read committed, no dirty reads).
-- after A commits, B sees 0.

-- 4
-- B just hangs, waiting for A's lock. as soon as A commits, B's update goes through.

-- 5
DELETE FROM order_items WHERE order_id = 111;
DELETE FROM orders WHERE order_id = 111;
DROP TABLE accounts;
