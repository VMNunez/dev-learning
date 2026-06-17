# Simulation Review Prompt

Use in a **separate conversation**. Fill in the configuration block, paste the prompt into a new chat, then paste your solution code at the very end.

Run this after you finish a timed simulation — no notes, no AI, timer stopped. You get the kind of feedback a real consultancy test reviewer would give.

---

**How to use:**

1. Fill in `SIMULATION_FILE`, `TIME_USED`, and `TYPE`
2. Paste the entire prompt into a new chat
3. Paste your code below it — after the last line of the prompt

---

````
## Configuration — edit only this block

SIMULATION_FILE = [e.g. simulations/angular/01-task-form.md]
TIME_USED       = [minutes used — exact, no rounding — e.g. 74]
TYPE            = [angular | spring-boot | sql]

---

## Context

I am Victor, 31 years old. I am preparing for a junior Angular + Java Spring Boot position
at Spanish consultancies (NTT Data, Capgemini, Indra) by August 2026.

I just completed the simulation at {SIMULATION_FILE} under real conditions: no notes,
no documentation, no AI. {TIME_USED} minutes used. My code is pasted at the end of this chat.

---

## Step 1 — Read the spec

Read {SIMULATION_FILE}. Understand exactly what was asked: requirements, acceptance criteria,
data or constraints given, and expected output or behaviour.

Do not look at my code yet. First, list the requirements as you understand them — numbered,
one per line. This list is the scoring basis for Step 2.

---

## Step 2 — Score my solution

Read the code pasted at the end of this chat.

Score each dimension:
- **3 — Strong:** a senior developer would accept this without changes
- **2 — Acceptable:** works but has noticeable issues a reviewer would flag
- **1 — Weak:** missing, broken, or fundamentally wrong approach

**Angular simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) | | |
| Reactive forms — FormGroup, validators, error messages wired | | |
| HTTP service — correct method, URL, error handled | | |
| TypeScript — interfaces defined, no `any` | | |
| Patterns — service for HTTP, smart/dumb split where relevant | | |
| Edge cases — loading state, empty state, error state | | |
| Tests — written and meaningful (required from project 07 onwards) | | |

**Spring Boot simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) | | |
| Layered architecture — controller handles HTTP only | | |
| DTOs — request and response separate from entity | | |
| Validation — @Valid, @NotBlank, @NotNull on request DTOs | | |
| Error handling — @RestControllerAdvice or manual try/catch in service | | |
| HTTP conventions — correct status codes (201, 204, 404, 400, 409) | | |
| Tests — written and meaningful (required from project 07 onwards) | | |

**SQL simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) | | |
| Query correctness — right result returned | | |
| JOIN type correct for each query | | |
| Aggregates and GROUP BY / HAVING used correctly | | |
| NULL handling — IS NULL, COALESCE where needed | | |
| PostgreSQL features used where they help (ILIKE, ::, DISTINCT ON) | | |

**Overall verdict:**
- **Pass** — requirements met, no core dimension scored 1
- **Borderline** — most requirements met, one or two dimensions scored 1
- **Fail** — core requirements missing, or patterns fundamentally wrong

If {TIME_USED} > 90 minutes, note which parts took the most time and why.
Not knowing the API vs. not knowing the design are different problems.

---

## Step 3 — Detailed feedback

For every requirement NOT fully met:
- Quote the requirement text
- Describe what was missing or wrong
- Show the corrected version in a code block

For every dimension scored 1:
- Quote the problematic code
- Explain why it is wrong (one sentence)
- Show the corrected version

If the solution was strong overall: name one or two things done well. One line each.
Only mention real strengths — no false positives.

---

## Step 4 — Interview questions

Based on what was wrong or missing, write 2–3 questions a real consultancy interviewer would ask.
Target the specific gaps in this solution — not generic questions.

Add them to the right files. Always add to BOTH at the same time — never one without the other:
- Angular → notes/interview-prep/en/angular.md AND notes/interview-prep/es/angular.md
- Spring Boot → notes/interview-prep/en/spring-boot.md AND notes/interview-prep/es/spring-boot.md
- SQL → notes/interview-prep/en/sql.md AND notes/interview-prep/es/sql.md

Each question: the question in English (en/ file) and in Spanish (es/ file), plus a model
answer in each language — 2–4 sentences at the level expected from a junior.

---

## Step 5 — Update the tracker

Read simulations/TRACKER.md. Find the row for {SIMULATION_FILE} and update:
- Status: ✅ Pass / ⚠️ Borderline / ❌ Fail
- Time used: {TIME_USED} min
- Date: today's date
- Main issue: one-line summary, or "—" if Pass with no significant issue

Then show the commit message:

```
git add simulations/TRACKER.md notes/interview-prep/
```

```
git commit -m "chore: simulation {SIMULATION_FILE} — [Pass/Borderline/Fail], {TIME_USED}min"
```

[paste your solution below this line]
````
