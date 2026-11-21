-- JSON (postgres jsonb)
-- run sample-data.sql first

-- examples ---------------------------------------------------------

SELECT event_id, payload -> 'type' AS type_json, payload ->> 'type' AS type_text FROM events;

SELECT * FROM events WHERE payload ->> 'type' = 'page_view';

SELECT * FROM events WHERE payload @> '{"device": "mobile"}';

SELECT payload ->> 'device' AS device, COUNT(*) FROM events GROUP BY 1;

SELECT event_id, jsonb_array_elements_text(payload -> 'items') AS product_id
FROM events WHERE payload ? 'items';

SELECT jsonb_build_object('id', customer_id, 'name', first_name, 'city', city) FROM customers;


-- practice ---------------------------------------------------------

-- 1. list every event with the customer's first name and the event type
-- 2. which pages were viewed and how many times?
-- 3. events that have a product_id, with that product's name (join products)
-- 4. for the purchase event, list the names of all products in its items array
-- 5. one json object per customer with their name and an array of their order_ids
-- 6. add "source": "app" to every mobile event, then check it worked


-- answers ----------------------------------------------------------

-- 1
SELECT e.event_id, c.first_name, e.payload ->> 'type' AS type
FROM events e JOIN customers c ON e.customer_id = c.customer_id;

-- 2
SELECT payload ->> 'page' AS page, COUNT(*)
FROM events
WHERE payload ->> 'type' = 'page_view'
GROUP BY 1;

-- 3
SELECT e.event_id, p.product_name
FROM events e
JOIN products p ON p.product_id = (e.payload ->> 'product_id')::int;

-- 4
SELECT p.product_name
FROM events e
CROSS JOIN LATERAL jsonb_array_elements_text(e.payload -> 'items') AS item(product_id)
JOIN products p ON p.product_id = item.product_id::int
WHERE e.payload ->> 'type' = 'purchase';

-- 5
SELECT jsonb_build_object(
  'name', c.first_name,
  'orders', COALESCE(jsonb_agg(o.order_id) FILTER (WHERE o.order_id IS NOT NULL), '[]'::jsonb)
)
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.first_name;

-- 6
UPDATE events SET payload = payload || '{"source": "app"}' WHERE payload ->> 'device' = 'mobile';
SELECT * FROM events WHERE payload ? 'source';
-- undo
UPDATE events SET payload = payload - 'source';
