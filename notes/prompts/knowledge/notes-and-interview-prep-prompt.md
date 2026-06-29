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

TOPIC      = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]
NOTES_PATH = [notes/angular/en/ | notes/angular-material/en/ | notes/css/en/ | notes/javascript/en/ | notes/typescript/en/ | notes/sql/en/ | notes/java/en/ | notes/spring-boot/en/ | notes/architecture/en/ | notes/git/en/ | notes/general/en/ | notes/security/en/]
FILE       = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
             → notes/interview-prep/en/{FILE}.md
             → notes/interview-prep/es/{FILE}.md

## TOPIC = all runs every topic in turn (NOTES_PATH and FILE derived per topic) —
## see notes/prompts/_batch-mode.md. Order: Angular, Angular Material, Spring Boot, Java,
## Architecture, Security, TypeScript, JavaScript, CSS, SQL, Git, General.

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/spring-boot/en/, notes/java/en/ (comma-separated — read both;
  Spring Boot code uses Java language concepts). Before marking a JWT or security question as
  unbacked, also check notes/security/en/ — JWT design and token invalidation concepts live
  there by folder convention.
- Angular Material: set NOTES_PATH = notes/angular-material/en/, FILE = angular. For direction 2,
  check only questions under Angular Material sections of angular.md — questions in other
  sections (Components, Signals, Routing, Forms, etc.) are backed by notes/angular/en/ and are
  out of scope for this run.
- Java: focus on language concepts needed to write Spring Boot code only.
- SQL: database is PostgreSQL.

Use TOPIC, NOTES_PATH, and FILE wherever the prompt refers to {TOPIC}, {NOTES_PATH}, or {FILE}.

---

## Purpose

This prompt does one thing: find and fix gaps between notes and interview prep — in both
directions. It does not audit quality, fix formatting, or resolve TODOs. Run the individual
prompts first for that.

Before starting, read CLAUDE.md (teaching rules, subfolder structure) and
`notes/prompts/_shared-context.md` (my profile and the market context).

---

## Step 1 — Read the source files

Read in this order:
1. All numbered note files in {NOTES_PATH} (the `en/` folder) — skip any non-numbered files
2. The Spanish counterpart: replace `en/` with `es/` in {NOTES_PATH} and read those files too — same exclusion rules
3. `notes/interview-prep/en/{FILE}.md`
4. `notes/interview-prep/es/{FILE}.md`

Note: `coverage.md` and `future-learning.md` live in the topic root (e.g. `notes/java/`), not inside `en/` or `es/`.

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

Exception: a sub-section that describes a gotcha, an edge case, a "why not X?" scenario, or
a comparison between two alternatives always needs its own question — it cannot be counted
as covered by a general question about the parent concept.

For each uncovered concept:
1. Write the question and answer in English and add it to the correct section in
   `en/{FILE}.md`; translate both to Spanish and add to the same section in `es/{FILE}.md`
   — never one without the other. If no section exists for this concept in the prep file,
   create the section heading in both files before adding the question.
2. Follow the question format defined in `interview-prep-by-topic-prompt.md` exactly:
   bold question + priority marker + blank line + answer + optional element based on type:
   — Conceptual (asks "what is X?" or "how does X work?") → add a Junior tip.
   — Decision-based (asks "why X?" or "when X instead of Y?") → add a Red flag (encouraged).
   — Pressure (a gotcha, edge case, or unusual condition) → add a Red flag (encouraged).
   Junior tip syntax — blank line, then two consecutive blockquote lines, English then Spanish:
   > **Junior tip:** [one line of advice in English]
   > **Consejo de entrevista:** [same advice in Spanish]
   Red flag syntax — one line after a blank line:
   Red flag answer: [what a weak candidate would say and why it fails]
   Priority: ⭐⭐⭐ if not knowing this would filter the candidate in a first screening;
   ⭐⭐ if it comes up when the interviewer goes deeper; ⭐ for niche details.
3. Reference a real project in the answer when the concept was practiced in one.
4. After adding questions to a section, reorder within that section so ⭐⭐⭐ come first,
   then ⭐⭐, then ⭐.
5. Note it in the summary as "notes → prep — added".

---

## Step 3 — Interview prep → Notes

For every question in `en/{FILE}.md`: is there at least one note file in {NOTES_PATH}
that covers the concept this question is about?

A question is "backed" if the concept appears as a section or sub-section in any numbered
note file. Use judgment — exact name matching is not required.

For each unbacked question:
1. Create a new note file or add a section to an existing file following the format defined
   in `notes-by-topic-prompt.md` exactly: conversational mode for all folders except
   `notes/java/en/` and `notes/spring-boot/en/` (structured mode). Write in a personal learning
   voice ("You use this when…", not "This is used when…"). Start with the problem the concept
   solves before introducing the concept itself. Include at least one sentence of context
   before any code block. Do not write documentation — if the text could appear on the
   official docs site unchanged, it is wrong. If adding to an existing file, choose the file
   whose topic is most closely related — check the headings read in Step 1.
2. Also create or update the Spanish version — replace `en/` with `es/` in the path (e.g.
   `notes/java/es/09-streams-lambdas.md`). Same structure and code blocks, prose in Spanish.
   If adding to an existing English file that already has a Spanish counterpart, add the Spanish
   translation of the new section too. If no Spanish counterpart exists yet, note it in the
   summary but do not create it from scratch — only create the specific section that backs the missing question.
3. Follow the numbered naming convention for new files — start from the next available
   number in CLAUDE.md for that folder. If creating multiple files in one run, assign
   numbers in study-sequence order.
4. Update the "next file:" counter in CLAUDE.md after creating new files.
5. Note it in the summary as "prep → notes — added".

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

If no gaps were found in either direction, print: "Files already in sync — no commit needed." and stop.

Otherwise, show the commit message. Replace {FILE} and {TOPIC} with the actual values.
List only files that were actually modified. Always one command per code block:

```
git add <list only modified files — include en/{FILE}.md and es/{FILE}.md only if questions were added; include note files only if created or modified>
```

If CLAUDE.md was updated (new file counter), add it separately:

```
git add CLAUDE.md
```

```
git commit -m "docs: cross-reference {TOPIC} notes ↔ interview prep — <one line summary>"
```
````
