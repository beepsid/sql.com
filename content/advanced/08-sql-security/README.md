# SQL Injection & Security

SQL injection is when user input ends up being run as sql code. It's one of the oldest bugs on the web and still one of the most common. The fix is simple once you get why it happens.

## how it happens

Say your app builds a query by gluing strings together (python here, same in any language):

```python
email = request.form["email"]
query = "SELECT * FROM customers WHERE email = '" + email + "'"
```

Normal user types `aman@mail.com`:

```sql
SELECT * FROM customers WHERE email = 'aman@mail.com'
```

Fine. Now someone types `' OR '1'='1`:

```sql
SELECT * FROM customers WHERE email = '' OR '1'='1'
```

`'1'='1'` is always true, so this returns every customer. They just dumped your user table from a login box.

Or worse, `'; DROP TABLE customers; --`:

```sql
SELECT * FROM customers WHERE email = ''; DROP TABLE customers; --'
```

The `--` comments out the leftover quote. Table gone.

The root problem is the database can't tell which part is your query and which part is user data, it's all one string.

## the fix: parameterized queries

Send the query and the data separately. The database treats the data as data, never as code, no matter what's in it.

```python
# python (psycopg)
cur.execute("SELECT * FROM customers WHERE email = %s", (email,))
```

```javascript
// node (pg)
await client.query("SELECT * FROM customers WHERE email = $1", [email]);
```

```java
// java
PreparedStatement ps = conn.prepareStatement("SELECT * FROM customers WHERE email = ?");
ps.setString(1, email);
```

Now `' OR '1'='1` is just searched for as a weird email that doesn't exist. Zero rows. Done.

You can see the same idea in plain sql with PREPARE:

```sql
PREPARE find_customer(TEXT) AS
  SELECT * FROM customers WHERE email = $1;

EXECUTE find_customer('aman@mail.com');
EXECUTE find_customer(''' OR ''1''=''1');  -- returns nothing
```

## stuff that does NOT fix it

- **escaping quotes yourself**, there are always edge cases (encodings, backslashes). Don't.
- **blocking words like DROP or SELECT**, attackers have a hundred ways around blocklists.
- **checking input on the frontend only**, anyone can skip your frontend and hit the api directly.
- **ORMs**, they're safe by default, but most of them have a "raw query" function, and string-gluing inside that is just as vulnerable.

## the one place you can't use parameters

Parameters are for *values*. You can't parameterize a table name, column name, or ASC/DESC. If users choose the sort column:

```python
allowed = {"name": "first_name", "date": "signup_date"}
col = allowed.get(user_choice, "first_name")   # whitelist
query = f"SELECT * FROM customers ORDER BY {col}"
```

Only ever insert something from a fixed list you control.

## least privilege

Even if injection happens, limit the damage. The app shouldn't connect as a superuser.

```sql
CREATE ROLE app_user LOGIN PASSWORD 'change_me';
GRANT SELECT, INSERT, UPDATE ON customers, orders, order_items TO app_user;
-- no DROP, no DELETE, no access to other tables
```

Reporting tools get a read-only role:

```sql
CREATE ROLE analyst LOGIN PASSWORD 'change_me';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst;
```

## other basics

- **never store plain text passwords**, store a hash (bcrypt / argon2), done in the app, not with MD5.
- **don't show raw database errors to users**, they leak table names and structure.
- **row level security** (postgres), the database itself restricts which rows a user can see. Great for multi-tenant apps.
- **sensitive columns**, encrypt or mask stuff like phone numbers, aadhaar, card numbers. Only some roles should see them.
- **audit**, log who changed what, at least for important tables.

## stuff that trips people up

- "it's an internal tool so it's fine". Still parameterize.
- string formatting inside ORM raw queries.
- trying to parameterize column names and giving up and gluing strings.
- the app user owning the tables and having full rights.

## practice

Check [`queries.sql`](queries.sql).
