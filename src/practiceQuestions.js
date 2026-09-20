export const practiceQuestions = [
  {
    id: 1,
    number: 1,
    difficulty: 'EASY',
    topic: 'Logical Operators',
    question: 'When using multiple logical operators (AND / OR) in a WHERE clause, how does the database handle the evaluation?',
    options: [
      { text: 'It ignores the order of operations and processes everything from left to right.', value: 'A' },
      { text: 'It prioritizes OR before AND unless parentheses are used.', value: 'B' },
      { text: 'It prioritizes AND before OR unless parentheses are used.', value: 'C' },
      { text: 'It executes the ORDER BY clause before filtering the rows.', value: 'D' }
    ],
    correctAnswer: 'C',
    explanation: 'SQL follows a defined operator precedence in WHERE clauses: AND binds more tightly than OR, similar to how multiplication binds more tightly than addition in arithmetic. This means "A OR B AND C" is evaluated as "A OR (B AND C)", not "(A OR B) AND C". To force a different evaluation order, you must use explicit parentheses.'
  },
  {
    id: 2,
    number: 2,
    difficulty: 'EASY',
    topic: 'Indexing',
    question: 'If you add an index to a column, what is the primary tradeoff you should expect during data modification operations?',
    options: [
      { text: 'Inserts and updates become faster because the index validates data structure.', value: 'A' },
      { text: 'Data storage becomes smaller because indexes compress the underlying column data.', value: 'B' },
      { text: 'Data modifications may become slightly slower because the index must also be updated.', value: 'C' },
      { text: 'Queries will always be slower because the database has to navigate the index tree before reading data.', value: 'D' }
    ],
    correctAnswer: 'C',
    explanation: 'Indexes speed up reads (SELECT queries) by letting the engine avoid full table scans, but they are separate physical structures that must stay in sync with the table. Every INSERT, UPDATE, or DELETE that touches an indexed column also has to update the index\'s internal structure (e.g., rebalancing a B-tree). This is the classic read/write tradeoff of indexing: faster lookups at the cost of slightly slower writes and additional storage.'
  },
  {
    id: 3,
    number: 3,
    difficulty: 'EASY',
    topic: 'COUNT Function',
    question: 'A table has 1,000 rows. The phone_number column has 800 non-NULL values and 200 NULL values. What\'s the difference in results?',
    options: [
      { text: 'Both return 1,000 (COUNT ignores NULL)', value: 'A' },
      { text: 'Both return 800 (NULL rows are skipped)', value: 'B' },
      { text: 'COUNT(*) returns 1,000; COUNT(phone_number) returns 800', value: 'C' },
      { text: 'COUNT(phone_number) returns 1,000; COUNT(*) returns 800', value: 'D' }
    ],
    correctAnswer: 'C',
    explanation: 'COUNT(*) counts ALL rows (including those with NULL), while COUNT(phone_number) counts only rows where phone_number is NOT NULL. This distinction is crucial for accurate data analysis.'
  },
  {
    id: 4,
    number: 4,
    difficulty: 'EASY',
    topic: 'JOINs',
    question: 'What is the primary difference in result set behavior when switching from an INNER JOIN to a LEFT JOIN on a pair of tables?',
    options: [
      { text: 'The LEFT JOIN returns columns from both tables, while the INNER JOIN only returns columns from the first table.', value: 'A' },
      { text: 'The LEFT JOIN includes all rows from the left table even if there is no match in the right table, whereas INNER JOIN excludes rows without matches.', value: 'B' },
      { text: 'The LEFT JOIN is significantly faster than the INNER JOIN due to how it processes matching values.', value: 'C' },
      { text: 'The LEFT JOIN automatically removes duplicate records from the result set, while INNER JOIN keeps them.', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'INNER JOIN only returns rows where the join condition matches in both tables. LEFT JOIN preserves every row from the left table regardless of whether a match exists in the right table; unmatched columns from the right table are filled with NULL. This distinction is essential when you need to see "all records, plus related data if it exists".'
  },
  {
    id: 5,
    number: 5,
    difficulty: 'EASY',
    topic: 'GROUP BY & HAVING',
    question: 'You want to find departments that have more than 5 employees. You write: SELECT department, COUNT(*) FROM employees WHERE COUNT(*) > 5 GROUP BY department; What is wrong with this query?',
    options: [
      { text: 'It uses an incorrect syntax for the COUNT function.', value: 'A' },
      { text: 'There is no issue; the query is correct.', value: 'B' },
      { text: 'COUNT(*) must be in the WHERE clause.', value: 'C' },
      { text: 'The filtering condition must be in the HAVING clause.', value: 'D' }
    ],
    correctAnswer: 'D',
    explanation: 'WHERE filters individual rows before any grouping or aggregation happens, so aggregate functions like COUNT(*) cannot be referenced there — the aggregated value doesn\'t exist yet at that stage of query processing. To filter on the result of an aggregate function, SQL provides the HAVING clause, which runs after GROUP BY.'
  },
  {
    id: 6,
    number: 6,
    difficulty: 'EASY',
    topic: 'String Comparison',
    question: 'A junior developer writes: SELECT * FROM users WHERE username = \'admin\'; They complain that they cannot find the user \'Admin\'. What is the likely cause?',
    options: [
      { text: 'The query is case-sensitive, causing the mismatch.', value: 'A' },
      { text: 'The user does not exist in the database.', value: 'B' },
      { text: 'The database is corrupted.', value: 'C' },
      { text: 'The username is stored as a NULL.', value: 'D' }
    ],
    correctAnswer: 'A',
    explanation: 'Many databases (e.g., PostgreSQL by default) perform case-sensitive string comparisons for standard "=" matching. To make the search case-insensitive, you could use LOWER(username) = \'admin\', an ILIKE operator (PostgreSQL), or a case-insensitive collation, depending on the database engine.'
  },
  {
    id: 7,
    number: 7,
    difficulty: 'EASY',
    topic: 'UPDATE Statement',
    question: 'You have a table "products". How would you increase the price of all items in the \'Electronics\' category by 10%?',
    options: [
      { text: 'UPDATE products SET price = price + 0.1;', value: 'A' },
      { text: 'UPDATE products SET price = price * 1.1 WHERE category = \'Electronics\';', value: 'B' },
      { text: 'UPDATE products SET price = price + 10 WHERE category = \'Electronics\';', value: 'C' },
      { text: 'UPDATE products SET price = price * 1.1;', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'Increasing a value by 10% mathematically means multiplying it by 1.1. The WHERE clause is essential — without it, ALL rows would be updated, not just Electronics. Option A adds a flat $0.10, and Option D multiplies correctly but forgets the WHERE filter.'
  },
  {
    id: 8,
    number: 8,
    difficulty: 'EASY',
    topic: 'NULL Handling',
    question: 'You want to select all users who have not set a \'phone_number\'. You write: SELECT * FROM users WHERE phone_number != NULL; Why will this return zero results even if there are users with missing numbers?',
    options: [
      { text: 'It returns the users that have a phone number.', value: 'A' },
      { text: 'It returns zero results because NULL cannot be directly compared.', value: 'B' },
      { text: 'It returns all users, including those without a phone number.', value: 'C' },
      { text: 'It only returns users with an empty string in phone_number.', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'In SQL, NULL represents an unknown or absent value, not a comparable value. Any comparison operator (=, !=, <, >) against NULL evaluates to UNKNOWN rather than TRUE or FALSE. The correct way to check for missing values is "WHERE phone_number IS NULL".'
  },
  {
    id: 9,
    number: 9,
    difficulty: 'MEDIUM',
    topic: 'JOIN Predicate Placement',
    question: 'Consider: SELECT * FROM A LEFT JOIN B ON A.id = B.a_id WHERE B.status = \'active\'; If Table A has 100 rows and only 50 have matches in B, and only 20 of those have status = \'active\', how many rows are returned?',
    options: [
      { text: '100', value: 'A' },
      { text: '70', value: 'B' },
      { text: '50', value: 'C' },
      { text: '20', value: 'D' }
    ],
    correctAnswer: 'D',
    explanation: 'The LEFT JOIN itself would preserve all 100 rows from A. However, the WHERE clause runs AFTER the join and filters on B.status = \'active\'. Since NULL never equals \'active\', every unmatched row (NULL B.status) is excluded, and only the 20 rows where B.status genuinely equals \'active\' survive. Placing this condition in the WHERE clause effectively converts the LEFT JOIN into behaving like an INNER JOIN.'
  },
  {
    id: 10,
    number: 10,
    difficulty: 'MEDIUM',
    topic: 'Index Selectivity',
    question: 'You have a table "orders" with 1,000,000 rows. A frequently run query is: SELECT order_id FROM orders WHERE customer_id = 500 AND status = \'SHIPPED\'; Statistics show 50 customers have exactly 20,000 orders each, and \'SHIPPED\' appears in 80% of all rows. Which index strategy minimizes the I/O for this query?',
    options: [
      { text: 'Index on (status, customer_id)', value: 'A' },
      { text: 'Index on (customer_id, status)', value: 'B' },
      { text: 'Index on (status)', value: 'C' },
      { text: 'Index on (customer_id)', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'For a composite index, place the most selective (highest-cardinality) column first. customer_id narrows the search to roughly 20,000 rows (1/50 of the table), while status = \'SHIPPED\' matches 80% of the entire table and is nearly useless as a filter on its own. An index on (customer_id, status) lets the database jump directly to the small customer_id=500 slice, then quickly filter by status within that narrow range using the same index.'
  },
  {
    id: 11,
    number: 11,
    difficulty: 'MEDIUM',
    topic: 'Transactions',
    question: 'Transaction A reads a balance. Transaction B updates the balance and commits. Transaction A reads the balance again within the same transaction and sees the updated value. What is this anomaly called?',
    options: [
      { text: 'Dirty Read', value: 'A' },
      { text: 'Non-repeatable Read', value: 'B' },
      { text: 'Phantom Read', value: 'C' },
      { text: 'Lost Update', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'A Non-repeatable Read occurs when a transaction reads the same row twice and gets different values because another transaction modified and committed a change to that row in between the two reads. Isolation levels like REPEATABLE READ or SERIALIZABLE are designed specifically to prevent this anomaly.'
  },
  {
    id: 12,
    number: 12,
    difficulty: 'MEDIUM',
    topic: 'SQL Injection',
    question: 'Which of the following code snippets is vulnerable to SQL injection?',
    options: [
      { text: 'db.execute(\'SELECT * FROM users WHERE username = ?\', (username,))', value: 'A' },
      { text: 'db.execute(\'SELECT * FROM users WHERE username = \'%s\' % username)', value: 'B' },
      { text: 'db.execute(sql_template, params) where params is a tuple.', value: 'C' },
      { text: 'Using a prepared statement with positional placeholders.', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'String formatting/concatenation directly embeds user input into the raw SQL text before it\'s sent to the database. Parameterized queries and prepared statements (as in the other three options) send the SQL structure and the user-supplied values separately, so the database engine always treats the input as data — never as executable SQL.'
  },
  {
    id: 13,
    number: 13,
    difficulty: 'MEDIUM',
    topic: 'Database Design',
    question: 'You are designing a database for a library. A "Book" can have multiple "Authors". An "Author" can write multiple "Books". To achieve 3NF, how should you structure this?',
    options: [
      { text: 'Add an author_id column to the Book table.', value: 'A' },
      { text: 'Add a book_id column to the Author table.', value: 'B' },
      { text: 'Create a separate junction table "BookAuthors" with foreign keys to both.', value: 'C' },
      { text: 'Store a comma-separated list of author names in the Book table.', value: 'D' }
    ],
    correctAnswer: 'C',
    explanation: 'Book-to-Author is a many-to-many relationship. The correct normalized approach is a junction (bridge/associative) table with foreign keys referencing both parent tables. Storing a comma-separated list violates First Normal Form (1NF).'
  },
  {
    id: 14,
    number: 14,
    difficulty: 'MEDIUM',
    topic: 'Join Fan-Out',
    question: 'A query "SELECT SUM(o.amount) FROM Users u JOIN Orders o ON u.id = o.user_id WHERE u.region = \'North\';" results in inflated revenue figures because users have multiple addresses in an "Addresses" table joined inadvertently. Which is the best fix?',
    options: [
      { text: 'Use SELECT DISTINCT SUM(o.amount).', value: 'A' },
      { text: 'Use a subquery or CTE to aggregate Orders first, then join to Users.', value: 'B' },
      { text: 'Filter the join condition by the primary_address flag.', value: 'C' },
      { text: 'Use GROUP BY u.id and take the average.', value: 'D' }
    ],
    correctAnswer: 'B',
    explanation: 'The inflation happens because joining Users to an Addresses table multiplies each Orders row once per matching address row — a classic join fan-out. The robust fix is to aggregate Orders independently first (in a CTE or subquery, grouped by user_id) before joining to Users/Addresses, so the fan-out from the address join never touches the order amounts being summed.'
  }
]
