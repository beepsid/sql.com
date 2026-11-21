---
title: Reorder rate by cohort
difficulty: hard
tags: cohorts, LEAD, first per group, performance
tables: orders
output: cohort_month, customers, reordered, reorder_pct
---

Group customers by the month of their **first delivered order** (their cohort). For each cohort, how many customers placed **another delivered order within 30 days** of that first one?

- "within 30 days" means placed no later than exactly 30 days (720 hours) after the first order's `placed_ts`
- only delivered orders count, both for the first order and the reorder. A cancelled order is not someone's first order.
- if two delivered orders share the first `placed_ts`, the smaller `order_id` is the first one and the other one counts as a reorder
- `cohort_month` is the first day of the month, `reorder_pct = 100 * reordered / customers` rounded to 1 decimal place

## hints

- filter to delivered orders first, then line up each customer's orders by `placed_ts, order_id`.
- the reorder that matters is just the customer's *second* delivered order. `LEAD(placed_ts) OVER (...)` on the first row gives it.
- an `EXISTS` subquery also works, but point it at the `orders` table (which has an index on `customer_id`), not at a CTE, or the large dataset times out.

## explanation

Cohort questions are always two steps:

1. **assign everyone to a cohort.** Here that's their first delivered order. Filtering `status = 'delivered'` *before* picking the first order matters: someone whose first attempt was cancelled joins the cohort of their first real order.
2. **measure something per cohort.** If the customer reordered within 30 days at all, then their *second* delivered order did. So one window pass does it:

```sql
ROW_NUMBER()   OVER (PARTITION BY customer_id ORDER BY placed_ts, order_id) AS rn,
LEAD(placed_ts) OVER (PARTITION BY customer_id ORDER BY placed_ts, order_id) AS next_ts
...
WHERE rn = 1   -- and reordered = next_ts <= placed_ts + INTERVAL '30 days'
```

**performance note:** the obvious version, `EXISTS (SELECT 1 FROM delivered_cte d WHERE d.customer_id = f.customer_id ...)`, can crawl. A CTE used twice gets materialised in postgres, and a materialised CTE has no indexes, so every customer scans every order. That's the kind of thing the large dataset is there to catch. Windows or a subquery on the real table both stay fast.
