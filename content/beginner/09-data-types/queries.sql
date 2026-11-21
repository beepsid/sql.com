-- data types
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT 0.1::float + 0.2::float;
SELECT 0.1::numeric + 0.2::numeric;

SELECT CAST('123' AS INT) + 1;
SELECT '2024-03-15'::date + 7;

SELECT 7 / 2, 7 / 2.0, 7::numeric / 2;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders';


-- practice ---------------------------------------------------------

-- 1. what are the column types of the employees table?
-- 2. show each employee's salary divided by 12 with decimals (not rounded off by int division)
-- 3. turn the text '2024-12-25' into a date and add 10 days to it
-- 4. show order_id as text with 'ORD-' in front, like ORD-101
-- 5. you have a table to store product reviews: an id, the product, a rating 1 to 5,
--    the review text, and when it was posted. write the CREATE TABLE with sensible types.


-- answers ----------------------------------------------------------

-- 1
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'employees';

-- 2
SELECT name, salary / 12.0 AS monthly FROM employees;
-- or ROUND(salary::numeric / 12, 2)

-- 3
SELECT '2024-12-25'::date + 10;

-- 4
SELECT 'ORD-' || order_id::text AS order_code FROM orders;

-- 5
CREATE TABLE reviews (
  review_id   BIGINT PRIMARY KEY,
  product_id  INT REFERENCES products(product_id),
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  posted_at   TIMESTAMPTZ DEFAULT NOW()
);
DROP TABLE reviews;
