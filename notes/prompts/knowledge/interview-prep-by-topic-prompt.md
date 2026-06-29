# Interview Prep by Topic Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

---

**How to use:**

1. Fill in `FILE` — the interview prep filename without extension
2. Fill in `SECTION` — which section to audit (`all` for the full file, or the exact heading like `## Routing`)
3. Fill in `MODE` — `full` for the complete audit, or `correct` to just fix and sync what you wrote (see "Mode")
4. Paste the entire prompt below into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security | all]
       → notes/interview-prep/en/{FILE}.md
       → notes/interview-prep/es/{FILE}.md
       → FILE can also be a path to ONE language file (e.g. notes/interview-prep/en/angular.md):
         derive the topic from it and audit it together with its twin in the other language.
         Pair it with MODE = correct to just fix that file's TODOs and mirror them to the twin.
       → FILE = all audits every file (with SECTION = all) — see notes/prompts/_batch-mode.md.
         Order: angular, spring-boot, java, architecture, security, typescript, sql, javascript,
         css, git, general.

SECTION = [all | ## Routing | ## Forms | ## JOINs | ...]
          → "all" audits every section in the file
          → Use the exact section heading to audit only that part (e.g. "## Transactions")

MODE = [full | correct]
       → full (default): the complete audit — sync, TODOs, coverage check, missing topics,
         weak-answer report, imbalance fixes, and adding missing questions.
       → correct: a focused "I just wrote/edited this file — correct it" pass. Does ONLY the
         en/es sync check, TODO resolution (mirrored to both languages), the always-allowed
         format/priority tidy, and the weak-answer report. SKIPS the coverage.md check and
         audit sections 1, 3, and 4 — it does not hunt for missing topics or add new questions.
         See "Mode" below.

Notes on specific files:
- spring-boot: questions about the Spring Boot framework (auto-configuration, controllers, beans, JPA).
  Java language questions live in java.md, not here.
- java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts that don't appear in a Spring Boot context.
- sql: database is PostgreSQL. Flag any PostgreSQL-specific behaviour consultancies would ask about
  (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- general: questions that don't belong to a specific technology (debugging, teamwork, process, git workflow).
- security: covers authentication vs authorisation, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
- architecture: covers REST principles, layered architecture, MVC, coordinator pattern, smart/dumb
  components, service layer, repository pattern. Does not cover framework internals — those belong
  in spring-boot.md or angular.md.

Use FILE and SECTION wherever the prompt refers to {FILE} or {SECTION}.

---

You are auditing my interview preparation files for a junior Angular + Java Spring Boot
position at Spanish IT consultancies (NTT Data, Capgemini, Indra, and similar) in 2026.

Before starting, read CLAUDE.md — it has the full project context, teaching rules, and subfolder structure.

---

## Who I am and what I need

My profile, my projects, the **Spanish job market 2026**, and the **AI factor** are in
`notes/prompts/_shared-context.md` — read it before auditing. Every answer is judged against
what a Spanish consultancy interviewer would actually filter on, so that context matters here.

Files to audit:
- notes/interview-prep/en/{FILE}.md
- notes/interview-prep/es/{FILE}.md
- If {FILE} is given as a path to one language file (e.g. notes/interview-prep/en/angular.md),
  derive the topic name from it and audit both that file and its twin in the other language
  folder — never just the one you were handed; the two always stay in sync.
- If SECTION is not "all", locate the {SECTION} heading in both files and audit only the content
  under that heading (up to the next ## heading).
- If {SECTION} is not found in one file: create it as an empty section in that file before
  proceeding.
- If {SECTION} is not found in either file: create it in both files as empty sections, then
  run the coverage.md pre-audit check to identify required topics, then move to audit
  section 1 to populate the section from scratch.

---

## Mode — full vs correct

`{MODE}` decides how much this run does. Check it before anything else.

- **full (default):** run the whole prompt as written — every pre-audit step and all four audit
  sections, including adding missing questions until the section is interview-ready.
- **correct:** the "I just wrote/edited this file — correct it" pass. Cheaper and focused. Run
  ONLY these steps, in order, then stop:
  1. **Pre-audit — Sync check** — keep en/ and es/ aligned.
  2. **Pre-audit — Resolve TODOs** — apply each fix and mirror it to the other language file at
     the matching position (this is the en/es sync). en/ stays the master file.
  3. **Format check** — the always-allowed tidy only: a blank line between question and answer,
     and a priority marker on any question missing one. Do not reorder or rewrite beyond this.
  4. **Audit section 2 — Weak answers**, report only (never rewrite without a TODO).

  In correct mode, **skip** the coverage.md check, audit section 1 (missing topics), audit
  section 3 (imbalances), and audit section 4 (missing questions). You are correcting what is
  there, not expanding the topic. If you notice a real gap, mention it in the summary instead
  of adding questions.

Whichever mode you run, **every change to one language file is mirrored in the other** (translated)
— the two files never drift apart.

---

## Existing content is final unless marked with TODO

Do not rewrite, rephrase, or change any question or answer that already exists in these files.
Victor may have already studied it and likes it as written. In either case, the text stays untouched.

You may do the following without a TODO:
- Resolve TODO markers
- Add new questions (always allowed)
- Assign priority markers (⭐⭐⭐/⭐⭐/⭐) to existing questions
- Reorder existing questions by priority within a section
- Fix structural format violations (missing blank lines between question and answer)
- Add a Junior tip to an existing Conceptual question that is missing one
- Add a Red flag to an existing Decision-based or Pressure question that is missing one

You may NOT do the following without a TODO:
- Change the wording of existing questions
- Rewrite or rephrase existing answers
- "Strengthen" or "improve" existing content on your own judgment

If audit section 2 identifies a weak answer that has no TODO, report it in the summary —
do not change it. Victor adds a TODO marker, and the fix is applied on the next run.

Exception: if Victor explicitly asks you to improve the weak answers after seeing the
summary (in the same conversation), you may rewrite those answers — even without a TODO.
Apply the fix to both en/{FILE}.md and es/{FILE}.md.

---

## Question types — definitions

Every question belongs to one of three types. Use these definitions throughout the audit to
classify existing questions, assign Junior tips, decide on Red flags, and count ratios.

- **Conceptual** — asks "what is X?" or "how does X work?" Tests whether the candidate
  understands a concept, not just its syntax. Example: "What is @Transactional and what
  does it do?" Only Conceptual questions get a Junior tip block.
- **Decision-based** — asks "why did you choose X?" or "when would you use X instead of Y?"
  Tests whether the candidate can justify architectural decisions and knows tradeoffs.
  Example: "Why did you use JWT instead of sessions?" Encouraged to have a Red flag answer.
- **Pressure** — a gotcha, an edge case, or a code snippet with a bug. Tests depth of
  understanding and exposes shallow knowledge. Example: "What happens if you put @Transactional
  on a private method?" Encouraged to have a Red flag answer.

Edge case: if a question asks "what is the difference between X and Y?" and the answer
implies choosing one over the other, classify it as Decision-based — not Conceptual.

Edge case: if a question asks "what happens when X?" — classify as Pressure if X is an
unusual condition or edge case that would surprise a developer (e.g. "what happens if you
put @Transactional on a private method?"). Classify as Conceptual if X describes the
normal expected behaviour of the technology (e.g. "what happens when the JWT expires and
the user is redirected to login?").

Target ratio per section: 55% Conceptual / 35% Decision-based / 10% Pressure.
Note: for sections with fewer than 5 questions the exact ratio is not achievable — treat
it as a direction, not a hard target. The practical floor: every section must have at
least 1 Decision-based question. A section with zero Decision-based questions is always
flagged, regardless of size.

---

## Pre-audit — Sync check

Before doing anything else, check that en/{FILE}.md and es/{FILE}.md are in sync.

Scope of the sync check:
- When SECTION = "all": check sync across the full file.
- When SECTION is a specific heading: check only that section for sync. Mismatches in other
  sections are outside the scope of this run — do not touch them.

For the relevant scope, list sections and question counts from each file side by side.
The files are out of sync if any of the following is true:
- A section exists in one file but not the other
- A section has a different question count in each file
- A section has the same count but different questions (e.g. a question exists in en/ but
  not in es/, or vice versa — same count, different content)

For each mismatch:
1. Report the mismatch clearly.
2. Bring the files into sync: for missing sections or missing questions, add the content
   from the file that has it — translated if adding to es/, in English if adding to en/.
   en/ is the master file: if the same question exists in different forms in both files,
   keep the en/ version and update es/ to match (translated).
3. Only after both files are in sync, move on to the TODO step.

If the files are already in sync for the relevant scope, move directly to the TODO step.

---

## Pre-audit — Resolve TODOs

**Victor studies from the `es/` files — that is where he adds TODO markers.**
Scan {SECTION} in es/{FILE}.md first, then en/{FILE}.md.
TODO markers can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO`.

For each TODO found:
1. Identify exactly what Victor wants changed.
2. Apply the fix to the file where the TODO was found.
3. Apply the equivalent fix (translated if needed) to the other file at the corresponding position.
4. Remove the TODO marker after fixing.
5. Report what was changed before moving on.

If no TODOs are found, skip this section and move directly to the coverage.md check.

**Pattern detection — after resolving all TODOs:**
If 2 or more TODOs reflect the same type of correction (e.g. always rewriting passive answers
to use "I used", always adding a project reference, always removing theoretical definitions),
this is a personal preference that should become a permanent rule — not a repeated manual fix.
Report it in the Summary section at the end as a recommended prompt change: one specific
sentence to add that would prevent the same correction from being needed in future runs.
Do not add the rule yourself — Victor decides whether to accept it.

---

## Pre-audit — coverage.md check

Before reading the interview prep files, read the coverage.md for this topic:
- For most files: `notes/{FILE}/coverage.md`
- For spring-boot: `notes/spring-boot/coverage.md`
- For java: `notes/java/coverage.md`

If coverage.md exists:
- List every concept it contains.
- Scope of the check:
  - When SECTION = "all": verify that every concept in coverage.md has at least one question
    somewhere in the file.
  - When SECTION is a specific heading: verify only the concepts that logically belong in
    that section have at least one question there. Skip concepts that belong in other sections.
- Concepts in coverage.md with no question are required additions — treat them the same as
  missing topics in audit section 1, regardless of whether you would have thought of them
  independently.
- When you add a question for a concept that was in coverage.md, note it as
  "coverage.md concept — added" in your report.

If coverage.md does not exist, skip this step and rely on your knowledge of what junior
Angular + Spring Boot interviews at Spanish consultancies require.

---

## Pre-audit — Priority markers

Every question must carry a priority marker indicating how often this question is asked at
Spanish consultancies in a junior interview for {FILE}:

- ⭐⭐⭐ — Asked in almost every interview for this topic. A candidate who cannot answer this
  would be filtered out immediately.
- ⭐⭐ — Asked often. Worth knowing well. A candidate who cannot answer it leaves a weak impression.
- ⭐ — Asked sometimes. Good to have, but missing it is not a dealbreaker.

**Criteria for ⭐⭐⭐:**
- The concept is foundational — it appears in any non-trivial project using this technology.
- The concept is commonly misunderstood or often confused with something similar.
- Not knowing it would cause the interviewer to doubt the candidate's basic competence.

**Criteria for ⭐⭐:**
- The concept is tested when the interviewer goes deeper than the basics.
- The candidate can survive without it in a first screen, but not knowing it leaves a weak
  impression in a full technical interview.

**Criteria for ⭐:**
- A niche detail, edge case, or subtlety that only the most thorough interviewers probe.
- Missing it would not cause a filter-out at junior level.

**Proportion check:** in a typical section of 8–12 questions, expect roughly 3–4 ⭐⭐⭐,
4–5 ⭐⭐, and 1–2 ⭐. If more than half the questions in a section are marked ⭐⭐⭐,
downgrade the excess: keep ⭐⭐⭐ only for the 3–4 most foundational ones and reassign
the rest to ⭐⭐. Run this check after assigning all markers, before the format check.

**Apply to all existing questions in {SECTION} now, before the format check:**
1. Every question that already exists without a marker gets one assigned.
2. Within each section, reorder questions so ⭐⭐⭐ come first, then ⭐⭐, then ⭐.
   Reorder only within a section — never move questions across sections.

Place the marker at the end of the bold question line, after the question mark:

**What is @Transactional and what does it do?** ⭐⭐⭐

New questions added during the audit also get a marker — this is enforced in the Execution rules.

---

## Format check — mandatory before the audit

Every question in the file must follow this structure. The mandatory elements are:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

Rules for mandatory elements:
- There must be a blank line between the bold question and the answer.
- Every question must have a priority marker (⭐⭐⭐, ⭐⭐, or ⭐) at the end of the bold
  question line, after the question mark. Markers were assigned in the previous step — if
  any question is still missing one, assign it now using the criteria above.

Optional elements added after the answer, based on question type:
- **Conceptual questions only:** a blank line, then a Junior tip block using `>` blockquote
  syntax — one English line then one Spanish line:
  > **Junior tip:** short advice on how to explain it clearly in an interview
  > **Consejo de entrevista:** same advice in Spanish
- **Decision-based and Pressure questions (encouraged):** a blank line, then a Red flag:
  Red flag answer: what a weak candidate would say and why it fails.

Scan every question in {SECTION} of both en/{FILE}.md and es/{FILE}.md.
Fix any violation immediately before moving on to the audit. Apply the same fix to both files.
Report what was fixed.

---

## Audit — 4 sections

**1. Missing topics**
Topics not covered in {SECTION} that Spanish consultancies would ask, given my stack and
target companies. Include any concept from coverage.md (if it exists) that has no question yet.
One sentence per topic explaining why they would ask it.

If coverage.md exists and a topic you identify is NOT in it, flag it with `[coverage gap]`
so Victor can add it to coverage.md in a separate run.

**2. Weak answers**
Answers that are too vague, too theoretical, or that do not reference a real project when
the question is about a pattern or decision.
Quote the weak part and explain what is missing. Do not rewrite the answer — report it in
the summary instead. Victor adds a TODO marker in the file, and the fix is applied on the
next run.

Quality bar: every answer must pass this test — "could I explain every word of this answer
if the interviewer pressed me?" If not, the answer is weak.

  **Weak:** "¿Qué es un interceptor en Angular? — Es una clase que intercepta las peticiones HTTP y permite modificarlas."
  **Strong:** "¿Qué es un interceptor en Angular? — Es una función que se ejecuta antes de cada petición HTTP. La usé en el proyecto 06 para añadir el token JWT automáticamente a todas las cabeceras — sin el interceptor, tendría que añadirlo manualmente en cada llamada al servicio."
  The strong answer references a real project, explains the problem it solves, and uses "I used it" — not "it is used".

**3. Imbalances**
Count questions by type using the definitions in the "Question types" section above.

When SECTION = "all": report the count and percentage per type for each section separately.
When SECTION is a specific heading: report the count and percentage for that section only.

Target ratio per section: 55% Conceptual / 35% Decision-based / 10% Pressure.
Flag any section where Decision-based or Pressure questions are completely absent.
Use these flags in section 4 — if a type was flagged absent, add enough questions to
reach the practical floor: at least 1 Pressure question if Pressure was absent, at least
2 Decision-based questions if the section had none. Do not add more than the floor —
quality over quantity.

**4. Missing questions**
All questions not yet in {SECTION} that a Spanish consultancy would realistically ask.
Do not cap at 3–5 — add every question needed until the section is genuinely complete.
Assign a priority marker to each new question.
If coverage.md exists, flag any new question whose concept is not in it with `[coverage gap]`.

Format for each new question — follow the structure defined in the Format check section:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

Then add the optional elements based on type:
- Conceptual: add a Junior tip block (see Format check for exact syntax)
- Decision-based and Pressure: add a Red flag answer (encouraged)

---

## Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

**Reminder — existing content is final:** only change existing question or answer text if
there is a TODO marker. New questions, priority markers, ordering, blank lines, Junior tips,
and Red flags are always allowed without a TODO. For weak answers in existing text with no
TODO, report them in the summary — do not change the text.

Rules for every new or updated question:
- Add to BOTH en/{FILE}.md and es/{FILE}.md — same question, same answer, same section,
  translated. Never add to one without the other.
- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition. Reference a specific project when the question is about a pattern or decision.
- Group new questions under the correct section heading. If SECTION is a specific heading
  and a new question logically belongs in a different section, do not add it to that
  other section in this run — note it in the summary as an out-of-scope gap so it is
  addressed when that section is audited.
- Add a Junior tip to every new Conceptual question (see "Question types" for the definition).
- Assign a priority marker (⭐⭐⭐, ⭐⭐, or ⭐) to every new question.
- After adding new questions to a section, reorder so ⭐⭐⭐ come first, then ⭐⭐, then ⭐.
  (New questions arrive after the initial reorder in the priority markers step — this
  second reorder merges them into the correct position.)

After auditing {SECTION}, give it a status:
- ✅ Complete — thorough coverage for the job target; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when ALL of these are true:
- Every coverage.md concept that belongs in this section has at least one question
- Every question a Spanish consultancy would realistically ask about this topic is covered
- The ratio is approximately on target per section (55% Conceptual / 35% Decision / 10%
  Pressure) — for sections with fewer than 5 questions, the floor is: at least 1
  Decision-based question present
- Every answer either passes the "explain every word" test, or has a TODO marker flagging it for rewrite
- At least one Decision-based question references a real project by name
- Every question has a priority marker (⭐⭐⭐, ⭐⭐, or ⭐)
- Within each section, questions are ordered ⭐⭐⭐ → ⭐⭐ → ⭐
- en/{FILE}.md and es/{FILE}.md are in sync — same sections, same questions, same order
- There are no obvious gaps that would make Victor look unprepared in a screening

Do not stop at 2 or 3 questions. Add as many as needed until the section is genuinely
interview-ready. A weak junior gets filtered out because one topic was thin.
Better to over-prepare one section than to have a gap a recruiter finds first.

---

## Summary

After all edits, report the following. Omit any block that has nothing to report.

When SECTION = "all", include a status table first:

| Section | Status |
|---------|--------|
| ## [section heading] | ✅ / 🔧 / ➕ |

When SECTION is a specific heading, the section status was already given in the Execution
step — do not repeat it here.

**Weak answers found** (existing answers that did not pass the quality check — add a TODO marker
in the file at that question to get it fixed on the next run):
- `[question text]` — [what is missing; what a strong answer would include]

**Coverage gaps found** (concepts added that are not yet in coverage.md — add them there in a
separate run using coverage-prompt.md):
- [concept] — [one sentence: why it belongs in coverage]

**TODO patterns detected** (recommended prompt rule additions):
- [pattern] — [one specific sentence to add to this prompt to prevent the same correction
  from being needed again]

---

After all edits, show the commit message so Victor can run it himself. Replace {FILE} with
the actual file name (e.g. angular, spring-boot, java). Always use this format — one command per code block:

```
git add notes/interview-prep/en/{FILE}.md notes/interview-prep/es/{FILE}.md
```

```
git commit -m "docs: audit {FILE} interview prep — <one line summary of main fixes>"
```
````
