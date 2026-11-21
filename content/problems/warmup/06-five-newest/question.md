---
title: The 5 newest movies
difficulty: easy
tags: ORDER BY, LIMIT, tie breaks
learn: beginner/05-sorting-ordering, beginner/06-limit-offset
tables: movies
output: title, release_year
---

Show the **5 most recently released** movies: `title` and `release_year`.

If several movies came out in the same year and they don't all fit in the top 5, pick them alphabetically by title.

## hints

- sort newest first with `ORDER BY release_year DESC`, then keep 5 rows with `LIMIT 5`.
- when two movies have the same year, which one comes first? Add a second sort column: `ORDER BY release_year DESC, title`.

## explanation

`ORDER BY ... LIMIT n` is how you get "top N" of anything.

The subtle bit is ties. If the 5th and 6th movies came out in the same year, `ORDER BY release_year DESC LIMIT 5` picks one of them **randomly**, and it can change from run to run. Adding a second sort key makes it deterministic:

```sql
ORDER BY release_year DESC, title
LIMIT 5
```

Rule of thumb: whenever you use LIMIT, make sure your ORDER BY can't tie.
