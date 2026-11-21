---
title: Users by platform and country
difficulty: easy
tags: GROUP BY multiple columns
tables: users
output: platform, country, users
---

How many users signed up for each combination of `platform` and `country`?

Only combinations that have at least one user.

## hints

- you can group by more than one column: `GROUP BY platform, country`.

## explanation

Grouping by two columns gives one row per *combination* that actually exists in the data. ios + IN and ios + US are separate groups.

If you ever need every combination, including empty ones, you'd `CROSS JOIN` the distinct platforms with the distinct countries and LEFT JOIN the counts onto that.
