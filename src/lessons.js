// Lesson content and expected answers
export const lessons = [
  {
    id: 1,
    title: "SELECT the Right Columns",
    difficulty: "Beginner",
    description: "Master the basics: fetching specific columns from a table.",

    prompt: "Get the name and email of all users. Don't include the signup_date.",

    hint: "Use SELECT with specific column names instead of *",

    expectedQuery: "SELECT name, email FROM users;",

    expectedResult: [
      { name: "Alice Johnson", email: "alice@example.com" },
    ],

    explanation: `
Great! You've selected the right columns. Here's why this matters:

**Why not SELECT *?**
- Selecting specific columns is faster (less data to transfer)
- Makes your query's intent clear to other developers
- Prevents accidental exposure of sensitive columns you don't need
- Makes refactoring easier if table structure changes

**What you did right:**
You used SELECT with column names separated by commas, which is the standard way to fetch specific data.
    `,

    wrongExplanations: {
      allColumns: `You selected all columns with SELECT *. While this works for now, in real-world code you should always select only the columns you need. This is a good habit to build!`,
      missingColumns: `You're missing some columns. Check the prompt again — we need both name AND email.`,
    }
  },

  {
    id: 2,
    title: "Filter with WHERE",
    difficulty: "Beginner",
    description: "Use WHERE to find specific rows that match a condition.",

    prompt: "Find the email address of the user named 'Alice Johnson'.",

    hint: "Use WHERE with a condition to filter rows.",

    expectedQuery: "SELECT email FROM users WHERE name = 'Alice Johnson';",

    expectedResult: [
      { email: "alice@example.com" },
    ],

    explanation: `
Perfect! You've filtered the data correctly. Here's what's happening:

**The WHERE clause:**
- Runs AFTER the SELECT, filtering which rows are returned
- Uses conditions like = (equals), > (greater than), < (less than), etc.
- String comparisons need quotes: 'Alice Johnson' not Alice Johnson

**Why this matters:**
In real databases, tables can have millions of rows. WHERE lets you fetch only what you need, making queries fast and efficient.
    `,

    wrongExplanations: {
      wrongFilter: `Your condition doesn't match 'Alice Johnson'. Check the exact spelling and make sure you're using = for equality.`,
      noWhere: `You selected the column but didn't filter for Alice. Add a WHERE clause with the right condition.`,
      stringQuotes: `Don't forget quotes around the name! Use WHERE name = 'Alice Johnson' with quotes.`,
    }
  },

  {
    id: 3,
    title: "Understanding NULL",
    difficulty: "Intermediate",
    description: "Learn why NULL is tricky and how to handle it correctly.",

    prompt: "Find all orders that have no amount specified (NULL values). Return the order id and user_id.",

    hint: "Use IS NULL, not = NULL. (= NULL doesn't work because NULL means 'unknown'.)",

    expectedQuery: "SELECT id, user_id FROM orders WHERE amount IS NULL;",

    expectedResult: [
      { id: 7, user_id: 5 },
    ],

    explanation: `
Excellent! You found the NULL value correctly. This is one of the trickiest concepts in SQL:

**Why IS NULL?**
NULL means "unknown" or "missing", not zero or empty string.
- amount = NULL doesn't work (can't compare unknown to anything)
- amount IS NULL is the correct syntax
- This trips up even experienced developers!

**Why this matters:**
In real systems, missing data is common. Orders might not have an amount yet, customers might not have a phone number, etc. You MUST use IS NULL to find these rows.

**Real-world example:**
Imagine finding all unpaid invoices. You'd do WHERE payment_date IS NULL to find invoices where payment hasn't been recorded yet.
    `,

    wrongExplanations: {
      nullEquals: `You tried amount = NULL, which doesn't work in SQL. NULL means 'unknown', so you can't compare it with =. Use IS NULL instead!`,
      missingNullCheck: `You didn't filter for NULL values. Remember, NULL is a special case and requires IS NULL syntax.`,
    }
  }
];

export const initialLesson = lessons[0];
