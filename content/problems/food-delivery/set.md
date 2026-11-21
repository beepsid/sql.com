---
title: Food delivery
tags: marketplace, operations
---

A food delivery app: restaurants, couriers and orders. Think of the analytics team at any delivery startup, these are the numbers they look at every morning: delivery times, late orders, tips, ratings, courier pay, repeat customers.

A few things that hold for every question here:

- an order's `status` is `delivered` or `cancelled`
- a cancelled order has no `delivered_ts`, and often no `courier_id` either
- `tip` is NULL when no tip was recorded, and `0` when the customer explicitly tipped nothing. Neither one is a tip.
- `rating` is 1 to 5, or NULL when the customer didn't rate. Only delivered orders can be rated.
- all timestamps are whole minutes

Answers are checked on the sample data, named test cases, random data and a large dataset, so don't hardcode anything you see in the sample.
