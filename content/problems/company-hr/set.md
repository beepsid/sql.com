---
title: Company HR
tags: hr, classic
---

A company's employees, their managers and departments. The questions here are the classics every SQL interview seems to have a version of: top earner per department, earns more than their manager, second highest salary, median, headcount over time, org chart depth.

- `manager_id` points at another employee. The top of the org has no manager (NULL).
- `termination_date` is NULL for people who still work here. Someone is a **current** employee if `termination_date` is NULL.
- a department can have no employees at all

Answers are checked on the sample data, named test cases, random data and a large dataset, so don't hardcode anything you see in the sample.
