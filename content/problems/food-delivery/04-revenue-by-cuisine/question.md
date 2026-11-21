---
title: Revenue by cuisine
difficulty: easy
tags: JOIN, SUM, filtering
tables: orders, restaurants
output: cuisine, revenue
---

What's the total revenue per cuisine? Revenue is the sum of `amount` on **delivered** orders. Tips aren't revenue.

Cuisines with no delivered orders don't appear.

## hints

- join to `restaurants` for the cuisine, filter `status = 'delivered'`, group by cuisine.

## explanation

Join, filter, group, sum. The only decision is *which* rows are revenue. Cancelled orders have an `amount` too, so forgetting the status filter quietly counts money that never came in. Always ask "which rows are real?" before summing.
