---
title: Short, normal or long
difficulty: easy
tags: CASE WHEN, boundaries
learn: beginner/10-case-when
tables: movies
output: title, length
---

Label every movie by how long it is, in a column called `length`:

| minutes | label |
|---|---|
| under 100 | `short` |
| 100 to 150 (both included) | `normal` |
| over 150 | `long` |

Show the `title` and the `length` label.

## hints

- `CASE WHEN ... THEN ... ELSE ... END` is if/else in SQL.
- checks run top to bottom and the first true one wins.
- check your boundaries: a 150 minute movie is `normal`, a 151 minute one is `long`.

## explanation

```sql
CASE
  WHEN minutes < 100  THEN 'short'
  WHEN minutes <= 150 THEN 'normal'
  ELSE 'long'
END AS length
```

Because the first true WHEN wins, the second line doesn't need `minutes >= 100`, anything under 100 was already caught. The classic mistake is `< 150` on the second line, which quietly turns 150 minute movies into `long`.
