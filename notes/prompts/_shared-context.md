# Shared context for the prompts

This file is **not a prompt**. It holds the context blocks that every prompt used to repeat:
my profile, my projects, the Spanish job market, and the AI factor. Prompts reference the
sections they need instead of duplicating them — so a fact changes in one place, not sixteen.

Keep this in sync with `CLAUDE.md` (which holds a condensed profile) if anything here changes.

---

## Profile

I am Victor, 31 years old. I am in a career transition — my background is React, Node.js, and
TypeScript, but I retrained to target **Angular + Spring Boot + PostgreSQL**, the dominant stack
at Spanish IT consultancies.

- Full-time studying since June 2, 2026 — this is my main job right now, not a side project
- Completed an internship in June 2026 (Next.js + TypeScript + MySQL) — real work experience,
  different stack, goes on the CV
- Target: my first developer job at a Spanish IT consultancy by **August–September 2026**
- Target companies: NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI,
  and similar large consultancies
- Differentiator: most candidates in Spain apply with React; I am going with Angular + Spring
  Boot, which is what consultancies use internally — this makes me stand out if I can demonstrate
  real understanding and real decisions, not just syntax knowledge
- Level: Junior to Junior-Mid. I need to sound like someone who makes decisions and can explain
  them — not someone who followed a tutorial and memorised the steps

---

## Projects

`CLAUDE.md` and `PROGRESS.md` are authoritative — if this list is outdated, use them instead.
Projects are a vehicle to practise concepts; they do not define what must be learned.

- **01 — todo list:** components, signals, services, directives
- **02 — weather app:** HttpClient, RxJS, forkJoin, API integration
- **03 — expense tracker:** reactive forms, routing, localStorage, smart/dumb pattern
- **04 — meal finder:** route params, ActivatedRoute, effect(), favourites
- **05 — task manager:** Angular Material, MatTable, MatDialog, coordinator pattern
- **06 — HR portal:** route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- **07 — TimeTrack (in progress):** Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate,
  PostgreSQL, Docker, Angular

---

## Spanish job market 2026

Large consultancies (NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI)
hire juniors through a standard 5-stage process:

1. **CV screening** — stack match, projects, internship. Filtered out if the CV is generic.
2. **HR call** — motivation, availability, salary expectation. 15–20 minutes.
3. **Technical test** — take-home mini-project (Angular mini-app or Spring Boot mini-API),
   typically 2–4 hours. Filtered out if the code is not clean, not structured, or not explainable.
4. **Technical interview** — live review of the take-home code: explain every decision, defend
   architecture choices, answer conceptual questions on the spot. The most important stage.
   Filtered out if the candidate cannot explain what they wrote.
5. **Offer** — salary and contract terms.

What gets a junior filtered out at the technical interview (stage 4):
- Cannot explain why a pattern was chosen (only knows how to write it)
- Cannot read code written by someone else and explain what it does
- No tests in the project — in 2026 this is a hard filter at most large consultancies, not a
  minor gap. A junior with tests is rare and immediately stands out
- Does not know the difference between similar concepts (`PATCH` vs `PUT`, `@NotNull` vs
  `@NotBlank`, `LAZY` vs `EAGER`, `Subject` vs `BehaviorSubject`)
- Gives textbook definitions instead of real examples from their own projects
- Cannot explain an architectural decision: "why JWT?", "why DTOs?", "why soft delete?"

What has specifically changed in 2026:
- Technical tests increasingly include a code-review step: the candidate is shown a snippet
  (sometimes AI-generated) and asked to find the bug or explain what is wrong
- Docker/containerisation is moving from "nice to have" to baseline expectation — a candidate
  who cannot explain what `docker-compose up` does is visibly behind
- Testing has become a real differentiator: almost no junior candidate has tests. Having
  JUnit 5 + Mockito on the backend is now worth more than an extra feature

At junior level, companies are not expecting a senior. They want someone who:
- Can explain every line of code they wrote
- Can justify at least one architectural decision with a real reason, not a tutorial answer
- Knows the basics of their stack and is not faking it
- Can be productive within a few months
- Can review code — including AI-generated code — and spot obvious mistakes

---

## The AI factor 2026

AI writes boilerplate. This has changed what technical interviewers test.

- Before AI: "Can you write the code?" was enough to pass.
- Now: "Can you explain the code, justify the decision, and catch a bug in code you did not write?"

There are two layers in 2026:
1. **Explain what AI generates** — a candidate who generates code without understanding it is
   filtered out faster than before
2. **Review AI output** — companies expect juniors to USE AI tools (Copilot, Cursor) and review
   the output critically. The question is no longer only "can you explain the code you wrote?" —
   it is also "can you spot what the AI got wrong?"

Common AI mistakes at junior level that interviewers test for:
- Hardcoded secrets or tokens instead of environment variables
- `@Transactional` placed on the wrong layer (controller instead of service)
- Missing validation edge cases (`@NotBlank` used where `@NotNull` was needed, or vice versa)
- Tests that always pass but never catch a real bug (no meaningful assertion)
- N+1 queries from missing `LAZY`/`EAGER` configuration

The bar is now: any concept that is easy to generate with AI but hard to explain, defend, or
review belongs in scope. "A junior must be able to explain, defend, and review this without AI help."
