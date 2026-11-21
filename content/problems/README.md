# problems

Coding questions for the `/problems` page. People write a query, run it on the sample data, and submit. A submission is graded on:

1. **sample data**, the rows people can see in the tables tab
2. **named test cases**, small hand-written datasets, each one targeting one trap (ties, NULLs, boundary dates...). When one fails, its name is shown, so people know what they missed.
3. **random data**, 5 datasets made by a generator, compared against your model answer. Catches bugs nobody thought to write a test for.
4. **large data**, tens of thousands of rows from the same generator, with a time limit (10s by default). Catches queries that are right but way too slow.

## how a set is laid out

```
problems/
  online-store/
    set.md               <- title, tags, options, and the rules shown to people
    schema.sql           <- CREATE TABLE (+ indexes)
    sample.sql           <- INSERTs people can see
    generate.sql         <- makes the random + large datasets (optional)
    tests/
      01-revenue-ties.sql  <- a named test case
    01-top-products-per-category/
      question.md        <- the question
      solution.sql       <- your model answer (stays local, not committed)
      expected.json      <- generated, commit this
```

## adding a question

1. make a folder in the set, like `20-whatever/`. The number decides the order.
2. write `question.md`:

   ```
   ---
   title: Top customer per country
   difficulty: medium
   tags: window functions, ties
   tables: customers, orders
   output: country, customer_id, revenue
   ---

   The question text, normal markdown.

   ## hints

   - shown one at a time when someone clicks "get a hint"
   - go from a gentle nudge to almost the answer

   ## explanation

   Shown once they solve it (or if they ask for it). Explain the trick, the trap, and why the obvious query is wrong.
   ```

   `## hints` and `## explanation` are optional, but every question has them, so please add both.

   `difficulty` is `easy`, `medium` or `hard`. `output` is the columns you expect, in order.

   The question page links to the topics that teach it ("new to this? learn it first"), and the topic links back. Those links are worked out from `tags`, or you can set them with `learn: beginner/02-where-filtering, beginner/04-null-handling`.

3. write `solution.sql`, one postgres query with the right answer.
4. if there's a trap the existing test cases don't cover, add a test case (below).
5. run `npm run problems` inside `website/`. It also runs on its own with `npm run dev` and `npm run build`.

That runs your solution on every dataset and writes `expected.json`. Only fingerprints of the expected output go into the website, never the solution.

It also saves the solution's output on the sample data, which people see in the "expected output" tab.

**Always add a couple of wrong answers too.** Save common mistakes next to the solution as `wrong-<what's wrong>.sql` (they stay local like `solution.sql`). The build runs each one and tells you which test caught it, or warns you if one passes every test. When that happens, add a test case that catches it.

The build remembers a fingerprint of everything that went into `expected.json`, so it only reruns questions whose schema, test data, solution or wrong answers changed, and `npm run dev` starts quickly. `npm run build` runs it with `--strict`: if any question is stale (test data changed but there's no `solution.sql` to recompute it) or a wrong answer passes, the deploy stops. `npm run problems -- --force` reruns everything.

## named test cases

A `.sql` file in `tests/` with just INSERTs (the schema is created for you), and two header lines:

```sql
-- name: products tied on revenue
-- for: 01-top-products-per-category, 02-monthly-revenue-growth

INSERT INTO ...
```

`name` is what people see when it fails, so make it describe the edge case. `for` lists which questions it applies to, leave it out to apply it to every question in the set. Use ids that look nothing like the sample, so hardcoded answers fail.

## the generator

`generate.sql` fills the tables with data that depends on two values:

- `{{seed}}`, which dataset (1 to 5 for random, 0 for large)
- `{{n}}`, how big (40 for random, 20000 for large by default)

Use `gen_rand('{{seed}}:something:' || id)` for randomness. It returns a number between 0 and 1 that's always the same for the same text, so the build and the browser generate identical data. Don't use `random()`.

Make the generator produce the messy stuff on purpose: NULLs, ties (pick values from a short list), duplicates, values right on boundaries, rows that should be filtered out.

## set options

In `set.md`'s header, all optional:

```
order: 0         sets are listed alphabetically, a lower order goes first (the warmup is 0)
random: 5        how many random datasets
small: 40        n for random datasets
large: 20000     n for the large dataset (keep it to a few seconds of generation)
timeout: 10      seconds allowed on the large dataset
```

## how grading works

- a submission passes a dataset if its output matches the solution's output exactly
- row order doesn't matter, column order and names do (case doesn't)
- `52500` and `52500.00` count as the same, so do a date and a timestamp at midnight
- everything runs in the browser in a background worker, a query that takes too long gets stopped

## dialects

People pick PostgreSQL, MySQL or SQL Server. Everything really runs on postgres (PGlite, in the browser). MySQL and SQL Server queries get translated first: `TOP`, `LIMIT x, y`, `[brackets]`, backticks, `ISNULL`, `IFNULL`, `DATEADD`, `DATEDIFF`, `GETDATE`, `LEN`, `YEAR()` and similar work. Not every function in those dialects is covered, so if something doesn't translate, write it in postgres.

## heads up

The test data ships to the browser too (the query runs there). Someone digging through dev tools could find it. Fine for practice and for interviews where you're watching, just don't treat it as a locked-down exam.
