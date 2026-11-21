---
title: Laptops but no accessories
difficulty: medium
tags: anti-join, NOT EXISTS, NULL traps
tables: customers, orders, order_items, products
output: customer_id, name
---

Marketing wants to send an accessories coupon to people who bought a laptop but never bought an accessory.

Return every customer who has a **completed** order containing a product in the `Laptops` category, and who has **never** had a completed order containing a product in the `Accessories` category.

Each customer should appear once, no matter how many laptops they bought.

## hints

- two conditions on the same customer: they *have* a completed laptop order, and they *don't have* a completed accessory order.
- `EXISTS (...)` for the first, `NOT EXISTS (...)` for the second. Each subquery joins orders → order_items → products.
- joining everything and filtering rows would check a single line at a time, which can't express "never".

## explanation

"Has X but never Y" is `EXISTS` + `NOT EXISTS`. Both are checks about the customer as a whole, so they belong in subqueries, not in a WHERE over joined rows.

If you join all the order lines and write `WHERE category = 'Laptops' AND category <> 'Accessories'`, each row is one line, so it only says "this line is a laptop". It can't see the customer's other orders. EXISTS also means each customer comes out once, no matter how many laptops they bought, without needing DISTINCT.
