# Expression Indexes

A normal index is on a column. An expression index is on the *result* of something, like `LOWER(email)`. It fixes the "I wrapped my column in a function and now my index is useless" problem.

## the problem

```sql
CREATE INDEX idx_customers_email ON customers (email);

SELECT * FROM customers WHERE LOWER(email) = 'aman@mail.com';
```

The index stores `email` values sorted. But you're searching for `LOWER(email)`, which is a different thing. The database can't use the index, it has to compute LOWER for every row. Seq scan.

## the fix

Index the expression itself:

```sql
CREATE INDEX idx_customers_email_lower ON customers (LOWER(email));
```

Now the index stores lowercased emails, and `WHERE LOWER(email) = '...'` can use it.

The catch, your query has to use *exactly* the same expression. `LOWER(email)` matches, `UPPER(email)` doesn't, `LOWER(TRIM(email))` doesn't.

## common uses

**case insensitive lookups** (emails, usernames)
```sql
CREATE INDEX ON customers (LOWER(email));
```

**searching by part of a date**
```sql
CREATE INDEX ON orders ((EXTRACT(YEAR FROM order_date)));
-- note the double brackets, needed for anything that's not a simple function call
```
Though honestly for dates, rewriting the WHERE as a range on a normal index is usually better.

**computed values you filter by a lot**
```sql
CREATE INDEX ON customers ((first_name || ' ' || last_name));
-- helps: WHERE first_name || ' ' || last_name = 'Aman Sharma'
```

**json fields** (more in the JSON topic)
```sql
CREATE INDEX ON events ((payload->>'type'));
```

## unique expression index

You can enforce uniqueness on an expression. Like "no two customers can have the same email, ignoring case":

```sql
CREATE UNIQUE INDEX ON customers (LOWER(email));
```

Now inserting `AMAN@mail.com` fails because `aman@mail.com` exists. Way better than trusting the app to lowercase everything.

## rules

- the function has to be **IMMUTABLE**, same input always gives same output. `LOWER` is fine. `NOW()` isn't, its result changes, so you can't index it.
- they cost the same as normal indexes on writes (the expression gets computed on every insert/update).
- run `ANALYZE` after creating one so the planner has stats on the expression.

## alternatives worth knowing

- **generated columns**, store the computed value as a real column and index that:
  ```sql
  ALTER TABLE customers ADD COLUMN email_lower TEXT GENERATED ALWAYS AS (LOWER(email)) STORED;
  CREATE INDEX ON customers (email_lower);
  ```
  Easier to see what's going on, costs a bit of disk.
- **citext**, a postgres extension type that's case-insensitive by default.

## stuff that trips people up

- query expression not exactly matching the index expression.
- missing double brackets, `CREATE INDEX ON t (EXTRACT(...))` errors, needs `((...))`.
- trying to index non-immutable stuff like NOW() or random().

## practice

Check [`queries.sql`](queries.sql).
