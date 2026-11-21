# CTEs (the WITH Clause)

A CTE (common table expression) is basically a subquery you give a name to and write at the top instead of stuffing it in the middle. Same power, way more readable.

## the shape

```sql
WITH name_of_it AS (
  SELECT ...
)
SELECT ...
FROM name_of_it;
```

## same query, both ways

Average number of orders per customer, with a subquery:

```sql
SELECT AVG(order_count)
FROM (
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
) t;
```

With a CTE:

```sql
WITH order_counts AS (
  SELECT customer_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
)
SELECT AVG(order_count) FROM order_counts;
```

You read it top to bottom like steps. First "work out order counts", then "average them". That's the whole point.

## multiple CTEs

Separate them with commas, only one WITH at the start. Later ones can use earlier ones.

```sql
WITH customer_spend AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE status <> 'cancelled'
  GROUP BY customer_id
),
avg_spend AS (
  SELECT AVG(total) AS avg_total FROM customer_spend
)
SELECT c.first_name, cs.total
FROM customer_spend cs
JOIN customers c ON c.customer_id = cs.customer_id
CROSS JOIN avg_spend a
WHERE cs.total > a.avg_total;
```

Customers who spent more than the average customer. Try writing that with nested subqueries, it's a mess.

## you can reuse a CTE

With a subquery you'd have to paste the same thing twice. A CTE you just reference again. Like above, `customer_spend` is used both to compute the average and in the final select.

## CTE vs subquery vs temp table

- **subquery**, fine for small one-off stuff
- **CTE**, when there are steps, or you need the same thing twice, or you just want it readable
- **temp table**, when the intermediate result is big and you'll query it many times across different statements

Performance wise in postgres 12+ CTEs and subqueries are usually treated the same. Older postgres always ran CTEs separately (an "optimization fence"), so you'll see old blog posts saying CTEs are slow, that's mostly outdated.

## a CTE only lives for one query

Once the query ends, it's gone. You can't use it in the next statement.

## recursive CTEs

A CTE can reference itself, which lets you walk through trees like org charts. That's its own advanced topic, it's a bit mind bending.

## stuff that trips people up

- writing WITH twice for two CTEs, it's one WITH and commas.
- a comma after the last CTE before the main SELECT, errors.
- trying to use the CTE in a second separate query.
- giving it a vague name like `t1`, the name is the documentation, make it say what it is.

## practice

Check [`queries.sql`](queries.sql).
