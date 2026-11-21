# NULL Handling

NULL means "we don't know". Not zero, not empty string, not false. Just unknown. And once you get that, all the weird NULL behaviour starts making sense.

In our data, Priya, Sneha and Arjun have no phone, and Karan has no city.

## you can't compare with =

```sql
SELECT * FROM customers WHERE phone = NULL;  -- returns nothing
```

Think about it like this, is an unknown value equal to another unknown value? We don't know. So the answer is NULL, not true, and WHERE only keeps rows where the answer is true.

Even `NULL = NULL` is NULL. Use these instead:

```sql
SELECT * FROM customers WHERE phone IS NULL;
SELECT * FROM customers WHERE phone IS NOT NULL;
```

## NULL eats everything in math

```sql
SELECT 100 + NULL;   -- NULL
SELECT 'Hi ' || NULL; -- NULL
```

Anything plus unknown is unknown. So if you're building a full name and last_name is NULL, the whole thing becomes NULL. Annoying.

## COALESCE (give it a default)

COALESCE goes through what you give it and returns the first thing that's not NULL.

```sql
SELECT first_name, COALESCE(phone, 'not given') AS phone
FROM customers;

SELECT first_name, COALESCE(city, 'unknown') AS city
FROM customers;
```

You'll use this all the time, especially after LEFT JOINs where missing matches come back as NULL and you want 0 instead.

## NULLIF (turn a value into NULL)

The opposite kinda. `NULLIF(a, b)` gives NULL if a equals b, otherwise gives a. Main use is avoiding divide by zero:

```sql
SELECT 100 / NULLIF(0, 0);  -- NULL instead of an error
```

## the sneaky one: WHERE drops NULL rows silently

```sql
SELECT * FROM customers WHERE city <> 'Delhi';
```

You'd expect everyone not in Delhi, so Priya, Sneha, Karan, Neha, Arjun. But Karan's missing. His city is NULL, `NULL <> 'Delhi'` is NULL, not true, so he's dropped. If you want him:

```sql
SELECT * FROM customers WHERE city <> 'Delhi' OR city IS NULL;
-- or in postgres
SELECT * FROM customers WHERE city IS DISTINCT FROM 'Delhi';
```

`IS DISTINCT FROM` is basically `<>` but treats NULL like a normal value. Pretty handy.

## NULL with aggregates

- `COUNT(*)` counts rows, NULLs included.
- `COUNT(phone)` counts only non-null phones.
- SUM, AVG, MIN, MAX all just skip NULLs.

```sql
SELECT COUNT(*) AS total, COUNT(phone) AS with_phone FROM customers;
-- 8 and 5
```

So AVG of (100, NULL, 200) is 150, not 100. Sometimes that's what you want, sometimes it's a bug.

## NULL in sorting

In postgres NULLs go last when sorting ASC and first in DESC. You can control it:

```sql
SELECT first_name, city FROM customers ORDER BY city NULLS FIRST;
```

## stuff that trips people up

- `= NULL` and `<> NULL`, never works.
- `<>` and `NOT IN` quietly dropping NULL rows.
- concatenation or math becoming NULL because one piece was NULL.
- mixing up `COUNT(*)` and `COUNT(column)`.

## practice

Check [`queries.sql`](queries.sql).
