-- anti-joins
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT c.first_name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);

SELECT c.first_name FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;

-- the NULL trap, returns nothing
SELECT first_name FROM customers WHERE customer_id NOT IN (1, 2, NULL);


-- practice ---------------------------------------------------------

-- 1. customers with no address on file (use NOT EXISTS)
-- 2. same thing but with LEFT JOIN / IS NULL
-- 3. customers who never bought anything from Stationery
-- 4. employees who are nobody's manager (no one reports to them)
-- 5. customers who have ordered but never had an order cancelled
-- 6. predict: what does this return? then run it.
--    SELECT name FROM employees WHERE employee_id NOT IN (SELECT manager_id FROM employees);


-- answers ----------------------------------------------------------

-- 1
SELECT c.first_name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM addresses a WHERE a.customer_id = c.customer_id);

-- 2
SELECT c.first_name FROM customers c
LEFT JOIN addresses a ON c.customer_id = a.customer_id
WHERE a.address_id IS NULL;

-- 3
SELECT c.first_name FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
  WHERE o.customer_id = c.customer_id AND p.category = 'Stationery'
);

-- 4
SELECT e.name FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM employees r WHERE r.manager_id = e.employee_id);

-- 5
SELECT c.first_name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
  AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.status = 'cancelled');

-- 6
-- nothing! Vikram's manager_id is NULL, so the subquery has a NULL in it, so NOT IN fails for everyone.
-- fix:
SELECT name FROM employees
WHERE employee_id NOT IN (SELECT manager_id FROM employees WHERE manager_id IS NOT NULL);
