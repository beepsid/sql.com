---
title: Monthly revenue growth
difficulty: hard
tags: date functions, period over period, gaps
tables: orders, order_items
output: month, revenue, growth_pct
---

For every calendar month that has completed sales, show the month's revenue and its growth compared with the **previous calendar month**.

- `month` is the first day of the month, as a date (for example `2026-01-01`)
- revenue is the sum of `quantity * unit_price` over completed orders, using `order_ts` to decide the month
- `growth_pct = 100 * (revenue - previous month revenue) / previous month revenue`, rounded to 1 decimal place
- if the previous calendar month had no completed sales (or this is the first month), `growth_pct` is NULL. Careful, "previous calendar month" is not the same as "previous row".

## hints

- get revenue per month first, with the month as `DATE_TRUNC('month', order_ts)`.
- `LAG(revenue)` gives the previous *row*, which isn't the previous month if a month had no sales.
- join each month to the row for `month - interval '1 month'` instead. A LEFT JOIN gives NULL when that month is missing.

## explanation

The trap is in the question on purpose: "previous calendar month" isn't "previous row". If March had no completed sales, `LAG` would compare April to February and call it month-over-month growth.

Self-joining the monthly table on the actual previous month fixes it:

```sql
FROM monthly cur
LEFT JOIN monthly prev ON prev.month = cur.month - INTERVAL '1 month'
```

Alternative: build a complete month spine with `generate_series`, LEFT JOIN revenue onto it, then `LAG` is safe. `NULLIF(prev.revenue, 0)` is a good habit too, it turns a division by zero into NULL instead of an error.
