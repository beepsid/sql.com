# Data Types

Every column has a type, and the type decides what you can store and what you can do with it. You can't do math on text, you can't do date stuff on a number. Picking the right type early saves so much pain later.

This is the postgres list. Mysql has mostly the same stuff with slightly different names, I've noted the big differences.

## text

| type | what it is |
|---|---|
| `CHAR(n)` | fixed length, pads with spaces. `CHAR(5)` storing 'ab' is really 'ab   '. Rarely want this. |
| `VARCHAR(n)` | up to n characters. Most common. |
| `TEXT` | no limit. In postgres it's just as fast as varchar, so use it freely. |

In mysql there's also TINYTEXT, MEDIUMTEXT, LONGTEXT, which are just text with different max sizes.

## whole numbers

| type | range (roughly) |
|---|---|
| `SMALLINT` | -32 thousand to 32 thousand |
| `INT` / `INTEGER` | -2 billion to 2 billion |
| `BIGINT` | -9 quintillion to 9 quintillion |

Ids for big tables should be BIGINT. 2 billion sounds like a lot until your events table hits it.

Mysql also has TINYINT (-128 to 127) and MEDIUMINT.

## decimals

| type | use it for |
|---|---|
| `NUMERIC(p, s)` / `DECIMAL(p, s)` | money, anything that needs to be exact. p is total digits, s is digits after the dot. `NUMERIC(10,2)` holds up to 99999999.99 |
| `REAL` / `FLOAT` / `DOUBLE PRECISION` | scientific stuff where tiny rounding errors are ok |

Never store money in FLOAT. See this:

```sql
SELECT 0.1::float + 0.2::float;      -- 0.30000000000000004
SELECT 0.1::numeric + 0.2::numeric;  -- 0.3
```

## dates and times

| type | example |
|---|---|
| `DATE` | `2024-03-15` |
| `TIME` | `14:30:00` |
| `TIMESTAMP` | `2024-03-15 14:30:00` |
| `TIMESTAMPTZ` | same but timezone aware, use this for "when did it happen" stuff |
| `INTERVAL` | `3 days`, `2 hours`, a length of time |

Always write dates as `'YYYY-MM-DD'`, it's the one format every database agrees on.

## true / false

`BOOLEAN`, holds true, false or NULL. Mysql fakes it with TINYINT(1).

## others you'll run into

- `UUID`, random unique ids like `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`
- `JSON` / `JSONB`, nested data (advanced topic on it)
- `ARRAY`, postgres lets a column hold a list, like `INT[]`
- `ENUM`, a fixed set of allowed values like ('small', 'medium', 'large')
- `BYTEA` (postgres) / `BLOB` (mysql), raw binary like files. Usually better to store files elsewhere and keep the path.

## converting between types (casting)

```sql
SELECT CAST('123' AS INT);
SELECT '123'::int;              -- postgres shortcut, same thing
SELECT CAST(order_date AS TEXT) FROM orders;
SELECT '2024-03-15'::date + 7;  -- 2024-03-22
```

You'll need this when numbers are stored as text, or when you want decimals from integer division:

```sql
SELECT 7 / 2;          -- 3
SELECT 7 / 2.0;        -- 3.5
SELECT 7::numeric / 2; -- 3.5
```

## checking a table's types

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders';
```

## stuff that trips people up

- storing numbers or dates as text, then sorting goes weird and math doesn't work.
- FLOAT for money.
- INT for ids that end up overflowing.
- integer division cutting off decimals.

## practice

Check [`queries.sql`](queries.sql).
