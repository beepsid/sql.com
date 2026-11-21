# INNER JOIN

Real data is split across tables. Orders don't store the customer's name, they store a customer_id, and the name lives in customers. JOIN is how you stitch them back together.

## why the data is split in the first place

If every order row stored the full customer name, email, city... and then the customer changes their email, you'd have to update it in 50 places. So instead you store it once and point to it with an id. That's called a foreign key, `orders.customer_id` points to `customers.customer_id`.

## the shape

```sql
SELECT o.order_id, o.amount, c.first_name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
```

- `orders o` gives the table a short name (alias) so you don't type `orders.` everywhere
- `ON` says how the rows match up
- `INNER` is optional, plain `JOIN` means the same thing

## what INNER actually means

Only rows that have a match on both sides come back.

Customers 5 (Karan) and 7 (Arjun) have never ordered, so they're not in the result. If there was an order with a customer_id that didn't exist in customers, it'd be dropped too.

Picture two circles overlapping, INNER JOIN is just the overlap.

## joining more than two tables

Which products were in which order, and who bought them?

```sql
SELECT
  o.order_id,
  c.first_name,
  p.product_name,
  oi.quantity
FROM orders o
JOIN customers   c  ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id    = oi.order_id
JOIN products    p  ON oi.product_id = p.product_id
ORDER BY o.order_id;
```

Just keep chaining. Each JOIN adds one table and says how it connects to what you already have.

## heads up: the row count can change

orders has 10 rows. After joining order_items you get 14, because some orders have 2 items. That's normal, one row per item now. But it matters a lot when you SUM afterwards, if you sum `o.amount` here you'd count order 101 twice. More on this in the join fan-out topic.

## joins + group by

Total spent per customer, with their name:

```sql
SELECT c.first_name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name
ORDER BY total_spent DESC;
```

Group by the id too, not just the name. Two customers can have the same name.

## always prefix columns

When two tables both have `customer_id`, writing just `customer_id` errors with "ambiguous column". Get into the habit of writing `c.customer_id` or `o.customer_id` always, even when it's not ambiguous. Makes queries way easier to read.

## the old comma style

You'll see this in older code:

```sql
SELECT * FROM orders o, customers c WHERE o.customer_id = c.customer_id;
```

Same result as INNER JOIN, but if you forget the WHERE you get every order paired with every customer (80 rows of garbage). Stick with JOIN ... ON.

## stuff that trips people up

- ambiguous column errors because of no prefix.
- joining on the wrong columns, like `o.order_id = c.customer_id`. It runs, gives nonsense.
- forgetting INNER JOIN drops unmatched rows, so customers with no orders vanish.
- summing after a join that multiplied rows.

## practice

Check [`queries.sql`](queries.sql).
