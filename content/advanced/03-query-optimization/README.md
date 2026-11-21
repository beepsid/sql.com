# Query Optimization

Making slow queries fast. The main skill here isn't memorizing tricks, it's learning to read what the database is actually doing, then fixing the part that's slow.

## step 1: EXPLAIN

Put EXPLAIN in front of any query and postgres tells you its plan instead of running it.

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;
```

```
Seq Scan on orders  (cost=0.00..1.12 rows=3 width=40)
  Filter: (customer_id = 1)
```

`EXPLAIN ANALYZE` actually runs it and shows real times:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;
```

Careful, ANALYZE really runs the query. Don't EXPLAIN ANALYZE a DELETE on prod lol.

## reading a plan

It's a tree, read it from the most indented line outwards. Things to look for:

| you see | means |
|---|---|
| `Seq Scan` | reading the whole table. Fine for small tables, bad for big ones with a selective filter |
| `Index Scan` / `Index Only Scan` | using an index, usually good |
| `Bitmap Heap Scan` | using an index for a medium sized chunk of rows, fine |
| `Nested Loop` | for each row on one side, look up the other. Great when one side is small |
| `Hash Join` | builds a hash table of one side, good for big unsorted joins |
| `Merge Join` | both sides sorted, then zipped together |
| `Sort` | sorting, can spill to disk if big ("external merge") |

And compare `rows=` (estimate) with `actual rows=`. If the estimate is way off, like it thinks 10 rows and it's actually 500,000, the planner is picking plans for the wrong situation. Run `ANALYZE tablename;` to refresh its stats.

## the usual suspects

**1. missing index**
Seq scan on a big table with a WHERE that returns few rows. Add an index on that column.

**2. functions on indexed columns**
```sql
-- can't use index on order_date
WHERE EXTRACT(YEAR FROM order_date) = 2024
-- can
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
```

**3. SELECT \***
Pulling 40 columns when you need 3. More data read, more sent over the network, and no chance of an index-only scan.

**4. fan-out then DISTINCT**
Joining stuff that multiplies rows, then DISTINCT to squash it back. Aggregate before joining instead (join fan-out topic).

**5. correlated subqueries that don't get optimized**
Usually fine in postgres, but if the plan shows a SubPlan running once per row on a big table, rewrite as a JOIN or use a CTE that aggregates once.

**6. OR across different columns**
```sql
WHERE customer_id = 5 OR email = 'x'
```
Can be hard to index. Sometimes splitting into two queries with UNION is faster.

**7. huge OFFSET**
`OFFSET 500000` reads and throws away 500k rows. Use keyset pagination (limit/offset topic).

**8. NOT IN with subqueries**
Besides the NULL bug, it's often slower than NOT EXISTS.

## filter early

Less data going into joins and sorts = faster everything. Postgres is good at pushing filters down on its own, but if you have a big CTE or subquery that aggregates everything and you only need one customer, filter inside it.

## count less

```sql
-- slow on big tables, counts everything
SELECT COUNT(*) FROM orders WHERE status = 'pending';
-- if you only need to know if any exist
SELECT EXISTS (SELECT 1 FROM orders WHERE status = 'pending');
```

## batch writes

Inserting 10,000 rows one INSERT at a time is way slower than one INSERT with 10,000 rows, or COPY. Same for updates, one UPDATE with a WHERE beats 10,000 single-row updates in a loop.

## the process

1. find the actually slow query (don't guess, measure)
2. EXPLAIN ANALYZE it
3. find the expensive node (biggest actual time)
4. fix that one thing
5. measure again

Don't optimize a query that takes 20ms and runs once a day. Optimize the one that takes 2 seconds and runs 1000 times an hour.

## stuff that trips people up

- guessing instead of looking at EXPLAIN.
- stale statistics making the planner dumb, run ANALYZE.
- testing on a tiny dev table where everything is a seq scan anyway.
- adding indexes for queries that aren't the problem.

## practice

Check [`queries.sql`](queries.sql).
