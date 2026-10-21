# Roadmap — Victor's Learning Plan

**Goal:** Junior / junior-mid Angular + Java Spring Boot developer at a Spanish consultancy — achieved when a consultancy hires you into that role.

**This goal does not expire.** Applications run every day from now (see the applications strategy); finishing the phases below raises the strength of each application, not the date the search starts or ends. If the goal is not met when they are done, the search continues and the same employment gates remain active; once hired, the post-job growth plan near the end of this file takes over.

---

## Who you are and where you stand

Build the application story around transferable team experience and a finished, defensible full-stack project. Use the internship's concrete delivery and collaboration results to bridge the difference between its stack and the target role; use TimeTrack to demonstrate the target stack itself.

The profile, internship details, strengths and risks are maintained in [`_shared-context.md`](notes/prompts/_internal/_shared-context.md#profile). This plan turns them into priorities: finish the project gate and practise unaided delivery and explanation; the English track is paused and returns under the criteria in `HORARIO.md` §2 (in the `Documents/main` folder above this repository).

---

## The market you are targeting

Target-company and market facts live in [`_shared-context.md`](notes/prompts/_internal/_shared-context.md), in its Spanish job market section. Use them to tailor each application rather than maintain another company list here.

**Why consultancies and not startups or product companies:**

Prioritise roles where the target stack and supervised junior delivery fit the evidence you can defend. Evaluate each opening against that fit before expanding the search to roles requiring autonomous ownership you have not demonstrated.

**What they look for in a junior:**

Turn the hiring criteria in the shared context into application evidence: a runnable project, meaningful tests, a concise decision story and a concrete internship result. Each claim must be supported by something you can show and explain.

**The hiring process at Spanish consultancies (what to expect):**

The stages and their conditions are maintained in the shared context's market section. Prepare the evidence for screening, run `/hr-screen` when application work starts or a call is scheduled, and use timed simulations plus active recall to prepare for the technical stages. Keep the ability to explain and review the submitted code at the centre of preparation.

---

## The AI factor — how it changes the market

The market analysis and examples are maintained in [`_shared-context.md`](notes/prompts/_internal/_shared-context.md), in its AI factor section. The strategic consequence is to practise explanation, testing and critical review alongside implementation: generated code only becomes useful evidence when you can defend it and catch its defects unaided.

**What this means for you concretely:**

- Every project must have a README with architecture decisions — not just _what it does_ but _why it was designed this way_
- Every concept you learn must be explainable out loud — if you cannot explain it, you cannot defend it in an interview
- Tests are not optional from project 07 — they are the proof that you understand the code
- The interview question _why did you use JWT instead of sessions?_ must have a real answer, not _because that is what I saw in a tutorial_

---

## What most increases your probability of being hired

In order of impact:

1. **Complete, explainable full-stack projects** — starting with project 07 TimeTrack, then project 08, and more if time allows. All live in `projects/`. Spring Boot + Angular + PostgreSQL + Docker + JWT + tests. You must be able to explain every line, every decision, every tradeoff in each one. Every extra project separates you further from other junior candidates.

2. **Tests in the project** — prioritise tests that catch a broken business rule or failed interaction and explain why each assertion matters. The testing stack and market rationale are maintained in the shared context and the permanent testing rule below.

3. **A README with architecture decisions** — not a list of technologies. Decisions: _why JWT over sessions, why soft delete, why DTOs instead of exposing entities, why coordinator pattern_. One candidate who explains decisions is worth more than five who just list features. The README format and quality standard is defined in `notes/prompts/projects/readme/_internal/_readme-standard.md`.

4. **The internship on the CV** — select a specific result from the shared context's internship evidence: _built X that does Y for Z users/clients_. Connect that result to the role rather than retelling the profile here.

5. **English at B2** — the English track is paused until `HORARIO.md` §2's return criteria are met; make only credential claims supported by the profile's current evidence in the shared context.

6. **Interview prep** — knowing how to answer _what is dependency injection, what is lazy loading, what is a JWT, what is a DTO_ fluently and with a project example. The notes/ folder and the simulator prompt exist for this.

7. **More full-stack projects** — project 08 after 07, and more once the higher-priority application gates are secure. Every project covers different challenges (many-to-many, pagination, file upload) and shows consistent effort, not a one-time build.

---

## Level strategy — junior breadth before specialisation

The immediate hiring strategy is a **demonstrated junior full-stack baseline**, not premature
middle/senior depth. `PROGRESS.md` owns the current level of every topic; this roadmap uses that matrix
to decide what comes next without duplicating its statuses.

Before the first developer job:

1. Close the highest-risk junior gaps across every registered topic in `notes/coverage/junior.md`,
   including the supporting Angular Material, Spring and HTML topics.
2. Prioritise Angular + Spring Boot + Java + Architecture + Security because they drive the target
   full-stack role, while still bringing every supporting topic to a credible junior baseline.
3. Choose projects, exercises, notes, interview sessions, and simulations from the **open junior
   gates** in `PROGRESS.md`; do not introduce middle material merely because it is interesting.
4. A topic reaches `Junior — demonstrated` only when knowledge consolidation and practical,
   unaided evidence both pass.

Backend is the intended long-term direction, but specialisation starts when real work, job postings,
or repeated practical gaps provide evidence for it. After employment, backend topics may advance to
middle first—Spring Boot, Java, SQL, Architecture, and Security—while frontend topics remain maintained
at a demonstrated junior level. The job determines which backend depth is valuable; the roadmap does
not guess it in advance.

This produces two different decisions:

- **Before employment:** maximise hireability through junior full-stack coverage and fluency.
- **After employment:** deepen the topics the role actually rewards, with backend as the preferred path.

---

## Phase plan

| #   | Goal                                              | Project                                                            | SQL                                                               | Interview prep                                | Status     |
| --- | ------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------- | ---------- |
| 1   | Angular projects 01–04 delivered                  | Angular 01–04 + CSS/Tailwind                                       | SELECT, WHERE, ORDER BY                                           | Angular notes                                 | ✅ Done    |
| 2   | Angular projects 05–06 delivered; Java introduced | Angular 05–06 + RxJS + Java foundation                             | SQL basics continued                                              | Angular notes + interview prep started        | ✅ Done    |
| 3a  | Project 07 backend demonstrable                   | Project 07 backend — JWT auth + protected endpoint                 | SQL querying basics in progress                                   | Spring Boot notes                             | ✅ Done    |
| 3b  | Project 07 demonstrable — frontend + tests        | Project 07 — finish backend/Angular tests; frontend already delivered | JOINs, GROUP BY, aggregates, subqueries                           | Java + Architecture + Security notes          | ⏳ Current |
| 3c  | Consolidation — fluent without Claude             | Rebuild key 07 slices solo (no notes, no AI) + SQL complement; Docker and deployment delivered | JOINs, GROUP BY/aggregates, subqueries/CTEs, NULL handling, DML basics | Spaced review                                 | 🔜         |
| 4   | Simulations on track; 08 conditional              | Project 08 **only once simulations are on track**                  | Remaining SQL topics                                              | TypeScript + SQL + JavaScript + CSS + Git notes | 🔜         |
| 5   | Interview ready                                   | Final project polish                                               | Remaining SQL topics                                              | Spaced review                                 | 🔜         |
| 6   | After phase 5 — depends on outcome                | Continue the employment gates, or follow the post-job growth plan once hired | Remaining SQL topics                                              | Spaced review                                 | 🔜         |

_Row 6 is intentionally open: if the employment gate is not met, the search and unfinished gates continue; once it is met, the post-job growth section applies._

### Urgency order — urgent first, important-but-not-urgent after

The hiring process (stages in the shared context's market section) defines urgency: the decisive filters
are the technical test and its live review, where the code must be produced and explained **unaided** —
so fluency without Claude outranks adding more artifacts. In order:

1. **Finish Project 07 tests (Steps 8–9)** — the frontend is delivered and the public deploy exists; the demonstrable gate still needs verified backend and Angular service tests. Start with Step 8's exact done condition in `projects/07-timetrack/PLANNING.md`.
2. **Close the Project 07 SQL complement (Step 10)** — Docker and deployment are already delivered; the remaining tests and SQL work close the project before its final quality gates.
3. **Consolidation (Phase 3c)** — rebuild key slices of 07 solo (a CRUD endpoint from scratch, a reactive form + service) under the same conditions as a real test. This is what the technical test measures; Claude-guided building does not train it.
4. **Simulations + interview prep (es/)** — the 15-simulation target and fluent answers with project examples.
5. **Verify and present the finished project** — follow the final quality gates in `projects/07-timetrack/PLANNING.md`, then use their accepted README and project decisions in application material.
6. **Project 08** — only once simulations are on track. A second project adds less than explaining the first one fluently; it must never displace items 3–4.

LeetCode stays behind its existing five gates — unchanged.

---

## Daily schedule

The day is `HORARIO.md` §1's, in the `Documents/main` folder above this repository: it alone says which blocks exist, when and in what order. What this system serves in each programming block is `_session-rules.md` → "Daily study blocks". The sections below are named by block and carry the strategy of each one, never its hour.

---

## Project block — active project

### Now — Project 07 TimeTrack

**Backend gate (Phase 3a — closed):** Login endpoint returns a valid JWT; protected endpoints reject requests without a token — confirmed in Postman. See `projects/07-timetrack/PLANNING.md` for the full step history.

**Covers:** REST API, JWT auth, role-based authorization, JPA + Hibernate, TimeEntry workflow (DRAFT → SUBMITTED → APPROVED / REJECTED), reports, Angular frontend, JUnit 5 + Mockito, Vitest + TestBed, Docker Compose, architecture README.

**Demonstrable gate (Phase 3b):** Steps 8 and 9 pass their done conditions in `projects/07-timetrack/PLANNING.md` — `mvn test` green over every service test class with no database running, and `ng test` green over the six Angular service specs. The Angular frontend (Steps 7a–7d) and the README's architecture decisions and tradeoffs are already in place. This is what unlocks consolidation.

**Full project gate (Phase 3c):** Steps 8–10 pass their done conditions and the plan's final quality gates are signed off. Docker and public deployment are already delivered; the remaining work is backend tests, Angular tests and the SQL complement. See `projects/07-timetrack/PLANNING.md` for the assertions and gate chain.

**CV gate:** met — project 07 is live on GitHub with a README that includes its architecture decisions, so the CV leads with it now. The CV bullet is rewritten from the finished project once the portfolio gate (G7 in `projects/07-timetrack/PLANNING.md`) returns ✅ Ready.

### Tests — permanent rule from project 07 — complete and production-quality

| What                 | Tool              | From       |
| -------------------- | ----------------- | ---------- |
| Spring Boot services | JUnit 5 + Mockito | Project 07 |
| Angular services     | Vitest + TestBed  | Project 07 |
| Angular components   | Vitest + TestBed  | Project 08 |

No project is finished without tests. Tests are not a step — they are part of finishing a feature. From project 07, tests are written at the level a senior developer would write them: edge cases covered, meaningful assertions, no trivial "it exists" tests.

### Project 08 — after 07

Planned in two runs, both inside Claude Code once project 07 is complete. `project-brief` **picks** the candidate from the list below and records why — the gaps it closes, the alternatives rejected, the scope ceiling — in a dated one-page brief at `projects/briefs/project-brief-08.md`, contested by a cold second opinion. `plan-audit` (`MODE = new`) then **writes** the complete `PLANNING.md` for it, author + architecture advisor + seven cold specialists, hands-off; it dispatches the brief itself if you skipped that step.

**Project 08 candidate ideas** — each names the `notes/coverage/junior.md` gaps it closes (gaps that project 07 does not touch). This list **proposes**; the brief decides and is where the reasons live:

- **Invoice Manager** — clients, products, invoices. Covers: many-to-many, Pageable, `@Query`, PDF export.
  Closes: `Page<T>` vs `Slice<T>`, owning side of a many-to-many, and `@Modifying` write queries.
- **Expense Reports** — submit and approve expenses. Covers: file upload, email, approval workflow, Flyway.
  Closes: Flyway / schema evolution, server-side file validation and safe storage/serving,
  `@Transactional` propagation, and transaction limits around files or outbound calls.
- **Library Catalog** — books, authors, members, loans. Covers: many-to-many, complex queries, component tests.
  Closes: `@DataJpaTest` repository tests, many-to-many ownership, and report-total verification.
- **Support Desk** — tickets with comments, search, and dynamic forms. Covers: typeahead search,
  dynamic form sections, status workflow with an audit trail.
  Closes: the RxJS search-pipeline gap (`debounceTime`, `distinctUntilChanged`, `switchMap`),
  `finalize`, `FormArray`, and `@WebMvcTest` slice tests.

---

## SQL block — SQL exercises

| Coverage heading                          | Status |
| ----------------------------------------- | ------ |
| JOINs                                     | 🔜     |
| Aggregates and grouping                   | 🔜     |
| Querying basics                           | ⏳     |
| Ordering and pagination                   | ⏳     |
| Set operations                            | ⏳     |
| Filtering and NULL handling               | ⏳     |
| Subqueries, CTEs, and views               | 🔜     |
| Schema operations                         | 🔜     |
| Working with an existing database         | 🔜     |
| DML — modifying data                      | 🔜     |
| Transactions                              | 🔜     |
| Window functions                          | 🔜     |
| Schema design                             | 🔜     |
| Data types                                | 🔜     |
| PostgreSQL specifics                      | 🔜     |
| Common string functions                   | 🔜     |
| Performance basics                        | 🔜     |
| Query workflow and SQL review             | 🔜     |

**The screening floor comes first.** The SQL route puts the test-relevant topics first — JOINs ·
GROUP BY/aggregates · subqueries/CTEs · NULL handling · DML basics — because they are what consultancy
tests actually ask; window functions, indexes and PostgreSQL specifics follow them. This is a priority
inside the route, never a switch: the SQL block stays SQL exercises on every day it runs, and the full
table above still gates LeetCode.

**LeetCode Easy — behind five gates (all of the following must be complete):**

LeetCode has no block in the day. Once all five gates below are complete, where it goes is a change to `HORARIO.md`, which is Victor's.

| Gate                                                                       | Why |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQL all topics solid (JOINs, GROUP BY, subqueries, CTEs, window functions) | SQL is more likely to appear in tests than algorithms                                                                                                                                                                                                                                        |
| Project 07 live, documented, and explainable line by line                  | This is the main differentiator — it must be solid first                                                                                                                                                                                                                                     |
| Project 07 has tests (JUnit 5 + Mockito + Vitest)                          | Tests are a stronger signal than LeetCode for consultancies                                                                                                                                                                                                                                  |
| Notes complete for Angular, Spring Boot, Java, Architecture, Security      | Interview prep gaps matter more than algorithm practice                                                                                                                                                                                                                                      |
| Interview prep (es/) solid for the main topics                             | Active recall ready before adding a new track                                                                                                                                                                                                                                                |

Until all five gates are complete, LeetCode stays out of the day; the open gate is what to strengthen.

---

## Technical test simulations

**Strategy:** the technical test and its live review are the stages that filter juniors out (their format is the shared context's, in its market section), and both ask for code produced and then explained unaided. Timed simulations, done alone with no notes and no AI, are the only practice that reproduces that unaided delivery, which is why they outrank adding more artifacts.

**Target: 15 simulations mark the technical stage prepared** — a preparation target, never a condition for sending an application. Split by type:

| Type        | Minimum | What it covers                                                        |
| ----------- | ------- | --------------------------------------------------------------------- |
| Spring Boot | 5       | REST endpoint + service + repository + basic validation               |
| Angular     | 5       | Reactive form + service + HTTP call + error state                     |
| SQL         | 5       | Given a schema: SELECT, JOIN, GROUP BY, subquery — under a time limit |

**The track owns everything else.** When a simulation is due is the level route's and `_practice-standard.md` §F's to state. `/simulation-plan` builds the level route — which tests are admissible, in what order and with what time limit; `simulation-block-open` opens a block and states its attempt conditions without starting the timer; `simulation-grade` is the only door to a review that records anything.

---

## Interview-prep block — spaced review and notes

The block is the spaced review of the question banks, with the notes it needs — how it runs is `_session-rules.md` → "Daily study blocks" and "The spaced review of the question banks". Notes are opened inside it when a question fails or a topic is new, not studied first as a separate stage. Notes study order: `angular → spring-boot → java → architecture → security → typescript → sql → javascript → css → git` (SQL is last because it is already practised in the SQL block).

Supporting topics have an explicit place alongside that order: Angular Material with Angular, Spring with Spring Boot, HTML with CSS, and General with Git. Use each topic's junior notes plan and active recall to consolidate its uncovered fundamentals; the coverage files remain the concept inventory. Later levels use their own isolated folders. Use the simulator prompt for mock interviews.

---

## Applications strategy

**Applications run every day, from now**, in the job-search block (Victor, 2026-10-20; `_session-rules.md` → "Daily study blocks"): offers, a CV tailored to each, applications and their follow-up through `/cv`, `/cover-letter` and `/tracker`. Nothing in this plan holds an application back — every early application also teaches how the screening works and what the CV is missing.

**What makes an application strong — bring what you have, strongest first:**

The order follows what the hiring process actually evaluates (CV screen → technical test → technical
interview). Each item raises the odds of the next stage; none is a condition for applying.

- Project 07 live, documented, explainable line by line — and, once Steps 8–9 pass, tested
- Timed simulations completed toward the 15-simulation target (see Technical test simulations)
- Interview prep (es/) solid for angular, spring-boot, java, architecture, security — every question answered with a project example
- CV with specific results (_built X that does Y_) + LinkedIn updated with project summaries and the internship bullet
- Then, as they come: Project 08 (see Urgency order, item 6), the remaining interview prep topics (typescript, css, sql, javascript, git), and LeetCode Easy behind its five gates

**Market timing (fact, not a phase):** Spanish consultancies approve headcount after summer, so junior positions cluster from September, when the decision-makers are back from holiday. It changes the volume of offers to expect, never whether to apply.

**Where to find jobs in Spain:**

- **LinkedIn Jobs** — most consultancies post here; also where recruiters search for candidates
- **InfoJobs** — biggest Spanish job board; high volume, filter by "junior" + "Angular" or "Spring Boot"
- **Tecnoempleo** — tech-specific, good signal-to-noise ratio for developer roles
- **Direct company careers pages** — NTT Data, Capgemini, and Indra all have public junior calls in September

---

## GitHub, LinkedIn, and CV — visibility before applications

Recruiters at consultancies check all three before calling you. If they are not updated, you are invisible even with a good technical foundation.

### GitHub

- All projects must be **public** with a clear README — not just code dumped in a repo
- The README must show: what the app does, the tech stack, how to run it locally, and at least one architecture decision
- Recruiters check: last commit date (is this person still active?), README quality, project variety
- Before applying: push everything, check every README reads well, make sure the commit history is clean

### LinkedIn

The full writing process — all sections, text, posts, and skill order — is in `notes/prompts/strategy/apply/linkedin-prompt.md`. Run it in a separate conversation when you are ready to update your profile.

What matters most for recruiter visibility:
- Keyword match in the headline and skills — `Angular`, `Spring Boot`, `Java` must appear
- Active profile — last post or activity within 30 days ranks higher in recruiter searches
- "Open to work" turned on and configured with the right job titles and location preferences

### CV

The full writing process — format, bullets, ATS keywords, and length check — is in `notes/prompts/strategy/apply/cv-prompt.md`. Run it in a separate conversation when you are ready to write or update your CV.

What matters most:
- One page maximum — non-negotiable for junior roles at Spanish consultancies
- Every bullet has a concrete result — "built X that does Y", not "developed a feature"
- ATS keywords present naturally: `Angular`, `Spring Boot`, `Java`, `PostgreSQL`, `Docker`, `JWT`
- English level stated as the profile evidences it; the Cambridge First Certificate is listed under languages once obtained — a concrete certification, not self-reported

---

## English — Cambridge First Certificate

**Why this matters for consultancies:** large consultancies (NTT Data, Capgemini) have international clients and European delivery teams. A junior with B2 English is placed on better projects, grows faster, and is harder to replace.

**Current plan:** Cambridge First Certificate preparation is paused while the TAI and programming take its blocks; it returns when the criteria in `HORARIO.md` §2 are met, and the English technical documents remain additional exposure meanwhile. Study sessions follow the shared session rules' current language preference, and the profile's language level remains in `_shared-context.md`.

**In the CV:** Cambridge First Certificate (B2) is a concrete certification — not self-reported. It signals discipline and that you invest in yourself beyond the minimum.

---

## After finding the job — keep growing

| Goal                                                  | When                                         | Why                                                                                             |
| ----------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Spring Framework (without Boot)                       | First months                                 | Understand what Boot auto-configures — makes any legacy project readable                        |
| Advanced Java (streams, lambdas, Optional patterns)   | First year                                   | Expected in code reviews as you grow                                                            |
| Microservices and REST communication between services | 12–18 months                                 | How large consultancies structure big projects                                                  |
| Docker + Kubernetes basics                            | First year                                   | Standard in enterprise CI/CD                                                                    |
| LeetCode Medium                                       | When stable                                  | For future senior interviews or tech-company moves                                              |
| Open source contribution                              | When stable                                  | Real collaboration outside the company project                                                  |
| Full AI-assisted development practice                 | When fundamentals are solid — see gate below | Learn to build faster with AI tools without losing the ability to explain and defend every line |

Each topic has `coverage/junior.md`, `coverage/middle.md`, and `coverage/senior.md`, plus matching
global mirrors. Study progression is strict: consolidate junior notes, interview preparation, and
practice before activating middle; consolidate middle before activating senior. Concepts move between
levels only through the coverage prompts, never implicitly during notes work.

**Spring Framework — when to start (post-job gate):**

Spring Framework (without Boot) is what Boot is built on top of. Learning it deepens your understanding of everything you already know. But it is only useful when you can see the gap — when you encounter code that Boot does not explain.

Start when all of the following are true:

| Gate                                                                                        | Why                                                               |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 2–3 months into the job and delivery work feels manageable                                  | You need mental space — don't add a study track during onboarding |
| You have seen `@Configuration`, `@Bean`, or XML bean wiring at work and couldn't explain it | That's the signal — Boot hid something real and you noticed       |
| Spring Boot notes and interview prep are complete and solid                                 | No gaps to fill first                                             |
| Your team lead or a senior agrees to answer questions as you study                          | You need someone to connect theory to your real project           |

The trigger is almost always: _you see something at work you cannot explain_. That is the right moment to open the Spring Framework docs — not before.

**Full AI-assisted development — when to start (fundamentals gate):**

Right now, Claude guides and Victor implements — this is the active learning mode. Building a project mostly or fully with AI (Copilot, Cursor, agentic tools) is a different skill: using AI to move fast while still reviewing, understanding, and defending every line. It is valuable for real consultancy work, but only once the fundamentals are solid enough that AI speed does not hide gaps in understanding.

Start when all of the following are true:

| Gate                                                                      | Why                                                              |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Project 07 and 08 are done, tested, and explainable line by line          | AI speed should not replace understanding you have not built yet |
| Angular, Spring Boot, Java, and architecture notes are complete and solid | You need a strong base to judge whether AI output is correct     |
| You can already spot mistakes in AI-generated code without help           | This is the actual skill being tested — review, not generation   |

When the gate is met, the practice itself is simple: pick a small project, build it with heavy AI assistance, but require yourself to explain every line before committing — same rule as "AI-assisted development" in CLAUDE.md, just applied at full project scale instead of snippet by snippet.
