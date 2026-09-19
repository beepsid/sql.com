# SQL Learning Website

A browser-based SQL learning platform that teaches SQL properly—from basics through tricky real-world stuff (NULL handling, JOIN traps, query performance, SQL injection, etc.).

## Current Status

**Working MVP:** Basic SQL playground with in-browser query execution.

- ✅ Live query editor with SQL syntax highlighting
- ✅ In-memory database with sample data (users, orders, discounts tables)
- ✅ Query execution (SELECT, WHERE, ORDER BY, LIMIT)
- ✅ Results displayed in a formatted table
- ✅ Clean, modern UI
- ⏳ Next: Add grading/feedback system for exercises

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Architecture

- **Frontend:** React + Vite + CodeMirror for SQL editing
- **Database:** Simple in-memory SQL engine (SQLite-like)—no server needed
- **Progress:** Stored in browser localStorage (no accounts required yet)
- **Deployment:** Static site ready for Vercel/Netlify

## What's Built

### SQL Query Engine
- `useDuckDB.js` - In-memory database with support for:
  - `CREATE TABLE` - Define tables with columns
  - `INSERT INTO` - Insert sample data
  - `SELECT` - Query with column selection
  - `WHERE` - Filtering with basic conditions (=, <>, <, >, <=, >=, AND, OR)
  - `ORDER BY` - Sort results (ASC/DESC)
  - `LIMIT` - Restrict result rows

### UI Components
- Query editor with CodeMirror syntax highlighting
- Results table with NULL value indicators
- Error handling and user feedback
- Responsive design

## Next Steps

1. **Grading System** - Compare learner results to correct answers
2. **Lesson Templates** - Structure for teaching concepts
3. **More SQL Features** - JOINs, aggregates, subqueries, window functions
4. **Progress Tracking** - localStorage-based lesson completion
5. **Content** - Actual learning lessons with explanations and practice problems
