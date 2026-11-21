---
title: Couriers doing two jobs at once
difficulty: hard
tags: self join, interval overlap, non-equi join
tables: orders
output: courier_id, order_id, other_order_id
---

Find every pair of **delivered** orders handled by the same courier whose delivery windows overlap. A window runs from `placed_ts` to `delivered_ts`.

- back to back doesn't count: if one ends at 12:30 and the next starts at 12:30, they don't overlap
- list each pair once, with the smaller id as `order_id`

## hints

- self join `orders` on `courier_id`, with `a.order_id < b.order_id` so each pair shows up once.
- two windows overlap when each one starts before the other one ends.
- "back to back doesn't count" means strict `<`, not `<=`.

## explanation

The overlap test is one of those formulas worth memorising. Two ranges `[a_start, a_end)` and `[b_start, b_end)` overlap exactly when

```sql
a_start < b_end AND b_start < a_end
```

That one condition covers every case: partial overlap on either side, one inside the other, identical windows. People often try to list the cases one by one with ORs and miss one.

It's a **non-equi join**: the join condition is a comparison, not just `=`. The same pattern finds double-booked meeting rooms, overlapping subscriptions or clashing shifts.
