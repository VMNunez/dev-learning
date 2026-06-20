# Notes ↔ Interview Prep Cross-Reference Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste everything into a new chat.

**Prerequisites:** run `notes-by-topic-prompt` and `interview-prep-by-topic-prompt` first. This prompt assumes both sides are already quality-checked — it only finds and fixes gaps between them.

---

**How to use:**

1. Fill in `TOPIC`, `NOTES_PATH`, and `FILE`
2. Paste the entire prompt into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC      = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]
FILE       = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
             → notes/interview-prep/en/{FILE}.md
             → notes/interview-prep/es/{FILE}.md

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/spring-boot/ — also read notes/java/ for language-level
  concepts that appear in Spring Boot code.
- Java: focus on language concepts needed to write Spring Boot code only.
- SQL: database is PostgreSQL.

Use TOPIC, NOTES_PATH, and FILE wherever the prompt refers to {TOPIC}, {NOTES_PATH}, or {FILE}.

---

## Purpose

This prompt does one thing: find and fix gaps between notes and interview prep — in both
directions. It does not audit quality, fix formatting, or resolve TODOs. Run the individual
prompts first for that.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, and subfolder structure.

---

## Step 1 — Read the source files

Read in this order:
1. All numbered note files in {NOTES_PATH} — skip `future-learning.md`, `coverage.md`,
   and `layer-reference.md`
2. `notes/interview-prep/en/{FILE}.md`
3. `notes/interview-prep/es/{FILE}.md`

Build a mental map of:
- Every concept section covered in the notes (## and ### headings)
- Every concept covered by at least one question in the prep files

---

## Step 2 — Notes → Interview prep

For every concept covered in the notes: is there at least one question in the interview
prep that covers it?

A concept is "covered" if any question in the prep — regardless of wording — tests the same
idea. Do not require a one-to-one match with a heading; one question can cover several
related sub-sections.

For each uncovered concept:
1. Write the question and add it to the correct section in both `en/{FILE}.md` and
   `es/{FILE}.md` — never one without the other.
2. Follow the question format defined in `interview-prep-by-topic-prompt.md` exactly:
   bold question + priority marker + blank line + answer + Junior tip (if Conceptual)
   or Red flag (if Decision-based or Pressure).
3. Reference a real project in the answer when the concept was practiced in one.
4. Note it in the summary as "notes → prep — added".

---

## Step 3 — Interview prep → Notes

For every question in `es/{FILE}.md`: is there at least one note file in {NOTES_PATH}
that covers the concept this question is about?

A question is "backed" if the concept appears as a section or sub-section in any numbered
note file. Use judgment — exact name matching is not required.

For each unbacked question:
1. Create a new note file or add a section to an existing file following the format defined
   in `notes-by-topic-prompt.md` exactly: conversational mode for all folders except
   `notes/java/` and `notes/spring-boot/` (structured mode).
2. Follow the numbered naming convention for new files — start from the next available
   number in CLAUDE.md for that folder. If creating multiple files in one run, assign
   numbers in study-sequence order.
3. Update the "next file:" counter in CLAUDE.md after creating new files.
4. Note it in the summary as "prep → notes — added".

If more than 3 new note files need to be created: create the first 3 in study-sequence
order and report the rest in the summary — address them in the next run.

---

## Execution

Apply all changes directly to the files. Do not report and leave gaps open.

---

## Summary

After all edits, report:

**Notes → prep gaps closed:**
- `[concept]` — `[question added, with priority marker]`

**Prep → notes gaps closed:**
- `[question topic]` — `[file or section created]`

**Deferred note files** (more than 3 needed — address in next run):
- `[concept]` — needs a note file

Then show the commit message. Replace {FILE} and {TOPIC} with the actual values.
Always one command per code block:

```
git add notes/interview-prep/en/{FILE}.md notes/interview-prep/es/{FILE}.md <note files created or modified>
```

If CLAUDE.md was updated (new file counter), add it separately:

```
git add CLAUDE.md
```

```
git commit -m "docs: cross-reference {TOPIC} notes ↔ interview prep — <one line summary>"
```
````
