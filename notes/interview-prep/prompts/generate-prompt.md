# Interview Questions Generate Prompt

Use in a **separate conversation** after finishing a new concept or topic.
Fill in the two values in the configuration block at the top of the prompt below, then paste everything into a new chat.

---

**How to use:**
1. Fill in `TOPIC` — the concept just learned (e.g. "Angular route guards and lazy loading")
2. Fill in `FILE` — which interview prep file to add to (e.g. `angular`, `css`, `sql`, `java`)
3. Paste the entire prompt below (configuration block included) into a new chat

---

```
## Configuration — edit only this block

TOPIC = [e.g. Angular route guards and lazy loading]
FILE = [e.g. angular]

Use these two values wherever the prompt refers to {TOPIC} or {FILE}.

---

I just finished learning: {TOPIC}

Before starting, read CLAUDE.md — it has my full profile, teaching rules, and interview
prep format conventions.

I am Victor, 31 years old, targeting a first junior developer job at Spanish IT consultancies
(NTT Data, Capgemini, Indra, and similar) with a target date of August 2026.
My stack: Angular + Java Spring Boot.
My differentiator: most candidates in Spain apply with React. Angular + Java is what large
consultancies actually use — I stand out if I demonstrate real understanding and decisions.
I currently have an internship (Next.js + TypeScript + MySQL) as real work experience.

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: finance tracker (in progress) — Spring Boot REST API, JWT auth, PostgreSQL, Angular

Generate interview questions on {TOPIC} and add them directly to:
- notes/interview-prep/en/{FILE}.md
- notes/interview-prep/es/{FILE}.md

Same questions, same answers, same section, translated. Never add to one without the other.

---

## How many questions to generate

Generate every question a Spanish consultancy would realistically ask about {TOPIC}.
Do not stop at 3 or 5. The goal is complete coverage of the topic — every angle a recruiter
could explore. A thin section is a risk. Better to over-prepare than to be caught off-guard.

---

## Rules for every question

Format:

**Question as an interviewer at a Spanish consultancy would ask it?**
Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

Quality bar: every answer must pass this test — "could I explain every word of this answer
if the interviewer pressed me?" If not, rewrite it.

- Group questions under the correct section heading: ## [section name]
- Mix of types: conceptual ("what is X?"), decision-based ("why X instead of Y?"),
  pressure ("what would you change?")
- Target ratio: 55% conceptual / 35% decision-based / 10% pressure
- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition
- Always reference a specific project for pattern or decision questions

For every new conceptual question, add a Junior Tip:

> **Junior tip:** short advice on how to explain it clearly in an interview  (English)
> **Consejo de entrevista:** same advice in Spanish

---

After adding all questions, show the commit message so Victor can run it himself.
Commit format: docs: add {TOPIC} interview questions to {FILE}
Example: docs: add RxJS operators interview questions to angular
```
