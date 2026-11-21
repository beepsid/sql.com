---
title: Customers per country
difficulty: easy
tags: GROUP BY, COUNT
tables: customers
output: country, customers
---

How many customers do we have in each country?

Return one row per country that has at least one customer.

## hints

- one row per country means you group by `country`.
- `COUNT(*)` counts the rows inside each group.

## explanation

This is the shape almost every report starts from: pick the column you want one row per (`country`), `GROUP BY` it, and aggregate everything else.

```sql
SELECT country, COUNT(*) AS customers
FROM customers
GROUP BY country;
```

Any column in the SELECT that isn't inside an aggregate has to be in the GROUP BY. Remember that rule and half of the "column must appear in the GROUP BY clause" errors go away.
