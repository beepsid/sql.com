---
title: Rating summary
difficulty: easy
tags: COUNT, AVG, NULLs in aggregates
learn: beginner/07-aggregation-basics, beginner/04-null-handling
tables: movies
output: movies, rated, avg_rating
---

Return **one row** with:

- `movies`: how many movies there are in total
- `rated`: how many of them have a rating
- `avg_rating`: the average rating, rounded to 1 decimal place

## hints

- `COUNT(*)` counts rows. `COUNT(rating)` counts only the rows where rating is not NULL.
- `ROUND(AVG(rating), 1)`. AVG already skips NULLs.
- name each column with `AS`, like `COUNT(*) AS movies`.

## explanation

Aggregates squash all the rows into one. Two flavours of COUNT do very different things:

- `COUNT(*)` counts rows, whatever is in them
- `COUNT(rating)` counts non-NULL ratings

`AVG`, `SUM`, `MIN` and `MAX` also ignore NULLs, so the average is over rated movies only, which is usually what you want.
