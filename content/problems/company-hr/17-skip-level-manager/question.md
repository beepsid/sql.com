---
title: Skip-level manager
difficulty: medium
tags: self join, LEFT JOIN
tables: employees
output: emp_id, name, skip_manager_name
---

For **every** employee (current or not), return the name of their skip-level manager: their manager's manager.

If someone has no manager, or their manager has no manager, `skip_manager_name` is NULL. Everyone still appears.

## hints

- join `employees` to itself twice: employee → manager → manager's manager.
- an inner join drops everyone near the top of the tree. You need LEFT JOINs, and the second one has to be a LEFT JOIN too.

## explanation

Chaining self joins walks up the org chart one level per join:

```sql
FROM employees e
LEFT JOIN employees m ON m.emp_id = e.manager_id
LEFT JOIN employees g ON g.emp_id = m.manager_id
```

If either join is an inner join, the CEO and their direct reports silently disappear. Once one LEFT JOIN is in a chain, every join after it on that side usually needs to be LEFT too. For "all the way up", you'd switch to a recursive CTE.
