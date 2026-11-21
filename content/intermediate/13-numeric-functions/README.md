# Numeric Functions

Math stuff. Most of it's obvious, but rounding and division have a few traps that cause real bugs, especially with money.

## the basic operators

```sql
SELECT 10 + 3, 10 - 3, 10 * 3, 10 / 3, 10 % 3;
-- 13, 7, 30, 3, 1
```

Yeah `10 / 3` is 3, not 3.33. Both are integers so you get integer division. Make one side a decimal:

```sql
SELECT 10 / 3.0;          -- 3.333...
SELECT 10::numeric / 3;   -- 3.333...
```

This bites you with things like `COUNT(*) / total` for percentages, which comes out 0.

`%` is modulo (the remainder), `MOD(10, 3)` is the same thing. Useful for "every 2nd row" or "is this even".

## rounding

```sql
SELECT ROUND(1234.5678);      -- 1235
SELECT ROUND(1234.5678, 2);   -- 1234.57
SELECT ROUND(1234.5678, -2);  -- 1200   (round to hundreds)
SELECT CEIL(4.1);             -- 5      (always up)
SELECT FLOOR(4.9);            -- 4      (always down)
SELECT TRUNC(4.987, 1);       -- 4.9    (just cuts off, no rounding)
```

CEIL is great for stuff like "how many pages do I need", `CEIL(total_items / 10.0)`.

## absolute value and sign

```sql
SELECT ABS(-50);    -- 50
SELECT SIGN(-50);   -- -1  (1 for positive, 0 for zero)
```

ABS is handy for "how far off was the estimate", where you don't care which direction.

## powers and roots

```sql
SELECT POWER(2, 10);  -- 1024
SELECT SQRT(144);     -- 12
SELECT EXP(1);        -- 2.718...
SELECT LN(10), LOG(100);  -- natural log, log base 10
```

## biggest / smallest across columns

MAX and MIN work down a column (across rows). GREATEST and LEAST work across columns in one row:

```sql
SELECT GREATEST(10, 50, 30);  -- 50
SELECT LEAST(10, 50, 30);     -- 10
```

Good for capping values, like "discount can't be more than 500":

```sql
SELECT order_id, amount, LEAST(amount * 0.2, 500) AS discount FROM orders;
```

## random

```sql
SELECT RANDOM();                          -- 0 to 1
SELECT FLOOR(RANDOM() * 100) + 1;         -- 1 to 100
SELECT * FROM customers ORDER BY RANDOM() LIMIT 3;  -- 3 random customers
-- mysql: RAND()
```

ORDER BY RANDOM() is fine for small tables, very slow on big ones.

## percentages (do it right)

```sql
SELECT
  status,
  COUNT(*) AS orders,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM orders
GROUP BY status;
```

The `100.0` at the start makes it decimal math. The `SUM(...) OVER ()` is a window function giving the grand total, covered in advanced. Simpler version with a subquery:

```sql
SELECT status, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM orders), 1) AS pct
FROM orders
GROUP BY status;
```

## divide by zero

```sql
SELECT 10 / 0;                -- error
SELECT 10 / NULLIF(0, 0);     -- NULL, no error
```

Wrap any denominator that might be zero in NULLIF.

## stuff that trips people up

- integer division giving 0 for percentages.
- divide by zero errors in reports.
- FLOAT for money, use NUMERIC. (data types topic)
- ROUND on floats sometimes giving 2.675 → 2.67 because the float was really 2.67499999.

## practice

Check [`queries.sql`](queries.sql).
