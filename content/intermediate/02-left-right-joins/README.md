# LEFT, RIGHT & FULL OUTER JOIN

INNER JOIN drops anything without a match. But a lot of the time you want to keep those rows. "Show all customers and their orders, including people who never ordered", that's a LEFT JOIN.

## LEFT JOIN

Keep every row from the left table (the one in FROM). If there's a match on the right, great. If not, the right side columns come back as NULL.

```sql
SELECT c.first_name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.customer_id;
```

| first_name | order_id | amount |
|---|---|---|
| Aman | 101 | 1098 |
| ... | ... | ... |
| Karan | NULL | NULL |
| ... | ... | ... |
| Arjun | NULL | NULL |

Karan and Arjun are still here, just with NULLs. With INNER JOIN they'd be gone.

## counting with a LEFT JOIN (careful)

Orders per customer, including zero:

```sql
SELECT c.first_name, COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name;
```

Use `COUNT(o.order_id)` not `COUNT(*)`. COUNT(*) counts the row, and Karan does have a row (full of NULLs), so he'd show 1 order. COUNT(o.order_id) skips NULLs so he correctly shows 0.

Same for SUM, it'd give NULL for Karan, wrap it in COALESCE:

```sql
COALESCE(SUM(o.amount), 0) AS total_spent
```

## finding things with no match

Super common pattern. Customers who never ordered:

```sql
SELECT c.first_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

LEFT JOIN keeps everyone, then WHERE keeps only the ones where nothing matched. There's a whole topic on this (anti-joins).

## the trap: WHERE on the right table kills your LEFT JOIN

```sql
-- "all customers, with their delivered orders"
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered';
```

Karan and Arjun disappear again. Why? Their o.status is NULL, `NULL = 'delivered'` isn't true, so WHERE throws them out. You basically turned it back into an INNER JOIN.

Fix, put the condition in ON:

```sql
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered';
```

Now it means "match only delivered orders, but keep every customer either way". This one's important enough that it has its own topic (join predicates).

## RIGHT JOIN

Same thing but keeps everything from the right table. `A RIGHT JOIN B` is exactly `B LEFT JOIN A`. Most people just flip the tables and use LEFT JOIN always, it's easier to read. You'll rarely write RIGHT JOIN.

## FULL OUTER JOIN

Keeps everything from both sides, NULLs wherever there's no match. Useful for comparing two lists and seeing what's missing on either side.

```sql
SELECT c.customer_id AS in_customers, a.customer_id AS in_addresses
FROM customers c
FULL OUTER JOIN (SELECT DISTINCT customer_id FROM addresses) a
  ON c.customer_id = a.customer_id;
```

Mysql doesn't have FULL OUTER JOIN, you fake it with a LEFT JOIN UNION a RIGHT JOIN.

## CROSS JOIN

Every row paired with every row, no ON. 8 customers × 8 products = 64 rows. Sounds useless but it's handy for generating combos, like every customer × every month for a report.

```sql
SELECT c.first_name, p.product_name
FROM customers c
CROSS JOIN products p;
```

## stuff that trips people up

- WHERE on the right table turning LEFT into INNER.
- COUNT(*) giving 1 for people with no matches.
- forgetting COALESCE on sums.
- left vs right, just always use LEFT and put the "keep everything" table first.

## practice

Check [`queries.sql`](queries.sql).
