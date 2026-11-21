# JSON in SQL

Sometimes data doesn't fit neat columns. Event logs where every event type has different fields, api responses, user settings. Postgres lets you store JSON in a column and still query inside it. Our `events` table has a `payload` JSONB column for exactly this.

## JSON vs JSONB

Postgres has both. Use **JSONB**.
- JSON stores the raw text, re-parses it every time you query
- JSONB stores a parsed binary version, faster to query, can be indexed, drops duplicate keys and whitespace

## getting values out

Two arrows, and the difference matters:

- `->` gives you JSON back
- `->>` gives you text back

```sql
SELECT
  event_id,
  payload -> 'type'  AS type_json,   -- "page_view" (with quotes, it's json)
  payload ->> 'type' AS type_text    -- page_view   (plain text)
FROM events;
```

Use `->>` when you want to compare or display. Use `->` when you need to go deeper.

## going deeper

```sql
SELECT payload -> 'items' -> 0 FROM events WHERE event_id = 4;   -- first item, as json: 2
SELECT payload #>> '{items,0}' FROM events WHERE event_id = 4;  -- same, as text
```

`#>` / `#>>` take a path. Arrays are 0-indexed in json (unlike sql strings, fun).

## filtering

```sql
SELECT * FROM events WHERE payload ->> 'type' = 'page_view';

SELECT * FROM events WHERE payload ->> 'device' = 'mobile';
```

Numbers come out as text with `->>`, so cast them:

```sql
SELECT * FROM events WHERE (payload ->> 'product_id')::int = 2;
```

## containment @>

"does this json contain this bit?". Fast, and works with indexes:

```sql
SELECT * FROM events WHERE payload @> '{"device": "mobile"}';
```

## does a key exist?

```sql
SELECT * FROM events WHERE payload ? 'product_id';   -- has the key
SELECT * FROM events WHERE payload ?| array['page', 'order_id'];  -- has any of these
```

## grouping on json fields

```sql
SELECT payload ->> 'device' AS device, COUNT(*)
FROM events
GROUP BY 1;
```

Once you pull the value out with `->>`, it's just a normal text column.

## arrays inside json

Turn a json array into rows:

```sql
SELECT event_id, jsonb_array_elements_text(payload -> 'items') AS product_id
FROM events
WHERE payload ? 'items';
```

Then you can join that to products like any other table.

## building json

The other direction, rows into json:

```sql
SELECT jsonb_build_object('id', customer_id, 'name', first_name, 'city', city)
FROM customers;

-- one json array of all products
SELECT jsonb_agg(jsonb_build_object('name', product_name, 'price', price))
FROM products;
```

Handy when an api wants nested data.

## updating json

```sql
UPDATE events SET payload = payload || '{"seen": true}' WHERE event_id = 1;   -- add / overwrite a key
UPDATE events SET payload = payload - 'seen' WHERE event_id = 1;              -- remove a key
UPDATE events SET payload = jsonb_set(payload, '{device}', '"ipad"') WHERE event_id = 5;
```

## indexing

```sql
CREATE INDEX idx_events_payload ON events USING GIN (payload);  -- helps @> and ?
CREATE INDEX idx_events_type ON events ((payload ->> 'type'));   -- helps ->> 'type' = ...
```

## when NOT to use JSON

If you query a field all the time, filter on it, join on it, it should be a real column. JSON is great for the flexible extra stuff, terrible as an excuse to not design tables. A table that's just `id, data JSONB` is a red flag.

## mysql

Has JSON too, different syntax: `JSON_EXTRACT(payload, '$.type')` or `payload->>'$.type'`.

## stuff that trips people up

- `->` vs `->>`, comparing json to text and getting nothing back.
- forgetting to cast numbers out of `->>`.
- json arrays starting at 0.
- dumping everything into json and then needing joins on it.

## practice

Check [`queries.sql`](queries.sql).
