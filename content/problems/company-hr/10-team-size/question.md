---
title: Team size of every manager
difficulty: easy
tags: self join, GROUP BY
tables: employees
output: manager_id, manager_name, direct_reports
---

For every manager, count their **current direct reports** (people whose `manager_id` points at them and who still work here).

Only list managers with at least one current direct report. The manager themselves may or may not still work here.

## hints

- join `employees` to itself: one copy for the report (`e`), one for the manager (`m`), on `m.emp_id = e.manager_id`.
- filter the *report* to current employees, then group by the manager.

## explanation

A **self join** treats one table as two. Give each copy its own alias and the rest is a normal join:

```sql
FROM employees e
JOIN employees m ON m.emp_id = e.manager_id
```

The inner join already drops managers with zero reports, which is what the question asks for.
