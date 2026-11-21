-- self joins
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT e.name AS employee, COALESCE(m.name, '-') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;

SELECT a.name, b.name, a.department
FROM employees a
JOIN employees b ON a.department = b.department AND a.employee_id < b.employee_id;

SELECT e.name, m.name AS manager, mm.name AS skip_manager
FROM employees e
LEFT JOIN employees m  ON e.manager_id = m.employee_id
LEFT JOIN employees mm ON m.manager_id = mm.employee_id;


-- practice ---------------------------------------------------------

-- 1. for each manager, how many people report directly to them
-- 2. employees who were hired before their manager (would be weird but check)
-- 3. pairs of products in the same category where one costs more than double the other
-- 4. pairs of orders placed by the same customer, showing both order_ids and the days between them
-- 5. employees who earn the same salary as someone else


-- answers ----------------------------------------------------------

-- 1
SELECT m.name AS manager, COUNT(e.employee_id) AS direct_reports
FROM employees m
JOIN employees e ON e.manager_id = m.employee_id
GROUP BY m.employee_id, m.name
ORDER BY direct_reports DESC;

-- 2
SELECT e.name, e.hire_date, m.name AS manager, m.hire_date AS manager_hired
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id
WHERE e.hire_date < m.hire_date;

-- 3
SELECT a.product_name AS pricey, b.product_name AS cheap, a.category
FROM products a
JOIN products b ON a.category = b.category AND a.price > 2 * b.price;

-- 4
SELECT a.customer_id, a.order_id AS first_order, b.order_id AS later_order,
       b.order_date - a.order_date AS days_between
FROM orders a
JOIN orders b ON a.customer_id = b.customer_id AND a.order_date < b.order_date
ORDER BY a.customer_id;

-- 5
SELECT DISTINCT a.name, a.salary
FROM employees a
JOIN employees b ON a.salary = b.salary AND a.employee_id <> b.employee_id;
-- Pooja and Dev, both 70000
