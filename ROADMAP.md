# Roadmap — Victor's Learning Plan

**Goal:** Junior / junior-mid Angular + Java Spring Boot developer at a Spanish consultancy — August/September 2026.

---

## Who you are and where you stand

- **31 years old.** More mature than a fresh graduate. Better soft skills, more motivation, more aware of what you want. Consultancies notice this — they work with clients, and a junior who communicates well is valuable.
- **Real internship completed** (Next.js + TypeScript + MySQL, ended June 2026). Even though the stack is different, this is real team experience. Few self-taught juniors have this. It answers the question every recruiter asks first: *has this person ever worked in a real environment?*
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
Juniors who only know how to write syntax are being replaced by AI + one experienced developer. The question is no longer *can you write a Spring Boot controller?* It is *can you explain why this controller is designed this way, review what AI generated, and catch its mistakes?*

**Skills that go UP in value because of AI:**

| Skill | Why it matters more now |
|-------|------------------------|
| Explaining architectural decisions | AI generates code — humans must justify it |
| Reading and reviewing code | AI output must be verified before it ships |
| Writing tests | AI-generated code fails silently without tests |
| Understanding patterns (why, not just how) | AI knows the what — companies need the why |
| Communication with clients and teammates | AI cannot replace human judgment and trust |
| Debugging — reading errors, tracing root causes | AI generates, humans fix what breaks |

**What this means for you concretely:**
- Every project must have a README with architecture decisions — not just *what it does* but *why it was designed this way*
- Every concept you learn must be explainable out loud — if you cannot explain it, you cannot defend it in an interview
- Tests are not optional from project 07 — they are the proof that you understand the code
- The interview question *why did you use JWT instead of sessions?* must have a real answer, not *because that is what I saw in a tutorial*

---

## What most increases your probability of being hired

In order of impact:

1. **A complete, explainable full-stack project** — project 07 TimeTrack. Spring Boot + Angular + PostgreSQL + Docker + JWT + tests. You must be able to explain every line, every decision, every tradeoff. This alone separates you from 80% of junior candidates.

2. **Tests in the project** — almost no junior candidate has tests. Having JUnit 5 + Mockito on the backend and Jasmine + TestBed on the frontend makes you immediately more credible. It shows you understand production code, not just working code.

3. **A README with architecture decisions** — not a list of technologies. Decisions: *why JWT over sessions, why soft delete, why DTOs instead of exposing entities, why coordinator pattern*. One candidate who explains decisions is worth more than five who just list features.

4. **The internship on the CV** — even with a different stack. It proves you have worked in a team, delivered something real, and handled real deadlines. Mention a specific result: *built X that does Y for Z users/clients*.

5. **English at B2** — most Spanish junior candidates have A2/B1. B2 opens international projects, which pay better and train you faster. The Cambridge First Certificate is a concrete proof, not self-reported.

6. **Interview prep** — knowing how to answer *what is dependency injection, what is lazy loading, what is a JWT, what is a DTO* fluently and with a project example. The notes/ folder and the simulator prompt exist for this.

7. **A second full-stack project** (project 08) — if time allows before September. Two full-stack projects with different challenges (many-to-many, pagination, file upload) show that project 07 was not a one-time effort.

---

## Phase plan

| # | Period | Project (08:00) | SQL → Practice (12:30) | Notes → Prep (13:30) | Status |
|---|--------|---------|----------|---------|--------|
| 1 | → May 2026 | Angular 01–04 + CSS/Tailwind | SELECT, WHERE, ORDER BY | Angular notes | ✅ Done |
| 2 | May → June 2 | Angular 05–06 + RxJS + Java foundation | SQL basics continued | Angular notes + interview prep started | ✅ Done |
| 3a | June 2–14 | Project 07 backend — JWT auth + protected endpoint | JOINs | Spring Boot notes | ⏳ Current |
| 3b | June 14 → July | Project 07 full — Angular frontend, tests, Docker | GROUP BY, aggregates, subqueries | Java + Architecture notes | 🔜 |
| 4 | July → August | Project 08 (TBD) + Friday applications | CTEs, window functions → SQL complete → technical test simulation | TypeScript + CSS notes + interview prep (es/) | 🔜 |
| 5 | Aug → Sep | Full application push — September market opens | Interview practice (technical test simulation) | Interview prep full focus | 🔜 |
| 6 | Sep+ | Job secured — keep growing | LeetCode Medium (optional, for future) | — | 🔜 |

---

## Daily schedule (fixed from June 2)

| Block | Time | Focus |
|-------|------|-------|
| Active project | 08:00–12:30 | Claude guides, Victor implements (30 min breakfast break inside) |
| SQL → Practice | 12:30–13:30 | SQL now → technical test simulation → LeetCode Easy (only when all gates complete) |
| Notes → Interview prep | 13:30–14:30 | Notes first, then interview prep, then CV/applications |
| English study | 16:00–19:00 | Cambridge First Certificate preparation |
| Sport | 19:00–20:30 | Physical training — essential for sustainability in a 10-hour study day |
| English reading | 22:00–23:00 | Cambridge English Reader — listening + reading |

**Friday rule (from July):** the 13:30–14:30 block is always CV + applications.

---

## 08:00–12:30 — Active project

### Now — Project 07 TimeTrack (June → July)

**Hard deadline June 14:** API runnable locally with login + one protected endpoint. Demonstrable in an interview, not necessarily finished.

**Covers:** REST API, JWT auth, JPA + Hibernate, role-based endpoints, Angular consuming the API, JUnit 5 + Mockito, Docker Compose, architecture README.

**CV rule:** update in July. The internship bullet must say *built X that does Y* — not just *developed a SaaS*.

### Tests — permanent rule from project 07

| What | Tool | From |
|------|------|------|
| Spring Boot services | JUnit 5 + Mockito | Project 07 |
| Angular services | Jasmine + TestBed | Project 07 |
| Angular components | Jasmine + TestBed | Project 08 |

No project is finished without tests. Tests are not a step — they are part of finishing a feature.

### Project 08 — after 07

Planned together with Claude based on what PROGRESS.md shows is still weak. The goal is to cover what project 07 did not cover.

**Gaps project 07 does not cover:**

| Gap | Why it matters |
|-----|---------------|
| Many-to-many JPA relationships | Every real app has them — consultancies will ask |
| Backend pagination (`Pageable`) | Standard in any list endpoint |
| Dynamic filtering (`@Query` / `Specification`) | Common Spring Boot interview topic |
| Angular component tests (TestBed) | From project 08 onwards |
| File upload | Very common in business apps |
| Email notifications | Appears in almost every enterprise app |
| Database migrations (Flyway) | How real teams manage schema changes |

**Project 08 candidate ideas:**
- **Invoice Manager** — clients, products, invoices. Covers: many-to-many, Pageable, `@Query`, PDF export
- **Expense Reports** — submit and approve expenses. Covers: file upload, email, approval workflow, Flyway
- **Library Catalog** — books, authors, members, loans. Covers: many-to-many, complex queries, component tests

---

## 12:30–13:30 block — SQL then practice

**Stage 1 — SQL (current):**

| Topic | Status |
|-------|--------|
| SELECT, WHERE, operators, ORDER BY, LIMIT | ✅ Done |
| JOINs (INNER, LEFT, RIGHT, FULL OUTER) | 🔜 |
| GROUP BY, HAVING, aggregate functions | 🔜 |
| Subqueries and CTEs | 🔜 |
| Window functions (ROW_NUMBER, RANK, PARTITION BY) | 🔜 |
| Indexes, EXPLAIN, basic query performance | 🔜 |

→ When all topics are solid: switch to Stage 2.

**Stage 2 — Technical test simulation:**
Simulate real consultancy tests: write a Spring Boot endpoint from scratch, build an Angular form with validation, write a SQL query against an unfamiliar schema — all under time pressure. This is what the actual tests look like.

**Minimum target: 15 simulations before applying seriously** — all tests are in `simulations/` with a tracker at `simulations/TRACKER.md`. Split by type:

| Type | Minimum | What it covers |
|------|---------|---------------|
| Spring Boot | 5 | REST endpoint + service + repository + basic validation |
| Angular | 5 | Reactive form + service + HTTP call + error state |
| SQL | 5 | Given a schema: SELECT, JOIN, GROUP BY, subquery — under a time limit |

**Rules for each simulation:**
- No notes, no documentation, no AI — exactly like a real test
- Set a timer: 60–90 minutes per test
- When time is up, review with Claude: what was wrong, what was slow, what you could not recall

**Where to get the tests:**
All 15 tests are already written in `simulations/` — 5 Angular, 5 Spring Boot, 5 SQL. Check `simulations/TRACKER.md` for the full list and your progress.

To do a simulation: open the spec file, set a timer, and build. No notes, no AI. When time is up, open a new chat and write:

> *"Review my solution for [simulations/angular/01-task-form.md]. Here is my code: [paste code]. Tell me what is wrong, what is missing, and what I would score."*

**Stage 3 — LeetCode Easy (only if all of the following are complete):**

| Gate | Why |
|------|-----|
| SQL all topics solid (JOINs, GROUP BY, subqueries, CTEs, window functions) | SQL is more likely to appear in tests than algorithms |
| Project 07 live, documented, and explainable line by line | This is the main differentiator — it must be solid first |
| Project 07 has tests (JUnit 5 + Mockito + Jasmine) | Tests are a stronger signal than LeetCode for consultancies |
| Notes complete for Angular, Spring Boot, Java, Architecture | Interview prep gaps matter more than algorithm practice |
| Interview prep (es/) solid for the main topics | Active recall ready before adding a new track |

If all five are done before September — start LeetCode Easy. If not — skip it and use that time to strengthen whatever gate is not yet complete.

---

## 13:30–14:30 block — Notes then interview prep

**Stage 1 — Notes:**
`angular → spring-boot → java → architecture → typescript → sql → javascript → css → git`

**Stage 2 — Interview prep:**
Active recall with `notes/interview-prep/es/`. Same order. Use the simulator prompt for mock interviews.

**Stage 3 — CV + LinkedIn + active applications:**
Replaces interview prep when topics are solid.

---

## Applications strategy

| When | Mode | What to do |
|------|------|-----------|
| July | Fridays only | Polish CV, update LinkedIn and GitHub. Apply to 2–3 companies — the goal is to **practice the process**: learn how the screening works, what they ask, what the CV is missing. Getting hired in July is not the goal. |
| August 1 | Equal priority | Study + applications every weekday |
| September | Full target mode | Market opens — companies back with budget and junior positions |

**What "ready" means by September:**
- Project 07 live, documented, explainable line by line
- Project 08 live or well advanced
- All interview prep files solid — every question answered with a project example
- CV with specific results: *built X that does Y*
- LinkedIn updated with project summaries and the internship bullet

**Why September and not August:** Spanish consultancies approve headcount after summer. The positions open in September — not in August when the decision-makers are on holiday.

**Where to find jobs in Spain:**
- **LinkedIn Jobs** — most consultancies post here; also where recruiters search for candidates
- **InfoJobs** — biggest Spanish job board; high volume, filter by "junior" + "Angular" or "Spring Boot"
- **Tecnoempleo** — tech-specific, good signal-to-noise ratio for developer roles
- **Direct company careers pages** — NTT Data, Capgemini, and Indra all have public junior calls in September

---

## GitHub and LinkedIn — visibility before applications

Recruiters at consultancies check both before calling you. If they are not updated, you are invisible even with a good CV.

### GitHub
- All projects must be **public** with a clear README — not just code dumped in a repo
- The README must show: what the app does, the tech stack, how to run it locally, and at least one architecture decision
- Recruiters check: last commit date (is this person still active?), README quality, project variety
- Before applying: push everything, check every README reads well, make sure the commit history is clean

### LinkedIn
- **Headline:** `Junior Angular + Spring Boot Developer | Java | PostgreSQL | Docker`
- **About:** 3–4 sentences — background, stack, what you are building, what you are looking for
- **Experience:** internship with a specific result — *built X that does Y*, not just *developed a SaaS*
- **Projects:** TimeTrack (with GitHub link) — 2–3 bullets on what it covers technically
- **Skills:** Angular, Spring Boot, Java, PostgreSQL, Docker, TypeScript, SQL, Git
- **Open to work:** turn it on — visible to recruiters searching for Angular + Java profiles in Spain
- **Activity:** react to or share one technical post per week — it keeps your profile visible in feeds

---

## English — Cambridge First Certificate

**Why this matters for consultancies:** large consultancies (NTT Data, Capgemini) have international clients and European delivery teams. A junior with B2 English is placed on better projects, grows faster, and is harder to replace.

**Current plan:** B1 → B2 (Cambridge First Certificate) alongside the technical preparation. Daily exposure through English-only study sessions with Claude.

**In the CV:** Cambridge First Certificate (B2) is a concrete certification — not self-reported. It signals discipline and that you invest in yourself beyond the minimum.

---

## After finding the job — keep growing

| Goal | When | Why |
|------|------|-----|
| Spring Framework (without Boot) | First months | Understand what Boot auto-configures — makes any legacy project readable |
| Advanced Java (streams, lambdas, Optional patterns) | First year | Expected in code reviews as you grow |
| Microservices and REST communication between services | 12–18 months | How large consultancies structure big projects |
| Docker + Kubernetes basics | First year | Standard in enterprise CI/CD |
| LeetCode Medium | When stable | For future senior interviews or tech-company moves |
| Open source contribution | When stable | Real collaboration outside the company project |

Each `notes/` folder has a `future-learning.md` — concepts that are real but beyond junior scope now. They become the next study plan after landing the job.

**Spring Framework — when to start (post-job gate):**

Spring Framework (without Boot) is what Boot is built on top of. Learning it deepens your understanding of everything you already know. But it is only useful when you can see the gap — when you encounter code that Boot does not explain.

Start when all of the following are true:

| Gate | Why |
|------|-----|
| 2–3 months into the job and delivery work feels manageable | You need mental space — don't add a study track during onboarding |
| You have seen `@Configuration`, `@Bean`, or XML bean wiring at work and couldn't explain it | That's the signal — Boot hid something real and you noticed |
| Spring Boot notes and interview prep are complete and solid | No gaps to fill first |
| Your team lead or a senior agrees to answer questions as you study | You need someone to connect theory to your real project |

The trigger is almost always: *you see something at work you cannot explain*. That is the right moment to open the Spring Framework docs — not before.
