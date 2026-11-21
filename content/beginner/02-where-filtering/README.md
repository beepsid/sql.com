# WHERE & Filtering

SELECT gets you columns, WHERE decides which rows make it. Without WHERE you get the whole table, with it you get only the rows that pass your condition.

## the shape

```sql
SELECT columns
FROM table
WHERE condition;
```

The database goes row by row, checks the condition, if it's true the row stays, if it's false (or NULL, more on that later) it's gone.

## comparing stuff

```sql
SELECT * FROM products WHERE price > 1000;
SELECT * FROM customers WHERE city = 'Delhi';
SELECT * FROM orders WHERE status != 'cancelled';
```

| operator | means |
|---|---|
| `=` | equal |
| `!=` or `<>` | not equal (both work, same thing) |
| `>` `<` | greater / less than |
| `>=` `<=` | greater or equal / less or equal |

Text goes in single quotes, numbers don't. And in postgres text comparison is case sensitive, so `city = 'delhi'` finds nothing because the data says `Delhi`.

## BETWEEN

For ranges. Both ends are included.

```sql
SELECT * FROM products WHERE price BETWEEN 100 AND 500;
-- same as price >= 100 AND price <= 500
```

Works on dates too:

```sql
SELECT * FROM orders
WHERE order_date BETWEEN '2024-03-01' AND '2024-04-30';
```

## IN

When you'd otherwise write a bunch of ORs.

```sql
SELECT * FROM customers
WHERE city IN ('Delhi', 'Mumbai');
```

And `NOT IN` for the opposite. (careful with NOT IN and NULLs, that's a whole thing, covered in the anti-joins topic.)

## LIKE (pattern matching)

- `%` means anything, any length, even nothing
- `_` means exactly one character

```sql
SELECT * FROM customers WHERE first_name LIKE 'A%';     -- starts with A
SELECT * FROM customers WHERE email LIKE '%@mail.com';  -- ends with @mail.com
SELECT * FROM products WHERE product_name LIKE '%Pen%'; -- has Pen anywhere
SELECT * FROM customers WHERE first_name LIKE '_r%';    -- second letter is r
```

LIKE is case sensitive in postgres. Use `ILIKE` if you want it to ignore case:

```sql
SELECT * FROM products WHERE product_name ILIKE '%mouse%';
```

## checking for NULL

You can't do `= NULL`, it just never matches. Use IS NULL.

```sql
SELECT * FROM customers WHERE phone IS NULL;
SELECT * FROM customers WHERE phone IS NOT NULL;
```

There's a whole topic on NULL right after this, it's weirder than it looks.

## you can't use SELECT aliases in WHERE

```sql
-- this errors
SELECT product_name, price * 1.18 AS final_price
FROM products
WHERE final_price > 1000;
```

Remember the order, WHERE runs before SELECT so `final_price` doesn't exist yet. Just repeat the expression:

```sql
SELECT product_name, price * 1.18 AS final_price
FROM products
WHERE price * 1.18 > 1000;
```

## stuff that trips people up

- `WHERE city = Delhi` without quotes, sql thinks Delhi is a column name.
- `= NULL` instead of `IS NULL`.
- forgetting that BETWEEN includes both ends.
- dates as text, `'2024-3-1'` might work or might not depending on the db, always write `'2024-03-01'`.

## practice

Check [`queries.sql`](queries.sql).
