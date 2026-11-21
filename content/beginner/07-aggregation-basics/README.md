# Aggregation Basics (COUNT, SUM, AVG, MIN, MAX)

Up till now every query gave back rows from the table. Aggregates squash a bunch of rows into one number. "How many orders?", "total revenue?", "average salary?", all of these are aggregates.

## the five you'll use 99% of the time

```sql
SELECT
  COUNT(*)    AS total_orders,
  SUM(amount) AS revenue,
  AVG(amount) AS avg_order,
  MIN(amount) AS smallest,
  MAX(amount) AS biggest
FROM orders;
```

One row comes back, 10 orders squashed into a summary.

## COUNT has three versions

```sql
SELECT COUNT(*)              FROM customers;  -- 8, every row
SELECT COUNT(city)           FROM customers;  -- 7, skips the NULL city
SELECT COUNT(DISTINCT city)  FROM customers;  -- 4, Delhi Mumbai Bangalore Chennai
```

Know the difference, interviewers love this.

## with WHERE

WHERE filters first, then the aggregate runs on what's left.

```sql
SELECT SUM(amount) AS delivered_revenue
FROM orders
WHERE status = 'delivered';
```

## GROUP BY (one number per group)

Ok this is the big one. Instead of one number for the whole table, you want one number per something, per city, per category, per month.

```sql
SELECT category, COUNT(*) AS products, AVG(price) AS avg_price
FROM products
GROUP BY category;
```

| category | products | avg_price |
|---|---|---|
| Electronics | 4 | 3899.00 |
| Stationery | 2 | 135.00 |
| Home | 2 | 874.50 |

Think of it like sql making little piles, one pile per category, and then running COUNT and AVG on each pile.

## the rule that'll save you errors

Every column in SELECT has to either be in GROUP BY or be inside an aggregate.

```sql
-- errors
SELECT category, product_name, COUNT(*)
FROM products
GROUP BY category;
```

Why? The Electronics pile has 4 products, which product_name should it show? Sql doesn't know, so it refuses. (mysql sometimes lets it slide and just picks one randomly, which is worse honestly.)

## grouping by more than one column

```sql
SELECT customer_id, status, COUNT(*) AS orders
FROM orders
GROUP BY customer_id, status
ORDER BY customer_id;
```

Now a pile is every unique (customer, status) combo.

## a little preview of HAVING

You can't filter on an aggregate in WHERE, because WHERE runs before grouping. HAVING is the WHERE for groups:

```sql
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2;
```

Full topic on this in intermediate.

## rounding

AVG often gives ugly decimals like 2308.2000000000000000. Wrap it:

```sql
SELECT ROUND(AVG(amount), 2) FROM orders;
```

## stuff that trips people up

- selecting a column that's not in GROUP BY and not aggregated.
- using WHERE for aggregate conditions instead of HAVING.
- SUM on an empty result gives NULL not 0, use `COALESCE(SUM(x), 0)`.
- integer division in AVG on some databases, postgres handles it fine but sqlite/sql server might not.

## practice

Check [`queries.sql`](queries.sql).
