---
title: Median salary by department
difficulty: medium
tags: percentiles, statistics
tables: employees, departments
output: dept_name, median_salary
---

For each department with at least one current employee, return the median salary of its **current** employees.

With an even number of people, the median is the average of the two middle salaries (so 70, 80, 90, 100 gives 85). Round `median_salary` to 2 decimal places.

## hints

- postgres has `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)`.
- `PERCENTILE_DISC` picks an actual value. With an even count you want the average of the two middle ones, which is `_CONT`.

## explanation

`PERCENTILE_CONT(0.5)` interpolates, so for 70, 80, 90, 100 it gives 85. `PERCENTILE_DISC(0.5)` returns a real value from the list (80), which isn't what's asked.

No percentile function? The manual way also works everywhere:

```sql
ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary) AS rn,
COUNT(*)     OVER (PARTITION BY dept)                 AS cnt
...
WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2)   -- then AVG(salary)
```
