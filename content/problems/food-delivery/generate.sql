-- data generator for random and large test datasets.
-- {{seed}} picks the dataset, {{n}} is the number of orders.

-- the last two restaurants never get an order
INSERT INTO restaurants
SELECT r, 'restaurant ' || r,
       (ARRAY['Mumbai','Delhi','Bengaluru','Pune'])[1 + floor(gen_rand('{{seed}}:rc:' || r) * 4)::int],
       (ARRAY['Indian','Chinese','Italian','Burgers','Healthy','Desserts'])[1 + floor(gen_rand('{{seed}}:cu:' || r) * 6)::int]
FROM generate_series(1, GREATEST(12, {{n}} / 40)) r;

-- the last courier never gets a delivery
INSERT INTO couriers
SELECT c, 'courier ' || c,
       (ARRAY['Mumbai','Delhi','Bengaluru','Pune'])[1 + floor(gen_rand('{{seed}}:cc:' || c) * 4)::int]
FROM generate_series(1, GREATEST(6, {{n}} / 50)) c;

-- small datasets squeeze into a few days so couriers end up with overlapping
-- deliveries and customers reorder. a courier usually covers a whole (day, hour)
-- slot, which also creates overlaps. delivery times come from a short list
-- that sits right on the 45 minute line.
INSERT INTO orders
WITH base AS (
  SELECT o,
         floor(gen_rand('{{seed}}:day:' || o) * LEAST(90, GREATEST(5, {{n}} / 100)))::int AS day,
         (ARRAY[9,11,12,12,13,13,14,16,18,19,19,20,20,21,22,23])[1 + floor(gen_rand('{{seed}}:hr:' || o) * 16)::int] AS hr,
         gen_rand('{{seed}}:cx:' || o) < 0.12 AS cancelled,
         (ARRAY[18,25,30,35,40,44,45,45,46,50,60,75])[1 + floor(gen_rand('{{seed}}:dur:' || o) * 12)::int] AS mins,
         gen_rand('{{seed}}:tip:' || o) AS tr
  FROM generate_series(1, {{n}}) o
),
timed AS (
  SELECT *,
         TIMESTAMP '2026-01-28 00:00:00' + day * INTERVAL '1 day' + hr * INTERVAL '1 hour'
           + floor(gen_rand('{{seed}}:min:' || o) * 60) * INTERVAL '1 minute' AS placed
  FROM base
)
SELECT o,
       1 + floor(gen_rand('{{seed}}:cust:' || o) * GREATEST(15, {{n}} / 4))::int,
       1 + floor(gen_rand('{{seed}}:rest:' || o) * (GREATEST(12, {{n}} / 40) - 2))::int,
       CASE WHEN cancelled AND gen_rand('{{seed}}:nc:' || o) < 0.6 THEN NULL
            WHEN gen_rand('{{seed}}:slot:' || o) < 0.7
              THEN 1 + floor(gen_rand('{{seed}}:sc:' || day || ':' || hr) * (GREATEST(6, {{n}} / 50) - 1))::int
            ELSE 1 + floor(gen_rand('{{seed}}:rc2:' || o) * (GREATEST(6, {{n}} / 50) - 1))::int END,
       placed,
       CASE WHEN cancelled THEN NULL ELSE placed + mins * INTERVAL '1 minute' END,
       CASE WHEN cancelled THEN 'cancelled' ELSE 'delivered' END,
       (ARRAY[150,199,250,299,350,420,500,650,800])[1 + floor(gen_rand('{{seed}}:amt:' || o) * 9)::int],
       CASE WHEN cancelled OR tr < 0.35 THEN NULL
            WHEN tr < 0.5 THEN 0
            ELSE (ARRAY[10,20,30,50])[1 + floor(gen_rand('{{seed}}:tv:' || o) * 4)::int] END,
       CASE WHEN cancelled OR gen_rand('{{seed}}:rt:' || o) < 0.4 THEN NULL
            ELSE 1 + floor(gen_rand('{{seed}}:rv:' || o) * 5)::int END
FROM timed;
