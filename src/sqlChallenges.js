export const sqlChallenges = [
  // BEGINNER CHALLENGES
  {
    id: 1,
    difficulty: 'BEGINNER',
    title: 'Select Basic Columns',
    description: 'Retrieve customer names and email addresses from the customers table',
    prompt: 'Write a query to get the first_name and email from the customers table.',
    hint: 'Use SELECT with the column names separated by commas',
    expectedQuery: 'SELECT first_name, email FROM customers',
    expectedColumns: ['first_name', 'email'],
    expectedRowCount: null, // Any number of rows
    explanation: 'This is the foundation of SQL - selecting specific columns from a table. The SELECT keyword specifies which columns to retrieve, and FROM specifies the table.',
    tags: ['SELECT', 'Columns', 'Basic']
  },
  {
    id: 2,
    difficulty: 'BEGINNER',
    title: 'Filter with WHERE Clause',
    description: 'Find all products with a price greater than $100',
    prompt: 'Write a query to get all columns from products where price is greater than 100.',
    hint: 'Use WHERE clause with the > operator',
    expectedQuery: 'SELECT * FROM products WHERE price > 100',
    expectedColumns: null,
    expectedRowCount: null,
    explanation: 'The WHERE clause filters rows based on conditions. Only rows matching the condition (price > 100) are returned. This is how you narrow down results from a table.',
    tags: ['WHERE', 'Filtering', 'Conditions']
  },
  {
    id: 3,
    difficulty: 'BEGINNER',
    title: 'Sort Results with ORDER BY',
    description: 'Get customers ordered by their signup date (newest first)',
    prompt: 'Write a query to get all customers sorted by created_at in descending order (most recent first).',
    hint: 'Use ORDER BY created_at DESC',
    expectedQuery: 'SELECT * FROM customers ORDER BY created_at DESC',
    expectedColumns: null,
    expectedRowCount: null,
    explanation: 'ORDER BY sorts results by specified column(s). DESC means descending (highest to lowest), ASC means ascending (lowest to highest, default).',
    tags: ['ORDER BY', 'Sorting', 'DESC']
  },
  {
    id: 4,
    difficulty: 'BEGINNER',
    title: 'Count Rows with Aggregation',
    description: 'Count how many active orders exist in the database',
    prompt: 'Write a query to count the number of orders where status = "active".',
    hint: 'Use COUNT(*) with a WHERE clause',
    expectedQuery: 'SELECT COUNT(*) FROM orders WHERE status = "active"',
    expectedColumns: ['COUNT(*)'],
    expectedRowCount: 1,
    explanation: 'Aggregate functions like COUNT() perform calculations across multiple rows. COUNT(*) counts all rows, COUNT(column) counts non-NULL values in that column.',
    tags: ['COUNT', 'Aggregation', 'WHERE']
  },

  // INTERMEDIATE CHALLENGES
  {
    id: 5,
    difficulty: 'INTERMEDIATE',
    title: 'INNER JOIN Two Tables',
    description: 'Get all orders with customer names (join orders and customers tables)',
    prompt: 'Write a query to get order_id, order_date, and customer name by joining orders and customers tables on customer_id.',
    hint: 'Use INNER JOIN to match rows from both tables. Specify the join condition in the ON clause.',
    expectedQuery: 'SELECT o.order_id, o.order_date, c.first_name FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id',
    expectedColumns: ['order_id', 'order_date', 'first_name'],
    expectedRowCount: null,
    explanation: 'INNER JOIN combines rows from two tables where the join condition matches. Only rows with matches in both tables are returned. Use table aliases (o, c) for clarity.',
    tags: ['INNER JOIN', 'JOIN', 'Relationships']
  },
  {
    id: 6,
    difficulty: 'INTERMEDIATE',
    title: 'LEFT JOIN with NULL Handling',
    description: 'Get all customers and their total spending (including those with no orders)',
    prompt: 'Write a query using LEFT JOIN to get customer name and SUM of order totals. Customers with no orders should show 0 or NULL.',
    hint: 'Use LEFT JOIN with GROUP BY and COALESCE to handle NULL totals',
    expectedQuery: 'SELECT c.first_name, COALESCE(SUM(o.total), 0) as total_spent FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name',
    expectedColumns: ['first_name', 'total_spent'],
    expectedRowCount: null,
    explanation: 'LEFT JOIN preserves all rows from the left table (customers) even if they have no matches in the right table (orders). COALESCE converts NULL to 0 for customers with no orders.',
    tags: ['LEFT JOIN', 'NULL Handling', 'GROUP BY']
  },
  {
    id: 7,
    difficulty: 'INTERMEDIATE',
    title: 'GROUP BY with HAVING',
    description: 'Find product categories with more than 5 products',
    prompt: 'Write a query to get category and count of products per category, but only where the count is greater than 5.',
    hint: 'Use GROUP BY to group by category, then HAVING to filter grouped results (not WHERE)',
    expectedQuery: 'SELECT category, COUNT(*) as product_count FROM products GROUP BY category HAVING COUNT(*) > 5',
    expectedColumns: ['category', 'product_count'],
    expectedRowCount: null,
    explanation: 'HAVING filters groups (results of GROUP BY), while WHERE filters individual rows before grouping. Use HAVING for conditions on aggregate functions.',
    tags: ['GROUP BY', 'HAVING', 'Aggregation']
  },
  {
    id: 8,
    difficulty: 'INTERMEDIATE',
    title: 'Subquery in SELECT',
    description: 'Get order details with a customer purchase count column',
    prompt: 'Write a query that shows each order with a column for how many total orders that customer has placed (using a subquery).',
    hint: 'Use a subquery in SELECT with a correlated subquery',
    expectedQuery: 'SELECT order_id, customer_id, (SELECT COUNT(*) FROM orders o2 WHERE o2.customer_id = o1.customer_id) as customer_total_orders FROM orders o1',
    expectedColumns: ['order_id', 'customer_id', 'customer_total_orders'],
    expectedRowCount: null,
    explanation: 'A correlated subquery references columns from the outer query. It runs once per outer query row, making it powerful but potentially slower than JOINs for large datasets.',
    tags: ['Subquery', 'Correlated', 'SELECT']
  },

  // ADVANCED CHALLENGES
  {
    id: 9,
    difficulty: 'ADVANCED',
    title: 'Window Function - Running Total',
    description: 'Calculate running total of sales by month for each customer',
    prompt: 'Write a query using a window function to get customer_id, order_date, amount, and a running total of amounts for each customer ordered by date.',
    hint: 'Use SUM() OVER (PARTITION BY customer_id ORDER BY order_date) as a window function',
    expectedQuery: 'SELECT customer_id, order_date, amount, SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) as running_total FROM orders ORDER BY customer_id, order_date',
    expectedColumns: ['customer_id', 'order_date', 'amount', 'running_total'],
    expectedRowCount: null,
    explanation: 'Window functions compute values across sets of rows without collapsing rows like GROUP BY does. PARTITION BY divides data into windows, ORDER BY specifies the order within each window.',
    tags: ['Window Functions', 'SUM OVER', 'Advanced']
  },
  {
    id: 10,
    difficulty: 'ADVANCED',
    title: 'CTE (Common Table Expression)',
    description: 'Find customers who spent more than average using a CTE',
    prompt: 'Write a query with a CTE that calculates average customer spending, then returns customers above average.',
    hint: 'Use WITH cte_name AS (...) SELECT ... FROM cte_name',
    expectedQuery: `WITH customer_spending AS (
  SELECT customer_id, SUM(amount) as total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT * FROM customer_spending
WHERE total_spent > (SELECT AVG(total_spent) FROM customer_spending)`,
    expectedColumns: ['customer_id', 'total_spent'],
    expectedRowCount: null,
    explanation: 'CTEs make complex queries more readable by naming intermediate results. They can reference themselves (recursive CTEs) for hierarchical data like organizational trees.',
    tags: ['CTE', 'WITH', 'Subquery']
  },
  {
    id: 11,
    difficulty: 'ADVANCED',
    title: 'Join Fan-Out Detection and Fix',
    description: 'Get user summary without double-counting due to multiple addresses',
    prompt: 'Write a query that gets user_id, name, order count, and total spent WITHOUT double-counting orders due to multiple addresses per user.',
    hint: 'Pre-aggregate orders in a subquery, then join to users and addresses',
    expectedQuery: `SELECT
  u.user_id,
  u.name,
  COALESCE(o.order_count, 0) as order_count,
  COALESCE(o.total_spent, 0) as total_spent
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as order_count, SUM(amount) as total_spent
  FROM orders
  GROUP BY user_id
) o ON u.user_id = o.user_id
LEFT JOIN addresses a ON u.user_id = a.user_id
GROUP BY u.user_id, u.name, o.order_count, o.total_spent`,
    expectedColumns: ['user_id', 'name', 'order_count', 'total_spent'],
    expectedRowCount: null,
    explanation: 'Join fan-out occurs when joining a table with multiple related rows (like multiple addresses per user) causing row multiplication. Pre-aggregate in a subquery to prevent this.',
    tags: ['JOIN', 'Fan-out', 'Aggregation']
  },
  {
    id: 12,
    difficulty: 'ADVANCED',
    title: 'Anti-Join Pattern',
    description: 'Find customers who NEVER placed an order',
    prompt: 'Write a query to find customers that do NOT have any orders using an anti-join pattern.',
    hint: 'Use NOT EXISTS or LEFT JOIN with IS NULL',
    expectedQuery: 'SELECT c.customer_id, c.name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)',
    expectedColumns: ['customer_id', 'name'],
    expectedRowCount: null,
    explanation: 'An anti-join returns rows from the left table that DON\'T match any row in the right table. NOT EXISTS is typically more efficient than LEFT JOIN with IS NULL.',
    tags: ['Anti-join', 'NOT EXISTS', 'Exclusion']
  },
  {
    id: 13,
    difficulty: 'ADVANCED',
    title: 'Date Range Query with Non-Equi Join',
    description: 'Find which discounts applied to each order (by date range)',
    prompt: 'Write a query using a non-equi join to match orders with discount periods based on date ranges.',
    hint: 'Use a JOIN condition with > and < operators instead of =',
    expectedQuery: 'SELECT o.order_id, o.order_date, d.discount_code, d.discount_percent FROM orders o JOIN discounts d ON o.order_date >= d.valid_from AND o.order_date <= d.valid_to',
    expectedColumns: ['order_id', 'order_date', 'discount_code', 'discount_percent'],
    expectedRowCount: null,
    explanation: 'Non-equi joins use comparison operators (>, <, >=, <=, BETWEEN) instead of equality. Common for date ranges, salary bands, and other range-based matching.',
    tags: ['Non-equi JOIN', 'Date Range', 'Advanced']
  },
  {
    id: 14,
    difficulty: 'ADVANCED',
    title: 'Recursive CTE - Hierarchy',
    description: 'Get organizational hierarchy (manager chains)',
    prompt: 'Write a recursive CTE to show each employee and their full manager chain (all ancestors up the tree).',
    hint: 'Use UNION to combine base case (no manager) and recursive case (employee has a manager)',
    expectedQuery: `WITH RECURSIVE emp_hierarchy AS (
  SELECT employee_id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.employee_id, e.name, e.manager_id, h.level + 1 FROM employees e
  INNER JOIN emp_hierarchy h ON e.manager_id = h.employee_id
)
SELECT * FROM emp_hierarchy`,
    expectedColumns: ['employee_id', 'name', 'manager_id', 'level'],
    expectedRowCount: null,
    explanation: 'Recursive CTEs have two parts: base case (stopping condition) and recursive case (how to climb up the hierarchy). Critical for org charts, hierarchies, and graph traversal.',
    tags: ['Recursive CTE', 'Hierarchy', 'Tree Traversal']
  }
]
