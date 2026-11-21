---
title: Online store
tags: e-commerce
---

An online store with customers, products, orders and the items in each order. These are the kind of questions product and data analyst interviews love: top N per group, growth, conversion, repeat rate, anti-joins.

A few things that hold for every question here:

- an order's `status` is `completed`, `cancelled` or `refunded`. Only **completed** orders count as sales unless the question says otherwise.
- revenue for an order line is `quantity * unit_price`. `unit_price` is what the customer actually paid, it can be lower than the product's list `price`.
- `customer_id` on an order can be NULL (guest checkout).

Answers are checked on the sample data, named test cases, random data and a large dataset, so don't hardcode anything you see in the sample.
