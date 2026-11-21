---
title: Long movies
difficulty: easy
tags: WHERE, comparisons
learn: beginner/02-where-filtering
tables: movies
output: title, minutes
---

Which movies are **longer than** 150 minutes? Show the `title` and `minutes`.

## hints

- `WHERE` keeps only the rows where a condition is true.
- "longer than 150" means 150 itself doesn't count. Is that `>` or `>=`?

## explanation

`WHERE minutes > 150` keeps the rows where the condition is true and drops the rest.

The trap is the boundary. A movie that's exactly 150 minutes is not *longer than* 150, so `>=` would wrongly include it. Whenever a question says "more than", "at least", "under" or "up to", stop and decide if the edge value counts.
