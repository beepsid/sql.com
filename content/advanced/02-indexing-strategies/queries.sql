-- indexes
-- run sample-data.sql first
-- note: with only 10 rows postgres will usually still pick a seq scan, it's cheaper.
-- the generate_series bit below makes a big table so you can actually see indexes kick in.

-- examples ---------------------------------------------------------

CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);

SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';

-- make a big table to play with
DROP TABLE IF EXISTS big_orders;
CREATE TABLE big_orders AS
SELECT
  g AS order_id,
  (random() * 10000)::int AS customer_id,
  DATE '2024-01-01' + (random() * 365)::int AS order_date,
  (random() * 5000)::numeric(10,2) AS amount
FROM generate_series(1, 500000) g;
ANALYZE big_orders;

-- before index
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 42;

CREATE INDEX idx_big_cust ON big_orders (customer_id);

-- after index, look for "Index Scan" or "Bitmap Index Scan" and compare the time
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 42;


-- practice ---------------------------------------------------------

-- 1. on big_orders, check how long WHERE order_date = '2024-05-01' takes. add an index. check again.
-- 2. you often run: WHERE customer_id = ? AND order_date >= ? ORDER BY order_date.
--    what index would you create?
-- 3. does an index on (customer_id, order_date) help WHERE order_date = '2024-05-01'? test it.
-- 4. create a partial index for orders with amount > 4500 and check it's used
-- 5. clean up: drop all the indexes you made and the big_orders table


-- answers ----------------------------------------------------------

-- 1
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE order_date = '2024-05-01';
CREATE INDEX idx_big_date ON big_orders (order_date);
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE order_date = '2024-05-01';

-- 2
CREATE INDEX idx_big_cust_date ON big_orders (customer_id, order_date);
-- equality column first, range/sort column second

-- 3
DROP INDEX idx_big_date;
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE order_date = '2024-05-01';
-- mostly no, it can't jump to a date without knowing the customer_id first.
-- postgres might still scan the index but it's way less efficient.

-- 4
CREATE INDEX idx_big_large ON big_orders (amount) WHERE amount > 4500;
EXPLAIN SELECT * FROM big_orders WHERE amount > 4800;

-- 5
DROP INDEX IF EXISTS idx_big_cust, idx_big_cust_date, idx_big_large, idx_big_date;
DROP INDEX IF EXISTS idx_orders_customer_id, idx_orders_customer_date;
DROP TABLE big_orders;
