---
title: Movies per genre
difficulty: easy
tags: GROUP BY, COUNT
learn: beginner/07-aggregation-basics
tables: movies
output: genre, movies
---

How many movies are there in each genre? Show the `genre` and the count as `movies`.

## hints

- "in each genre" means one row per genre: `GROUP BY genre`.
- then `COUNT(*)` counts the rows inside each group.

## explanation

`GROUP BY genre` splits the table into one bucket per genre, and `COUNT(*)` runs once per bucket.

The rule to remember: every column in SELECT must either be in the GROUP BY, or be inside an aggregate like COUNT. That's why `SELECT genre, title, COUNT(*) ... GROUP BY genre` errors, which title should it show for a group of 5 movies?
