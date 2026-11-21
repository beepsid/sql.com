-- sample data for every topic in this repo
-- run this once and every query in the topics will work on it.
-- written for PostgreSQL, most of it works on mysql / sqlite too but some functions differ.
-- easiest way to try it: https://www.db-fiddle.com (pick postgres) and paste this whole file.

DROP TABLE IF EXISTS events, addresses, discounts, order_items, orders, products, employees, customers CASCADE;

CREATE TABLE customers (
  customer_id  INT PRIMARY KEY,
  first_name   VARCHAR(50),
  last_name    VARCHAR(50),
  email        VARCHAR(100),
  city         VARCHAR(50),
  phone        VARCHAR(15),
  signup_date  DATE
);

INSERT INTO customers VALUES
(1, 'Aman',  'Sharma', 'aman@mail.com',  'Delhi',     '9876500001', '2024-01-05'),
(2, 'Priya', 'Verma',  'priya@mail.com', 'Mumbai',    NULL,         '2024-01-20'),
(3, 'Rahul', 'Mehta',  'rahul@mail.com', 'Delhi',     '9876500003', '2024-02-11'),
(4, 'Sneha', 'Iyer',   'sneha@mail.com', 'Bangalore', NULL,         '2024-03-02'),
(5, 'Karan', 'Singh',  'karan@mail.com', NULL,        '9876500005', '2024-03-15'),
(6, 'Neha',  'Gupta',  'neha@mail.com',  'Mumbai',    '9876500006', '2024-04-01'),
(7, 'Arjun', 'Nair',   'arjun@mail.com', 'Chennai',   NULL,         '2024-05-10'),
(8, 'Riya',  'Kapoor', 'riya@mail.com',  'Delhi',     '9876500008', '2024-06-22');

CREATE TABLE products (
  product_id    INT PRIMARY KEY,
  product_name  VARCHAR(100),
  category      VARCHAR(50),
  price         NUMERIC(10,2)
);

INSERT INTO products VALUES
(1, 'Wireless Mouse',      'Electronics', 799),
(2, 'Mechanical Keyboard', 'Electronics', 3499),
(3, 'USB-C Cable',         'Electronics', 299),
(4, 'Notebook',            'Stationery',  120),
(5, 'Gel Pen Pack',        'Stationery',  150),
(6, 'Water Bottle',        'Home',        450),
(7, 'Desk Lamp',           'Home',        1299),
(8, 'Monitor 24in',        'Electronics', 10999);

CREATE TABLE orders (
  order_id     INT PRIMARY KEY,
  customer_id  INT REFERENCES customers(customer_id),
  order_date   DATE,
  status       VARCHAR(20),
  amount       NUMERIC(10,2)
);

INSERT INTO orders VALUES
(101, 1, '2024-02-01', 'delivered', 1098),
(102, 1, '2024-03-15', 'delivered', 3499),
(103, 2, '2024-03-20', 'cancelled', 450),
(104, 3, '2024-04-02', 'delivered', 10999),
(105, 3, '2024-04-18', 'shipped',   270),
(106, 4, '2024-05-05', 'delivered', 1299),
(107, 1, '2024-06-10', 'pending',   299),
(108, 6, '2024-06-25', 'delivered', 4298),
(109, 2, '2024-07-01', 'delivered', 120),
(110, 8, '2024-07-14', 'pending',   750);

CREATE TABLE order_items (
  order_id    INT REFERENCES orders(order_id),
  product_id  INT REFERENCES products(product_id),
  quantity    INT
);

INSERT INTO order_items VALUES
(101, 1, 1), (101, 3, 1),
(102, 2, 1),
(103, 6, 1),
(104, 8, 1),
(105, 4, 1), (105, 5, 1),
(106, 7, 1),
(107, 3, 1),
(108, 2, 1), (108, 1, 1),
(109, 4, 1),
(110, 6, 1), (110, 5, 2);

CREATE TABLE employees (
  employee_id  INT PRIMARY KEY,
  name         VARCHAR(50),
  department   VARCHAR(50),
  salary       INT,
  manager_id   INT REFERENCES employees(employee_id),
  hire_date    DATE
);

INSERT INTO employees VALUES
(1, 'Vikram', 'Management',  250000, NULL, '2018-01-10'),
(2, 'Anita',  'Engineering', 150000, 1,    '2019-03-01'),
(5, 'Sameer', 'Sales',       120000, 1,    '2019-06-11'),
(3, 'Rohit',  'Engineering', 90000,  2,    '2020-07-15'),
(4, 'Meera',  'Engineering', 95000,  2,    '2021-01-20'),
(6, 'Pooja',  'Sales',       70000,  5,    '2022-02-14'),
(7, 'Dev',    'Sales',       70000,  5,    '2022-08-01'),
(8, 'Isha',   'Engineering', 60000,  3,    '2023-05-05');

CREATE TABLE discounts (
  discount_code     VARCHAR(20) PRIMARY KEY,
  discount_percent  INT,
  valid_from        DATE,
  valid_to          DATE
);

INSERT INTO discounts VALUES
('NEWYEAR', 10, '2024-01-01', '2024-01-31'),
('HOLI',    15, '2024-03-10', '2024-03-31'),
('SUMMER',  20, '2024-06-01', '2024-06-30');

CREATE TABLE addresses (
  address_id    INT PRIMARY KEY,
  customer_id   INT REFERENCES customers(customer_id),
  city          VARCHAR(50),
  address_type  VARCHAR(20)
);

INSERT INTO addresses VALUES
(1, 1, 'Delhi',   'home'),
(2, 1, 'Gurgaon', 'office'),
(3, 3, 'Delhi',   'home'),
(4, 6, 'Mumbai',  'home'),
(5, 6, 'Pune',    'office'),
(6, 6, 'Mumbai',  'other');

CREATE TABLE events (
  event_id     INT PRIMARY KEY,
  customer_id  INT REFERENCES customers(customer_id),
  payload      JSONB
);

INSERT INTO events VALUES
(1, 1, '{"type": "page_view",   "page": "/home",     "device": "mobile"}'),
(2, 1, '{"type": "add_to_cart", "product_id": 2,     "device": "desktop"}'),
(3, 3, '{"type": "page_view",   "page": "/products", "device": "mobile"}'),
(4, 6, '{"type": "purchase",    "order_id": 108, "items": [2, 1], "device": "mobile"}'),
(5, 4, '{"type": "page_view",   "page": "/home",     "device": "tablet"}');
