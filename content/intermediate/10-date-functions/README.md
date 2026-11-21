# Date & Time Functions

Almost every real question has a time part to it. Revenue this month, users who signed up last week, days since last order. Dates are also where databases differ the most, so I'll stick to postgres and note mysql where it's very different.

## right now

```sql
SELECT CURRENT_DATE;       -- 2024-07-20
SELECT NOW();              -- 2024-07-20 14:32:10.123+05:30
SELECT CURRENT_TIMESTAMP;  -- same as NOW()
```

## pulling parts out

```sql
SELECT
  order_date,
  EXTRACT(YEAR  FROM order_date) AS yr,
  EXTRACT(MONTH FROM order_date) AS mon,
  EXTRACT(DAY   FROM order_date) AS d,
  EXTRACT(DOW   FROM order_date) AS weekday   -- 0 = sunday
FROM orders;
```

Mysql has shortcuts like `YEAR(order_date)`, `MONTH()`, `DAYNAME()`.

## DATE_TRUNC (your best friend for reports)

Rounds a date down to the start of the month/week/year:

```sql
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount)
FROM orders
GROUP BY 1
ORDER BY 1;
```

`2024-03-15` becomes `2024-03-01 00:00:00`. Group by that and you get monthly totals. Works with 'day', 'week', 'quarter', 'year' too.

## adding and subtracting

```sql
SELECT order_date + 7 FROM orders;                    -- 7 days later (date + int)
SELECT order_date + INTERVAL '1 month' FROM orders;   -- 1 month later
SELECT NOW() - INTERVAL '2 hours';
-- mysql: DATE_ADD(order_date, INTERVAL 1 MONTH)
```

## difference between two dates

```sql
SELECT CURRENT_DATE - signup_date AS days_since_signup FROM customers;  -- integer days
SELECT AGE(CURRENT_DATE, signup_date) FROM customers;                    -- '6 mons 15 days'
-- mysql: DATEDIFF(CURRENT_DATE, signup_date)
```

Date minus date gives days. Timestamp minus timestamp gives an interval.

## formatting

```sql
SELECT TO_CHAR(order_date, 'DD Mon YYYY') FROM orders;  -- 01 Feb 2024
SELECT TO_CHAR(order_date, 'Day')        FROM orders;  -- Thursday
-- mysql: DATE_FORMAT(order_date, '%d %b %Y')
```

## text to date

```sql
SELECT TO_DATE('15/03/2024', 'DD/MM/YYYY');
SELECT '2024-03-15'::date;
-- mysql: STR_TO_DATE('15/03/2024', '%d/%m/%Y')
```

## filtering by date ranges (do it right)

```sql
-- bad: wraps the column in a function, can't use an index
WHERE EXTRACT(MONTH FROM order_date) = 3 AND EXTRACT(YEAR FROM order_date) = 2024

-- good
WHERE order_date >= '2024-03-01' AND order_date < '2024-04-01'
```

Use `>=` start and `<` next start. Don't use `BETWEEN '2024-03-01' AND '2024-03-31'` on timestamps, it misses everything after midnight on the 31st.

## last N days

```sql
SELECT * FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL '30 days';
```

Our sample data is from 2024 so this'll be empty, but that's the pattern.

## timezones (just know this)

`TIMESTAMP` has no timezone, `TIMESTAMPTZ` does. Store event times as TIMESTAMPTZ. Otherwise "the order at 11pm" means different things for a server in india and one in the US.

```sql
SELECT NOW() AT TIME ZONE 'Asia/Kolkata';
```

## stuff that trips people up

- BETWEEN on timestamps cutting off the last day.
- functions on the column in WHERE killing index use.
- month math, jan 31 + 1 month = feb 29 (or 28). Database handles it but it might surprise you.
- forgetting dates are compared as dates only if they're actually DATE type, text dates sort weird.

## practice

Check [`queries.sql`](queries.sql).
