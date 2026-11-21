---
title: Titles starting with "The"
difficulty: easy
tags: LIKE, patterns
learn: beginner/02-where-filtering
tables: movies
output: title
---

Find the movies whose title starts with the **word** "The", like "The Long Drive". A title like "Theory of Rain" doesn't count, that's a different word.

Show the `title`.

## hints

- `LIKE` matches patterns: `%` means "anything, any length".
- `LIKE 'The%'` also matches "Theory". What's different about a title that starts with the *word* The?
- there's a space after it: `LIKE 'The %'`.

## explanation

`LIKE 'The%'` means "starts with the letters T-h-e", which also matches Theory, There, Thermos...

To match the *word*, include the space: `LIKE 'The %'`. LIKE is case sensitive in postgres, so a title starting with lowercase "the" isn't matched either, which is what we want here. (`ILIKE` is the case insensitive version.)
