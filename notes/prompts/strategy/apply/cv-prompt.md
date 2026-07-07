# CV Prompt

Use in a **separate conversation**. Fill in the configuration block before pasting.

Run this when you are ready to write or update your CV for Spanish consultancy applications.
The output is complete, ready-to-paste CV text in Spanish — copy it into your Word or PDF template.

Three modes:
- **`create`** — builds the CV from scratch using your profile, projects, and existing personal data
- **`review`** — audits an existing CV and rewrites any weak sections (read from `personal/CV` or pasted)
- **`tailor`** — adapts your base CV to one specific job offer, keyword-matched to what that offer asks

> **▶ Run first:** `progress-update` (so `PROGRESS.md` is current). Optional: `portfolio-ready` for polished `cv-bullets`.

---

**How to use:**

1. Fill in the configuration block below
2. Paste the entire prompt into a new chat
3. If MODE = review: paste your current CV at the very end
4. If MODE = tailor: paste the full job offer at the very end

---

````
## Configuration — edit only this block

MODE       = [create | review | tailor]
EDUCATION  = [your degree, university, and year — e.g. "Grado en Administración de Empresas, Universidad Complutense de Madrid, 2017" | "no university degree" | auto — read it from my existing CV in personal/CV]
CAMBRIDGE  = [obtained (B2) | in progress (B1→B2) | not yet started]
LOCATION   = [your city — e.g. "Madrid" | "Barcelona" | auto]
PHONE      = [your phone number — e.g. "+34 612 345 678" | auto — read it from my existing CV]
PROJECTS   = [comma-separated list of projects to include — e.g. "07-timetrack, 06-hr-portal, 05-task-manager" | auto — let the prompt choose the 3 strongest]
BASE_CV    = [tailor mode only: path to the master CV to start from | auto — the most recent in personal/CV/master]

---

## Before starting

First read `notes/prompts/strategy/apply/_application-standard.md` — the shared standard both
application prompts follow. It defines the **sources to read** (`CLAUDE.md`,
`notes/prompts/_shared-context.md`, `PROGRESS.md`, `ROADMAP.md`, the optional
`notes/cv/cv-bullets.md`, and your existing CV in `personal/CV`), the **universal bullet format**, the **ATS keyword pool** (required +
preferred), the **Spanish / no-buzzword voice**, the **defensibility rule**, and the
**project-selection heuristic**. This prompt does not repeat those rules — it adds only the
CV-specific flow on top.

---

## Where CVs live and are saved

Finished CVs are personal documents with your phone and email — they are **never committed to the
repo**. They live outside it, at `C:\Users\Victor\Documents\main\personal\CV\`:
- `master/` — your base CV(s): the canonical version you keep current
- `applications/` — one tailored CV per job offer, named `empresa-puesto.md`
- `assets/` — your headshot; the `[FOTO]` placeholder in the CV points here
- `archive/` — old drafts, kept only as a data source (never sent)

Only `notes/cv/cv-bullets.md` (no personal data) stays inside the repo. Read the existing CV in
`master/` or `archive/` for the real personal facts (per the standard's "Sources to read") instead of
inventing them.

---

## Spanish CV conventions

A CV for Spanish IT consultancies must follow these rules (these are CV-specific, on top of the
shared voice rules in the standard):
- **One page maximum** — juniors with a two-page CV are rejected at the ATS stage
- **No "Curriculum Vitae" header** — start directly with the name
- **Photo:** optional in Spain but common; leave a placeholder `[FOTO]` at the top right if included
- **Sections in this order:** contact info → summary → technical skills → experience → projects → education → languages
- **No hobbies section** — wastes space; only include if directly relevant (e.g. open source)
- **Date format:** `MM/YYYY – MM/YYYY` for date ranges (e.g. `01/2025 – 06/2025`)
- **No soft skills section** — "trabajo bien en equipo" is assumed; show it through results instead

The bullet format, the language (Spanish), and the no-buzzword rule all come from the standard —
apply them here without restating them.

---

## Mode handling

**If MODE = create:** proceed directly to Step 1.

**If MODE = review:** before Step 1, read the CV to audit — either the one pasted at the end of this
chat, or, if nothing is pasted, the most recent file in `personal/CV/master/` (or `archive/`, including
`currículum.pdf`).
- Note which projects are included → use them as the starting point for Step 1 instead of choosing from scratch
- Note which bullets are weak, missing a result, or use filler language → flag them so Step 3 rewrites them
- The output of Step 2 is a rewrite of each existing section, not a blank draft — show before/after for every section that changes

**If MODE = tailor:** before Step 1, read the job offer pasted at the end of this chat (or fetch the URL
given). Then:
- **Extract the offer** — its hard requirements, its exact keywords/terminology, and its nice-to-haves.
- **Start from BASE_CV** (the master CV) — adapt it, do not rebuild from zero.
- **Gap analysis** — for each offer requirement, mark `HAVE` (with concrete evidence from PROGRESS/projects),
  `PARTIAL` (can be spun honestly), or `MISSING`. Never claim a `MISSING` one — the standard's
  defensibility rule still holds; a tailored CV is reordered and reworded, not fabricated.
- **Reweight** — reorder skills, projects, and the PERFIL so the CV leads with what THIS offer prioritizes,
  and mirror the offer's wording where you can defend it (e.g. if it says "APIs REST", use that phrasing).

---

## Step 1 — Choose the projects to include

If PROJECTS = auto: apply the **project-selection heuristic from the standard** to choose the 3
strongest projects (full-stack first, then the most complex Angular project, then one more that shows
a different skill; prefer recency and concept coverage).

If PROJECTS is a specific list: use those exact projects, in that order.

For each chosen project, follow the standard's rule on sourcing bullets: use the polished entry in
`notes/cv/cv-bullets.md` as the primary bullet if it exists (use it as-is — it was already polished by
`portfolio-ready-prompt`), otherwise draft the primary bullet from the project's `README.md`. In both
cases, read the README.md to find supporting details for the 2nd and 3rd bullets in the project section.

---

## Step 2 — Draft the CV

Write the complete CV in Spanish. Use this exact structure:

---

**[FOTO]**                                          **Victor Núñez Pradas**
                                                    Madrid · victornunezpradas@gmail.com
                                                    +34 XXX XXX XXX
                                                    [LinkedIn URL] · [GitHub URL]

---

**PERFIL**

[3 sentences maximum. Sentence 1: background and context (previous experience + current learning).
Sentence 2: current stack and what you can do. Sentence 3: what you are looking for.
No buzzwords. No "apasionado por la tecnología". Be direct and specific.]

Example structure (rewrite with real content):
"Desarrollador con experiencia en el sector tecnológico y una internship reciente en desarrollo
SaaS con Next.js. Actualmente enfocado en Angular + Java Spring Boot, con proyectos propios que
incluyen autenticación JWT, persistencia con PostgreSQL y tests con JUnit 5. Busco una posición
junior en consultora donde aplicar y seguir desarrollando estas competencias."

---

**HABILIDADES TÉCNICAS**

| Frontend       | Backend             | Base de datos  | Herramientas   |
|----------------|---------------------|----------------|----------------|
| Angular 19     | Java · Spring Boot  | PostgreSQL     | Git · GitHub   |
| TypeScript     | Spring Security     | SQL            | Docker         |
| Angular Material | Spring Data JPA  | Hibernate      | Maven · Postman |
| RxJS · Signals | JUnit 5 · Mockito  | —              | IntelliJ IDEA  |
| HTML · CSS     | Jasmine · TestBed  | —              | —              |

Also known (previous experience): React, Node.js, Express, MySQL, Tailwind CSS

---

**EXPERIENCIA**

**[Job title] — [Company name]** · [City]                    MM/YYYY – MM/YYYY
[What the company does — one clause, not a full sentence]
- [Action verb] + [what] + [result — specific, measurable if possible]
- [Action verb] + [what] + [result]
- [Action verb] + [what] + [result]
Maximum 3 bullets. Each must start with a past-tense verb: Desarrollé, Implementé, Construí, Diseñé.

---

**PROYECTOS**

[For each project chosen in Step 1:]

**[Project name]** · Angular + Spring Boot + PostgreSQL + JWT + Docker     [GitHub URL]
- [What it does — user perspective, one line]
- [Architecture decision that shows depth — not just "uses JWT" but why]
- [Something that separates you — tests, specific pattern, real business rule]
Maximum 3 bullets per project. Include the GitHub link. Do not include a demo URL unless the app is live.

---

**FORMACIÓN**

**[Degree]** — [University]                                    [graduation year]
[Only include if degree is relevant or recent. If no CS degree, include it anyway — consultancies
check. Do not apologize for a non-CS degree. Just list it without comment.]

---

**IDIOMAS**

- Español: nativo
- Inglés: [B1 (en progreso) | B2 — Cambridge First Certificate (obtenido en YYYY)]

---

## Step 3 — Check each bullet

Apply the **standard's bullet rules** to every bullet (past-tense action verb, concrete result — or a
qualitative one if no measurable result exists, no filler words like "participé en" / "colaboré en" /
"trabajé en"). Then add the CV-only print-length check:
- Is it under 2 lines when printed in a 10–11pt font?

For every bullet that fails: rewrite it in place and show the before/after.

---

## Step 4 — ATS keyword audit

Go through the **required keyword list from the standard** (`Angular`, `Spring Boot`, `Java`,
`PostgreSQL`, `REST API`, `JWT`, `Docker`, `TypeScript`, `SQL`, `JUnit`, `Jasmine`, `Git`, `Maven`).
For each keyword: ✅ present naturally in the CV / ❌ missing.

For each missing required keyword: propose a natural place to add it without forcing it.

**In `tailor` mode:** also audit against the **specific offer's keywords** extracted in mode handling.
For this CV those take priority over the generic list — a keyword the offer names but the standard's
list omits must still appear (if you can defend it), and a generic keyword the offer never mentions can
be dropped to save space.

---

## Step 5 — Length check

Count the approximate lines and estimate if the content fits on one page in a standard CV template
(A4, 10–11pt font, 1.5cm margins). If it does not fit:
- Suggest which bullets to cut or shorten
- Never suggest removing a section — only trim within sections

---

## Step 6 — Output the final CV and save it

Print the complete final CV text, ready to copy into a Word or PDF template. All fixes from Steps 3, 4,
and 5 already applied.

Then **save it to the personal folder outside the repo** (create the file):
- `create` / `review` → `C:\Users\Victor\Documents\main\personal\CV\master\cv-<yyyy-mm>.md`
- `tailor` → `C:\Users\Victor\Documents\main\personal\CV\applications\<empresa>-<puesto>.md`

Writing outside the project directory may prompt for permission the first time — that is expected.
Never commit a CV to the repo; export the final version to PDF yourself for sending.

Then print:

**ATS keywords present:** list of keywords found in the CV
**ATS keywords missing:** list of required keywords not found (with suggested placement)
**Estimated length:** fits on one page / slightly over (X lines to cut)
**Saved to:** the exact path written above
**(tailor mode) Gap analysis:** the `HAVE / PARTIAL / MISSING` table against the offer, so you know
what to shore up before the interview

---

## Step 7 — Feed the job-market evidence (tailor mode only)

A full, real job offer is high-value evidence for what the target market actually asks — stronger than
the web-search extracts already on file. After tailoring, record it in
`notes/prompts/_job-market-evidence.md`. That file **is** in the repo (public posting data, no personal
information) and feeds `coverage-prompt` / `coverage-audit-prompt` as the required floor — so every offer
you tailor to also sharpens what you study.

> The **canonical intake procedure** lives in
> `notes/prompts/knowledge/coverage/evidence-intake-prompt.md` — the three sub-steps below mirror it. If
> the two ever diverge, that prompt wins; keep them in sync.

1. **Add a Raw posting block** under `## Raw postings`, in the file's exact existing format:
   `### <Company> — <Role> · <year> · <source>` followed by a `Requisitos (from extract):` line quoting
   the real requirement text from the offer (stack, DB, testing, methodology, English level, seniority).
   Because this is a *full* offer, mark it as such (e.g. `· full posting`) — it outranks the partial extracts.
2. **Update the Synthesis** — increment "postings on file" by one, re-tally each recurring requirement's
   frequency to include this offer (e.g. `~6/8` → `~7/9`), and add any newly recurring skill. Keep the
   file's honesty rule: a skill seen only in a senior-ish posting is a "signal to watch", not a junior floor.
3. **Update the footer** — `_Last updated: <yyyy-mm> · postings on file: <N>_`.

Commit it **separately** from the CV (the CV is never committed; the evidence is):

```
git add notes/prompts/_job-market-evidence.md
```

```
git commit -m "docs: add <company> <role> posting to job-market-evidence"
```

[paste your current CV (review mode) or the full job offer (tailor mode) below this line]
````
