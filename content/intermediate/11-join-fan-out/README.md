# Join Fan-Out (Why Your Totals Are Wrong)

This is probably the most common bug in real sql, and it doesn't give an error. The query runs, you get a number, the number is wrong. Usually too big.

## what's happening

When you join a table where one row matches many rows, the one row gets copied once per match. That's normal. The problem is when you then SUM or COUNT something from the "one" side, you're summing the copies.

## see it happen

Neha (customer 6) has 1 order of 4298, and 3 addresses.

```sql
SELECT c.first_name, o.order_id, o.amount, a.city
FROM customers c
JOIN orders    o ON c.customer_id = o.customer_id
JOIN addresses a ON c.customer_id = a.customer_id
WHERE c.customer_id = 6;
```

| first_name | order_id | amount | city |
|---|---|---|---|
| Neha | 108 | 4298 | Mumbai |
| Neha | 108 | 4298 | Pune |
| Neha | 108 | 4298 | Mumbai |

Her one order is now 3 rows. Now sum it:

```sql
SELECT c.first_name, SUM(o.amount) AS total_spent, COUNT(a.address_id) AS addresses
FROM customers c
JOIN orders    o ON c.customer_id = o.customer_id
JOIN addresses a ON c.customer_id = a.customer_id
GROUP BY c.customer_id, c.first_name;
```

Neha shows 12894 spent. She spent 4298. Aman has 3 orders and 2 addresses, so his orders get doubled and his address count gets tripled. Everything's wrong.

## why it happens

You joined two different "many" tables (orders and addresses) to the same "one" table (customers). They have nothing to do with each other, but the join pairs every order with every address. 3 orders × 2 addresses = 6 rows for Aman.

## how to spot it

- the total looks too big
- quick check, `COUNT(*)` before and after adding a join. If it went up and you didn't expect it, fan-out.
- someone added DISTINCT "to fix duplicates". Big hint.

## fix 1: aggregate before joining

Squash each "many" table down to one row per customer first, then join the squashed versions.

```sql
WITH spend AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id
),
addr AS (
  SELECT customer_id, COUNT(*) AS addresses
  FROM addresses
  GROUP BY customer_id
)
SELECT c.first_name,
       COALESCE(s.total_spent, 0) AS total_spent,
       COALESCE(a.addresses, 0)   AS addresses
FROM customers c
LEFT JOIN spend s ON c.customer_id = s.customer_id
LEFT JOIN addr  a ON c.customer_id = a.customer_id;
```

Now each join is one-to-one, nothing multiplies. This is the proper fix, use it.

## fix 2: scalar subqueries

```sql
SELECT c.first_name,
  (SELECT SUM(amount) FROM orders o    WHERE o.customer_id = c.customer_id) AS total_spent,
  (SELECT COUNT(*)    FROM addresses a WHERE a.customer_id = c.customer_id) AS addresses
FROM customers c;
```

Works fine, readable for small stuff.

## the not-really-a-fix: COUNT DISTINCT

`COUNT(DISTINCT o.order_id)` gives the right order count even with fan-out. But `SUM(DISTINCT o.amount)` is wrong, if two different orders had the same amount it'd only count one. Don't use SUM DISTINCT to fix fan-out.

## the same thing with order_items

```sql
-- wrong: order 101 has 2 items so its amount is counted twice
SELECT SUM(o.amount)
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id;
```

Gives 29,498 instead of 23,082. Either don't join order_items if you don't need it, or sum from the item level (`quantity * price`) instead of the order level.

## the rule

Before you SUM or COUNT, ask "what is one row in this result?". If the answer is "one order-address pair" but you're summing order amounts, you've got fan-out.

## practice

Check [`queries.sql`](queries.sql).
