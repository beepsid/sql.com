---
title: Repeat buyers by country
difficulty: medium
tags: aggregation, conditional counts, percentages
tables: customers, orders
output: country, buyers, repeat_buyers, repeat_rate
---

For each country, work out how many customers came back to buy again.

- `buyers` is the number of customers in that country with at least one completed order
- `repeat_buyers` is how many of them have **two or more** completed orders
- `repeat_rate = 100 * repeat_buyers / buyers`, rounded to 1 decimal place
- only include countries with at least one buyer. Guest orders (no customer) don't belong to any country.

## hints

- first count completed orders per customer (inner join, so only buyers are left).
- then per country: `COUNT(*)` buyers, and count only the ones with 2 or more orders.

## explanation

Two levels of aggregation: per customer, then per country. Trying to do it in one GROUP BY doesn't work because "2 or more orders" is a fact about a customer, not about a country.

So aggregate in a CTE first (orders per customer), then aggregate that (customers per country) with conditional counting. Multiplying by `100.0` keeps the rate from being truncated by integer division.
