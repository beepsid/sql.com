-- data generator for random and large test datasets.
-- {{seed}} picks the dataset, {{n}} is the number of users.

INSERT INTO users
SELECT u,
       DATE '2026-01-01' + floor(gen_rand('{{seed}}:su:' || u) * 60)::int,
       (ARRAY['IN','US','GB','BR','JP'])[1 + floor(gen_rand('{{seed}}:co:' || u) * 5)::int],
       (ARRAY['ios','android','web'])[1 + floor(gen_rand('{{seed}}:pl:' || u) * 3)::int]
FROM generate_series(1, {{n}}) u;

-- each user is active on some of the 30 days after signup (more likely early on),
-- with 1 to 4 events per active day. minute offsets come from a fixed list so
-- gaps of exactly 30 minutes, same-timestamp events and long gaps all show up.
INSERT INTO events
SELECT ROW_NUMBER() OVER (ORDER BY u.user_id, d, k),
       u.user_id,
       (u.signup_date + d)
         + (8 + floor(gen_rand('{{seed}}:h:' || u.user_id || ':' || d) * 14)) * INTERVAL '1 hour'
         + (ARRAY[0, 0, 5, 20, 30, 31, 45, 60, 90, 200])
             [1 + floor(gen_rand('{{seed}}:m:' || u.user_id || ':' || d || ':' || k) * 10)::int]
           * (k - 1) * INTERVAL '1 minute',
       (ARRAY['app_open','app_open','view_item','view_item','view_item','add_to_cart','add_to_cart','purchase'])
         [1 + floor(gen_rand('{{seed}}:ty:' || u.user_id || ':' || d || ':' || k) * 8)::int]
FROM users u
CROSS JOIN generate_series(0, 30) d
CROSS JOIN generate_series(1, 4) k
WHERE gen_rand('{{seed}}:act:' || u.user_id || ':' || d) < 0.55 - d * 0.012
  AND (k = 1 OR gen_rand('{{seed}}:k:' || u.user_id || ':' || d || ':' || k) < 0.5);
