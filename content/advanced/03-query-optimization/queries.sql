-- query optimization
-- run sample-data.sql first, then the setup below to get a big table

-- setup ------------------------------------------------------------

DROP TABLE IF EXISTS big_orders;
CREATE TABLE big_orders AS
SELECT
  g AS order_id,
  (random() * 10000)::int AS customer_id,
  DATE '2023-01-01' + (random() * 730)::int AS order_date,
  (ARRAY['pending','shipped','delivered','cancelled'])[1 + (random() * 3)::int] AS status,
  (random() * 5000)::numeric(10,2) AS amount
FROM generate_series(1, 500000) g;
ANALYZE big_orders;


-- examples ---------------------------------------------------------

EXPLAIN SELECT * FROM orders WHERE customer_id = 1;

EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 42;

-- function on the column vs plain range
CREATE INDEX idx_big_date ON big_orders (order_date);
EXPLAIN ANALYZE SELECT COUNT(*) FROM big_orders WHERE EXTRACT(YEAR FROM order_date) = 2024 AND EXTRACT(MONTH FROM order_date) = 3;
EXPLAIN ANALYZE SELECT COUNT(*) FROM big_orders WHERE order_date >= '2024-03-01' AND order_date < '2024-04-01';


-- practice ---------------------------------------------------------

-- 1. EXPLAIN ANALYZE this, find the slow part, and fix it:
--    SELECT * FROM big_orders WHERE customer_id = 777 ORDER BY order_date DESC LIMIT 5;
-- 2. this query pages deep into the table. rewrite it with keyset pagination.
--    SELECT * FROM big_orders ORDER BY order_id LIMIT 20 OFFSET 400000;
-- 3. rewrite to avoid the function on the column:
--    SELECT * FROM big_orders WHERE order_date + 30 > CURRENT_DATE;
-- 4. "are there any cancelled orders over 4990?" write the fastest version.
-- 5. clean up


-- answers ----------------------------------------------------------

-- 1
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 777 ORDER BY order_date DESC LIMIT 5;
CREATE INDEX idx_big_cust_date ON big_orders (customer_id, order_date);
EXPLAIN ANALYZE SELECT * FROM big_orders WHERE customer_id = 777 ORDER BY order_date DESC LIMIT 5;
-- seq scan + sort becomes an index scan that reads just 5 rows (backwards)

-- 2
-- order_id is the sort key, so remember the last one you saw (say it was 400000)
SELECT * FROM big_orders WHERE order_id > 400000 ORDER BY order_id LIMIT 20;
-- needs an index on order_id to be fast:
CREATE INDEX idx_big_id ON big_orders (order_id);

-- 3
SELECT * FROM big_orders WHERE order_date > CURRENT_DATE - 30;
-- move the math to the other side so order_date is left alone

-- 4
SELECT EXISTS (SELECT 1 FROM big_orders WHERE status = 'cancelled' AND amount > 4990);

-- 5
DROP TABLE big_orders;
