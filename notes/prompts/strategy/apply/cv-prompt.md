# CV Prompt

Use in a **separate conversation**. Fill in the configuration block before pasting.

Run this when you are ready to write or update your CV for Spanish consultancy applications.
The output is complete, ready-to-paste CV text in Spanish — copy it into your Word or PDF template.

Two modes:
- **`create`** — builds the CV from scratch using your current profile and projects
- **`review`** — audits an existing CV and rewrites any weak sections; paste your current CV at the end

---

**How to use:**

1. Fill in the configuration block below
2. Paste the entire prompt into a new chat
3. If MODE = review: paste your current CV at the very end

---

````
## Configuration — edit only this block

MODE       = [create | review]
EDUCATION  = [your degree, university, and year — e.g. "Grado en Administración de Empresas, Universidad Complutense de Madrid, 2017" | "no university degree"]
CAMBRIDGE  = [obtained (B2) | in progress (B1→B2) | not yet started]
LOCATION   = [your city — e.g. "Madrid" | "Barcelona"]
PHONE      = [your phone number — e.g. "+34 612 345 678"]
PROJECTS   = [comma-separated list of projects to include — e.g. "07-timetrack, 06-hr-portal, 05-task-manager" | auto — let the prompt choose the 3 strongest]

---

## Before starting

First read `notes/prompts/strategy/apply/_application-standard.md` — the shared standard both
application prompts follow. It defines the **sources to read** (`CLAUDE.md`,
`notes/prompts/_shared-context.md`, `PROGRESS.md`, `ROADMAP.md`, and the optional
`notes/cv/cv-bullets.md`), the **universal bullet format**, the **ATS keyword pool** (required +
preferred), the **Spanish / no-buzzword voice**, the **defensibility rule**, and the
**project-selection heuristic**. This prompt does not repeat those rules — it adds only the
CV-specific flow on top.

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

**If MODE = review:** before Step 1, read the CV pasted at the end of this chat.
- Note which projects are included → use them as the starting point for Step 1 instead of choosing from scratch
- Note which bullets are weak, missing a result, or use filler language → flag them so Step 3 rewrites them
- The output of Step 2 is a rewrite of each existing section, not a blank draft — show before/after for every section that changes

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

---

## Step 5 — Length check

Count the approximate lines and estimate if the content fits on one page in a standard CV template
(A4, 10–11pt font, 1.5cm margins). If it does not fit:
- Suggest which bullets to cut or shorten
- Never suggest removing a section — only trim within sections

---

## Step 6 — Output the final CV

Print the complete final CV text, ready to copy directly into a Word or PDF template.
All fixes from Steps 3, 4, and 5 already applied.

Then print:

**ATS keywords present:** list of keywords found in the CV
**ATS keywords missing:** list of required keywords not found (with suggested placement)
**Estimated length:** fits on one page / slightly over (X lines to cut)

No commit message needed — the CV is not stored in this repo.
Save it separately as a PDF in a folder outside the learning directory.

[paste your current CV below this line — only needed in review mode]
````
