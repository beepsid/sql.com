CREATE TABLE departments (
  dept_id    INT PRIMARY KEY,
  dept_name  TEXT
);

CREATE TABLE employees (
  emp_id            INT PRIMARY KEY,
  name              TEXT,
  dept_id           INT,
  manager_id        INT,
  salary            INT,
  hire_date         DATE,
  termination_date  DATE
);

CREATE INDEX ON employees (dept_id);
CREATE INDEX ON employees (manager_id);
