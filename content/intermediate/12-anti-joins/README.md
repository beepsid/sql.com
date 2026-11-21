# Anti-Joins (Finding What's Missing)

A normal join finds matches. An anti-join finds rows that *don't* have a match. "Customers who never ordered", "products never sold", "users who signed up but never logged in". Super common question, and there are three ways to write it, one of which has a nasty bug.

## way 1: NOT EXISTS (use this)

```sql
SELECT c.first_name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

Karan and Arjun. Reads almost like english, "customers where there doesn't exist an order for them". Handles NULLs correctly and databases optimize it really well.

## way 2: LEFT JOIN + IS NULL

```sql
SELECT c.first_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

Same result. LEFT JOIN keeps everyone, the unmatched ones have NULLs on the order side, keep just those. Check for NULL on a column that can never be NULL normally (like the primary key), otherwise you might catch real rows that just happen to have a NULL.

## way 3: NOT IN (careful!)

```sql
SELECT first_name
FROM customers
WHERE customer_id NOT IN (SELECT customer_id FROM orders);
```

Works here. But see what happens if there's a NULL in the subquery:

```sql
SELECT first_name
FROM customers
WHERE customer_id NOT IN (1, 2, NULL);
```

Returns **nothing**. Zero rows. Not even Karan.

Why? `5 NOT IN (1, 2, NULL)` means `5 <> 1 AND 5 <> 2 AND 5 <> NULL`. That last one is NULL (unknown), and `true AND NULL` is NULL, so the WHERE fails for every single row.

So if `orders.customer_id` ever had a NULL (guest checkout, deleted user, whatever), your NOT IN query silently returns empty. No error. That's why people say just use NOT EXISTS.

If you must use NOT IN, filter the NULLs out:

```sql
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)
```

## semi-join (the opposite)

"customers who have at least one order", just EXISTS:

```sql
SELECT c.first_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

Better than a JOIN for this because a join would give Aman 3 times (3 orders), EXISTS gives him once.

## with extra conditions

"customers who never had a delivered order":

```sql
SELECT c.first_name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id AND o.status = 'delivered'
);
```

Karan, Arjun, and Riya (she has an order but it's pending).

## stuff that trips people up

- NOT IN with NULLs, returns nothing. The classic.
- LEFT JOIN anti-join checking IS NULL on a nullable column.
- putting the extra condition in WHERE instead of ON for the LEFT JOIN version (see join predicates topic).
- using JOIN + DISTINCT when you just wanted EXISTS.

## practice

Check [`queries.sql`](queries.sql).
