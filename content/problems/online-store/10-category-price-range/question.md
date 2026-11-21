---
title: Price range per category
difficulty: easy
tags: aggregation, MIN, MAX, AVG
tables: products
output: category, products, cheapest, priciest, avg_price
---

For each product category, show how many products it has, the cheapest and the most expensive list `price`, and the average list price rounded to 2 decimal places.

## hints

- you can put several aggregates in one SELECT: `COUNT(*)`, `MIN(price)`, `MAX(price)`...
- `ROUND(AVG(price), 2)` for the average.

## explanation

One GROUP BY, five aggregates. Every aggregate runs over the same group of rows, so you never need separate queries for min, max and average.

Small detail that matters in real work: this uses the **list** price in `products`. What customers actually paid is `unit_price` in `order_items`, which can be lower because of discounts.
