# Portfolio-readiness standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for the **portfolio gate**:
the final go/no-go check on a project before it goes on the CV, LinkedIn, or into a job application.
All three pieces of the portfolio pipeline read it:

- `portfolio-write-prompt.md` (the **author**) reads it for the interview-question quality bar.
- `portfolio-review-prompt.md` (the **reviewer**) reads it to audit the question bank against that bar.
- `portfolio-audit.md` (the **orchestrator**) reads it for the verdict logic and the CV / GitHub formats.

## What the portfolio gate is for

It answers one question: **is the project at `{PROJECT_PATH}` ready to show a recruiter and reference
in a job application right now — not "ready eventually", ready today?** It produces four things:

1. A bank of **project-specific interview questions** (saved regardless of the verdict — they are
   useful prep even for an unfinished project).
2. A **go/no-go verdict** (✅ Ready / ⚠️ Almost / ❌ Not ready).
3. If the verdict is not ❌: a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub repo
   description** (English).
4. If the verdict is ✅ Ready: a **direct update of Victor's GitHub profile README**
   (`dev/portfolio/VMNunez`, a separate repo). Format: match that README's existing style and sections
   exactly; add or refresh the project's entry (name, one-line pitch, stack, links). Never committed
   from the learning flow — the orchestrator prints the commit + push commands for that repo
   (procedure: `portfolio-audit.md`, Phase 3).

It is the last link in the per-project chain: `plan-audit` → build → `readme-audit` → `review-audit`
→ **portfolio gate**.

---

## Two project formats

- **Full-stack projects (07+)** — Spring Boot + Angular + PostgreSQL. Read the backend + frontend
  source, tests, `application.properties`, `docker-compose.yml`.
- **Angular-only projects (01–06)** — closed. Read routes, config, page components, services, guards,
  interceptors.

Derive the type from the project number (01–06 Angular-only, 07+ full-stack) — never ask.

---

## Bank sections → code areas (canonical table)

The question bank has **five fixed sections**, each mapping to a distinct code area. This is the single
source of that mapping — the orchestrator and both subagent prompts reference it, never their own copy:

| Section | Code area to mine / walk |
|---|---|
| Architecture & Patterns | structure + layered architecture; backend controllers/services, or angular routes/config/components |
| Security & Auth | backend security folder + JWT filter; angular guards/interceptors — **skip if the project has no auth** |
| Business Rules | service logic + validation + PLANNING.md §8 business rules |
| Technical Decisions | tradeoffs in PLANNING.md, DTOs, HTTP status choices, config/properties |
| Testing | the test files (`src/test/java`, `**/*.spec.ts`) — **skip if the project has none** |

---

## Verdict logic

Two checks, run in order. **Check 1 gates Check 2.**

### Check 1 — Feature completeness (from PLANNING.md)
Read `{PROJECT_PATH}/PLANNING.md`, find the step-by-step plan (Section 0 or the steps list). Are all
steps marked complete?
- **Any step incomplete → ❌ Not ready.** List the incomplete steps and stop — do **not** check the
  backlog. A partially built project is not portfolio-ready regardless of code quality.

### Check 2 — Code quality (from PROJECT-BACKLOG.md)
Only if all steps are complete. Read `{PROJECT_PATH}/PROJECT-BACKLOG.md` (full-stack keeps its own
backlog inside its folder). If it does **not** exist: stop and report "no PROJECT-BACKLOG.md — run
`review-audit` first". Otherwise apply:
- Any open **High** `[ ]` task → **❌ Not ready.** List every blocking task. Do not proceed to CV /
  GitHub.
- Only open **Medium** `[ ]` tasks → **⚠️ Almost ready.** List them; the project can be shown but
  mention the limitations if asked.
- No open High or Medium → **✅ Ready.** Show it to a recruiter today.
- Open **Low** tasks do not affect the verdict — ignore them.

**Two sanity scans before the verdict is final** (report each as a one-line note, never auto-fix):
- **Resolved-but-unchecked tasks.** Every `[ ]` counts as open. For each open High/Medium task, glance
  at the real code — if it looks already done, flag it ("task X marked open but appears resolved —
  check it off in the backlog and re-run"). Never silently treat it as done.
- **Unfilled visual placeholders.** Scan the global README for `*(screenshot — … — to be added)*` /
  `*(GIF — …)*` placeholders. If any remain, **downgrade a ✅ to ⚠️** and list them — a README full of
  unfilled visuals is not recruiter-ready.

> Unchecked tasks count as open even if the code is already fixed — the verdict reads the backlog
> directly. Before running the gate, tasks already fixed should be checked off (✅) in the backlog.

### Verdict definitions
- **✅ Ready** — all steps complete, no open High or Medium. Include it in the CV and LinkedIn now.
- **⚠️ Almost ready** — all steps complete, open Medium tasks remain. List them as checkboxes.
- **❌ Not ready** — incomplete steps or open High tasks. List them as checkboxes. Skip the CV bullet
  and GitHub description entirely.

---

## Interview-question quality bar

The question bank lives at `notes/interview-prep/projects/{PROJECT_NAME}.md` (`{PROJECT_NAME}` = the
last path segment, e.g. `07-timetrack`). It complements the topic-based files in `interview-prep/en/`
and `es/` — these are **project-specific**, about the actual implementation decisions made here.

**Every question must:**
- Target a **decision, a pattern, or a gotcha** — never "what is X". It must be answerable only by
  someone who actually wrote or understands this specific code.
- Come from the real files: PLANNING.md's new/review concepts, business rules, architecture decisions
  and tradeoffs; and the actual source. Use ROADMAP.md to target the companies/context (NTT Data,
  Capgemini, and similar — the profile in `_shared-context.md` is the source for targets).

**Model answer:** 2–4 sentences, references the **actual implementation** (not a textbook
definition), and uses "I chose" / "I decided" — not "it is used".

**Exhaustiveness — the highest-value rule.** Generate as many questions as there are real decisions and
patterns to defend. **Do not cap at 5.** Cover every decision, every pattern, every business rule, and
every testing choice that could come up in a 30-minute technical interview. *A thin file is a gap the
interviewer will find.*

**Format per question:**
```
**[Question as an interviewer would ask it?]**

[Model answer — 2–4 sentences, references the real code, uses "I chose"/"I decided".]
```

**Append + dedupe:** if the file exists, append only questions not already there. Never add a question
covering the same decision or code path as an existing one, even if worded differently.

**File template:**
```markdown
# Interview Questions — {PROJECT_NAME}

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in interview-prep/en/ and es/.

## Architecture & Patterns
[coordinator, smart/dumb, layered architecture, etc.]

## Security & Auth
[JWT, SecurityContextHolder, BCrypt — omit this section if the project has no authentication]

## Business Rules
[status transitions, validation, access control, etc.]

## Technical Decisions
[DTOs, PATCH vs PUT, soft delete, etc.]

## Testing
[what is tested, why that service/edge case, what the mock does, what would break if the test were
removed — omit if the project has no tests]
```

---

## CV bullet format

Read `notes/prompts/strategy/apply/_application-standard.md` first — the bullet lands in the Spanish CV
**as-is** (`cv-prompt` uses it without rewriting), so it must already comply:
- **Spanish** (the CV is screened in Spanish).
- **Format:** past-tense action verb (Desarrollé, Implementé, Construí, Diseñé) + what was built +
  one concrete result or defensible decision that shows depth. No filler ("participé en", "colaboré en").
- **ATS keywords** from the standard's pool (Angular, Spring Boot, PostgreSQL, JWT, Docker, JUnit…)
  where they genuinely apply.
- **Defensibility:** nothing Victor cannot defend line by line.

`[Verbo en pasado] [qué es] con [tecnologías clave] — [un resultado concreto o una decisión que demuestra profundidad]`

Draft **two options**, save both to `notes/cv/cv-bullets.md` under a `## {PROJECT_PATH}` heading (replace
the section if it exists). If the file does not exist, create it with the header:
```markdown
# CV Bullets

One bullet per project. Edit each entry to keep only your chosen option.
Used by `cv-prompt` when drafting the Projects section of your CV.

---
```
Entry format:
```markdown
## {PROJECT_PATH}

*(choose one — delete the other before committing)*

- [Option A]
- [Option B]
```

---

## GitHub repo description format

Stays in **English** (GitHub's audience is wider than the Spanish screen; English is the convention
there). One line, 160 characters max, no markdown. Draft **one** option.

`[What it does] — [tech stack]. [One thing that makes it worth looking at.]`

Example: "Full-stack time tracker — Spring Boot + Angular + PostgreSQL + JWT. Role-based access, soft
delete, JUnit 5 tests."
