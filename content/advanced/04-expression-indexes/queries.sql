-- expression indexes
-- run sample-data.sql first

-- setup: a bigger customers table so the planner actually uses indexes
DROP TABLE IF EXISTS big_customers;
CREATE TABLE big_customers AS
SELECT
  g AS customer_id,
  CASE WHEN g % 2 = 0 THEN 'User' || g || '@Mail.com' ELSE 'user' || g || '@mail.com' END AS email,
  'Name' || g AS first_name
FROM generate_series(1, 300000) g;
ANALYZE big_customers;


-- examples ---------------------------------------------------------

CREATE INDEX idx_big_email ON big_customers (email);

-- can't use idx_big_email
EXPLAIN ANALYZE SELECT * FROM big_customers WHERE LOWER(email) = 'user500@mail.com';

CREATE INDEX idx_big_email_lower ON big_customers (LOWER(email));
ANALYZE big_customers;

-- now it can
EXPLAIN ANALYZE SELECT * FROM big_customers WHERE LOWER(email) = 'user500@mail.com';


-- practice ---------------------------------------------------------

-- 1. does the index get used for WHERE UPPER(email) = 'USER500@MAIL.COM'? check with EXPLAIN.
-- 2. on the real customers table, make it impossible to insert a duplicate email ignoring case.
--    then try inserting 'AMAN@MAIL.COM' and see what happens.
-- 3. create an index that helps: SELECT * FROM events WHERE payload->>'device' = 'mobile';
-- 4. why does this fail? CREATE INDEX ON orders ((order_date > NOW()));
-- 5. clean up


-- answers ----------------------------------------------------------

-- 1
EXPLAIN SELECT * FROM big_customers WHERE UPPER(email) = 'USER500@MAIL.COM';
-- no, different expression, seq scan

-- 2
CREATE UNIQUE INDEX idx_customers_email_ci ON customers (LOWER(email));
INSERT INTO customers (customer_id, first_name, email) VALUES (99, 'Test', 'AMAN@MAIL.COM');
-- ERROR: duplicate key value violates unique constraint
DROP INDEX idx_customers_email_ci;

-- 3
CREATE INDEX idx_events_device ON events ((payload->>'device'));

-- 4
-- NOW() isn't immutable, the result would change over time so the index would go stale.
-- postgres refuses: "functions in index expression must be marked IMMUTABLE"

-- 5
DROP INDEX IF EXISTS idx_events_device;
DROP TABLE big_customers;
