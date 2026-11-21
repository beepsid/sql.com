-- system & misc functions
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT current_user, current_database(), current_schema(), version();

-- RETURNING gives back what you just changed (wrapped in a transaction so the sample data stays the same)
BEGIN;
UPDATE orders SET status = 'delivered' WHERE status = 'pending'
RETURNING order_id, status;
ROLLBACK;

SELECT md5('aman@mail.com'), encode(sha256('aman@mail.com'), 'hex');

SELECT gen_random_uuid();

SELECT 5 & 3 AS bit_and, 5 | 3 AS bit_or, 5 # 3 AS bit_xor, ~5 AS bit_not, 1 << 3 AS shl, 16 >> 2 AS shr;

SELECT 2 ^ 3;   -- 8, power in postgres, not xor

SELECT first_name, city, phone
FROM customers
WHERE (phone IS NOT NULL) <> (city IS NOT NULL);

SELECT BIT_OR(x), BIT_AND(x) FROM (VALUES (1), (2), (4)) AS t(x);

SELECT BOOL_AND(status = 'delivered') AS all_delivered,
       BOOL_OR(status = 'cancelled')  AS any_cancelled
FROM orders;

SELECT to_timestamp(1719792000), EXTRACT(EPOCH FROM TIMESTAMP '2024-07-01 00:00:00');

SELECT '192.168.1.10'::inet << '192.168.1.0/24'::inet AS in_range;


-- practice ---------------------------------------------------------

-- 1. show every customer's email next to its md5 hash
-- 2. how many unique email hashes are there? (should match the number of customers)
-- 3. permissions are stored as numbers, 1 = read, 2 = write, 4 = delete.
--    for the values 1 to 7, show whether each one can write and whether it can delete
-- 4. for each customer who has orders, did they ever have an order that's still pending? true / false
-- 5. orders where the order_id is odd XOR the amount is over 1000
--    (exactly one of the two is true)
-- 6. turn every order_date into a unix timestamp (seconds)
-- 7. the epoch 1719792000000 came from a javascript app. what date is it?
-- 8. inside a transaction, insert a new customer and get their customer_id and signup_date back
--    in the same statement, then roll it back


-- answers ----------------------------------------------------------

-- 1
SELECT email, md5(email) AS email_hash FROM customers;

-- 2
SELECT COUNT(DISTINCT md5(email)) AS unique_hashes FROM customers;
-- 8

-- 3
SELECT p AS permission,
  (p & 2) <> 0 AS can_write,
  (p & 4) <> 0 AS can_delete
FROM generate_series(1, 7) AS p;

-- 4
SELECT customer_id, BOOL_OR(status = 'pending') AS has_pending
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
-- 1 and 8 are true

-- 5
SELECT order_id, amount
FROM orders
WHERE (order_id % 2 = 1) <> (amount > 1000);
-- 102, 103, 104, 105, 106, 107, 108, 109. only 101 (odd and over 1000) and 110 (even and under) drop out

-- 6
SELECT order_id, order_date, EXTRACT(EPOCH FROM order_date::timestamp) AS unix_seconds
FROM orders;

-- 7
SELECT to_timestamp(1719792000000 / 1000);
-- 2024-07-01, it was milliseconds so divide by 1000 first

-- 8
BEGIN;
INSERT INTO customers (customer_id, first_name, last_name, email, signup_date)
VALUES (9, 'Tara', 'Bose', 'tara@mail.com', '2024-08-01')
RETURNING customer_id, signup_date;
ROLLBACK;
