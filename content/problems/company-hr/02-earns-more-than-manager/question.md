---
title: Earns more than their manager
difficulty: easy
tags: self join
tables: employees
output: name, salary, manager_name, manager_salary
---

Find every **current** employee who earns more than their direct manager.

Compare against the manager's salary even if the manager has since left the company. People without a manager can't earn more than one, so they never show up.

## hints

- join `employees` to itself: `e` is the employee, `m` is their manager, `ON m.emp_id = e.manager_id`.
- only the *employee* has to be current, the manager can have left.

## explanation

The classic self join. Same table twice, different roles:

```sql
FROM employees e
JOIN employees m ON m.emp_id = e.manager_id
```

An inner join is right here, people with no manager can't earn more than one. Read carefully who the "current" filter applies to: here it's only `e`. Filtering `m` too would drop people whose manager left.
