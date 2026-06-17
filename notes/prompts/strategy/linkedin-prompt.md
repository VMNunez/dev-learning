# LinkedIn Prompt

Use in a **separate conversation**. No configuration needed — paste the whole prompt into a new chat.

Run this when you are ready to update your LinkedIn profile before applying.
The output is ready-to-paste text for every section — no rewriting needed, just copy each one.

---

````
## Context

I am Victor, 31 years old. I am looking for a junior Angular + Java Spring Boot position at
Spanish IT consultancies (NTT Data, Capgemini, Indra, Sopra Steria, Accenture) by August–September 2026.

Before starting, read these files:
1. `CLAUDE.md` — my full profile, stack, internship details
2. `PROGRESS.md` — all completed projects and what each one demonstrates
3. `ROADMAP.md` — the LinkedIn checklist (GitHub and LinkedIn section) and career target

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
- Written in Spanish (Spanish consultancies screen in Spanish)
- No buzzwords: no "apasionado", no "entusiasta", no "orientado a resultados"
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

Draft the experience entry for the internship. Use the same bullet format as the CV:
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

Draft project entries for the top 3 projects based on PROGRESS.md.

Priority order:
1. Full-stack project (07-timetrack) — always first; most impressive for Spanish consultancies
2. Most complex Angular project (06-hr-portal or 05-task-manager)
3. One more Angular project that shows a different skill

For each project entry:
- **Name:** the project name (e.g. "TimeTrack — Full-Stack Time Tracking App")
- **Date:** the approximate month/year it was completed (or "In progress" if still active)
- **Description:** 2–3 bullets; same format as experience bullets
- **Skills associated:** tag the main technologies (LinkedIn lets you add associated skills per project)
- **GitHub link:** always include

The first bullet should describe what the app does from a user perspective.
The second bullet should mention the most technically significant decision (e.g. JWT over sessions).
The third bullet (optional) should mention tests if they exist.

---

## Step 5 — Skills section

List the skills to add on LinkedIn, in priority order (LinkedIn shows the top 3 most prominently):

**Top 3 (always show first):**
1. Angular
2. Spring Boot
3. Java

**Next tier (add all of these):**
PostgreSQL, TypeScript, SQL, Docker, REST APIs, Git, Maven

**Also add:**
JUnit, Jasmine, Angular Material, RxJS, HTML, CSS, Spring Security, Hibernate

**Do NOT add skills you cannot defend in an interview.**
If you have not used Scrum/Agile in a structured way, do not add it.
If you have not worked with Kubernetes or Microservices, do not add them.

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
**PROJECT — TimeTrack:**
[bullets + link]

**PROJECT — [Project 2]:**
[bullets + link]

**PROJECT — [Project 3]:**
[bullets + link]

---
**SKILLS TO ADD (in order):**
[list]

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
````
