---
title: Every genre, once
difficulty: easy
tags: DISTINCT
learn: beginner/08-distinct-values
tables: movies
output: genre
---

List every genre that appears in `movies`, each one **only once**.

## hints

- `SELECT genre FROM movies` gives one row per movie, so genres repeat.
- `SELECT DISTINCT genre` removes the duplicates.

## explanation

`DISTINCT` removes duplicate rows from the result. It works on the whole row, so `SELECT DISTINCT genre, language` gives each *combination* once, not each genre once. Here there's just one column, so you get one row per genre.
