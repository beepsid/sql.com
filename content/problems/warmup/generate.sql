-- data generator for random and large test datasets.
-- {{seed}} picks the dataset, {{n}} is the number of movies.
-- values come from short lists so ties, NULL ratings and boundary lengths
-- (99, 100, 150, 151 minutes) all show up. some titles start with "The ",
-- some with "There" or "Theory" so LIKE 'The%' is a trap.
INSERT INTO movies
SELECT m,
       CASE WHEN gen_rand('{{seed}}:t:' || m) < 0.2 THEN 'The '
            WHEN gen_rand('{{seed}}:t:' || m) < 0.3 THEN (ARRAY['Theory of ', 'There Was ', 'Thea and '])[1 + floor(gen_rand('{{seed}}:th:' || m) * 3)::int]
            ELSE '' END
         || (ARRAY['Monsoon','Rocket','Station','Garden','River','Signal','Lantern','Ticket','Orbit','Window'])[1 + floor(gen_rand('{{seed}}:w:' || m) * 10)::int]
         || ' ' || m,
       (ARRAY['Drama','Comedy','Horror','Sci-Fi','Romance','Action'])[1 + floor(gen_rand('{{seed}}:g:' || m) * 6)::int],
       (ARRAY['Hindi','English','Tamil'])[1 + floor(gen_rand('{{seed}}:l:' || m) * 3)::int],
       2000 + floor(gen_rand('{{seed}}:y:' || m) * 25)::int,
       (ARRAY[85, 95, 99, 100, 101, 120, 135, 149, 150, 151, 165, 180])[1 + floor(gen_rand('{{seed}}:min:' || m) * 12)::int],
       CASE WHEN gen_rand('{{seed}}:nr:' || m) < 0.15 THEN NULL
            ELSE (ARRAY[5.5, 6.0, 6.5, 7.0, 7.2, 7.5, 8.0, 8.1, 8.5, 9.0])[1 + floor(gen_rand('{{seed}}:r:' || m) * 10)::int] END
FROM generate_series(1, {{n}}) m;
