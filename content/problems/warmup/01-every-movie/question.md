---
title: Every movie
difficulty: easy
tags: SELECT
learn: beginner/00-what-is-sql, beginner/01-select-basics
tables: movies
output: title, release_year
---

Show the `title` and `release_year` of every movie.

## hints

- you only need two keywords: `SELECT` (which columns) and `FROM` (which table).
- list the columns you want with a comma between them: `SELECT title, release_year`.

## explanation

The simplest query there is, and every other query is built on it:

```sql
SELECT title, release_year
FROM movies;
```

Columns come back in the order you list them. `SELECT *` would give you every column, which isn't what's asked, the checker wants exactly these two.
