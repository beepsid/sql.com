# String Functions

Text data is always messy. Extra spaces, random caps, stuff you need to cut or join. These are the functions you'll keep reaching for. Postgres names, mysql differences noted where they matter.

## joining text

```sql
SELECT first_name || ' ' || last_name FROM customers;       -- postgres / standard
SELECT CONCAT(first_name, ' ', last_name) FROM customers;   -- works in both
SELECT CONCAT_WS(', ', last_name, first_name) FROM customers; -- "with separator"
```

Difference that matters, `||` gives NULL if any piece is NULL. CONCAT just treats NULL as empty. CONCAT_WS skips NULLs and doesn't leave double separators.

## changing case

```sql
SELECT UPPER(first_name), LOWER(email), INITCAP('hello world') FROM customers;
-- INITCAP -> 'Hello World' (postgres only)
```

Handy for case-insensitive matching, `WHERE LOWER(email) = LOWER('Aman@Mail.com')`.

## length

```sql
SELECT first_name, LENGTH(first_name) FROM customers;
```

In mysql `LENGTH` counts bytes and `CHAR_LENGTH` counts characters, they differ for emojis/hindi text. In postgres LENGTH counts characters, fine.

## cutting pieces out

```sql
SELECT LEFT(first_name, 3)  FROM customers;   -- first 3 chars
SELECT RIGHT(phone, 4)      FROM customers;   -- last 4 digits
SELECT SUBSTRING(email FROM 1 FOR 4) FROM customers;  -- postgres style
SELECT SUBSTRING(email, 1, 4) FROM customers;         -- also works
```

Positions start at 1 in sql, not 0.

## finding stuff inside text

```sql
SELECT email, POSITION('@' IN email) FROM customers;  -- where's the @
SELECT STRPOS(email, '@') FROM customers;             -- postgres, same thing
-- mysql: LOCATE('@', email) or INSTR(email, '@')
```

Combine with SUBSTRING to grab the domain:

```sql
SELECT email, SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain
FROM customers;
```

Or in postgres just `SPLIT_PART(email, '@', 2)`, way cleaner.

## cleaning

```sql
SELECT TRIM('   hello   ');          -- 'hello'
SELECT LTRIM('   hello');            -- 'hello'
SELECT RTRIM('hello   ');            -- 'hello'
SELECT TRIM(BOTH '-' FROM '--hi--'); -- 'hi'
SELECT REPLACE(phone, '98765', 'XXXXX') FROM customers;
```

Always TRIM user input data before comparing, `'Delhi '` with a trailing space is not `'Delhi'`.

## padding

```sql
SELECT LPAD(order_id::text, 6, '0') FROM orders;  -- 000101
SELECT RPAD('ab', 5, '*');                         -- 'ab***'
```

## others worth knowing

```sql
SELECT REVERSE('sql');               -- 'lqs'
SELECT REPEAT('ha', 3);              -- 'hahaha'
SELECT ASCII('A'), CHR(65);          -- 65, 'A'
SELECT MD5('hello');                 -- a hash
SELECT STRING_AGG(first_name, ', ') FROM customers;  -- all names in one string
-- mysql: GROUP_CONCAT(first_name SEPARATOR ', ')
```

STRING_AGG is an aggregate, so it works with GROUP BY, super useful:

```sql
SELECT city, STRING_AGG(first_name, ', ' ORDER BY first_name) AS people
FROM customers
GROUP BY city;
```

## regex (postgres)

When LIKE isn't enough.

```sql
SELECT * FROM customers WHERE email ~ '^[a-z]+@mail\.com$';  -- matches regex
SELECT * FROM customers WHERE first_name ~* '^a';             -- case insensitive
SELECT REGEXP_REPLACE('a1b2c3', '[0-9]', '', 'g');             -- 'abc'
-- mysql uses REGEXP / RLIKE
```

## stuff that trips people up

- `||` with NULL making the whole thing NULL.
- positions starting at 1, not 0.
- trailing spaces breaking equality checks.
- function names differing across databases, always check which one you're on.

## practice

Check [`queries.sql`](queries.sql).
