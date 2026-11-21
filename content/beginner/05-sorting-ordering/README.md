# Sorting with ORDER BY

Here's something people don't expect, without ORDER BY the database gives you rows in whatever order it feels like. It might look sorted today and come back different tomorrow. If order matters, say it.

## the shape

```sql
SELECT columns
FROM table
ORDER BY column ASC;   -- smallest first (default)
ORDER BY column DESC;  -- biggest first
```

ASC is the default so you can skip it.

```sql
SELECT product_name, price FROM products ORDER BY price;       -- cheapest first
SELECT product_name, price FROM products ORDER BY price DESC;  -- most expensive first
```

Text sorts alphabetically, dates sort oldest to newest.

## sorting by more than one column

Second column only kicks in when the first one ties.

```sql
SELECT name, department, salary
FROM employees
ORDER BY department, salary DESC;
```

So it groups by department alphabetically (Engineering, Management, Sales), and inside each department highest salary first. Each column gets its own ASC/DESC, `DESC` here only applies to salary, not department.

## sorting by an alias

Remember ORDER BY runs after SELECT, so here aliases do work.

```sql
SELECT product_name, price * 1.18 AS final_price
FROM products
ORDER BY final_price DESC;
```

## sorting by something you're not selecting

Totally allowed.

```sql
SELECT first_name FROM customers ORDER BY signup_date;
```

## sorting by column number

```sql
SELECT first_name, city FROM customers ORDER BY 2;  -- sorts by city
```

Works but don't do it in real code, someone adds a column at the start and suddenly you're sorting by something else.

## NULLs

Postgres puts NULLs last for ASC and first for DESC. Want it different?

```sql
SELECT first_name, city FROM customers ORDER BY city NULLS FIRST;
SELECT first_name, city FROM customers ORDER BY city DESC NULLS LAST;
```

## custom order

Say you want orders shown as pending, then shipped, then delivered, then cancelled. Alphabetical won't do that. Use CASE (there's a topic on it):

```sql
SELECT order_id, status
FROM orders
ORDER BY CASE status
  WHEN 'pending'   THEN 1
  WHEN 'shipped'   THEN 2
  WHEN 'delivered' THEN 3
  ELSE 4
END;
```

## stuff that trips people up

- assuming the table has a "natural" order. It doesn't.
- `ORDER BY department, salary DESC` and thinking DESC applies to both.
- sorting numbers stored as text, `'100'` comes before `'9'` because it compares character by character.

## practice

Check [`queries.sql`](queries.sql).
