# Non-Equi Joins

Every join so far used `=` in the ON. A non-equi join uses anything else, `<`, `>`, `BETWEEN`, `<>`. You need it when rows match by range instead of by exact id.

## the classic: date ranges

Which discount was running when each order was placed? There's no `discount_id` on orders. The connection is "order_date falls inside the discount's valid dates".

```sql
SELECT o.order_id, o.order_date, d.discount_code, d.discount_percent
FROM orders o
JOIN discounts d
  ON o.order_date BETWEEN d.valid_from AND d.valid_to;
```

Orders 102 and 103 (march) get HOLI, 107 and 108 (june) get SUMMER. Everything else has no discount running so it's dropped. Use LEFT JOIN to keep them:

```sql
SELECT o.order_id, o.order_date, COALESCE(d.discount_code, 'none') AS discount
FROM orders o
LEFT JOIN discounts d
  ON o.order_date BETWEEN d.valid_from AND d.valid_to;
```

## bands / buckets

Same idea, salary bands, tax slabs, age groups. Say you had a table of grade ranges:

```sql
WITH grades AS (
  SELECT * FROM (VALUES
    ('L1', 0,      80000),
    ('L2', 80001,  130000),
    ('L3', 130001, 1000000)
  ) AS g(grade, min_salary, max_salary)
)
SELECT e.name, e.salary, g.grade
FROM employees e
JOIN grades g ON e.salary BETWEEN g.min_salary AND g.max_salary;
```

Way better than a giant CASE WHEN, because when bands change you update a table, not your query.

## comparing rows with each other

Non-equi self joins. "For each order, how many earlier orders were there?":

```sql
SELECT a.order_id, a.order_date, COUNT(b.order_id) AS earlier_orders
FROM orders a
LEFT JOIN orders b ON b.order_date < a.order_date
GROUP BY a.order_id, a.order_date
ORDER BY a.order_date;
```

(a window function does this better, `ROW_NUMBER() - 1`, but it shows the idea.)

Pairs without duplicates, which you saw in self joins:

```sql
SELECT a.name, b.name
FROM employees a
JOIN employees b ON a.employee_id < b.employee_id AND a.department = b.department;
```

## overlapping ranges

Two ranges overlap if each one starts before the other ends:

```sql
-- do any discount periods overlap?
SELECT d1.discount_code, d2.discount_code
FROM discounts d1
JOIN discounts d2
  ON d1.discount_code < d2.discount_code
 AND d1.valid_from <= d2.valid_to
 AND d2.valid_from <= d1.valid_to;
```

Empty in our data, good. Remember this formula, it shows up for bookings, shifts, meetings, anything with start and end.

## watch out

**performance**, an equality join can use hash joins which are fast. Range joins often end up as nested loops, comparing lots of rows to lots of rows. On big tables, index the range columns and keep the other side small.

**multiple matches**, if two discount periods overlap, an order in that window matches both and gets duplicated. Decide what you want (best discount? first one?) and handle it, e.g. with ROW_NUMBER.

**boundaries**, BETWEEN includes both ends. If one band is 0-80000 and the next is 80000-130000, someone earning exactly 80000 lands in both. Make the ranges not touch, or use `>= min AND < max`.

## stuff that trips people up

- overlapping ranges causing duplicate rows.
- BETWEEN boundaries double matching.
- slow nested loop joins on big tables.
- forgetting LEFT JOIN, so rows with no matching range just vanish.

## practice

Check [`queries.sql`](queries.sql).
