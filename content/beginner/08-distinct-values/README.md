# DISTINCT

DISTINCT removes duplicate rows from your result. Simple idea, but people misuse it a lot so let's go through it properly.

## the basic use

```sql
SELECT city FROM customers;
-- Delhi, Mumbai, Delhi, Bangalore, NULL, Mumbai, Chennai, Delhi

SELECT DISTINCT city FROM customers;
-- Delhi, Mumbai, Bangalore, NULL, Chennai
```

Notice NULL shows up once. For DISTINCT, all NULLs count as the same thing (which is funny because `NULL = NULL` isn't true, but yeah sql is like that).

## DISTINCT works on the whole row, not one column

This confuses everyone at least once.

```sql
SELECT DISTINCT customer_id, status FROM orders;
```

This doesn't give unique customer_ids. It gives unique (customer_id, status) pairs. Customer 1 has delivered and pending orders, so customer 1 shows up twice.

DISTINCT always applies to everything after it, you can't do `SELECT DISTINCT(customer_id), status` and expect it to only apply to customer_id. The brackets do nothing there.

## COUNT DISTINCT

Super common:

```sql
-- how many different customers have ordered?
SELECT COUNT(DISTINCT customer_id) FROM orders;  -- 6
```

vs `COUNT(customer_id)` which would be 10 because customer 1 ordered 3 times.

## DISTINCT vs GROUP BY

These two give the same result:

```sql
SELECT DISTINCT category FROM products;
SELECT category FROM products GROUP BY category;
```

Use DISTINCT when you just want unique values. Use GROUP BY when you also want to count or sum something per value.

## DISTINCT ON (postgres only, but really useful)

"give me one row per customer, their latest order":

```sql
SELECT DISTINCT ON (customer_id) customer_id, order_id, order_date
FROM orders
ORDER BY customer_id, order_date DESC;
```

It keeps the first row for each customer_id based on the ORDER BY. In other databases you'd do this with ROW_NUMBER() (window functions topic).

## when DISTINCT is a red flag

If you join some tables and suddenly see duplicates, slapping DISTINCT on top "fixes" it but usually you're hiding a bad join. Find out why the rows are duplicating first. There's a whole topic on this called join fan-out.

Also DISTINCT has to sort or hash the whole result, so on big data it's not free.

## stuff that trips people up

- thinking DISTINCT applies to just the first column.
- using DISTINCT to cover up a broken join.
- `COUNT(DISTINCT a, b)` doesn't work in postgres, do `COUNT(DISTINCT (a, b))` or a subquery.

## practice

Check [`queries.sql`](queries.sql).
