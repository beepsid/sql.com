-- data generator for random and large test datasets.
-- {{seed}} picks the dataset, {{n}} is the number of employees.

-- the last department never gets anyone, so empty departments always exist
INSERT INTO departments
SELECT d, 'dept ' || d
FROM generate_series(1, GREATEST(5, {{n}} / 150)) d;

-- a random tree: everyone's manager is someone with a smaller id, so there are no loops.
-- a few extra people have no manager. salaries come from a short list so ties happen.
INSERT INTO employees
SELECT g,
       'employee ' || g,
       1 + floor(gen_rand('{{seed}}:d:' || g) * (GREATEST(5, {{n}} / 150) - 1))::int,
       CASE WHEN g = 1 OR gen_rand('{{seed}}:root:' || g) < 0.01 THEN NULL
            ELSE 1 + floor(gen_rand('{{seed}}:m:' || g) * (g - 1))::int END,
       (40 + floor(gen_rand('{{seed}}:s:' || g) * 30) * 5) * 1000,
       DATE '2019-01-01' + floor(gen_rand('{{seed}}:h:' || g) * 2190)::int,
       NULL
FROM generate_series(1, {{n}}) g;

-- about 20% have left. some leave exactly on a month end.
UPDATE employees
SET termination_date = CASE
      WHEN gen_rand('{{seed}}:me:' || emp_id) < 0.3
        THEN (DATE_TRUNC('month', hire_date + 30 + floor(gen_rand('{{seed}}:l:' || emp_id) * 900)::int)
              + INTERVAL '1 month - 1 day')::date
      ELSE hire_date + 1 + floor(gen_rand('{{seed}}:l:' || emp_id) * 900)::int
    END
WHERE gen_rand('{{seed}}:t:' || emp_id) < 0.2;
