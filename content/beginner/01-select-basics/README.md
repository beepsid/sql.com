# SELECT & Basic Queries

Ok so this is where everything starts. Every query you'll ever write has a SELECT in it somewhere, it's basically you telling the database "hey, give me these columns from this table".

> All examples use the tables from the [sample data](../../sample-data.sql). Hit **run** under any of them to try it right here.

## The basic shape

```sql
SELECT column1, column2
FROM table_name;
```

That's it. SELECT tells the database what you want, FROM tells it where it lives. The semicolon at the end just means "query over".

## Want to get everything?

```sql
SELECT * FROM customers;
```

`*` means all columns. It's fine when you're just poking around a table to see what's inside, but never ever use it in real code (unless required). Because, let's suppose someone adds 20 columns to that table and then tomorrow your query suddenly pulls all of them, your query becomes slower and output messier.

## So how do we get what we need?

```sql
SELECT first_name, email
FROM customers;
```

| first_name | email |
|---|---|
| Aman | aman@mail.com |
| Priya | priya@mail.com |
| ... | ... |

The order you write the columns in is the order you get them back, so `SELECT email, first_name` flips them.

## renaming columns (aliases)

```sql
SELECT
  first_name AS name,
  email      AS contact
FROM customers;
```

`AS` just changes the name in the output, the actual table doesn't change. You'll use this a lot once you start doing calculations because otherwise the column comes out named something ugly like `?column?`.

If your alias has a space in it, wrap it in double quotes like `AS "full name"`. Honestly just use underscores, saves headache.

## calculated columns

You're not stuck with what's in the table, you can do math or join text right inside SELECT.

```sql
SELECT
  product_name,
  price,
  price * 0.18 AS gst,
  price * 1.18 AS price_with_gst
FROM products;
```

```sql
SELECT first_name || ' ' || last_name AS full_name
FROM customers;
```

`||` sticks strings together in postgres. In mysql you'd use `CONCAT(first_name, ' ', last_name)`, which also works in postgres btw.

## SELECT without a table

Kinda random but useful for quick testing.

```sql
SELECT 2 + 2;
SELECT NOW();
```

## the order sql actually runs things in

This one's important and nobody tells you early. You *write* SELECT first but the database *runs* FROM first.

```
FROM  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT  ->  ORDER BY  ->  LIMIT
```

That's why you can't use an alias you made in SELECT inside WHERE, WHERE already ran before the alias existed. Keep this in mind, it'll explain like half the errors you hit later.

## stuff that trips people up

- forgetting the comma between columns, `SELECT first_name email` doesn't error, it renames first_name to email. Fun one to debug.
- putting a comma after the last column, `SELECT first_name, email, FROM ...` errors out.
- using `SELECT *` everywhere out of habit.
- single quotes are for text values (`'Delhi'`), double quotes are for names (`"full name"`). Mixing them up gives weird errors.

## practice

Questions with answers are in [`queries.sql`](queries.sql). Try them before peeking.
