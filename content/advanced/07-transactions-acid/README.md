# Transactions & ACID

A transaction groups several statements into one all-or-nothing unit. Either every step happens, or none of them do. The classic example is moving money, you can't have the debit happen and the credit fail.

## the shape

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;
COMMIT;
```

If something goes wrong in the middle:

```sql
ROLLBACK;
```

Undoes everything since BEGIN, like it never happened.

Without BEGIN, postgres runs every statement in its own tiny transaction and commits it immediately (autocommit).

## an example with our data

Place an order: insert the order, insert its items, all or nothing.

```sql
BEGIN;
  INSERT INTO orders VALUES (111, 7, '2024-08-01', 'pending', 1098);
  INSERT INTO order_items VALUES (111, 1, 1), (111, 3, 1);
COMMIT;
```

If the second insert fails (say a typo in product_id), you'd otherwise have an order with no items. With the transaction, postgres puts it in an aborted state, and you ROLLBACK and the order is gone too.

## ACID

What a transaction guarantees. Interview favourite.

- **Atomicity**, all or nothing. No half-done transactions.
- **Consistency**, the database goes from one valid state to another. Constraints (foreign keys, checks) still hold at the end.
- **Isolation**, transactions running at the same time don't step on each other (how much they're isolated is configurable, below).
- **Durability**, once COMMIT returns, it's saved. Power cut a millisecond later? Still there.

## SAVEPOINT (partial undo)

```sql
BEGIN;
  INSERT INTO orders VALUES (112, 7, '2024-08-02', 'pending', 120);
  SAVEPOINT before_items;
  INSERT INTO order_items VALUES (112, 999, 1);  -- bad product, fails
  ROLLBACK TO before_items;
  INSERT INTO order_items VALUES (112, 4, 1);    -- try again
COMMIT;
```

## what goes wrong when transactions run together

Two people doing stuff at the same time can cause:

- **dirty read**, you read data another transaction hasn't committed yet, and then it rolls back. You read something that never existed.
- **non-repeatable read**, you read a row twice in your transaction and get different values because someone else committed a change in between.
- **phantom read**, you run the same WHERE twice and new rows appear because someone inserted them.
- **lost update**, two people read balance 1000, both add 100, both write 1100. Should've been 1200.

## isolation levels

From least to most strict:

| level | stops | postgres notes |
|---|---|---|
| READ UNCOMMITTED | nothing really | postgres treats it as read committed |
| READ COMMITTED | dirty reads | **postgres default** |
| REPEATABLE READ | + non-repeatable reads, (and phantoms in postgres) | |
| SERIALIZABLE | everything, acts like transactions ran one by one | may throw errors you have to retry |

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
...
COMMIT;
```

Stricter = safer but more conflicts and retries. Most apps live happily on read committed.

## avoiding lost updates

Do the math in the database, not the app:

```sql
-- bad: app reads 1000, adds 100, writes 1100
UPDATE accounts SET balance = 1100 WHERE account_id = 1;
-- good: atomic
UPDATE accounts SET balance = balance + 100 WHERE account_id = 1;
```

Or lock the row while you work with it:

```sql
BEGIN;
  SELECT * FROM accounts WHERE account_id = 1 FOR UPDATE;  -- others wait here
  -- do your checks
  UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
COMMIT;
```

## deadlocks

A locks row 1 and wants row 2. B locks row 2 and wants row 1. Both wait forever. Postgres detects this and kills one of them with an error.

Avoid it by always locking things in the same order (like lower id first), and keeping transactions short.

## keep transactions short

A transaction that stays open holds locks and blocks cleanup (vacuum). Never BEGIN, then wait for a user to click something, then COMMIT. Do the work, commit, done.

## stuff that trips people up

- forgetting COMMIT in a manual session, your changes are invisible to everyone else and locks stay held.
- read-modify-write in the app causing lost updates.
- long running transactions blocking everything.
- not retrying serialization failures at SERIALIZABLE.

## practice

Check [`queries.sql`](queries.sql). Some of these need two separate connections (two query tabs) to see what happens.
