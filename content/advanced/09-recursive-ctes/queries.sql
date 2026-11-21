-- recursive CTEs
-- run sample-data.sql first

-- examples ---------------------------------------------------------

WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 5
)
SELECT * FROM nums;

WITH RECURSIVE org AS (
  SELECT employee_id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, e.manager_id, o.level + 1
  FROM employees e
  JOIN org o ON e.manager_id = o.employee_id
)
SELECT * FROM org ORDER BY level, name;

WITH RECURSIVE org AS (
  SELECT employee_id, name, name::text AS path
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, o.path || ' > ' || e.name
  FROM employees e
  JOIN org o ON e.manager_id = o.employee_id
)
SELECT path FROM org ORDER BY path;


-- practice ---------------------------------------------------------

-- 1. generate the numbers 1 to 10 and their squares
-- 2. everyone under Anita (directly or indirectly), not including Anita
-- 3. the full chain of bosses above Isha, with how many levels up each one is
-- 4. for each manager, the total salary of everyone under them (all levels)
-- 5. every day from 2024-03-01 to 2024-03-31, with the number of orders placed that day


-- answers ----------------------------------------------------------

-- 1
WITH RECURSIVE n AS (
  SELECT 1 AS x
  UNION ALL
  SELECT x + 1 FROM n WHERE x < 10
)
SELECT x, x * x AS square FROM n;

-- 2
WITH RECURSIVE team AS (
  SELECT employee_id, name FROM employees WHERE manager_id = (SELECT employee_id FROM employees WHERE name = 'Anita')
  UNION ALL
  SELECT e.employee_id, e.name
  FROM employees e JOIN team t ON e.manager_id = t.employee_id
)
SELECT name FROM team;
-- Rohit, Meera, Isha

-- 3
WITH RECURSIVE chain AS (
  SELECT employee_id, name, manager_id, 0 AS levels_up FROM employees WHERE name = 'Isha'
  UNION ALL
  SELECT e.employee_id, e.name, e.manager_id, c.levels_up + 1
  FROM employees e JOIN chain c ON e.employee_id = c.manager_id
)
SELECT name, levels_up FROM chain WHERE levels_up > 0;

-- 4
WITH RECURSIVE reports AS (
  -- every (manager, employee under them) pair
  SELECT manager_id AS boss_id, employee_id, salary
  FROM employees WHERE manager_id IS NOT NULL
  UNION ALL
  SELECT e.manager_id, r.employee_id, r.salary
  FROM reports r
  JOIN employees e ON r.boss_id = e.employee_id
  WHERE e.manager_id IS NOT NULL
)
SELECT b.name AS manager, SUM(r.salary) AS team_salary
FROM reports r JOIN employees b ON r.boss_id = b.employee_id
GROUP BY b.name
ORDER BY team_salary DESC;

-- 5
WITH RECURSIVE days AS (
  SELECT DATE '2024-03-01' AS d
  UNION ALL
  SELECT d + 1 FROM days WHERE d < '2024-03-31'
)
SELECT days.d, COUNT(o.order_id) AS orders
FROM days
LEFT JOIN orders o ON o.order_date = days.d
GROUP BY days.d
ORDER BY days.d;
