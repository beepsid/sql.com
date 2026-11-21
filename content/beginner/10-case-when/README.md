# CASE WHEN (If/Else in SQL)

CASE is how you write if/else logic inside a query. You'll use it for labels, buckets, custom sorting, and later for really useful stuff like conditional counting.

## the shape

```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE fallback
END
```

It goes top to bottom and stops at the first WHEN that's true. If nothing matches and there's no ELSE, you get NULL.

## labelling stuff

```sql
SELECT
  product_name,
  price,
  CASE
    WHEN price >= 3000 THEN 'expensive'
    WHEN price >= 500  THEN 'mid'
    ELSE 'cheap'
  END AS price_band
FROM products;
```

Order matters here. If you put `price >= 500` first, the monitor (10999) would be "mid" because that check passes first and it stops.

## the short version

When you're just comparing one column to fixed values:

```sql
SELECT order_id,
  CASE status
    WHEN 'delivered' THEN 'done'
    WHEN 'cancelled' THEN 'done'
    ELSE 'in progress'
  END AS stage
FROM orders;
```

## conditional counting (this is the good stuff)

Say you want, per customer, how many orders were delivered and how many weren't, in one row. CASE inside an aggregate:

```sql
SELECT
  customer_id,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
  SUM(CASE WHEN status <> 'delivered' THEN 1 ELSE 0 END) AS not_delivered
FROM orders
GROUP BY customer_id;
```

This "pivot" trick shows up in a lot of interview questions. Postgres also has a cleaner way:

```sql
COUNT(*) FILTER (WHERE status = 'delivered')
```

Same result, but FILTER is postgres only, CASE works everywhere.

## in ORDER BY

```sql
SELECT order_id, status
FROM orders
ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, order_date;
```

Pending ones on top, rest after.

## in WHERE (usually don't)

You can, but there's almost always a simpler way with AND/OR. If you find yourself writing CASE in WHERE, step back and rethink.

## stuff that trips people up

- forgetting END. Every CASE needs one.
- wrong order of WHENs, broader condition first swallows everything.
- no ELSE, then the unmatched rows silently become NULL.
- mixing types, `THEN 'high' ELSE 0` errors because one's text and one's a number.

## practice

Check [`queries.sql`](queries.sql).
