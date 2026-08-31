# LinkedIn Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

> **External-path preflight:** Before reading or writing `job-search/`, execute
> `notes/prompts/_internal/_external-path-preflight.md`. Stop before any write if it fails.

Use in a **separate conversation**. No configuration needed — paste the whole prompt into a new chat.

Run this when you are ready to update your LinkedIn profile before applying.
The output is ready-to-paste text for every section — no rewriting needed, just copy each one.

> **▶ Run first:** `progress-update` — the profile draws on `PROGRESS.md`; keep it current so project status and the level per topic are accurate. The **skills** half is not in that file: it comes from the standard's source 7 (the coverage markers).

---

````
> **Run-start check (step 0):** before any content work, execute `_single-shot-self-report.md` Step 5
> against `notes/prompts/strategy/apply/_internal/_last-run-report-linkedin.md`; never restate the
> shared `Status:` meanings here.

---

## Before starting

First read `notes/prompts/strategy/apply/_internal/_application-standard.md`. It defines the **sources to read**
(`notes/prompts/_internal/_session-rules.md`, `notes/prompts/_internal/_shared-context.md`, `PROGRESS.md`, `ROADMAP.md`, the optional
`notes/cv/cv-bullets.md`, your existing CV in `job-search`, and `notes/coverage/junior.md` for defensibility), the **universal bullet format**, the **Project-bullet spec** (the eight conditions a sourced `cv-bullets.md` entry is re-checked against), the **skills pool** (required + preferred),
the **Spanish / no-buzzword voice**, the **defensibility rule**, and the **project-selection
heuristic**. This prompt does not repeat those rules — it adds only the LinkedIn-specific flow on top.

Note: for LinkedIn also read `ROADMAP.md` specifically for the **LinkedIn checklist** (GitHub and
LinkedIn section) and career target, and read `PROGRESS.md`'s `## Projects` for which projects are done
and their headline topics. What a project demonstrates in detail comes from its `README.md` and
`cv-bullets.md` (the standard's project-selection heuristic); what a **skill** is backed by comes from
the standard's source 7.

---

## Why LinkedIn matters for this target

Recruiters at Spanish consultancies search LinkedIn by skills: `Angular`, `Spring Boot`, `Java`.
If your profile is missing these keywords in the right fields, you are invisible.

Two things that determine whether a recruiter clicks on your profile:
1. **Headline** — the one line under your name, always visible in search results
2. **Last activity** — profiles active in the last 30 days appear higher in recruiter searches

A good LinkedIn profile does not replace a good CV — but a weak profile means recruiters
never get to the CV.

---

## Step 1 — Headline

Draft the headline. It must:
- Be under 220 characters (LinkedIn limit)
- Contain the most-searched keywords for this target role
- Sound like a person, not a keyword list

Recommended format:
`Junior [Main role] | [Tech 1] · [Tech 2] · [Tech 3] | [Differentiator]`

Draft two options:
1. The recommended option (based on ROADMAP.md checklist)
2. An alternative with slightly different emphasis

Mark the recommended one clearly.

---

## Step 2 — About section

Draft the "About" section. Rules:
- 3–4 short paragraphs (LinkedIn shows only the first 2–3 lines before "see more" — the first line must hook)
- Written in Spanish and free of buzzwords per the standard's voice rules (no "apasionado", no
  "entusiasta", no "orientado a resultados")
- Be specific: name the stack, name the internship company (or describe it), name the type of project
- End with a clear call to action: "Abierto a oportunidades junior en [stack] — puedes escribirme en LinkedIn o contactarme en [email]"

Structure:
1. **First paragraph (hook):** who you are and what you build — one or two sentences max
2. **Second paragraph (background):** internship result + what it taught you
3. **Third paragraph (current focus):** what you are building now and why
4. **Fourth paragraph (CTA):** what you are looking for and how to reach you

---

## Step 3 — Experience section

**Internship entry:**

Draft the experience entry for the internship. Use the **universal bullet format from the standard**:
action verb (past tense) + what + result.

Required fields:
- Job title: the real title used at the internship (or "Desarrollador Web Junior" if no title was given)
- Company: the company name
- Dates: start and end month/year
- Location: city or "Remote" if applicable
- Description: 3 bullets maximum

The description must answer: "What did you build, with what technology, and what was the result?"
Do not write: "Participé en el desarrollo de una aplicación." That says nothing.
Write: "Desarrollé el módulo de [feature] de una SaaS con Next.js + TypeScript, integrado con [database/API]."

---

## Step 4 — Projects section

Draft project entries for the top **3-5** projects by applying the **project-selection heuristic from
the standard** (full-stack project first; then the most complex Angular project; then one more that
shows a different skill; then, for the remaining slots, the next projects the heuristic ranks). **A
LinkedIn profile is not a one-page CV**, so it takes the wider of the two bands in the standard's
source 8 (`_application-evidence.md`), where two independent Spanish sources put a *portfolio* at 3-5.
**That band is carried across by analogy and is not founded on a LinkedIn source** — no source in that
file measures a LinkedIn profile, the profile is simply the document here that behaves like a portfolio
rather than like one page. Say so if the number is ever challenged, and do not cite it as measured.
Five is a ceiling, not a target: the same evidence states a weak entry as subtracting rather than adding
nothing, so stop at the last project that earns its slot on the heuristic and state on the run's output
how many were featured and why the next one was left out. Wherever a slot's own rule leaves more than
one candidate, the
standard ranks a project whose **premise is not reconstructible from its name** above one whose is,
before recency and concept coverage.

Where a project has an entry in `notes/cv/cv-bullets.md`, that entry is its polished bullet and reaches
the profile **as-is**. **Re-check it against the standard's Project-bullet spec and report — never repair
it here**: run the eight conditions over the entry as it stands, keep the bullet whatever the result, and
carry each failure to the `PROJECT BULLETS NEEDING A RE-RUN` heading of the final output. The entry is
`portfolio-audit`'s to write, and a consumer that silently improves it puts the profile and the committed
file out of step with no record.

For each project entry:
- **Name:** the project name (e.g. "TimeTrack — Full-Stack Time Tracking App")
- **Date:** the approximate month/year it was completed (or "In progress" if still active)
- **Description:** 2–3 bullets; same format as experience bullets
- **Skills associated:** tag the main technologies (LinkedIn lets you add associated skills per project)
- **GitHub link:** always include

The first bullet is the `cv-bullets.md` entry where one exists, used as-is; otherwise it describes what
the app does from a user perspective.
The second bullet should mention the most technically significant decision (e.g. JWT over sessions).
The third bullet (optional) should mention tests if they exist.

---

## Step 5 — Skills section

Add the skills from the standard's keyword pool, but in **LinkedIn priority order** — LinkedIn shows
the top 3 most prominently, so ordering is what matters here:

**Top 3 (always show first):**
1. Angular
2. Spring Boot
3. Java

**Next tier (add all of these):**
PostgreSQL, TypeScript, SQL, Docker, REST APIs, Git, Maven

**Also add:**
JUnit, Jasmine, Angular Material, RxJS, HTML, CSS, Spring Security, Hibernate

Apply the standard's **defensibility rule**: **do NOT add skills you cannot defend in an interview.**
It binds the three lists above too, not only the extras below — under the standard's precedence rule a
required-pool skill Victor cannot defend is left out of the Skills section and named as a gap, not
padded in. If you have not used Scrum/Agile in a structured way, do not add it. If you have not worked
with Kubernetes or Microservices, do not add them.

---

## Step 6 — Open to work settings

Explain exactly how to configure the "Open to work" feature:
- Turn it ON (visible to recruiters — the green "Open to Work" frame on the photo)
- Job titles to add: `Desarrollador Junior Angular`, `Desarrollador Java Junior`, `Junior Full-Stack Developer`, `Junior Software Developer`
- Location preferences: Spain (set to "On-site and hybrid" — remote-only is less common at consultancies)
- Start date: Immediately

---

## Step 7 — Activity strategy

A recruiter who sees your profile will check your last activity. If you have not posted anything
in 6 months, your profile feels inactive — even if everything else is perfect.

Draft 3 post ideas Victor can use when he starts applying. Each post should:
- Be 3–5 short paragraphs (no walls of text)
- Share something specific he learned or built — not generic "coding is hard" content
- End with a question to encourage comments (LinkedIn algorithm rewards engagement)
- Be in Spanish

Post ideas based on the project content:
1. A post about how JWT authentication works — what it is, why stateless, one diagram or bullet list
2. A post about a specific challenge solved in TimeTrack — what was the problem, what was the fix
3. A post announcing TimeTrack is live on GitHub — what it does, what he learned, a screenshot

Draft all 3 posts, ready to copy and paste.

---

## Final output format

Print each section in this order, ready to copy directly into LinkedIn:

---
**HEADLINE — Recommended:**
[text]

**HEADLINE — Alternative:**
[text]

---
**ABOUT:**
[text]

---
**EXPERIENCE — [Company name] · [Role]:**
[bullets]

---
**PROJECTS FEATURED:** [how many, and why the next-ranked project was left out — never dropped]

**PROJECT — TimeTrack:**
[bullets + link]

**PROJECT — [Project 2]:**
[bullets + link]

**PROJECT — [Project 3 to 5 — one block each, only for the projects that earned their slot]:**
[bullets + link]

---
**SKILLS TO ADD (in order):**
[list]

**SKILLS LEFT OUT — not defensible:**
[required-pool skills omitted under the standard's precedence rule, and what each one leaves to close
in a project — `Ninguna` if there are none; never drop the heading]

---
**PROJECT BULLETS NEEDING A RE-RUN:**
[for each entry sourced from `notes/cv/cv-bullets.md` that fails the standard's Project-bullet spec: the
project, the conditions it fails, and `/portfolio-audit` on that project as the run that repairs it —
`Ninguno` if every sourced entry passes; never drop the heading, since this line is the only route those
failures have out of an output-only run]

---
**OPEN TO WORK SETTINGS:**
[step-by-step instructions]

---
**POST 1:**
[text]

**POST 2:**
[text]

**POST 3:**
[text]

---

No commit message needed — this content goes directly into LinkedIn, not into the repo.

---

## Profile ready when

- Headline contains `Angular`, `Spring Boot`, and `Java`
- About section opens with a specific sentence — no "apasionado" or "entusiasta"
- Every experience bullet starts with a past-tense action verb and includes a concrete result
- Between 3 and 5 projects listed with working GitHub links, and the run stated how many and why the
  next-ranked one was left out (Step 4's band — a two-project profile no longer passes this gate)
- Every required skill Victor can defend added in the correct priority order, and any he cannot named
  as a gap
- "Open to work" configured with the right job titles and Spain as location
- At least one post drafted and ready to publish when applications start

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/strategy/apply/_internal/_last-run-report-linkedin.md`, its own commit, then the refinement step.

````
