---
title: Cancellation rate by month
difficulty: medium
tags: conditional aggregation, dates, percentages
tables: orders
output: month, orders, cancelled, cancel_pct
---

For each month (first day of the month, like `2026-01-01`), count all orders, count the **cancelled** ones, and work out the cancellation rate.

- all orders count, including guests and refunded ones
- refunded is not cancelled
- `cancel_pct = 100 * cancelled / orders`, rounded to 1 decimal place

## hints

- one GROUP BY month, then count everything and *also* count only the cancelled rows in the same query.
- `COUNT(*) FILTER (WHERE status = 'cancelled')` in postgres, or `SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)` anywhere.

## explanation

This is **conditional aggregation**: several counts with different conditions, in one pass over the table.

```sql
COUNT(*)                                           AS orders,
SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
```

It's way faster and simpler than writing two queries and joining them, and it's how most funnel and rate metrics are written in practice.
