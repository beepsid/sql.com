# GROUP BY & HAVING

You saw GROUP BY in the aggregation basics. This goes deeper, especially HAVING, and the difference between WHERE and HAVING which comes up in like every interview.

## quick recap of GROUP BY

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS spent
FROM orders
GROUP BY customer_id;
```

One output row per customer_id. Every column you select is either in GROUP BY or inside an aggregate.

## HAVING = WHERE but for groups

"Customers who placed 2 or more orders". You can't write `WHERE COUNT(*) >= 2` because WHERE runs on single rows before any grouping happens. The count doesn't exist yet.

```sql
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2;
```

## WHERE vs HAVING, side by side

```sql
SELECT customer_id, SUM(amount) AS spent
FROM orders
WHERE status = 'delivered'        -- 1. throw out non-delivered rows
GROUP BY customer_id              -- 2. make piles per customer
HAVING SUM(amount) > 2000;        -- 3. throw out piles with small totals
```

- WHERE filters **rows**, before grouping
- HAVING filters **groups**, after grouping

Rule of thumb, if the condition has an aggregate in it (COUNT, SUM...), HAVING. Otherwise WHERE. You *can* put normal conditions in HAVING but it's slower because it groups everything first and filters after.

## the full order again

```
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
```

That's why in postgres you can't use a SELECT alias in HAVING either (mysql lets you, postgres doesn't), just repeat the expression.

## grouping by expressions

You don't have to group by a plain column.

```sql
-- orders per month
SELECT DATE_TRUNC('month', order_date) AS month, COUNT(*), SUM(amount)
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;
```

```sql
-- customers by first letter
SELECT LEFT(first_name, 1) AS letter, COUNT(*)
FROM customers
GROUP BY LEFT(first_name, 1);
```

## grouping after a join

Most real group bys are after a join.

```sql
SELECT p.category, SUM(oi.quantity) AS units, SUM(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category
HAVING SUM(oi.quantity) >= 4
ORDER BY revenue DESC;
```

## finding duplicates

GROUP BY + HAVING is the standard way to find duplicate values:

```sql
SELECT city, COUNT(*)
FROM customers
GROUP BY city
HAVING COUNT(*) > 1;
```

Swap city for email in a real users table and you've found duplicate signups.

## stuff that trips people up

- aggregates in WHERE, always an error.
- selecting columns not in GROUP BY.
- using an alias in HAVING (works in mysql, fails in postgres).
- `GROUP BY name` when two people can share a name, group by the id.

## practice

Check [`queries.sql`](queries.sql).
