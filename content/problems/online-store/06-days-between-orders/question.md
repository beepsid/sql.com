---
title: Average days between orders
difficulty: hard
tags: LAG, window functions, date math
tables: orders
output: customer_id, avg_days_between
---

For every customer with **at least two completed orders**, find the average number of days between one completed order and their next one.

- use calendar dates of `order_ts`, so two orders on the same day are 0 days apart
- "next one" means next in time, not next by `order_id`
- round `avg_days_between` to 1 decimal place
- guest orders (no `customer_id`) don't belong to a customer, leave them out

Example: completed orders on Jan 1, Jan 3 and Jan 4 give gaps of 2 and 1, so the average is 1.5.

## hints

- order each customer's completed orders by time and use `LAG(order_ts)` to get the previous one.
- use calendar dates: `order_ts::date - LAG(order_ts::date) OVER (...)` gives whole days, so same-day orders are 0 apart.
- customers with one order have no gap, so they drop out by themselves when you average non-NULL gaps.

## explanation

"Time between consecutive things" is always `LAG` (or `LEAD`):

```sql
order_ts::date - LAG(order_ts::date) OVER (PARTITION BY customer_id ORDER BY order_ts, order_id)
```

Order by the timestamp (with `order_id` as a tiebreak), not by `order_id` alone, since ids can be out of time order. Then average per customer. Fun fact: the average gap is also just `(last - first) / (n - 1)`, because all the gaps in between add up to the total span. Knowing both ways is a nice thing to mention in an interview.
