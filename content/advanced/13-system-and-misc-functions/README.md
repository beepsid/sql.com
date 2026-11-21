# System & Misc Functions

All the stuff at the end of every SQL cheat sheet that nobody explains. Who am I logged in as, what id did that insert just get, hashing, uuids, bit tricks, unix timestamps, locks. You won't use these every day, but when you need one you really need it, and they come up in interviews more than you'd think.

Every example is postgres first, mysql and sql server versions are in the comments.

## who am I, where am I

```sql
SELECT current_user;        -- the user you're logged in as
SELECT current_database();  -- which database you're connected to
SELECT version();           -- full postgres version string
SELECT current_schema();    -- usually 'public'
```

```sql
-- mysql:      SELECT CURRENT_USER(), DATABASE(), VERSION();
-- sql server: SELECT CURRENT_USER, DB_NAME(), @@VERSION;
```

Mostly useful when you're debugging "why can't I see this table". Half the time you're connected to the wrong database or the wrong schema.

## what id did my insert just get

You insert a row, the id is auto generated, and now you need that id to insert the child rows. Don't do `SELECT MAX(id)` after the insert, if two people insert at the same time you'll get someone else's id.

Postgres has RETURNING, which gives you back the row you just wrote:

```sql
INSERT INTO customers (customer_id, first_name, last_name, email, signup_date)
VALUES (9, 'Tara', 'Bose', 'tara@mail.com', '2024-08-01')
RETURNING customer_id, signup_date;
```

Works on UPDATE and DELETE too, which is really handy:

```sql
UPDATE orders SET status = 'delivered' WHERE status = 'pending'
RETURNING order_id, status;
-- 107 and 110, now you know exactly what changed
```

```sql
-- mysql:      SELECT LAST_INSERT_ID();   (right after the insert, same connection)
--             SELECT ROW_COUNT();        (how many rows the last statement changed)
-- sql server: SELECT SCOPE_IDENTITY();   or use OUTPUT inserted.id in the insert itself
--             SELECT @@ROWCOUNT;
```

LAST_INSERT_ID is per connection, so two people inserting at the same time don't mess each other up. That's the whole point of it vs MAX(id).

## hashing (md5, sha)

A hash turns any text into a fixed length fingerprint. Same input, same output, always. But you can't go back from the hash to the text.

```sql
SELECT md5('aman@mail.com');
-- 32 hex characters, same every time you run it

SELECT encode(sha256('aman@mail.com'), 'hex');
-- 64 hex characters, sha256 wants bytes, encode turns it back into readable text
```

```sql
-- mysql:      SELECT MD5('aman@mail.com'), SHA2('aman@mail.com', 256), SHA1('aman@mail.com');
-- sql server: SELECT HASHBYTES('SHA2_256', 'aman@mail.com');
```

Where it's actually useful:
- checking if two big rows are the same without comparing every column, `md5(row_to_json(t)::text)`.
- hiding emails in a report but still being able to count unique people. Same email always gives the same hash.
- spotting duplicates in a big text column.

One important thing. **don't store passwords as md5 or plain sha**. They're fast, and fast is bad for passwords because someone can guess billions per second. Passwords get hashed in your app with bcrypt or argon2, the database just stores the result.

## encryption (the other direction)

Hashing is one way. Encryption is two way, you lock it with a key and unlock it with the same key.

```sql
-- postgres needs the pgcrypto extension for this
CREATE EXTENSION IF NOT EXISTS pgcrypto;

SELECT pgp_sym_encrypt('9876500001', 'my-secret-key');          -- gibberish bytes
SELECT pgp_sym_decrypt(pgp_sym_encrypt('9876500001', 'my-secret-key'), 'my-secret-key');
-- 9876500001
```

```sql
-- mysql: SELECT AES_DECRYPT(AES_ENCRYPT('9876500001', 'my-secret-key'), 'my-secret-key');
```

Honestly, in real projects you rarely do this in SQL. If the key is sitting in your query, it's sitting in your logs too. Most teams encrypt in the app or let the cloud database encrypt the whole disk. Just know the functions exist.

(the in-browser postgres on this site doesn't ship pgcrypto, so this one you'll have to try on a real postgres.)

## uuids

A uuid is a random 128 bit id like `a3f1c2e4-...`. Basically guaranteed unique, even across different servers.

```sql
SELECT gen_random_uuid();
-- different every single time

CREATE TABLE sessions (
  session_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id INT
);
```

```sql
-- mysql:      SELECT UUID();
-- sql server: SELECT NEWID();
```

Why use them over 1, 2, 3...:
- nobody can guess the next id. `/orders/105` tells people you have about 105 orders and lets them try 106.
- you can generate the id before the row hits the database, even in the app or on a phone.
- merging data from two databases doesn't clash.

The downside is they're bigger (16 bytes vs 4) and random ones make indexes a bit slower since new rows land all over the place instead of at the end.

## bitwise operators

These work on the bits of a number. Sounds useless, until you see someone storing permissions like this:

```
1 = read    (binary 001)
2 = write   (binary 010)
4 = delete  (binary 100)
```

So 3 means read + write, 7 means everything. One integer column holds all the flags.

```sql
SELECT 5 & 3;   -- 1    AND: bits that are on in both
SELECT 5 | 3;   -- 7    OR: bits that are on in either
SELECT 5 # 3;   -- 6    XOR: bits on in one but not the other (mysql and sql server use ^)
SELECT ~5;      -- -6   NOT: flips every bit
SELECT 1 << 3;  -- 8    shift left, same as multiplying by 2 three times
SELECT 16 >> 2; -- 4    shift right
```

Careful with `^` in postgres, that's power not XOR. `SELECT 2 ^ 3` gives 8.

Checking a permission:

```sql
-- does permission 6 (write + delete) include write?
SELECT (6 & 2) <> 0 AS can_write;   -- true
-- does it include read?
SELECT (6 & 1) <> 0 AS can_read;    -- false
```

## logical XOR

Not the bit one, the true/false one. "exactly one of these is true".

```sql
-- customers who have a phone OR a city, but not both
SELECT first_name, city, phone
FROM customers
WHERE (phone IS NOT NULL) <> (city IS NOT NULL);
-- Priya, Sneha, Karan, Arjun
```

Comparing two booleans with `<>` is XOR. Mysql has an actual `XOR` keyword, postgres and sql server don't.

## bit and bool aggregates

Like SUM, but for bits and booleans:

```sql
SELECT BIT_OR(x), BIT_AND(x)
FROM (VALUES (1), (2), (4)) AS t(x);
-- 7, 0      (all the flags anyone has, flags everyone has)

SELECT
  BOOL_AND(status = 'delivered') AS all_delivered,
  BOOL_OR(status = 'cancelled')  AS any_cancelled
FROM orders;
-- false, true
```

BOOL_OR is a neat way to ask "did this customer ever do X":

```sql
SELECT customer_id, BOOL_OR(status = 'cancelled') AS ever_cancelled
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
```

Mysql has BIT_AND / BIT_OR / BIT_XOR but not BOOL_AND, use `MIN(condition)` and `MAX(condition)` there since true is 1 and false is 0.

## unix timestamps

Lots of apps and APIs store time as "seconds since 1 jan 1970". You'll see numbers like 1719792000 in logs and need to turn them into a real date.

```sql
SELECT to_timestamp(1719792000);
-- 2024-07-01 00:00:00+00  (shown in your session's timezone, so it might say 05:30+05:30 in india)

SELECT EXTRACT(EPOCH FROM TIMESTAMP '2024-07-01 00:00:00');
-- 1719792000, the other way around
```

```sql
-- mysql:      SELECT FROM_UNIXTIME(1719792000), UNIX_TIMESTAMP('2024-07-01 00:00:00');
-- sql server: SELECT DATEADD(SECOND, 1719792000, '1970-01-01'), DATEDIFF(SECOND, '1970-01-01', '2024-07-01');
```

If the number has 13 digits, it's milliseconds not seconds (javascript does this). Divide by 1000 first.

## sounds like (soundex)

SOUNDEX turns a word into a code based on how it sounds, so spelling mistakes still match.

```sql
-- mysql:      SELECT SOUNDEX('Priya'), SOUNDEX('Preeya');   -- both P600
--             SELECT * FROM customers WHERE first_name SOUNDS LIKE 'Preeya';
-- sql server: SELECT SOUNDEX('Priya'), DIFFERENCE('Priya', 'Preeya');   -- 4 means very similar
-- postgres:   CREATE EXTENSION fuzzystrmatch;  then SELECT soundex('Priya');
```

It was made for english surnames so it's rough with indian names and basically everything else. For real fuzzy search postgres people use the `pg_trgm` extension with `similarity()`.

## sleep

```sql
SELECT pg_sleep(2);   -- waits 2 seconds, returns nothing
-- mysql:      SELECT SLEEP(2);
-- sql server: WAITFOR DELAY '00:00:02';
```

Good for testing timeouts and locks. You also see this one in SQL injection attacks, if `' OR SLEEP(5)--` makes the page load 5 seconds slower, the attacker knows the site is injectable. (SQL injection & security topic)

## advisory locks

Normal locks are on rows and tables. Advisory locks are on a number you pick, and the database just keeps track of who's holding it. Useful when you want "only one copy of this job runs at a time".

```sql
SELECT pg_try_advisory_lock(42);   -- true if you got it, false if someone else has it
-- ... do the job ...
SELECT pg_advisory_unlock(42);
```

```sql
-- mysql:      SELECT GET_LOCK('nightly_report', 10);   -- waits up to 10 seconds
--             SELECT RELEASE_LOCK('nightly_report');
--             SELECT IS_FREE_LOCK('nightly_report');
-- sql server: EXEC sp_getapplock @Resource = 'nightly_report', @LockMode = 'Exclusive';
```

The database doesn't stop anyone from touching the data, it's only a lock if everyone agrees to check it. Hence "advisory".

## ip addresses

```sql
SELECT '192.168.1.10'::inet << '192.168.1.0/24'::inet;   -- true, is this ip inside that range
SELECT host('192.168.1.10/24'::inet);                    -- 192.168.1.10
```

```sql
-- mysql stores ips as numbers:
-- SELECT INET_ATON('192.168.1.10');   -- 3232235786
-- SELECT INET_NTOA(3232235786);       -- 192.168.1.10
```

Postgres has a proper `inet` type so you don't need the number trick. The `<<` there means "is contained in", not bit shift, same symbol different meaning because the types are different.

## stuff that trips people up

- `SELECT MAX(id)` to get the new id. Use RETURNING / LAST_INSERT_ID / SCOPE_IDENTITY.
- `^` is power in postgres and XOR in mysql / sql server. Same symbol, totally different answer.
- md5 for passwords. Don't.
- forgetting `encode(..., 'hex')` around sha256 in postgres and getting `\x...` bytes back.
- 13 digit unix timestamps are milliseconds.
- encryption keys written right in the query end up in logs.
- most of these are different in every database. Check the [functions cheat sheet](../../functions.md) when you switch.

## practice

Check [`queries.sql`](queries.sql).
