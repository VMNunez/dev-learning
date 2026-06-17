# Roadmap — Victor's Learning Plan

**Goal:** Junior / junior-mid Angular + Java Spring Boot developer at a Spanish consultancy — target window August/September 2026.

**This goal does not expire.** September is a checkpoint that raises urgency, not a deadline that ends the search. If the goal is not met by then, the search continues — see "After September — three possible paths" near the end of this file for how the plan adapts.

---

## Who you are and where you stand

- **31 years old.** More mature than a fresh graduate. Better soft skills, more motivation, more aware of what you want. Consultancies notice this — they work with clients, and a junior who communicates well is valuable.
- **Real internship completed** (Next.js + TypeScript + MySQL, ended June 2026). Even though the stack is different, this is real team experience. Few self-taught juniors have this. It answers the question every recruiter asks first: _has this person ever worked in a real environment?_
- **Previous knowledge** (React, Node.js, Express, TypeScript, CSS). You are not starting from zero. This background accelerates your Spring Boot and Angular learning because the patterns are familiar — components, services, HTTP, async, routing.
- **Full-time study from June 2.** Most self-learners study 2–3 hours a day after work. You are doing 6+ hours every day. This is a serious competitive advantage. By September you will have months of full-time practice — equivalent to several years of evening learning.
- **English at B1, targeting Cambridge First Certificate (B2).** Most junior candidates in Spain have weak or no English. B2 opens access to international project tracks at consultancies, which are better paid and more interesting.

---

## The market you are targeting

**Target companies:** NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI, and similar large IT consultancies operating in Spain.

**Why consultancies and not startups or product companies:**

- They hire juniors systematically — internal programs (NTT Academy, Capgemini Academy), not one-off hires
- They use Angular + Java Spring Boot on real client projects — your stack matches what they need
- They accept candidates who are still learning, as long as the foundation is solid
- Real team experience from day one — version control, code reviews, architecture discussions, delivery pressure
- Startups often want senior developers who can work autonomously from the start

**What they look for in a junior in 2026:**

- Stack match: Angular + Java Spring Boot + PostgreSQL
- Real project — not a tutorial, not a course certificate
- Tests in the project — very few junior candidates have them
- Can explain the code, not just show it
- Internship or work experience of any kind
- Communication — they work with clients

**The hiring process at Spanish consultancies (what to expect):**

1. **CV screening** — human or ATS filter. Stack, project, internship. One page.
2. **HR call** (15–30 min) — motivation, salary expectations, availability, English level. Typical junior range at large Spanish consultancies: **18.000–24.000€ gross per year**. Don't lowball — they expect you to know the market.
3. **Technical test** — sent by email, 2–3 days to complete. Typically: Angular form with validation + service, or Spring Boot REST endpoint with repository. Sometimes timed.
4. **Technical interview** — 45–90 min. They ask you to explain your test solution, then ask concepts (what is dependency injection, why JWT, what is a JPA entity). This is where preparation makes the difference.
5. **Offer** — salary, contract type, project team

---

## The AI factor — how it changes the market

AI is changing what companies look for in junior developers. This is important to understand.

**What AI does:**

- Writes boilerplate code instantly (controllers, DTOs, components)
- Generates CRUD from a description
- Autocompletes tests and documentation

**What this means for junior hiring:**
Juniors who only know how to write syntax are being replaced by AI + one experienced developer. The question is no longer _can you write a Spring Boot controller?_ It is _can you explain why this controller is designed this way, review what AI generated, and catch its mistakes?_

**Skills that go UP in value because of AI:**

| Skill                                           | Why it matters more now                        |
| ----------------------------------------------- | ---------------------------------------------- |
| Explaining architectural decisions              | AI generates code — humans must justify it     |
| Reading and reviewing code                      | AI output must be verified before it ships     |
| Writing tests                                   | AI-generated code fails silently without tests |
| Understanding patterns (why, not just how)      | AI knows the what — companies need the why     |
| Communication with clients and teammates        | AI cannot replace human judgment and trust     |
| Debugging — reading errors, tracing root causes | AI generates, humans fix what breaks           |

**What this means for you concretely:**

- Every project must have a README with architecture decisions — not just _what it does_ but _why it was designed this way_
- Every concept you learn must be explainable out loud — if you cannot explain it, you cannot defend it in an interview
- Tests are not optional from project 07 — they are the proof that you understand the code
- The interview question _why did you use JWT instead of sessions?_ must have a real answer, not _because that is what I saw in a tutorial_

---

## What most increases your probability of being hired

In order of impact:

1. **Complete, explainable full-stack projects** — starting with project 07 TimeTrack, then project 08, and more if time allows. All live in `projects/`. Spring Boot + Angular + PostgreSQL + Docker + JWT + tests. You must be able to explain every line, every decision, every tradeoff in each one. Every extra project separates you further from other junior candidates.

2. **Tests in the project** — almost no junior candidate has tests. Having JUnit 5 + Mockito on the backend and Jasmine + TestBed on the frontend makes you immediately more credible. It shows you understand production code, not just working code.

3. **A README with architecture decisions** — not a list of technologies. Decisions: _why JWT over sessions, why soft delete, why DTOs instead of exposing entities, why coordinator pattern_. One candidate who explains decisions is worth more than five who just list features. The README format and quality standard is defined in `notes/prompts/project-review-prompt.md`.

4. **The internship on the CV** — even with a different stack. It proves you have worked in a team, delivered something real, and handled real deadlines. Mention a specific result: _built X that does Y for Z users/clients_.

5. **English at B2** — most Spanish junior candidates have A2/B1. B2 opens international projects, which pay better and train you faster. The Cambridge First Certificate is a concrete proof, not self-reported.

6. **Interview prep** — knowing how to answer _what is dependency injection, what is lazy loading, what is a JWT, what is a DTO_ fluently and with a project example. The notes/ folder and the simulator prompt exist for this.

7. **More full-stack projects** — project 08 after 07, and more if time allows before September. Every project covers different challenges (many-to-many, pagination, file upload) and shows consistent effort, not a one-time build.

---

## Phase plan

| #   | Goal                                              | Project (08:00)                                                    | SQL → Practice (12:30)                                            | Interview prep (13:30)                        | Status     |
| --- | ------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------- | ---------- |
| 1   | Angular foundation + CSS/Tailwind solid           | Angular 01–04 + CSS/Tailwind                                       | SELECT, WHERE, ORDER BY                                           | Angular notes                                 | ✅ Done    |
| 2   | Angular complete + Java foundation                | Angular 05–06 + RxJS + Java foundation                             | SQL basics continued                                              | Angular notes + interview prep started        | ✅ Done    |
| 3a  | Project 07 backend demonstrable                   | Project 07 backend — JWT auth + protected endpoint                 | JOINs                                                             | Spring Boot notes                             | ✅ Done    |
| 3b  | Project 07 complete with tests and Docker         | Project 07 full — Angular frontend, tests, Docker                  | GROUP BY, aggregates, subqueries                                  | Java + Architecture notes                     | ⏳ Current |
| 4   | Project 08 done + Friday applications             | Project 08 + more if time allows + Friday applications             | CTEs, window functions → SQL complete → technical test simulation | TypeScript + CSS notes + interview prep (es/) | 🔜         |
| 5   | Interview ready — full application push           | Final project polish + applications every day                      | Technical test simulation                                         | Interview prep full focus                     | 🔜         |
| 6   | After the job — depends on outcome                | Branches by outcome — see "After September — three possible paths" | Depends on path                                                   | Depends on path                               | 🔜         |

_Row 6 is intentionally open — what happens after September depends on whether the goal is met by then. See the dedicated section near the end of this file for the three paths and what each one requires._

---

## Daily schedule (fixed from June 2)

_This schedule is fixed for the full-time study window only — June 2 → September 2026. What replaces it afterward depends on which path applies once September ends: see "After September — three possible paths" near the end of this file._

| Block                  | Time        | Focus                                                                              |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------- |
| Active project         | 08:00–12:30 | Claude guides, Victor implements (30 min breakfast break inside)                   |
| SQL → Practice         | 12:30–13:30 | SQL now → technical test simulation → LeetCode Easy (only when all gates complete) |
| Notes → Interview prep | 13:30–14:30 | Notes first, then interview prep, then CV/applications                             |
| English study          | 16:00–19:00 | Cambridge First Certificate preparation                                            |
| Sport                  | 19:00–20:30 | Physical training — essential for sustainability in a 10-hour study day            |
| English reading        | 22:00–23:00 | Cambridge English Reader — listening + reading                                     |

**Friday rule (from July):** the 13:30–14:30 block is always CV + applications.

---

## 08:00–12:30 — Active project

### Now — Project 07 TimeTrack

**Backend gate (Phase 3a — closed):** Login endpoint returns a valid JWT; protected endpoints reject requests without a token — confirmed in Postman. See `projects/07-timetrack/PLANNING.md` for the full step history.

**Covers:** REST API, JWT auth, role-based authorization, JPA + Hibernate, TimeEntry workflow (DRAFT → SUBMITTED → APPROVED / REJECTED), reports, Angular frontend, JUnit 5 + Mockito, Jasmine + TestBed, Docker Compose, architecture README.

**Full project gate (Phase 3b):** Angular frontend live, all services have at least one unit test, `docker-compose up` runs everything, README includes at least one architecture decision with a real tradeoff — and every line is explainable out loud in an interview.

**CV gate:** Update CV when project 07 is live on GitHub with a README that includes at least one architecture decision — not before.

### Tests — permanent rule from project 07 — complete and production-quality

| What                 | Tool              | From       |
| -------------------- | ----------------- | ---------- |
| Spring Boot services | JUnit 5 + Mockito | Project 07 |
| Angular services     | Jasmine + TestBed | Project 07 |
| Angular components   | Jasmine + TestBed | Project 08 |

No project is finished without tests. Tests are not a step — they are part of finishing a feature. From project 07, tests are written at the level a senior developer would write them: edge cases covered, meaningful assertions, no trivial "it exists" tests.

### Project 08 — after 07

Planned using `notes/prompts/projects/new-project-prompt.md` — paste it into a new chat when project 07 is complete. It reads `notes/coverage.md`, `PROGRESS.md`, and `ROADMAP.md`, picks the best candidate from the list below, and writes a complete `PLANNING.md` for the new project. Run it once, get a full plan.

**Project 08 candidate ideas:**

- **Invoice Manager** — clients, products, invoices. Covers: many-to-many, Pageable, `@Query`, PDF export
- **Expense Reports** — submit and approve expenses. Covers: file upload, email, approval workflow, Flyway
- **Library Catalog** — books, authors, members, loans. Covers: many-to-many, complex queries, component tests

---

## 12:30–13:30 block — SQL then practice

**Stage 1 — SQL (current):**

| Topic                                                                  | Status  |
| ---------------------------------------------------------------------- | ------- |
| SELECT, WHERE, operators, ORDER BY, LIMIT                              | ✅ Done |
| JOINs (INNER, LEFT, RIGHT, FULL OUTER, self JOIN)                     | 🔜      |
| GROUP BY, HAVING, aggregate functions                                  | 🔜      |
| Filtering and NULL handling (IS NULL, COALESCE, NULLIF, LIKE, IN)     | 🔜      |
| Subqueries, CTEs, and views                                            | 🔜      |
| DML — INSERT, UPDATE, DELETE, RETURNING, ON CONFLICT                  | 🔜      |
| Transactions (BEGIN, COMMIT, ROLLBACK, ACID)                           | 🔜      |
| Window functions (ROW_NUMBER, RANK, LAG, SUM OVER)                    | 🔜      |
| Schema design (keys, constraints, relationships, normalization)         | 🔜      |
| Data types (VARCHAR, NUMERIC, TIMESTAMPTZ, BOOLEAN)                   | 🔜      |
| PostgreSQL specifics (::, ILIKE, DISTINCT ON, DATE_TRUNC, STRING_AGG) | 🔜      |
| Indexes, EXPLAIN, basic query performance                              | 🔜      |

→ When all topics are solid: switch to Stage 2.

**Stage 2 — Technical test simulation:**
Simulate real consultancy tests: write a Spring Boot endpoint from scratch, build an Angular form with validation, write a SQL query against an unfamiliar schema — all under time pressure. This is what the actual tests look like.

**Minimum target: 15 simulations before applying seriously** — all tests are in `simulations/` with a tracker at `simulations/TRACKER.md`. Split by type:

| Type        | Minimum | What it covers                                                        |
| ----------- | ------- | --------------------------------------------------------------------- |
| Spring Boot | 5       | REST endpoint + service + repository + basic validation               |
| Angular     | 5       | Reactive form + service + HTTP call + error state                     |
| SQL         | 5       | Given a schema: SELECT, JOIN, GROUP BY, subquery — under a time limit |

**Rules for each simulation:**

- No notes, no documentation, no AI — exactly like a real test
- Set a timer: 60–90 minutes per test
- When time is up, review with Claude: what was wrong, what was slow, what you could not recall

**Where to get the tests:**
All 15 tests are already written in `simulations/` — 5 Angular, 5 Spring Boot, 5 SQL. Check `simulations/TRACKER.md` for the full list and your progress.

To do a simulation: open the spec file, set a timer, and build. No notes, no AI. When time is up, open a new chat and write:

> _"Review my solution for [simulations/angular/01-task-form.md]. Here is my code: [paste code]. Tell me what is wrong, what is missing, and what I would score."_

**Stage 3 — LeetCode Easy (only if all of the following are complete):**

**When LeetCode replaces SQL:** LeetCode Easy replaces the 12:30–13:30 block permanently once all five gates below are complete. The 13:30–14:30 interview prep block stays fixed and is never replaced by LeetCode.

| Gate                                                                       | Why |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQL all topics solid (JOINs, GROUP BY, subqueries, CTEs, window functions) | SQL is more likely to appear in tests than algorithms                                                                                                                                                                                                                                        |
| Project 07 live, documented, and explainable line by line                  | This is the main differentiator — it must be solid first                                                                                                                                                                                                                                     |
| Project 07 has tests (JUnit 5 + Mockito + Jasmine)                         | Tests are a stronger signal than LeetCode for consultancies                                                                                                                                                                                                                                  |
| Notes complete for Angular, Spring Boot, Java, Architecture                | Interview prep gaps matter more than algorithm practice                                                                                                                                                                                                                                      |
| Interview prep (es/) solid for the main topics                             | Active recall ready before adding a new track                                                                                                                                                                                                                                                |

If all five are done before September — start LeetCode Easy. If not — skip it and use that time to strengthen whatever gate is not yet complete.

---

## 13:30–14:30 block — Notes then interview prep

**Stage 1 — Notes:**
Study in priority order: `angular → spring-boot → java → architecture → typescript → sql → javascript → css → git`. SQL is last — it is already practiced daily in the 12:30 block. Move to Stage 2 when notes for the high-priority topics are well understood.

**Stage 2 — Interview prep:**
Active recall with `notes/interview-prep/es/`. Same order as Stage 1. Use the simulator prompt for mock interviews.

**Stage 3 — CV + LinkedIn + active applications:**
Replaces interview prep when all main topics are solid.

---

## Applications strategy

| When      | Mode             | What to do                                                                                                                                                                                                            |
| --------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| July      | Fridays only     | Polish CV, update LinkedIn and GitHub. Apply to 2–3 companies — the goal is to **practice the process**: learn how the screening works, what they ask, what the CV is missing. Getting hired in July is not the goal. |
| August 1  | Equal priority   | Study + applications every weekday                                                                                                                                                                                    |
| September | Full target mode | Market opens — companies back with budget and junior positions                                                                                                                                                        |

**What "ready" means by September:**

- Project 07 live, documented, explainable line by line
- Project 08 live or well advanced
- At least 15 simulations completed (5 Spring Boot, 5 Angular, 5 SQL) — tracker at `simulations/TRACKER.md`
- All interview prep files solid — every question answered with a project example
- CV with specific results: _built X that does Y_
- LinkedIn updated with project summaries and the internship bullet

**Why September and not August:** Spanish consultancies approve headcount after summer. The positions open in September — not in August when the decision-makers are on holiday.

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

The full writing process — all sections, text, posts, and skill order — is in `notes/prompts/strategy/linkedin-prompt.md`. Run it in a separate conversation when you are ready to update your profile.

What matters most for recruiter visibility:
- Keyword match in the headline and skills — `Angular`, `Spring Boot`, `Java` must appear
- Active profile — last post or activity within 30 days ranks higher in recruiter searches
- "Open to work" turned on and configured with the right job titles and location preferences

### CV

The full writing process — format, bullets, ATS keywords, and length check — is in `notes/prompts/strategy/cv-prompt.md`. Run it in a separate conversation when you are ready to write or update your CV.

What matters most:
- One page maximum — non-negotiable for junior roles at Spanish consultancies
- Every bullet has a concrete result — "built X that does Y", not "developed a feature"
- ATS keywords present naturally: `Angular`, `Spring Boot`, `Java`, `PostgreSQL`, `Docker`, `JWT`
- Cambridge First Certificate listed under languages — a concrete certification, not self-reported

---

## English — Cambridge First Certificate

**Why this matters for consultancies:** large consultancies (NTT Data, Capgemini) have international clients and European delivery teams. A junior with B2 English is placed on better projects, grows faster, and is harder to replace.

**Current plan:** B1 → B2 (Cambridge First Certificate) alongside the technical preparation. Daily exposure through English-only study sessions with Claude.

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

Each `notes/` folder has a `future-learning.md` — concepts that are real but beyond junior scope now. They become the next study plan after landing the job. Use `notes/coverage.md` to track what is solid and what is still missing. Once everything in coverage is complete, start promoting items from `future-learning.md` into the active coverage — that is how each topic deepens over time.

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
