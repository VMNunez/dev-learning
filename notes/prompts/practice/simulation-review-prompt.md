# Simulation Review Prompt

Use in a **separate conversation**. Fill in the configuration block, paste the prompt into a new chat, then paste your solution code at the very end.

Run this after you finish a timed simulation — no notes, no AI, timer stopped. You get the kind of feedback a real consultancy test reviewer would give.

---

**How to use:**

1. Fill in `SIMULATION_FILE` and `TIME_USED`
2. Paste the entire prompt into a new chat
3. Paste your code below it — after the last line of the prompt

---

````
## Configuration — edit only this block

SIMULATION_FILE = [e.g. simulations/angular/01-task-form.md]
TIME_USED       = [minutes used — exact, no rounding — e.g. 74]

TYPE is auto-detected from SIMULATION_FILE — do not fill it in:
- path contains /angular/     → angular
- path contains /spring-boot/ → spring-boot
- path contains /sql/         → sql

---

## Context

Before starting, read CLAUDE.md — it has my full profile, teaching rules, and what Spanish
consultancies look for.

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

Also note the time limit stated in the spec. You will compare it against {TIME_USED} in Step 2.

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
| Tests — written and meaningful | | Only include this row if tests appear in the spec requirements |

**Spring Boot simulations:**
| Dimension | Score (1–3) | Notes |
|-----------|-------------|-------|
| Requirements met (X/Y from Step 1) | | |
| Layered architecture — controller handles HTTP only | | |
| DTOs — request and response separate from entity | | |
| Validation — @Valid, @NotBlank, @NotNull on request DTOs | | |
| Error handling — @RestControllerAdvice or manual try/catch in service | | |
| HTTP conventions — correct status codes (201, 204, 404, 400, 409) | | |
| Tests — written and meaningful | | Only include this row if tests appear in the spec requirements |

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

If {TIME_USED} exceeded the spec time limit, note which parts took the most time and why.
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

**Pattern check — before closing this step:**
Read simulations/TRACKER.md. Look at past results for the same type (angular / spring-boot / sql).
If the same weakness appears in 2 or more previous simulations of the same type, flag it explicitly:
"Recurring weakness: [dimension] — seen in [N] previous simulations. Prioritise this before the next one."

---

## Step 4 — Interview questions

Based on what was wrong or missing, write 2–3 questions a real consultancy interviewer would ask.
Target the specific gaps in this solution — not generic questions.

Add them to the right files. Always add to BOTH at the same time — never one without the other:
- Angular → notes/interview-prep/en/angular.md AND notes/interview-prep/es/angular.md
- Spring Boot → notes/interview-prep/en/spring-boot.md AND notes/interview-prep/es/spring-boot.md
- SQL → notes/interview-prep/en/sql.md AND notes/interview-prep/es/sql.md

Each question must follow the full format used in these files:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences. Reference a real project or this simulation if the question is about
a pattern or decision. Use "I used" or "I chose" — not "it is used".

Then add the optional element based on question type:
- **Conceptual** (asks "what is X?" or "how does X work?") → add a Junior tip:
  > **Junior tip:** one line of advice on how to explain it clearly in an interview
  > **Consejo de entrevista:** same advice in Spanish
- **Decision-based** (asks "why X?" or "when X instead of Y?") or **Pressure** (gotcha or edge case)
  → add a Red flag:
  Red flag answer: what a weak candidate would say and why it fails.

Priority markers:
- ⭐⭐⭐ — not knowing this would filter the candidate in a first screening
- ⭐⭐ — comes up when the interviewer goes deeper
- ⭐ — a niche detail; missing it is not a dealbreaker at junior level

Place each question under the correct existing section heading in the file. If no section exists
for this concept, create one. After adding, reorder within that section so ⭐⭐⭐ come first,
then ⭐⭐, then ⭐.

---

## Step 5 — Update the tracker

Read simulations/TRACKER.md. Find the row for {SIMULATION_FILE} and update these three columns:
- **Status:** ✅ Pass / ⚠️ Borderline / ❌ Fail (from Step 2 verdict)
- **Date:** today's date
- **Self-assessment:** one-line summary of the main issue, or "—" if Pass with no significant issue

Then show the commit message:

```
git add simulations/TRACKER.md notes/interview-prep/
```

```
git commit -m "chore: simulation {SIMULATION_FILE} — [Pass/Borderline/Fail], {TIME_USED}min"
```

[paste your solution below this line]
````
