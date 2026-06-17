# SQL Exercises Prompt

Use in a **separate conversation**. Fill in the configuration block before pasting.

Two modes:

- **`practice`** — generates a set of exercises for a specific SQL topic. Saves them as a file in `sql/` so you can attempt them offline without AI.
- **`review`** — checks your answers. Paste the exercise file with your answers at the end of the prompt.

**How to use:**

1. Fill in `MODE`, `TOPIC`, and (for practice mode) `COUNT`
2. Paste the prompt into a new chat
3. If MODE = review: paste your answer file at the very end

---

````
## Configuration — edit only this block

MODE  = [practice | review]
TOPIC = [joins | group-by | subqueries | ctes | window-functions | dml | schema-design | nulls | indexes]
COUNT = [number of exercises to generate — only used in practice mode — default: 8]

---

## Context

I am Victor, 31 years old. I am learning SQL as part of my preparation for junior Angular +
Java Spring Boot interviews at Spanish consultancies (NTT Data, Capgemini, Indra) by August 2026.

My daily SQL block is 12:30–13:30. I study topics in this order:
JOINs → GROUP BY + HAVING → NULLs + filtering → subqueries → CTEs → DML → schema design
→ window functions → indexes + performance

Before starting, read PROGRESS.md. The SQL section shows which topics are already solid.
Do not generate exercises for topics already listed as complete there.

The database used in my previous exercises is the bookstore:
tables: books, authors, publishers, genres, customers, orders, order_items
If this schema does not have enough tables for the requested topic, add one or two realistic
tables (e.g. employees, reviews) and describe them clearly at the top of the exercise file.

---

<!-- ======================================================= -->
<!-- BRANCH A — run only when MODE = practice               -->
<!-- ======================================================= -->

## MODE = practice

---

### Step 1 — Check what has been done

Read PROGRESS.md. Find the SQL section. Check what exercises for {TOPIC} have already been done.
If {TOPIC} is already marked as solid in PROGRESS.md, stop and say:
"This topic is already marked as solid in PROGRESS.md. Are you sure you want more exercises?
Reply YES to continue."

---

### Step 2 — Generate the exercises

Generate {COUNT} exercises for {TOPIC}.

**Schema:** include the full schema at the top of the output. List every table with its columns
and types. Do not assume Victor remembers the bookstore schema from previous exercises.

**Difficulty levels:** spread the exercises across three levels:
- Intro (exercises 1–3): straightforward, one concept at a time
- Standard (exercises 4–6): realistic, combine two or three concepts
- Challenge (exercises 7+): requires thinking through edge cases, NULLs, or multiple steps

**Format for each exercise:**
```
-- Exercise N: [short title]
-- [one or two lines describing what to return, in plain English]
-- [any hints or constraints — e.g. "exclude NULL values", "order by total descending"]

-- Your answer:

```

**Topic-specific focus:**

JOINS — cover: INNER JOIN, LEFT JOIN (with NULLs), RIGHT JOIN, FULL OUTER JOIN,
        self-JOIN, multi-table JOINs; at least one exercise where JOIN type matters
        (i.e. INNER would give wrong result, LEFT is needed)

GROUP BY — cover: basic aggregates (COUNT, SUM, AVG, MIN, MAX), GROUP BY multiple columns,
           HAVING to filter groups, difference between WHERE and HAVING

SUBQUERIES — cover: subquery in WHERE, subquery in SELECT, correlated subquery, EXISTS / NOT EXISTS

CTEs — cover: basic WITH clause, chained CTEs, recursive CTE if realistic for the schema

WINDOW FUNCTIONS — cover: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER (PARTITION BY),
                   running totals

DML — cover: INSERT, UPDATE with WHERE, DELETE with WHERE, RETURNING clause, ON CONFLICT

SCHEMA DESIGN — cover: CREATE TABLE, PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK,
                adding a column, dropping a constraint

NULLS — cover: IS NULL / IS NOT NULL, COALESCE, NULLIF, NULL in aggregates, NULL in JOINs

INDEXES — cover: CREATE INDEX, when indexes help (WHERE, JOIN, ORDER BY), EXPLAIN ANALYZE

---

### Step 3 — Save the file

Save the exercises to the correct folder. Naming convention:

| Topic | Folder | File |
|-------|--------|------|
| joins | sql/02-joins/ | exercises.sql |
| group-by | sql/03-group-by/ | exercises.sql |
| subqueries | sql/04-subqueries/ | exercises.sql |
| ctes | sql/05-ctes/ | exercises.sql |
| window-functions | sql/06-window-functions/ | exercises.sql |
| dml | sql/07-dml/ | exercises.sql |
| schema-design | sql/08-schema-design/ | exercises.sql |
| nulls | sql/09-nulls/ | exercises.sql |
| indexes | sql/10-indexes/ | exercises.sql |

If the folder does not exist, create it.

After saving, print:
"Ready. {COUNT} exercises saved to [path]. Attempt them offline, then run this prompt in
review mode to check your answers."

---

<!-- ======================================================= -->
<!-- BRANCH B — run only when MODE = review                 -->
<!-- ======================================================= -->

## MODE = review

---

### Step 1 — Read the exercise file

Read the file Victor pasted at the end of this chat. It contains the exercises and his answers.

---

### Step 2 — Check each answer

For each exercise, run the query mentally against the schema defined at the top of the file.

Mark each answer:
- ✅ **Correct** — the query returns the right result
- ⚠️ **Partially correct** — runs without error but returns wrong or incomplete results
- ❌ **Wrong** — syntax error, wrong JOIN type, wrong aggregate, or missing WHERE / HAVING

For ✅ answers: one line max — confirm it is correct. If there is a cleaner way to write the
same query, mention it briefly.

For ⚠️ and ❌ answers:
- Explain what is wrong (one sentence)
- Show the correct query in a code block
- If the mistake is a common pattern error (e.g. WHERE vs HAVING, INNER vs LEFT), explain
  why the distinction matters

---

### Step 3 — Summary

Print a short summary table:

| Exercise | Result | Main issue |
|----------|--------|------------|
| 1 | ✅ | — |
| 2 | ⚠️ | Used WHERE instead of HAVING |
| ... | | |

**Score:** X / {COUNT} correct

If score < 60%: "These exercises need more practice before moving to the next topic."
If score 60–80%: "Solid base. Review the wrong answers, then retry the ones marked ⚠️ or ❌."
If score > 80%: "Ready to mark {TOPIC} as solid in PROGRESS.md."

---

### Step 4 — Interview questions

If any answer revealed a misunderstanding of a core concept, add one interview question
to notes/interview-prep/en/sql.md AND notes/interview-prep/es/sql.md (both at the same time).

Then show the commit message:

```
git add sql/ notes/interview-prep/
```

```
git commit -m "chore: SQL {TOPIC} exercises — [X/COUNT correct], [main concept gap if any]"
```

[paste your answer file below this line — only needed in review mode]
````
