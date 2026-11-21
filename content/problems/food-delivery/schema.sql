CREATE TABLE restaurants (
  restaurant_id  INT PRIMARY KEY,
  name           TEXT,
  city           TEXT,
  cuisine        TEXT
);

CREATE TABLE couriers (
  courier_id  INT PRIMARY KEY,
  name        TEXT,
  city        TEXT
);

CREATE TABLE orders (
  order_id       INT PRIMARY KEY,
  customer_id    INT,
  restaurant_id  INT,
  courier_id     INT,
  placed_ts      TIMESTAMP,
  delivered_ts   TIMESTAMP,
  status         TEXT,
  amount         NUMERIC(10,2),
  tip            NUMERIC(10,2),
  rating         INT
);

CREATE INDEX ON orders (customer_id);
CREATE INDEX ON orders (restaurant_id);
CREATE INDEX ON orders (courier_id);
CREATE INDEX ON orders (placed_ts);
