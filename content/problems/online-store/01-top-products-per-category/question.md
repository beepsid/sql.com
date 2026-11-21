---
title: Top 3 products per category
difficulty: medium
tags: window functions, top N per group, ties
tables: products, order_items, orders
output: category, product_name, revenue
---

For each category, find the top 3 products by revenue from **completed** orders.

- revenue is the sum of `quantity * unit_price`
- products that tie on revenue share a rank. Include every product whose rank is 3 or better, so a category can return more than 3 products. For example revenues 500, 300, 300, 200 give ranks 1, 2, 2, 4, so the first three come back and 200 doesn't.
- products with no completed sales aren't ranked at all

## hints

- compute revenue per product from completed orders first.
- then `RANK() OVER (PARTITION BY category ORDER BY revenue DESC)`.
- keep `rank <= 3`. With RANK, ties share a number and the next one skips, which is exactly what the example wants.

## explanation

Top N per group, step by step:

1. aggregate to the level you're ranking (product revenue)
2. rank inside each group with a window function
3. filter on the rank in an outer query (you can't put a window function in WHERE)

The example in the question decides the function: 500, 300, 300, 200 → 1, 2, 2, 4 is `RANK`. `DENSE_RANK` would make 200 a 3 and let it in, `ROW_NUMBER` would drop one of the tied 300s.
