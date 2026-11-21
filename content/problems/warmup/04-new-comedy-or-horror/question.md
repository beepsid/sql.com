---
title: Recent comedies or horror
difficulty: easy
tags: AND / OR, brackets
learn: beginner/03-logical-operators
tables: movies
output: title, genre, release_year
---

Find movies that are a `Comedy` **or** `Horror`, and were released in **2020 or later**. Show the `title`, `genre` and `release_year`.

## hints

- you need an OR (comedy or horror) and an AND (2020 or later) in the same WHERE.
- `AND` runs before `OR`, just like `*` runs before `+` in maths. Use brackets to say what you mean.
- `genre IN ('Comedy', 'Horror')` is a neat way to avoid the OR completely.

## explanation

This one catches almost everyone the first time. Without brackets

```sql
WHERE genre = 'Comedy' OR genre = 'Horror' AND release_year >= 2020
```

SQL reads it as `genre = 'Comedy' OR (genre = 'Horror' AND release_year >= 2020)`, because AND binds tighter than OR. So every comedy ever made sneaks in, old ones too.

Brackets fix it: `WHERE (genre = 'Comedy' OR genre = 'Horror') AND release_year >= 2020`. Or skip the OR: `WHERE genre IN ('Comedy', 'Horror') AND release_year >= 2020`.
