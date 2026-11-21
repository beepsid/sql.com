---
title: Paid above the company average
difficulty: easy
tags: subqueries, AVG
tables: employees
output: emp_id, name, salary
---

List the **current** employees whose salary is higher than the average salary of all **current** employees.

## hints

- you can't use `AVG()` straight inside a WHERE. Put it in a subquery: `salary > (SELECT AVG(salary) FROM ...)`.
- the average should also only include current employees.

## explanation

Aggregates run after WHERE, so `WHERE salary > AVG(salary)` is an error. A scalar subquery solves it: it runs once, returns one number, and you compare against it.

The easy mistake is the average itself. If the subquery forgets `termination_date IS NULL`, people who left years ago drag the average around. When a question says "current", check *every* place the table is read.
