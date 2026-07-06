# Coverage standard — what a good coverage.md contains

This is the **shared standard** for coverage files. It is not a runnable prompt — it holds no
configuration and does nothing on its own. Two prompts read it:

- `coverage-prompt.md` reads it to **create/update one topic's** `coverage.md`.
- `coverage-audit-prompt.md` reads it to **audit all** of `notes/coverage.md` globally.

Both used to carry their own copy of these rules; keeping them here once means the two can never drift.
Each prompt adds only its own *flow* (per-topic edit vs global convergence) on top of this standard.

---

## What coverage.md is

`coverage.md` is the **single source of truth** for everything Victor must learn about a topic. It is
**derived from what the job requires, not from the notes.** The notes are then written to cover every
item in coverage — never the other way around.

- If an item is in coverage but not in the notes yet → that is a gap in the notes.
- If the notes cover something not in coverage → extra material, fine to keep, but not required.

Downstream, `notes-audit.md` and `notes-and-interview-prep-prompt.md` use coverage as their baseline:
every item is a required topic that must be covered by at least one note. No exceptions. So the state
of the notes never limits what goes in coverage — if the notes are sparse or missing, derive coverage
entirely from what Spanish consultancies test at junior level; the gap just means notes must be written.

> **Projects are a vehicle to practise coverage items — they do not define coverage scope.** Never use
> the project list to decide what belongs in coverage.

---

## The job target is the source — never hardcode it

What counts as "in scope" is defined by **Victor's job target**, and that target lives in
`ROADMAP.md` (current phase, deadline, what is post-junior) and `notes/prompts/_shared-context.md`
(profile, the Spanish job market 2026, the AI factor). **Read both** before deciding scope — do not
rely on values written into a prompt.

Any concrete mention below — "junior Angular + Spring Boot", "NTT Data / Capgemini", "August–September
2026" — is an **illustration of what the source currently says**, not a fixed value. If ROADMAP.md and
`_shared-context.md` say something different (a new deadline, a shifted target role, new companies),
**they win** — the coverage must reflect the source, not the example.

### Real postings outrank the model's guess

There is a stronger source than reasoning about the market: the market itself. Read
`notes/prompts/_job-market-evidence.md` — real junior postings from the target companies, distilled
into recurring requirements. When it has evidence, its Synthesis is a **required floor**: every skill
that recurs across several postings must map to coverage items, and a recurring requirement missing
from coverage is a defect. When it is empty or stale, fall back to the model's knowledge (and,
optionally, a live web search for current postings) — but real evidence always wins over a guess.
Do not, however, *shrink* coverage below what the interview clearly tests just because a posting
omitted it; postings under-list the fundamentals interviewers still probe. Evidence raises the floor,
it does not lower the ceiling.

---

## Deciding what is IN and what is OUT

Think from the perspective of a technical interviewer at one of the target companies who has ~30
minutes with a candidate at the target level. Ask: *"What would I ask to test whether they really know
this topic?"* The answers are the coverage items. Then apply the filter:

**IN coverage — must be there:**
- The candidate is expected to explain it confidently out loud.
- The candidate is expected to write it, read it, or recognise it in a real codebase.
- Not knowing it would make the interviewer doubt the candidate's competence.

**OUT → goes to `future-learning.md`:**
- Real and worth learning, but only relevant after landing the first job.
- Too advanced for the target screening (mid-level architecture, performance tuning, distributed
  systems, patterns only seniors use).
- Belongs to a future project or a post-hire growth stage.
- Someone who doesn't know it would not be filtered out at the target level in the target year.

If a concept fits neither category, it is not needed at all — do not add it anywhere.

### The AI factor

For each concept, ask:
- Easy to generate with AI but hard to explain? → **must be in coverage.**
- The kind of thing an interviewer shows as a snippet and asks "what does this do and why?" →
  **must be in coverage.**
- Something only a mid-level developer needs, regardless of AI? → **future-learning.**

---

## Every section needs all three item types

The interview-prep system that consumes coverage generates three kinds of questions — conceptual
(~55%), decision (~35%), pressure (~10%). A section with only conceptual items is incomplete: it
generates only one kind of question, which is the most common gap and the one interviewers use to
filter juniors. Before closing any section, confirm it has at least one of each:

- **Conceptual** — "what is X and how does it work?" e.g. `@Transactional — what it does and at which
  layer it belongs`.
- **Decision** — "why X instead of Y?" e.g. `JWT vs sessions — when to choose each and the tradeoff
  for a stateless REST API`.
- **Pressure** — a gotcha or edge case that exposes shallow understanding e.g. `@Transactional on a
  private method — silently ignored because Spring cannot proxy it`.

---

## Confusable pairs — both sides, as separate items

Pairs of similar concepts are a standard interview filter. When a section touches one side of a
confusable pair, include the other as its own item, with a description that draws the difference.
Examples by topic (not exhaustive — apply the same logic to any topic):
- Spring Boot: `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`, `@Component` vs `@Bean`,
  `@Service` vs `@Repository` vs `@Component`, `findById` Optional vs throw, `save()` vs `saveAndFlush()`
- Angular: `Subject` vs `BehaviorSubject`, `signal()` vs `computed()`, `ngIf` vs `@if`,
  `async pipe` vs manual subscribe, `Observable` vs `Promise`, `constructor` vs `ngOnInit`
- Java: `==` vs `.equals()`, `checked` vs `unchecked` exceptions
- SQL: `WHERE` vs `HAVING`, `JOIN` vs `LEFT JOIN`, `COUNT(*)` vs `COUNT(column)`, `TRUNCATE` vs
  `DELETE`, `UNION` vs `UNION ALL`, `EXISTS` vs `IN`
- TypeScript: `interface` vs `type`, `any` vs `unknown`, `?.` vs `??`
- Architecture: `PUT` vs `PATCH`, `401` vs `403`, unit vs integration test, `DTO` vs entity,
  soft delete vs hard delete
- Security: authentication vs authorisation, hashing vs encryption, `XSS` vs `CSRF`, access vs
  refresh token

---

## Item format and file format

**Each item:** `concept name or syntax — one sentence anchored to interview context`. The description
is mandatory and must answer "why does this belong in coverage?" — the signal the interviewer is
probing for, not a tutorial definition. Use language like "interviewers ask…", "tested in every
technical screening", "the most common source of bugs in junior code".

**Good vs bad item:**
- ❌ `@Transactional — manages database transactions`
- ✅ `@Transactional — ensures multiple DB writes either all succeed or all roll back; interviewers
  ask where it belongs (service layer) and what happens if you put it on a private method (silently
  ignored — Spring cannot proxy it)`

The bad item is a dictionary definition. The good item names what the interviewer is testing and the
gotcha a junior is likely to miss. Fix every item that reads like a dictionary definition.

**One concept per item — functional requirement, not style.** Never group multiple concepts in one
bullet (if a bullet lists `@Entity`, `@Table`, `@Id` together, split them). Notes are audited per
item, interview questions are generated per item, and project gap analysis maps per item — a grouped
bullet breaks all three downstream steps.

**File format rules:**
- Plain `- ` bullets. No checkboxes (`[ ]`), no numbered lists.
- Inline backticks for annotations/class/method names are encouraged (`` `@Transactional` ``). Fenced
  code blocks (triple backtick) are **not** allowed — no implementation, no method bodies, no examples.
- Sections grouped by theme, with functional, specific names ("Spring Data JPA", "Bean validation",
  "Smart/dumb pattern" — good; "Annotations", "Patterns", "Basics" — too vague).
- Aim for 5–10 items per section. More than 12 → split. Fewer than 3 → merge into a related section.

---

## Ordering — filtering-risk order, and the note-sequence caveat

Order sections from **highest filtering risk** (most likely to cause rejection if unknown) to lowest,
and items within a section foundational-first, then more specific.

> **This is not the study order.** Coverage is ordered by interview risk; `notes-audit` builds the
> notes in **pedagogical/narrative order** (each concept arrives because the previous made it
> necessary). The two orders differ on purpose — `notes-plan` re-sequences for the narrative thread.
> So do not force coverage into a teaching sequence, and do not expect the notes to follow coverage's
> order file-for-file.

---

## The completeness test — before finalising a section or file

Answer honestly: *"If Victor studied only the items here and nothing else, could he confidently answer
any interview question about this topic at a screening for the target role and companies?"* If no,
something is missing — find it before writing. A section that fails any of: all three item types
present · both sides of every confusable pair · no item is a dictionary definition — is not done.
