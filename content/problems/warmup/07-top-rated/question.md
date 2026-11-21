---
title: Top 3 rated movies
difficulty: easy
tags: ORDER BY, NULLs, LIMIT
learn: beginner/05-sorting-ordering, beginner/04-null-handling
tables: movies
output: title, rating
---

Show the **3 highest rated** movies: `title` and `rating`.

- movies with no rating don't count
- if ratings tie, go alphabetically by title

## hints

- `ORDER BY rating DESC, title LIMIT 3`... then run it and look closely at the top rows.
- in postgres, NULLs count as *bigger* than any number, so they come first when you sort DESC.
- filter them out with `WHERE rating IS NOT NULL` (or sort with `NULLS LAST`).

## explanation

Sort descending, take 3. Except in postgres NULLs sort as if they were the biggest value, so `ORDER BY rating DESC` puts every unrated movie at the **top**, and your "top 3" is three movies nobody rated.

Fix it with `WHERE rating IS NOT NULL`, or `ORDER BY rating DESC NULLS LAST`. MySQL and SQL Server do the opposite (NULLs first when ascending), which is exactly why it's worth being explicit.
