# Advanced Aggregation

You know COUNT, SUM and GROUP BY. This is the stuff on top, subtotals, pivots, conditional aggregates, stats, and putting things into arrays. Basically everything you need to build a proper report in one query.

## FILTER (conditional aggregates)

You saw the CASE trick. Postgres has a cleaner way:

```sql
SELECT
  customer_id,
  COUNT(*)                                       AS all_orders,
  COUNT(*)    FILTER (WHERE status = 'delivered') AS delivered,
  SUM(amount) FILTER (WHERE status = 'delivered') AS delivered_amount
FROM orders
GROUP BY customer_id;
```

Same as `SUM(CASE WHEN ... THEN amount END)`, just easier to read.

## pivoting

Rows into columns. Status as rows → status as columns:

```sql
SELECT
  DATE_TRUNC('month', order_date)::date AS month,
  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered,
  COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
  COUNT(*) FILTER (WHERE status = 'shipped')   AS shipped,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders
GROUP BY 1
ORDER BY 1;
```

You do have to know the values in advance. Sql doesn't do "make a column for every distinct value" by itself.

## ROLLUP (subtotals and grand total)

```sql
SELECT p.category, p.product_name, SUM(oi.quantity) AS units
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY ROLLUP (p.category, p.product_name)
ORDER BY p.category, p.product_name;
```

You get:
- a row per (category, product), the normal detail
- a row per category with product_name NULL, that's the category subtotal
- one row with both NULL, the grand total

Exactly what you'd build by hand in excel.

## CUBE

Like ROLLUP but every combination. `CUBE (a, b)` gives totals for (a, b), (a), (b), and (). Useful when you want to slice both ways, like totals by city and by status and by both.

## GROUPING SETS

You pick exactly which groupings you want:

```sql
SELECT c.city, o.status, COUNT(*)
FROM orders o JOIN customers c ON o.customer_id = c.customer_id
GROUP BY GROUPING SETS ((c.city), (o.status), ());
```

Totals per city, totals per status, and a grand total, stacked in one result.

## telling real NULLs from subtotal NULLs

A subtotal row has NULL in the grouped column, but what if the data itself had NULL (like Karan's city)? `GROUPING()` tells you:

```sql
SELECT
  CASE WHEN GROUPING(c.city) = 1 THEN 'ALL CITIES' ELSE COALESCE(c.city, 'unknown') END AS city,
  COUNT(*)
FROM customers c
GROUP BY ROLLUP (c.city);
```

GROUPING returns 1 for a subtotal row, 0 for a normal one.

## collecting into lists

```sql
SELECT customer_id,
  ARRAY_AGG(order_id ORDER BY order_date) AS order_ids,
  STRING_AGG(status, ', ')                AS statuses
FROM orders
GROUP BY customer_id;
```

Also `JSON_AGG` / `JSONB_AGG` to build json from rows, which apis love.

## stats

```sql
SELECT
  AVG(salary)                                          AS mean,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)  AS median,
  MODE() WITHIN GROUP (ORDER BY salary)                AS most_common,
  STDDEV(salary)                                       AS std_dev,
  VARIANCE(salary)                                     AS variance
FROM employees;
```

Median is way more honest than average when one value is huge. Vikram's 250000 drags the average to 113125, the median is 92500.

`PERCENTILE_CONT(0.9)` gives the 90th percentile, used a lot for things like response times.

## aggregates of aggregates

Can't nest them directly (`AVG(SUM(x))` errors). Either a subquery/CTE:

```sql
WITH per_customer AS (
  SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id
)
SELECT AVG(total) FROM per_customer;
```

Or a window over the grouped result:

```sql
SELECT customer_id, SUM(amount) AS total,
  ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 1) AS pct_of_revenue
FROM orders
GROUP BY customer_id;
```

`SUM(SUM(amount)) OVER ()` looks weird but it's "sum of the group sums across all groups". Very handy.

## stuff that trips people up

- ROLLUP NULLs getting mixed up with real NULLs, use GROUPING().
- AVG when median is the real question.
- trying to nest aggregates directly.
- pivoting with values you didn't know existed (they just don't show up).

## practice

Check [`queries.sql`](queries.sql).
