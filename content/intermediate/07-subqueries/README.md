# Subqueries

A subquery is a query inside another query. You use one when you need an answer from the database before you can ask your actual question. Like "products more expensive than average", first you need the average, then you can compare.

## in WHERE (single value)

```sql
SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

The inner query runs, gives back one number (2201.875), and then it's like you wrote `WHERE price > 2201.875`. The brackets are required.

This only works if the subquery returns exactly one value. If it returns more, error.

## in WHERE with IN (a list)

When the subquery gives back a column of values:

```sql
-- customers who placed at least one delivered order
SELECT first_name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'delivered');
```

## EXISTS

Same question, different way:

```sql
SELECT first_name
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id AND o.status = 'delivered'
);
```

EXISTS just checks "is there at least one row?", doesn't care what's in it, which is why people write `SELECT 1`. It stops looking as soon as it finds one match, so it's often fast.

## correlated subqueries

Notice in the EXISTS one, the inner query uses `c.customer_id` from the outer query. That makes it *correlated*, it conceptually runs once per outer row.

Another example, products priced above their own category's average:

```sql
SELECT product_name, category, price
FROM products p
WHERE price > (
  SELECT AVG(price) FROM products p2 WHERE p2.category = p.category
);
```

For each product, the inner query computes the average of just that product's category. Powerful, but on big tables running something per row can get slow. Modern databases are good at optimizing them though, so don't be scared of them.

## in SELECT (scalar subquery)

Adds a computed column:

```sql
SELECT
  first_name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS order_count
FROM customers c;
```

Must return one value per row. Same thing can usually be done with LEFT JOIN + GROUP BY, which is often faster.

## in FROM (derived table)

You can treat a query's result like a table:

```sql
SELECT AVG(order_count) AS avg_orders_per_customer
FROM (
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
) t;
```

Postgres needs that alias (`t`) at the end, it's mandatory.

This is how you do "aggregate of an aggregate", which you can't do directly (`AVG(COUNT(*))` errors).

## subquery or join?

Both often work. Roughly:

- want columns from the other table? → join
- just checking if something exists? → EXISTS / IN
- need a number to compare against? → scalar subquery
- query getting long and nested? → CTE (next topic)

## stuff that trips people up

- a scalar subquery returning more than one row, "more than one row returned by a subquery used as an expression".
- forgetting the alias on a derived table.
- `NOT IN` with a subquery that might return NULL, returns nothing. Use NOT EXISTS. (anti-joins topic)
- nesting 4 levels deep until nobody can read it.

## practice

Check [`queries.sql`](queries.sql).
