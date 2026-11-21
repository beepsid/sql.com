-- data generator for random and large test datasets.
-- {{seed}} picks the dataset, {{n}} is the number of customers.

INSERT INTO customers
SELECT g,
       'customer ' || g,
       (ARRAY['IN','US','GB','DE','BR','JP','AE'])[1 + floor(gen_rand('{{seed}}:c:' || g) * 7)::int],
       DATE '2025-09-01' + floor(gen_rand('{{seed}}:s:' || g) * 240)::int
FROM generate_series(1, {{n}}) g;

-- a catalog that grows a bit with n. prices are coarse so revenue ties happen.
INSERT INTO products
SELECT p,
       'product ' || p,
       (ARRAY['Laptops','Accessories','Audio','Phones','Books'])[1 + (p % 5)],
       (10 + floor(gen_rand('{{seed}}:p:' || p) * 20) * 10)::numeric(10,2)
FROM generate_series(1, GREATEST(30, {{n}} / 20)) p;

-- up to 6 orders per customer, starting on or after signup.
-- some orders land within the first week, some on the same day, a few are guest orders.
INSERT INTO orders
SELECT ROW_NUMBER() OVER (ORDER BY g, k),
       CASE WHEN gen_rand('{{seed}}:guest:' || g || ':' || k) < 0.03 THEN NULL ELSE g END,
       (c.signup_date
         + CASE WHEN gen_rand('{{seed}}:early:' || g || ':' || k) < 0.3
                THEN floor(gen_rand('{{seed}}:d1:' || g || ':' || k) * 10)::int
                ELSE floor(gen_rand('{{seed}}:d2:' || g || ':' || k) * 150)::int END)
       + floor(gen_rand('{{seed}}:t:' || g || ':' || k) * 86400) * INTERVAL '1 second',
       CASE WHEN gen_rand('{{seed}}:st:' || g || ':' || k) < 0.75 THEN 'completed'
            WHEN gen_rand('{{seed}}:st2:' || g || ':' || k) < 0.6 THEN 'cancelled'
            ELSE 'refunded' END
FROM generate_series(1, {{n}}) g
JOIN customers c ON c.customer_id = g
CROSS JOIN generate_series(1, 6) k
WHERE gen_rand('{{seed}}:o:' || g || ':' || k) < 0.5;

-- 1 to 3 lines per order. unit price is the list price or a 10% discount.
INSERT INTO order_items
SELECT o.order_id,
       pr.product_id,
       1 + floor(gen_rand('{{seed}}:q:' || o.order_id || ':' || i) * 3)::int,
       CASE WHEN gen_rand('{{seed}}:disc:' || o.order_id || ':' || i) < 0.2
            THEN round(pr.price * 0.9, 2) ELSE pr.price END
FROM orders o
CROSS JOIN generate_series(1, 3) i
JOIN products pr
  ON pr.product_id = 1 + floor(gen_rand('{{seed}}:pi:' || o.order_id || ':' || i)
                               * (SELECT COUNT(*) FROM products))::int
WHERE i = 1 OR gen_rand('{{seed}}:line:' || o.order_id || ':' || i) < 0.4;
