CREATE TABLE customers (
  customer_id  INT PRIMARY KEY,
  name         TEXT,
  country      TEXT,
  signup_date  DATE
);

CREATE TABLE products (
  product_id    INT PRIMARY KEY,
  product_name  TEXT,
  category      TEXT,
  price         NUMERIC(10,2)
);

CREATE TABLE orders (
  order_id     INT PRIMARY KEY,
  customer_id  INT,
  order_ts     TIMESTAMP,
  status       TEXT
);

CREATE TABLE order_items (
  order_id    INT,
  product_id  INT,
  quantity    INT,
  unit_price  NUMERIC(10,2)
);

CREATE INDEX ON orders (customer_id);
CREATE INDEX ON orders (order_ts);
CREATE INDEX ON order_items (order_id);
CREATE INDEX ON order_items (product_id);
