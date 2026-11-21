---
title: First purchase within 7 days
difficulty: medium
tags: conversion, aggregation, date math
tables: customers, orders
output: customer_id, signup_date, first_order_date
---

Find the customers whose **first completed order** happened within 7 days of signing up.

- compare calendar dates: the order's date minus `signup_date` must be between 0 and 7 days, both included. So an order at 23:30 on day 7 counts.
- it's the first *completed* order that matters. A cancelled order in the first week doesn't make someone count.
- `first_order_date` is the date (not timestamp) of that first completed order

## hints

- find each customer's first *completed* order: `MIN(order_ts)` with `status = 'completed'`.
- compare dates, not timestamps: `first_order_ts::date - signup_date BETWEEN 0 AND 7`.

## explanation

Two decisions matter:

1. **which first order.** Filter to completed orders *before* taking the MIN. Otherwise a cancelled order on day 2 becomes the "first order" and you count someone who didn't actually buy in their first week.
2. **dates vs timestamps.** `signup_date` is a date and `order_ts` has a time. Subtracting after casting to a date gives whole calendar days, so 23:30 on day 7 is still day 7.
