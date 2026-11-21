# LIMIT & OFFSET

LIMIT says "only give me this many rows". OFFSET says "skip this many first". That's literally it, but there are a couple of gotchas.

## LIMIT

```sql
SELECT * FROM products LIMIT 3;
```

Gives 3 rows. Which 3? No idea, could be any. LIMIT without ORDER BY is basically random, so almost always pair them:

```sql
-- 3 most expensive products
SELECT product_name, price
FROM products
ORDER BY price DESC
LIMIT 3;
```

This "top N" pattern is everywhere, top 5 customers, latest 10 orders, etc.

## OFFSET

```sql
-- skip the first 3, give the next 3
SELECT product_name, price
FROM products
ORDER BY price DESC
LIMIT 3 OFFSET 3;
```

## pagination

This is what websites do for page 1, page 2, page 3...

```
page 1  ->  LIMIT 10 OFFSET 0
page 2  ->  LIMIT 10 OFFSET 10
page 3  ->  LIMIT 10 OFFSET 20

OFFSET = (page - 1) * page_size
```

## the problem with big OFFSETs

`OFFSET 100000` doesn't magically jump to row 100000. The database still reads all 100000 rows and throws them away. So page 1 is fast and page 5000 is slow.

The better way for big tables is "keyset" pagination, you remember the last thing you saw and continue from there:

```sql
-- first page
SELECT * FROM orders ORDER BY order_id LIMIT 3;
-- last order_id on that page was 103, so next page:
SELECT * FROM orders WHERE order_id > 103 ORDER BY order_id LIMIT 3;
```

With an index on order_id this stays fast no matter how deep you go. Don't stress about it yet, just know it exists.

## second highest anything

Classic interview question, "find the second highest salary".

```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

DISTINCT is there because if two people share the top salary, you'd get the same number twice. Window functions do this better, but this works.

## other databases

Same idea, different words:

```sql
-- sql server
SELECT TOP 3 * FROM products ORDER BY price DESC;

-- standard sql (postgres supports this too)
SELECT * FROM products ORDER BY price DESC FETCH FIRST 3 ROWS ONLY;
```

## stuff that trips people up

- LIMIT without ORDER BY, results change randomly.
- ties, if 3rd and 4th place have the same price, LIMIT 3 just picks one of them. If that matters use `FETCH FIRST 3 ROWS WITH TIES`.
- deep OFFSET pagination on big tables being slow.

## practice

Check [`queries.sql`](queries.sql).
