---
title: Everyone's favourite cuisine
difficulty: medium
tags: top 1 per group, RANK, ties
tables: orders, restaurants
output: customer_id, cuisine, orders
---

For every customer, find the cuisine they ordered most often, counting **delivered** orders only.

If several cuisines tie for the top, return all of them.

## hints

- count orders per (customer, cuisine) first.
- then `RANK() OVER (PARTITION BY customer_id ORDER BY orders DESC)` and keep rank 1.

## explanation

This is "top 1 per group" where the thing being ranked is itself an aggregate. Do it in two steps:

1. `GROUP BY customer_id, cuisine` to get counts
2. rank those counts inside each customer

`RANK` keeps ties (both get 1). `ROW_NUMBER` would keep one random cuisine, and the grader would catch it on a customer with a tie.
