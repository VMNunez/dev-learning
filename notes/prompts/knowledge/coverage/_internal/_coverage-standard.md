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

Downstream, `knowledge/notes/notes-audit.md` and `knowledge/interview-prep/notes-and-interview-prep-prompt.md` use coverage as their baseline:
every item is a required topic that must be covered by at least one note. No exceptions. So the state
of the notes never limits what goes in coverage — if the notes are sparse or missing, derive coverage
entirely from what Spanish consultancies test at junior level; the gap just means notes must be written.

> **Projects are a vehicle to practise coverage items — they do not define coverage scope.** Never use
> the project list to decide what belongs in coverage.

---

## The job target is the source — never hardcode it

What counts as "in scope" is defined by **Victor's job target**, and that target lives in
`ROADMAP.md` (current phase, deadline, what is post-junior) and `notes/prompts/_internal/_shared-context.md`
(profile, the Spanish job market 2026, the AI factor). **Read both** before deciding scope — do not
rely on values written into a prompt.

Any concrete mention below — "junior Angular + Spring Boot", "NTT Data / Capgemini", "August–September
2026" — is an **illustration of what the source currently says**, not a fixed value. If ROADMAP.md and
`_shared-context.md` say something different (a new deadline, a shifted target role, new companies),
**they win** — the coverage must reflect the source, not the example.

### Two sources: a deep market analysis, complemented by real postings

Coverage scope rests on **two sources that reinforce each other**, and the first is primary. Neither
gives the true picture alone: the exhaustive analysis reveals the *real state of the market* — what a
junior is actually asked, the whole surface of it — and the real postings corroborate that with hard
frequency and the market's exact wording. Only together do they produce the complete, realistic view
coverage is built on.

1. **A deep analysis of the target market — the backbone.** Reason thoroughly about what a junior for
   the target role and companies (per ROADMAP + `_shared-context`) is actually asked in screenings,
   technical interviews, and take-homes, and — when possible — back it with a **live web search of
   current Spanish junior postings and interview norms** for the stack. This analysis is always
   required; it is never a mere fallback. It is what makes coverage reflect the whole market, not only
   the few postings that happen to be on file.
2. **Real postings — the corroboration.** `notes/prompts/_internal/_job-market-evidence.md` holds real postings
   from the target companies, distilled into recurring requirements. They **complement** the analysis:
   they confirm it, add a frequency signal (`~7/9`), surface the exact wording the market uses, and —
   on a concrete point where a real posting clearly conflicts with the analysis — the posting wins
   (real data beats an unverified guess).

Neither source alone is enough. The evidence file is a small, partial sample, so it can only *raise*
the floor, never lower it — a requirement's absence from it is not proof a junior does not need it. And
the analysis without the postings drifts toward what the model imagines rather than what the market
prints. Use both: where they conflict on a concrete point, evidence wins; everywhere else, the deep
analysis defines the floor. Evidence raises the floor, it does not lower the ceiling.

**Cover the market first, then expand — but the expansion is not optional.** Sequence the work: first
make every recurring market requirement map to an item (the priority floor), then expand to the
interview fundamentals and confusable pairs the postings under-list. The order is a priority, not a
licence to stop at the market: a section is not allowed to be "rich" in extras while a `~8/8` recurring
requirement has no item — but neither is it done just because the market requirements are covered. The
fundamentals a junior is still tested on are equally required for completeness.

> **When the evidence is thin, its silences are not signals.** `_job-market-evidence.md` currently holds
> only a handful of partial postings — a small, noisy sample. A skill *not* appearing there does **not**
> mean a junior for the target role does not need it. When the evidence is thin or empty, treat the
> model's reasoned per-topic analysis of what a junior at the target role and companies must know as an
> **equally required floor**: run the completeness test (below) in full for every section, and let real
> evidence override that analysis only where the two actually conflict — never let a sparse file quietly
> shrink coverage.

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
- ✅ `@Transactional — defines an atomic service-layer boundary so its database writes commit or
  roll back together; interviewers use it to test whether you place transactions around a complete
  business operation`

The bad item is a dictionary definition. The good item names one mechanism and the signal the
interviewer is testing. Proxy limitations such as private methods belong in their own item.

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

Answer honestly: *"If Victor studied only the items here, could he handle the common screening
questions and practical tasks that materially filter a junior candidate for the target role?"* Do
not optimise for every question an interviewer could invent. A section is complete when it covers
the recurring market floor, ordinary junior fundamentals, the important confusable pairs, and the
three item types without importing post-hire depth.
