---
title: Hindi comedies
difficulty: easy
tags: AND
learn: beginner/03-logical-operators
tables: movies
output: title
---

Find every movie that is a `Comedy` **and** in `Hindi`. Show the `title`.

## hints

- two conditions that both have to be true: join them with `AND`.
- text values go in single quotes: `genre = 'Comedy'`. And the spelling has to match the data exactly, capital C included.

## explanation

`AND` means both sides must be true for the row to stay:

```sql
WHERE genre = 'Comedy' AND language = 'Hindi'
```

In postgres text comparison is case sensitive, `'comedy'` wouldn't match `'Comedy'`. Look at the data (tables tab) before you write the value.
