# Self Joins

A self join is just joining a table to itself. Nothing new syntax wise, but it trips people up because it feels weird at first.

## when would you even need this

When rows in a table point to other rows in the same table. The classic one is employees, every employee has a manager_id, and the manager is also an employee in the same table.

```
employee_id | name   | manager_id
1           | Vikram | NULL       <- the boss
2           | Anita  | 1          <- reports to Vikram
3           | Rohit  | 2          <- reports to Anita
```

## the trick: two aliases

Pretend you have two copies of the table, one called `e` (employees) and one called `m` (managers).

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id;
```

Read the ON like "the employee's manager_id is the manager's employee_id".

Vikram isn't in the result because his manager_id is NULL, no match. Use LEFT JOIN if you want him:

```sql
SELECT e.name AS employee, COALESCE(m.name, '-') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

## who earns more than their manager?

Classic interview question. Once you have both rows side by side it's easy:

```sql
SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;
```

Nobody in our data, which is honestly realistic. Change Meera's salary to 160000 and try again.

## comparing rows with each other

Self joins aren't only for hierarchies. Find pairs of employees in the same department:

```sql
SELECT a.name, b.name, a.department
FROM employees a
JOIN employees b
  ON a.department = b.department
 AND a.employee_id < b.employee_id;
```

Why `<` and not `<>`? With `<>` you'd get (Rohit, Meera) and also (Meera, Rohit), plus nobody gets paired with themselves either way. `<` keeps each pair only once.

Another one, customers from the same city:

```sql
SELECT a.first_name, b.first_name, a.city
FROM customers a
JOIN customers b ON a.city = b.city AND a.customer_id < b.customer_id;
```

## going more than one level up

Employee → manager → manager's manager, just join again:

```sql
SELECT e.name, m.name AS manager, mm.name AS skip_manager
FROM employees e
LEFT JOIN employees m  ON e.manager_id = m.employee_id
LEFT JOIN employees mm ON m.manager_id = mm.employee_id;
```

This gets ugly fast if you don't know how deep the tree goes. That's what recursive CTEs are for (advanced topic).

## stuff that trips people up

- forgetting aliases, you literally can't do a self join without them.
- mixing up which side is which in ON, `e.employee_id = m.manager_id` gives you reports instead of managers.
- getting every pair twice with `<>`.
- INNER join dropping the top of the hierarchy.

## practice

Check [`queries.sql`](queries.sql).
