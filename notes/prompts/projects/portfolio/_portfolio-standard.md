# Portfolio-readiness standard — the shared contract

**Internal component. Not runnable.** This is the single source of truth for the **portfolio gate**:
the final go/no-go check on a project before it goes on the CV, LinkedIn, or into a job application.
All three pieces of the portfolio pipeline read it:

- `portfolio-write-prompt.md` (the **author**) reads it for the interview-question quality bar.
- `portfolio-review-prompt.md` (the **reviewer**) reads it to audit the question bank against that bar.
- `portfolio-audit.md` (the **orchestrator**) reads it for the verdict logic and the CV / GitHub formats.

## What the portfolio gate is for

It answers one question: **is the project at `{PROJECT_PATH}` ready to show a recruiter and reference
in a job application right now — not "ready eventually", ready today?** It produces three things:

1. A bank of **project-specific interview questions** (saved regardless of the verdict — they are
   useful prep even for an unfinished project).
2. A **go/no-go verdict** (✅ Ready / ⚠️ Almost / ❌ Not ready).
3. If the verdict is not ❌: a **CV bullet** (Spanish, reused as-is by `cv-prompt`) and a **GitHub repo
   description** (English).

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
  Capgemini, Indra).

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
