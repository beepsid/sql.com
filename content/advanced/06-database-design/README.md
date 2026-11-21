# Database Design & Normalization

Every other topic is about querying tables. This one's about how the tables should look in the first place. Bad design makes every query harder forever, so it's worth getting right.

## the main idea

Store each fact in exactly one place.

If a customer's email is written in the customers table *and* in every order row, then when they change it you have to update everything, and if you miss one, your data now disagrees with itself. That's called an update anomaly, and normalization is basically the rules to avoid it.

## keys

- **primary key**, uniquely identifies a row. `customer_id`. Never NULL, never duplicated.
- **foreign key**, a column pointing to another table's primary key. `orders.customer_id → customers.customer_id`. The database won't let you add an order for a customer that doesn't exist.
- **natural vs surrogate**, a natural key is real data (email, phone). A surrogate is a made up id. Use surrogate ids, real data changes (people change emails).

## relationships

**one to many**, one customer, many orders. Foreign key on the "many" side (`orders.customer_id`).

**many to many**, an order has many products, a product is in many orders. You can't do this with one foreign key, you need a table in between. That's `order_items`, it has `order_id` and `product_id`, one row per (order, product) pair. This in-between table is called a junction or bridge table.

**one to one**, rare. User and user_settings. Usually just same table unless there's a reason to split.

## normal forms (the short version)

You'll hear 1NF, 2NF, 3NF in interviews. Here's what they mean in plain words.

**1NF, one value per cell.**
Bad:
| order_id | products |
|---|---|
| 101 | Mouse, Cable |

You can't easily query "orders with a cable". Fix, one row per product (that's order_items).

**2NF, every column depends on the whole key.**
Say order_items had `(order_id, product_id, quantity, product_name)`. The key is (order_id, product_id), but product_name only depends on product_id. So the same product name is copied into every order. Move it to products.

**3NF, no column depends on another non-key column.**
Say customers had `city` and `city_state`. state depends on city, not on the customer. Delhi is always Delhi state. Move it to a cities table.

The phrase people remember: every column should depend on "the key, the whole key, and nothing but the key".

## our sample data, checked

- customers, products, employees, all one thing per row ✓
- orders → customers via customer_id ✓
- order_items is the junction for orders ↔ products ✓
- `orders.amount` is technically duplicate info, you could compute it from order_items × price. But prices change over time, so storing what was actually charged is correct. That's a good reason to "break" the rules.

## denormalization

Sometimes you copy data on purpose:
- storing the price at time of purchase (because product prices change)
- a `total_orders` counter on customers so you don't COUNT every time
- wide flat tables in analytics / data warehouses for faster reporting

The deal is faster reads, but you're now responsible for keeping copies in sync.

## constraints (let the db enforce your rules)

```sql
CREATE TABLE orders_v2 (
  order_id    BIGINT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(customer_id),
  status      TEXT NOT NULL CHECK (status IN ('pending','shipped','delivered','cancelled')),
  amount      NUMERIC(10,2) CHECK (amount >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

NOT NULL, UNIQUE, CHECK, FOREIGN KEY. Every rule the database enforces is one less bug your app can introduce.

## naming

Boring but matters:
- pick singular or plural table names and stick to it
- `snake_case`
- id columns as `tablename_id` so joins read clearly
- no spaces, no reserved words like `order` or `user` as table names (you'll be quoting them forever)

## stuff that trips people up

- comma separated lists in a column.
- copying the same info into multiple tables with no reason.
- no foreign keys, so orphan rows pile up.
- using email or phone as the primary key.
- over-normalizing tiny stuff into 15 tables nobody can query.

## practice

Check [`queries.sql`](queries.sql).
