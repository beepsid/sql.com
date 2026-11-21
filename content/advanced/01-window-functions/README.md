# Window Functions

If there's one advanced topic to really get, it's this one. Window functions show up in basically every data interview, and once they click you'll use them everywhere.

## the problem they solve

GROUP BY squashes rows. If you want each employee's salary *and* their department's average in the same row, GROUP BY can't do it, the individual rows are gone after grouping.

Window functions do the calculation across a group of rows but keep every row.

```sql
SELECT
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;
```

Every employee is still there, each with their department's average next to them.

## the OVER() part

`OVER` is what makes it a window function. Inside it:

- `PARTITION BY`, splits rows into groups (like GROUP BY but without squashing)
- `ORDER BY`, the order of rows inside each group
- frame (ROWS BETWEEN...), which rows around the current one to include. Later.

Empty `OVER ()` means the whole result is one window:

```sql
SELECT name, salary, SUM(salary) OVER () AS total_payroll FROM employees;
```

## ranking: ROW_NUMBER, RANK, DENSE_RANK

```sql
SELECT
  name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK()       OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

Pooja and Dev both earn 70000, see the difference at the bottom:

| name | salary | row_num | rnk | dense_rnk |
|---|---|---|---|---|
| Meera | 95000 | 4 | 4 | 4 |
| Rohit | 90000 | 5 | 5 | 5 |
| Pooja | 70000 | 6 | 6 | 6 |
| Dev | 70000 | 7 | 6 | 6 |
| Isha | 60000 | 8 | 8 | 7 |

- ROW_NUMBER, always unique, ties get split randomly
- RANK, ties share a number, then it skips (6, 6, 8)
- DENSE_RANK, ties share, no gaps (6, 6, 7)

## top N per group (the classic)

"Highest paid person in each department". Rank inside each department, then keep rank 1:

```sql
WITH ranked AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn = 1;
```

You can't put a window function in WHERE directly (WHERE runs before them), so the CTE is needed. Change `rn = 1` to `rn <= 2` for top 2. Use DENSE_RANK instead if ties should all count.

## running totals

Add ORDER BY inside OVER and SUM becomes cumulative:

```sql
SELECT order_id, order_date, amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

Per customer:

```sql
SELECT customer_id, order_date, amount,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS customer_running_total
FROM orders
ORDER BY customer_id, order_date;
```

## LAG and LEAD (previous / next row)

```sql
SELECT order_id, order_date, amount,
  LAG(amount)  OVER (ORDER BY order_date) AS prev_amount,
  LEAD(amount) OVER (ORDER BY order_date) AS next_amount,
  amount - LAG(amount) OVER (ORDER BY order_date) AS change
FROM orders;
```

First row's LAG is NULL, nothing before it. `LAG(amount, 2)` goes back 2 rows, `LAG(amount, 1, 0)` uses 0 instead of NULL.

Great for "month over month growth" and "days since last order".

## FIRST_VALUE, LAST_VALUE, NTILE

```sql
SELECT name, department, salary,
  FIRST_VALUE(name) OVER (PARTITION BY department ORDER BY salary DESC) AS top_earner,
  NTILE(4) OVER (ORDER BY salary DESC) AS quartile
FROM employees;
```

NTILE(4) splits rows into 4 roughly equal buckets.

## frames (ROWS BETWEEN)

Moving averages, like the average of this row and the 2 before it:

```sql
SELECT order_date, amount,
  AVG(amount) OVER (
    ORDER BY order_date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg_3
FROM orders;
```

Heads up on LAST_VALUE. The default frame when you have ORDER BY is "start up to current row", so LAST_VALUE just returns the current row, which looks broken. Fix:

```sql
LAST_VALUE(name) OVER (
  PARTITION BY department ORDER BY salary DESC
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

## where they run

```
FROM -> WHERE -> GROUP BY -> HAVING -> window functions -> SELECT -> ORDER BY -> LIMIT
```

So you can use them on top of GROUP BY results (`SUM(COUNT(*)) OVER ()` for a grand total), but you can't filter on them without wrapping in a CTE/subquery.

## stuff that trips people up

- trying to use a window function in WHERE.
- ROW_NUMBER vs RANK vs DENSE_RANK when there are ties.
- LAST_VALUE "not working" because of the default frame.
- forgetting PARTITION BY and getting a running total over everyone instead of per customer.

## practice

Check [`queries.sql`](queries.sql).
