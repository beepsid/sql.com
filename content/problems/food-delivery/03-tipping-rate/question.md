---
title: How often do people tip?
difficulty: easy
tags: NULL handling, conditional counts
tables: orders
output: delivered_orders, tipped_orders, tip_rate_pct
---

Across all **delivered** orders, how many got a tip, and what percentage is that?

- an order counts as tipped only if `tip > 0`. NULL and 0 both mean no tip.
- `tip_rate_pct = 100 * tipped_orders / delivered_orders`, rounded to 1 decimal place
- return a single row

## hints

- `COUNT(tip)` counts every non-NULL tip, which includes the zeros.
- `COUNT(*) FILTER (WHERE tip > 0)` or `SUM(CASE WHEN tip > 0 THEN 1 ELSE 0 END)`.

## explanation

NULL and 0 look similar but mean different things: NULL is "we don't know / nothing recorded", 0 is "we know, and it's zero". Neither is a tip here, but they get counted differently:

- `COUNT(tip)` skips NULLs but **counts zeros**
- `tip > 0` is false for 0 and unknown for NULL, so a filter on it drops both

Whenever a column can be NULL or 0, decide what each one means before you count.
