# What is SQL? (start here)

Never written a line of SQL? Perfect, this page is for you. No installing anything, no setup. By the end of it you'll know what a database is, what a table is, and you'll have run your first query.

## So what's a database?

A database is just a place where an app keeps its data. Every app you use has one. When you order food, your order gets saved in a database. When you scroll Instagram, the posts come out of a database.

Inside a database, data lives in **tables**. And a table is basically a spreadsheet:

| customer_id | first_name | city | signup_date |
|---|---|---|---|
| 1 | Aman | Delhi | 2024-01-05 |
| 2 | Priya | Mumbai | 2024-01-20 |
| 3 | Rahul | Bengaluru | 2024-02-11 |

- each **row** is one thing, here one customer
- each **column** is one piece of info about it, like their city
- every column has a **type**: `first_name` holds text, `customer_id` holds numbers, `signup_date` holds dates

A database usually has lots of tables that point at each other. An `orders` table doesn't copy the customer's name into every order, it just stores their `customer_id`. That's how tables get connected, and you'll learn to put them back together later with JOIN.

## And SQL?

SQL (people say "sequel" or "S-Q-L", both are fine) is the language you use to **ask a database questions**. You write a question, called a **query**, the database answers with a table of results.

The nice thing is it reads almost like English:

```sql
SELECT first_name, city
FROM customers;
```

That's "give me the first name and city, from the customers table". Hit **run** under it, seriously, try it. You just ran your first query 🎉

## The database you'll practice on

Every topic on this site uses the same small, made-up shop database. These are the tables in it:

| table | what's in it |
|---|---|
| `customers` | 8 people with their name, email, city, phone and signup date |
| `products` | 8 products with a category and a price |
| `orders` | 10 orders: who ordered, when, the status and the amount |
| `order_items` | which products are in each order |
| `employees` | a small company with salaries and managers |
| `discounts`, `addresses`, `events` | used in later topics, ignore them for now |

Want to see everything in a table? `*` means "all columns":

```sql
SELECT * FROM products;
```

You can see the whole thing on the [sample data](../../sample-data.sql) page too.

## How to use the examples here

Every example on this site has two buttons under it:

- **run** shows you what it returns
- **edit & try your own** lets you change it first. Change `products` to `orders`, swap a column, break it on purpose and see the error

You can't break anything. Every run is undone right after, so the data is always exactly the same for everyone.

Try changing this one so it shows the `email` column instead of `city`:

```sql
SELECT first_name, city FROM customers;
```

## When you get an error

You will, all the time, that's normal, even for people who've done this for years. Errors on this site are explained in plain English by default:

```sql
SELECT first_name FROM customer;
```

Run that one. The table is called `customers`, not `customer`, and the error tells you exactly that. If you ever want to see the raw message the database actually sends (that's what you'll see at work), switch the errors to **postgres** in the error box.

## A few words you'll keep hearing

- **query**: a question you ask the database, written in SQL
- **keyword**: the SQL words with a special meaning, like `SELECT`, `FROM`, `WHERE`. People write them in CAPS so they stand out, but `select` works too
- **result**: the table you get back
- **NULL**: "no value / unknown", an empty cell. Gets its own topic later because it's sneaky
- **postgres**: short for PostgreSQL, the database this site runs. MySQL, SQL Server, SQLite are other databases. They all speak SQL, with small differences

There's a full [glossary](/glossary/) if you forget any of these.

## stuff that trips people up

- the semicolon `;` at the end just means "query over". You need it when you write several queries one after another
- text values go in **single quotes**: `'Delhi'`. Double quotes are for column names, mixing them up is the number one beginner error
- table and column names have to match exactly. `customer` is not `customers`

## practice

Three tiny ones below. Write the query, hit **run**, then **check my answer**. Then head to the next topic, SELECT, where we go properly into it.
