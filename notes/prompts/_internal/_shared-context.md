# Shared context for the prompts

This file is **not a prompt**. It is the single place that holds the context every prompt used
to repeat: who I am, where I stand, my projects, and the market I am aiming at. Prompts read the
sections they need instead of copying them — so a fact changes here once, not in sixteen files.

Keep this in sync with `_session-rules.md` (which holds a condensed profile) whenever something changes.

---

## Profile

I am Victor, 31 years old, in a deliberate career change. My background is React, Node.js, and
TypeScript, but I retrained to target **Angular + Spring Boot + PostgreSQL** — the stack that
large Spanish IT consultancies actually run internally.

- **Status:** studying full-time since June 2, 2026. This is my main job right now, not a side
  project — a fixed daily routine of building, practising, and interview prep.
- **Recent experience:** a ~3-month internship at **Sagatech** (Mar–Jun 2026) as a web developer,
  on a 3-developer team building **Getxo**, a management SaaS in real internal use (launch planned).
  Two standout points beyond just shipping features (Next.js + TypeScript + Supabase, and an earlier
  project on Next.js + MySQL): **(1)** I introduced the **Git branching flow (GitFlow)** to a team
  that was pushing straight to `main`, and wrote the developer onboarding guide; **(2)** on the
  earlier project I **set up the whole foundation from scratch** (architecture, DB with a
  PostgreSQL→MySQL/Flyway migration, JWT auth, Docker dev environment) and onboarded teammates. The
  stack differs from my target, but it is real, professional teamwork — full detail in the CV source
  file `personal/job-search/internship-daw.md`.
- **Goal:** my first developer job at a Spanish IT consultancy by **August–September 2026**.
- **Target companies:** NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI,
  and similar large consultancies.
- **The bet (my differentiator):** most juniors in Spain apply with React, so that pool is
  crowded. I go with Angular + Spring Boot, which consultancies use but fewer candidates offer.
  The bet only pays off if I can show *real understanding and real decisions*, not just syntax.
- **Level I am aiming for:** junior to junior-mid. I want to come across as someone who makes
  decisions and can explain them — not someone who followed a tutorial and memorised the steps.
- **English:** currently B1 (working towards Cambridge First / B2). Enough for consultancies that
  screen in Spanish; a tie-breaker for international accounts.

---

## Where I stand — honest analysis

Use this to position me accurately: lead with the strengths, prepare for the risks, hold the work
to the bar. It is not a pep talk — it is the real picture.

**Real edges (most juniors do not have these):**

- **Professional experience.** A 2026 internship shipping a real SaaS. Most self-taught or
  bootcamp juniors have zero work history — this is my single strongest CV signal. The story has
  to bridge the stack gap: same fundamentals (typed language, components, relational DB, REST),
  different framework. Frame it as transferable, not as "wrong stack".
- **A deliberate market bet,** not a default. Choosing Angular + Spring Boot is a strategic
  decision I can defend — it shows I researched where the demand is.
- **I build the things that filter juniors out.** Tests (JUnit 5 + Mockito, Jasmine + TestBed
  from project 07 onward), explicit architecture decisions, and the habit of explaining every
  line. These are rare at junior level in 2026 and are exactly what passes the hardest stage —
  the live code review.
- **I am not learning to program.** Prior React/Node/TypeScript/SQL means I am mapping known
  concepts onto a new stack, which is faster than starting cold.
- **Discipline and a system.** A full-time routine plus this whole feedback folder (coverage →
  notes → projects → practice → applications) is uncommon and compounds over months.

**Honest risks (what could keep me from the goal):**

- **The portfolio centrepiece is not finished.** My first full-stack project (07 — TimeTrack) is
  still in progress. Until it ships — runnable, tested, with a README and defensible decisions —
  my strongest claim is incomplete. **Finishing it is priority number one before applying.**
- **Short runway.** The applications window is August–September 2026. That favours depth over
  breadth: one full-stack project I can defend end to end beats three half-built ones.
- **No professional reference in the target stack.** This is my first Angular + Spring Boot role,
  so the projects and my ability to explain decisions have to carry the weight a job reference
  normally would.
- **Career-changer at 31 applying to junior roles.** I must project maturity and judgement, not
  the uncertainty of a fresh graduate. The framing is "experienced professional who retrained",
  never "beginner".
- **English at B1** can cap some international-account roles even when the Spanish screen goes
  well. Cambridge First (B2) in progress is the mitigation.

**The bar the next months must clear:**

- One full-stack project, finished and explainable line by line, with tests and at least three
  architecture decisions I can defend under questioning.
- The ability to pass a stage-4 technical review: justify my choices, read code I did not write,
  and spot what an AI assistant got wrong.
- A CV and LinkedIn that open with the internship result and that full-stack project.

---

## Projects

`_session-rules.md` and `PROGRESS.md` are authoritative — if this list is outdated, use them instead.
Projects are a vehicle to practise concepts; they do not define what must be learned.

- **01 — todo list:** components, signals, services, directives
- **02 — weather app:** HttpClient, RxJS, forkJoin, API integration
- **03 — expense tracker:** reactive forms, routing, localStorage, smart/dumb pattern
- **04 — meal finder:** route params, ActivatedRoute, effect(), favourites
- **05 — task manager:** Angular Material, MatTable, MatDialog, coordinator pattern
- **06 — HR portal:** route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- **07 — TimeTrack (in progress):** Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate,
  PostgreSQL, Docker, Angular — the first full-stack project and the current portfolio centrepiece

---

## Spanish job market 2026

Large consultancies (NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI)
hire juniors through a standard 5-stage process. Knowing where the filters are tells the prompts
what to optimise for.

1. **CV screening** — stack match, projects, internship. A generic CV is filtered here.
2. **HR call** — motivation, availability, salary expectation. 15–20 minutes, non-technical.
3. **Technical test** — a take-home mini-project (small Angular app or Spring Boot API),
   typically 2–4 hours. Filtered out if the code is not clean, structured, or explainable.
4. **Technical interview** — the take-home reviewed live: explain every decision, defend the
   architecture, answer concept questions on the spot. **The decisive stage.** Filtered out if
   the candidate cannot explain what they wrote.
5. **Offer** — salary and contract terms.

What gets a junior filtered out at stage 4 (the one that matters most):

- Can write a pattern but cannot say *why* it was chosen
- Cannot read code written by someone else and explain what it does
- No tests in the project — in 2026 this is a hard filter at most large consultancies, not a
  minor gap. A junior who writes tests is rare and stands out immediately
- Confuses look-alike concepts (`PATCH` vs `PUT`, `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`,
  `Subject` vs `BehaviorSubject`)
- Gives textbook definitions instead of real examples from their own projects
- Cannot justify an architecture decision: "why JWT?", "why DTOs?", "why soft delete?"

What changed specifically in 2026:

- Technical tests increasingly add a **code-review step**: the candidate is shown a snippet
  (often AI-generated) and asked to find the bug or explain what is wrong
- **Docker / containerisation** moved from "nice to have" to baseline — not being able to explain
  `docker-compose up` reads as behind
- **Testing** became a genuine differentiator: almost no junior has it, so JUnit 5 + Mockito is
  worth more than an extra feature

At junior level, companies are not expecting a senior. They want someone who:

- Can explain every line of code they wrote
- Can justify at least one architecture decision with a real reason, not a tutorial answer
- Knows the basics of their stack and is not faking it
- Can be productive within a few months
- Can review code — including AI-generated code — and spot obvious mistakes

---

## The AI factor 2026

AI writes boilerplate, and that changed what interviewers test.

- Before AI: "Can you write the code?" was enough.
- Now: "Can you explain the code, justify the decision, and catch a bug in code you did not write?"

There are two layers in 2026:

1. **Explain what AI generates** — a candidate who produces code they do not understand is
   filtered out faster than before.
2. **Review AI output** — companies expect juniors to *use* AI tools (Copilot, Cursor) and review
   the result critically. The new question is not only "can you explain your code?" but also
   "can you spot what the AI got wrong?"

Common AI mistakes at junior level that interviewers probe for:

- Hardcoded secrets or tokens instead of environment variables
- `@Transactional` on the wrong layer (controller instead of service)
- Wrong validation choice (`@NotBlank` where `@NotNull` was needed, or vice versa)
- Tests that always pass but never catch a real bug (no meaningful assertion)
- N+1 queries from missing `LAZY` / `EAGER` configuration

The rule this sets for scope: **any concept that is easy to generate with AI but hard to explain,
defend, or review belongs in scope.** The bar is "a junior must be able to explain, defend, and
review this without AI help."
