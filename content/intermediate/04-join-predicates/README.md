# ON vs WHERE (Join Predicates)

"Predicate" is just a fancy word for a condition. This topic is about one question: should a condition go in the ON or in the WHERE? For INNER JOIN it doesn't matter. For LEFT JOIN it changes your answer completely.

## for INNER JOIN, same thing

```sql
SELECT c.first_name, o.order_id
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered';

SELECT c.first_name, o.order_id
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered';
```

Both give the same rows. Inner join only keeps matches anyway, so filtering during or after the match ends the same.

## for LEFT JOIN, totally different

The way to think about it:

- **ON** decides which right-side rows *count as a match*. The left rows always stay no matter what.
- **WHERE** runs *after* the join and throws out whole rows.

```sql
-- A: condition in ON
SELECT c.first_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered'
ORDER BY c.customer_id;
```

All 8 customers come back. Priya shows her delivered order (109) only, Karan shows NULL, Riya shows NULL too because her only order is pending.

```sql
-- B: condition in WHERE
SELECT c.first_name, o.order_id, o.status
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'delivered'
ORDER BY c.customer_id;
```

Only customers with delivered orders. Karan, Arjun, Riya, gone. You wrote LEFT JOIN but you got an INNER JOIN.

## what about filtering the left table?

Conditions on the left table almost always belong in WHERE.

```sql
-- probably not what you meant
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND c.city = 'Delhi';
```

This still returns all 8 customers! It's just that only Delhi people get their orders matched, everyone else gets NULLs. If you wanted only Delhi customers:

```sql
SELECT c.first_name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.city = 'Delhi';
```

## the cheat sheet

For `A LEFT JOIN B`:

| condition on | put it in | why |
|---|---|---|
| how A and B connect | ON | that's what ON is for |
| filtering B | ON | so A rows still survive |
| filtering A | WHERE | so you actually remove A rows |
| "B has no match" | WHERE `B.id IS NULL` | anti-join pattern |

## when WHERE on B is fine

Checking for NULL is the one case where WHERE on the right table is exactly what you want:

```sql
SELECT c.first_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

## stuff that trips people up

- right-table filters in WHERE, silently becomes inner join. The #1 left join bug.
- left-table filters in ON, doesn't filter anything, just adds NULLs.
- thinking ON and WHERE are interchangeable because it worked with an inner join once.

## practice

Check [`queries.sql`](queries.sql).
