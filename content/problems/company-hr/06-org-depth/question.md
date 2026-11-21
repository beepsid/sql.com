---
title: Org chart depth
difficulty: hard
tags: recursive CTE, hierarchy
tables: employees
output: emp_id, name, level, reports_total
---

For every employee (current or not), return:

- `level`, how far down the org chart they are. Someone with no manager is level 1, their direct reports are level 2, and so on.
- `reports_total`, how many people sit anywhere below them in the chart (direct reports, their reports, and so on all the way down). Count everyone, current or not.

You can assume there are no loops in the chart, and every `manager_id` points at an existing employee.

## hints

- `level` is a recursive CTE: start with people whose `manager_id` is NULL at level 1, then join their reports at level + 1.
- for `reports_total`, build every (boss, person below them) pair recursively, then count per boss.
- people at the bottom have no reports. LEFT JOIN and `COALESCE` to 0.

## explanation

Hierarchies need `WITH RECURSIVE`. The shape is always:

```sql
WITH RECURSIVE t AS (
  SELECT ... FROM employees WHERE manager_id IS NULL   -- anchor
  UNION ALL
  SELECT ... FROM employees e JOIN t ON e.manager_id = t.emp_id   -- step
)
```

Going **down** from the top gives levels. For "everyone below me", it's easier to go **up**: start from every direct (manager, employee) pair and keep replacing the manager with *their* manager. Each row is one (boss, someone under them) pair, so counting rows per boss is the total.
