# Real World Patterns

This is where everything comes together. These are the problems that keep showing up in actual jobs and interviews, and each one is a combo of CTEs, window functions and joins you've already seen. Once you know these shapes, most "hard" sql questions are just one of them in disguise.

## 1. top N per group

"Top 2 earners in each department", "latest order per customer", "best selling product per category".

```sql
WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, department, salary FROM ranked WHERE rn <= 2;
```

ROW_NUMBER for exactly N, DENSE_RANK if ties should all be included.

## 2. deduplication

Duplicate rows got in, keep one per email, the newest:

```sql
WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY signup_date DESC) AS rn
  FROM customers
)
SELECT * FROM ranked WHERE rn = 1;
```

To actually delete the extras:

```sql
DELETE FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM (
    SELECT customer_id,
      ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY signup_date DESC) AS rn
    FROM customers
  ) t
  WHERE rn > 1
);
```

## 3. running totals & cumulative %

```sql
WITH daily AS (
  SELECT order_date, SUM(amount) AS revenue
  FROM orders
  GROUP BY order_date
)
SELECT order_date, revenue,
  SUM(revenue) OVER (ORDER BY order_date) AS running_total,
  ROUND(100.0 * SUM(revenue) OVER (ORDER BY order_date) / SUM(revenue) OVER (), 1) AS cumulative_pct
FROM daily;
```

## 4. period over period (growth)

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date)::date AS month, SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS last_month,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
        / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS growth_pct
FROM monthly;
```

NULLIF so a zero month doesn't blow up the division.

## 5. first / last event per user

```sql
SELECT DISTINCT
  customer_id,
  FIRST_VALUE(order_date) OVER w AS first_order,
  LAST_VALUE(order_date)  OVER w AS last_order,
  COUNT(*) OVER (PARTITION BY customer_id) AS orders
FROM orders
WINDOW w AS (PARTITION BY customer_id ORDER BY order_date
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING);
```

(or just MIN / MAX with GROUP BY, honestly simpler for this one. Use the window version when you need other columns from that first row.)

## 6. gaps and islands

Find streaks, like consecutive days a user was active. The trick: for consecutive dates, `date - row_number` gives the same value, so you can group by it.

```sql
WITH activity AS (
  SELECT * FROM (VALUES
    (1, DATE '2024-03-01'), (1, '2024-03-02'), (1, '2024-03-03'),
    (1, '2024-03-07'), (1, '2024-03-08'),
    (2, '2024-03-05')
  ) AS t(user_id, day)
),
grp AS (
  SELECT user_id, day,
    day - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day))::int AS island
  FROM activity
)
SELECT user_id, MIN(day) AS streak_start, MAX(day) AS streak_end, COUNT(*) AS days
FROM grp
GROUP BY user_id, island
ORDER BY user_id, streak_start;
```

User 1 gets two streaks, 3 days and 2 days. Looks like magic the first time, write out the row numbers by hand once and it'll click.

## 7. retention / cohorts

Which month did each customer start in, and did they come back later?

```sql
WITH first_order AS (
  SELECT customer_id, DATE_TRUNC('month', MIN(order_date))::date AS cohort
  FROM orders
  GROUP BY customer_id
),
activity AS (
  SELECT DISTINCT o.customer_id, f.cohort,
    DATE_TRUNC('month', o.order_date)::date AS active_month
  FROM orders o JOIN first_order f ON o.customer_id = f.customer_id
)
SELECT cohort,
  (EXTRACT(YEAR FROM AGE(active_month, cohort)) * 12 + EXTRACT(MONTH FROM AGE(active_month, cohort)))::int AS months_later,
  COUNT(*) AS customers
FROM activity
GROUP BY 1, 2
ORDER BY 1, 2;
```

## 8. funnel

How many people made it through each step:

```sql
SELECT
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'page_view')   AS viewed,
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'add_to_cart') AS added,
  COUNT(DISTINCT customer_id) FILTER (WHERE payload ->> 'type' = 'purchase')    AS bought
FROM events;
```

## 9. filling missing dates

Reports with gaps look wrong. Generate the full calendar and LEFT JOIN onto it:

```sql
SELECT d::date AS day, COUNT(o.order_id) AS orders
FROM generate_series(DATE '2024-03-01', DATE '2024-03-31', INTERVAL '1 day') d
LEFT JOIN orders o ON o.order_date = d::date
GROUP BY 1
ORDER BY 1;
```

## how to approach a new hard question

1. figure out what one row of the final answer is
2. write it as steps in plain words
3. one CTE per step
4. run each CTE on its own and look at the output before moving on

Most "I can't solve this" moments are trying to write it all in one go.

## practice

Check [`queries.sql`](queries.sql).
