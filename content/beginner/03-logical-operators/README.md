# Logical Operators (AND, OR, NOT)

One condition is rarely enough. Like "orders from Delhi" is fine but "delivered orders from Delhi above 1000" is what people actually ask for. That's where AND, OR and NOT come in.

## AND

Both sides have to be true.

```sql
SELECT * FROM products
WHERE category = 'Electronics' AND price < 1000;
```

Gets you the mouse and the cable, the keyboard is Electronics but too expensive so it's out.

## OR

At least one side has to be true.

```sql
SELECT * FROM customers
WHERE city = 'Delhi' OR city = 'Chennai';
```

## NOT

Flips whatever comes after it.

```sql
SELECT * FROM orders WHERE NOT status = 'delivered';
SELECT * FROM customers WHERE city NOT IN ('Delhi', 'Mumbai');
SELECT * FROM products WHERE product_name NOT LIKE '%Pen%';
```

## the part everyone gets wrong: AND runs before OR

See this query, looks fine right?

```sql
-- "electronics or stationery, but only cheap stuff"
SELECT * FROM products
WHERE category = 'Electronics' OR category = 'Stationery' AND price < 200;
```

It's not. Sql reads it like this:

```sql
WHERE category = 'Electronics' OR (category = 'Stationery' AND price < 200)
```

So you get every electronics item including the 10999 monitor. AND sticks together first, same way multiplication happens before addition in math.

Fix is just brackets:

```sql
SELECT * FROM products
WHERE (category = 'Electronics' OR category = 'Stationery') AND price < 200;
```

Honestly whenever you mix AND and OR, just put brackets. Even if it's technically not needed, the next person reading it (probably you in 2 months) will thank you.

## a quick way to think about it

| A | B | A AND B | A OR B |
|---|---|---|---|
| true | true | true | true |
| true | false | false | true |
| false | false | false | false |

And then NULL makes it weirder, `true AND NULL` is NULL, `true OR NULL` is true. Next topic explains why.

## stuff that trips people up

- mixing AND and OR without brackets, by far the #1 thing.
- `WHERE city = 'Delhi' OR 'Mumbai'`, doesn't work, you have to repeat the column, `city = 'Delhi' OR city = 'Mumbai'` or just use IN.
- `NOT IN` with a list that has a NULL in it returns nothing. Yeah really. Covered later.

## practice

Check [`queries.sql`](queries.sql).
