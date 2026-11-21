# Indexes

Your query is correct but takes 40 seconds. Nine times out of ten, the fix is an index. This topic is about what they actually are, so you know when to add one and when not to.

## what an index is

Think of the index at the back of a textbook. Want the page about "joins"? You don't read the whole book, you check the index, it says page 142, you go straight there.

Without an index the database does a **sequential scan**, reads every single row and checks it. Fine for 8 customers. Terrible for 80 million.

An index is a separate sorted structure (usually a B-tree) that points to where rows live. With it, finding `email = 'x'` takes a few jumps instead of reading everything.

## creating one

```sql
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
```

Now `WHERE customer_id = 3` and joins on customer_id can use it.

Primary keys and UNIQUE constraints get an index automatically. Foreign keys do **not** in postgres (mysql does). So `orders.customer_id` needs one manually, and this is a super common missing index.

## what indexes help with

- `WHERE col = value`
- `WHERE col > value`, ranges, BETWEEN
- `JOIN ... ON col = ...`
- `ORDER BY col` (already sorted, no extra sort needed)
- `WHERE col LIKE 'abc%'` (starts-with only, not `'%abc'`)

## composite indexes (more than one column)

```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
```

Column order matters a lot. It's sorted by customer_id first, then order_date inside each customer. Like a phone book sorted by last name then first name.

This index helps:
- `WHERE customer_id = 1`
- `WHERE customer_id = 1 AND order_date > '2024-03-01'`
- `WHERE customer_id = 1 ORDER BY order_date`

It doesn't really help:
- `WHERE order_date > '2024-03-01'` alone, because you can't use a phone book sorted by last name to find everyone named "Rahul".

Rule of thumb: equality columns first, range/sort column last.

## covering indexes

If the index has every column the query needs, the database doesn't even look at the table. "Index only scan".

```sql
CREATE INDEX idx_orders_cust_amount ON orders (customer_id) INCLUDE (amount);
-- now this can be answered from the index alone:
SELECT customer_id, SUM(amount) FROM orders WHERE customer_id = 1 GROUP BY customer_id;
```

## partial indexes

Index only some rows:

```sql
CREATE INDEX idx_orders_pending ON orders (order_date) WHERE status = 'pending';
```

Small and fast if you're always querying pending orders.

## when indexes DON'T get used

- functions on the column, `WHERE LOWER(email) = '...'` can't use an index on email (see expression indexes topic)
- leading wildcard, `LIKE '%gmail.com'`
- type mismatch, comparing an int column to a text value
- small tables, scanning 8 rows is faster than using an index, the planner knows this
- the query returns a big chunk of the table anyway, reading everything is cheaper

## the cost of indexes

They're not free:
- every INSERT/UPDATE/DELETE has to update every index on that table
- they take disk space
- too many on a write-heavy table makes writes slow

So don't index every column "just in case". Index what your actual slow queries filter, join, and sort on.

## seeing what's there

```sql
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';
DROP INDEX idx_orders_pending;
```

Use `EXPLAIN` to check if your index is being used, that's the next topic.

## stuff that trips people up

- forgetting foreign keys aren't auto indexed in postgres.
- wrong column order in composite indexes.
- wrapping indexed columns in functions.
- adding 15 indexes and wondering why inserts got slow.

## practice

Check [`queries.sql`](queries.sql).
