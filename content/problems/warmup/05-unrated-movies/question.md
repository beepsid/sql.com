---
title: Movies nobody rated yet
difficulty: easy
tags: NULL, IS NULL
learn: beginner/04-null-handling
tables: movies
output: title
---

Which movies don't have a rating yet (their `rating` is NULL)? Show the `title`.

## hints

- NULL means "unknown". Is unknown equal to unknown?
- `= NULL` never matches anything. There's a special way to check for NULL: `IS NULL`.

## explanation

`WHERE rating = NULL` runs without an error and returns **nothing**. Comparing anything with NULL gives "unknown", not true, so no row ever passes.

The only way to test for NULL is `IS NULL` (and `IS NOT NULL` for the opposite). Burn this one into memory, it causes bugs in real code all the time.
