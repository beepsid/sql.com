export const sqlTopics = [
  // BEGINNER TOPICS
  {
    id: 1,
    title: 'SELECT & Basic Queries',
    difficulty: 'Beginner',
    icon: '🔍',
    description: 'Learn how to retrieve data from tables and master the fundamentals of SQL querying',
    subtopics: [
      'SELECT statement syntax',
      'Retrieving specific columns',
      'Using aliases for columns',
      'Wildcards in column selection',
      'Data type handling in results'
    ],
    lessons: 3
  },
  {
    id: 2,
    title: 'WHERE & Filtering',
    difficulty: 'Beginner',
    icon: '🔎',
    description: 'Master data filtering techniques and conditional logic in SQL',
    subtopics: [
      'WHERE clause fundamentals',
      'Comparison operators',
      'Pattern matching with LIKE',
      'IN & BETWEEN operators',
      'Filtering best practices'
    ],
    lessons: 3
  },
  {
    id: 3,
    title: 'Logical Operators (AND/OR)',
    difficulty: 'Beginner',
    icon: '⚙️',
    description: 'Understand operator precedence and how to combine multiple conditions',
    subtopics: [
      'AND vs OR evaluation',
      'Operator precedence rules',
      'Parentheses for clarity',
      'Complex boolean expressions',
      'Common mistakes with precedence'
    ],
    lessons: 2
  },
  {
    id: 4,
    title: 'NULL Handling',
    difficulty: 'Beginner',
    icon: '❓',
    description: 'Learn how NULL values work and how to handle missing data correctly',
    subtopics: [
      'What is NULL?',
      'IS NULL vs = NULL',
      'IS NOT NULL operator',
      'COALESCE function',
      'NULL in WHERE clauses'
    ],
    lessons: 2
  },
  {
    id: 5,
    title: 'Sorting & Ordering',
    difficulty: 'Beginner',
    icon: '↕️',
    description: 'Control result set ordering with ORDER BY',
    subtopics: [
      'ORDER BY basics',
      'Ascending vs Descending',
      'Multi-column sorting',
      'Sorting by position',
      'NULL handling in ORDER BY'
    ],
    lessons: 2
  },
  {
    id: 6,
    title: 'LIMIT & OFFSET',
    difficulty: 'Beginner',
    icon: '📄',
    description: 'Retrieve specific subsets of results for pagination and sampling',
    subtopics: [
      'LIMIT clause syntax',
      'OFFSET for pagination',
      'FETCH clause (SQL:2008)',
      'Top-N queries',
      'Pagination patterns'
    ],
    lessons: 2
  },
  {
    id: 7,
    title: 'COUNT & Aggregation Basics',
    difficulty: 'Beginner',
    icon: '📊',
    description: 'Understand how aggregation functions work and COUNT behaviors',
    subtopics: [
      'COUNT(*) vs COUNT(column)',
      'NULL handling in COUNT',
      'SUM, AVG, MIN, MAX functions',
      'Aggregate function basics',
      'Selecting with aggregates'
    ],
    lessons: 3
  },
  {
    id: 8,
    title: 'DISTINCT Values',
    difficulty: 'Beginner',
    icon: '✨',
    description: 'Remove duplicates and find unique values in your data',
    subtopics: [
      'DISTINCT keyword usage',
      'Multiple column DISTINCT',
      'Performance considerations',
      'DISTINCT vs GROUP BY',
      'Finding unique combinations'
    ],
    lessons: 2
  },

  // INTERMEDIATE TOPICS
  {
    id: 9,
    title: 'INNER JOIN',
    difficulty: 'Intermediate',
    icon: '🔗',
    description: 'Master the most common join type and combining tables based on conditions',
    subtopics: [
      'INNER JOIN syntax',
      'Join conditions',
      'Equi-joins',
      'Multi-table joins',
      'Join performance tips'
    ],
    lessons: 3
  },
  {
    id: 10,
    title: 'LEFT & RIGHT OUTER JOINS',
    difficulty: 'Intermediate',
    icon: '↔️',
    description: 'Preserve unmatched rows and handle missing data in joins',
    subtopics: [
      'LEFT JOIN fundamentals',
      'RIGHT JOIN',
      'FULL OUTER JOIN',
      'Preserving all rows',
      'NULL in join results'
    ],
    lessons: 3
  },
  {
    id: 11,
    title: 'Self-Joins & Complex Joins',
    difficulty: 'Intermediate',
    icon: '🔄',
    description: 'Learn to join a table to itself and advanced join patterns',
    subtopics: [
      'Self-join use cases',
      'Hierarchical data',
      'Comparing rows in same table',
      'Manager-employee relationships',
      'Table aliasing'
    ],
    lessons: 2
  },
  {
    id: 12,
    title: 'JOIN Predicate Placement',
    difficulty: 'Intermediate',
    icon: '⚡',
    description: 'Understand ON vs WHERE clauses and how they affect results',
    subtopics: [
      'ON clause purpose',
      'WHERE clause filtering',
      'Impact on outer joins',
      'Predicate evaluation order',
      'Common pitfalls'
    ],
    lessons: 2
  },
  {
    id: 13,
    title: 'GROUP BY & HAVING',
    difficulty: 'Intermediate',
    icon: '📦',
    description: 'Aggregate data into groups and filter on aggregate results',
    subtopics: [
      'GROUP BY syntax',
      'HAVING clause',
      'Multiple grouping columns',
      'Aggregate functions with GROUP BY',
      'HAVING vs WHERE'
    ],
    lessons: 3
  },
  {
    id: 14,
    title: 'UNION & Set Operations',
    difficulty: 'Intermediate',
    icon: '∪',
    description: 'Combine results from multiple queries',
    subtopics: [
      'UNION vs UNION ALL',
      'Column matching requirements',
      'Set operations',
      'Performance considerations',
      'EXCEPT & INTERSECT'
    ],
    lessons: 2
  },
  {
    id: 15,
    title: 'Subqueries',
    difficulty: 'Intermediate',
    icon: '🎁',
    description: 'Write queries within queries for complex data analysis',
    subtopics: [
      'Scalar subqueries',
      'Subqueries in WHERE',
      'Subqueries in FROM',
      'Correlated subqueries',
      'Subquery performance'
    ],
    lessons: 3
  },
  {
    id: 16,
    title: 'CTEs (WITH Clause)',
    difficulty: 'Intermediate',
    icon: '📋',
    description: 'Write readable recursive and hierarchical queries using CTEs',
    subtopics: [
      'CTE syntax',
      'Multiple CTEs',
      'Recursive CTEs',
      'CTE scope and nesting',
      'Performance benefits'
    ],
    lessons: 3
  },
  {
    id: 17,
    title: 'String Functions',
    difficulty: 'Intermediate',
    icon: '🔤',
    description: 'Manipulate text data with SQL functions',
    subtopics: [
      'SUBSTRING & SUBSTR',
      'UPPER, LOWER, TRIM',
      'CONCAT & string operators',
      'LIKE pattern matching',
      'Regular expressions'
    ],
    lessons: 2
  },
  {
    id: 18,
    title: 'Date & Time Functions',
    difficulty: 'Intermediate',
    icon: '📅',
    description: 'Work with dates, times, and intervals',
    subtopics: [
      'Date arithmetic',
      'DATEADD, DATEDIFF',
      'EXTRACT functions',
      'Date formatting',
      'Timezone handling'
    ],
    lessons: 2
  },
  {
    id: 19,
    title: 'JOIN Fan-Out Problems',
    difficulty: 'Intermediate',
    icon: '⚠️',
    description: 'Identify and fix row multiplication issues in complex joins',
    subtopics: [
      'Cartesian product problems',
      'One-to-many join multipliers',
      'Detecting fan-out',
      'Pre-aggregation solutions',
      'DISTINCT in aggregates'
    ],
    lessons: 2
  },
  {
    id: 20,
    title: 'Anti-Joins & NOT EXISTS',
    difficulty: 'Intermediate',
    icon: '🚫',
    description: 'Find records that DON\'T match criteria',
    subtopics: [
      'NOT EXISTS pattern',
      'LEFT JOIN with IS NULL',
      'NOT IN considerations',
      'Anti-join performance',
      'NULL handling in anti-joins'
    ],
    lessons: 2
  },

  // ADVANCED TOPICS
  {
    id: 21,
    title: 'Window Functions',
    difficulty: 'Advanced',
    icon: '📈',
    description: 'Perform calculations across ordered sets without grouping',
    subtopics: [
      'OVER clause and partitioning',
      'ROW_NUMBER, RANK, DENSE_RANK',
      'LAG, LEAD functions',
      'Running aggregates',
      'Frame specifications'
    ],
    lessons: 4
  },
  {
    id: 22,
    title: 'Indexing Strategies',
    difficulty: 'Advanced',
    icon: '⚙️',
    description: 'Design indexes for query performance',
    subtopics: [
      'B-tree index fundamentals',
      'Composite indexes',
      'Index selectivity',
      'Leading column selection',
      'Index maintenance tradeoffs'
    ],
    lessons: 3
  },
  {
    id: 23,
    title: 'Query Optimization',
    difficulty: 'Advanced',
    icon: '⚡',
    description: 'Write efficient queries and understand execution plans',
    subtopics: [
      'Execution plans',
      'Query cost analysis',
      'Index usage',
      'Join order optimization',
      'Statistics and cardinality'
    ],
    lessons: 4
  },
  {
    id: 24,
    title: 'Expression-Based Indexes',
    difficulty: 'Advanced',
    icon: '🔍',
    description: 'Create indexes on computed columns and function results',
    subtopics: [
      'Function-based indexes',
      'UPPER/LOWER indexes',
      'Date truncation indexes',
      'Computed column indexes',
      'When to use expression indexes'
    ],
    lessons: 2
  },
  {
    id: 25,
    title: 'Non-Equi JOINs',
    difficulty: 'Advanced',
    icon: '≠',
    description: 'Join tables using range conditions and non-equality operators',
    subtopics: [
      'Greater than/less than joins',
      'BETWEEN joins',
      'Date range joins',
      'Range overlap detection',
      'Performance considerations'
    ],
    lessons: 2
  },
  {
    id: 26,
    title: 'Database Design & Normalization',
    difficulty: 'Advanced',
    icon: '🏗️',
    description: 'Structure databases efficiently following normal forms',
    subtopics: [
      '1NF, 2NF, 3NF concepts',
      'Denormalization tradeoffs',
      'Star schemas',
      'Surrogate vs natural keys',
      'Schema design patterns'
    ],
    lessons: 3
  },
  {
    id: 27,
    title: 'Transactions & ACID',
    difficulty: 'Advanced',
    icon: '💾',
    description: 'Ensure data consistency and integrity',
    subtopics: [
      'Atomicity & Consistency',
      'Isolation levels',
      'Dirty reads, non-repeatable reads',
      'Phantom reads',
      'Locking mechanisms'
    ],
    lessons: 3
  },
  {
    id: 28,
    title: 'SQL Injection & Security',
    difficulty: 'Advanced',
    icon: '🔐',
    description: 'Write secure SQL and prevent injection attacks',
    subtopics: [
      'SQL injection vulnerabilities',
      'Parameterized queries',
      'Prepared statements',
      'Input validation',
      'Access control strategies'
    ],
    lessons: 2
  },
  {
    id: 29,
    title: 'Recursive CTEs',
    difficulty: 'Advanced',
    icon: '🔁',
    description: 'Traverse hierarchical data with recursive queries',
    subtopics: [
      'Anchor member',
      'Recursive member',
      'Base case vs recursive case',
      'Tree traversal',
      'Cycle detection'
    ],
    lessons: 3
  },
  {
    id: 30,
    title: 'Advanced Aggregation',
    difficulty: 'Advanced',
    icon: '🎯',
    description: 'Complex aggregations and statistical analysis',
    subtopics: [
      'FILTER clause',
      'WITHIN GROUP clause',
      'Array aggregation',
      'Conditional aggregation',
      'Statistical functions'
    ],
    lessons: 2
  },
  {
    id: 31,
    title: 'JSON & Semi-Structured Data',
    difficulty: 'Advanced',
    icon: '{}',
    description: 'Query and manipulate JSON data in SQL',
    subtopics: [
      'JSON path expressions',
      'JSON operators',
      'JSON to relational mapping',
      'JSON generation',
      'JSONB performance'
    ],
    lessons: 2
  },
  {
    id: 32,
    title: 'Common Table Expressions Patterns',
    difficulty: 'Advanced',
    icon: '📊',
    description: 'Master advanced CTE patterns and techniques',
    subtopics: [
      'Multiple CTEs',
      'CTE chaining',
      'Recursive + non-recursive',
      'CTE materialization',
      'Complex hierarchies'
    ],
    lessons: 2
  }
]
