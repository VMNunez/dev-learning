# CV Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

> **External-path preflight:** Before reading or writing `job-search/`, execute
> `notes/prompts/_internal/_external-path-preflight.md`. Stop before any write if it fails.

Use in a **separate conversation**. Fill in the configuration block before pasting.

Run this when you are ready to write or update your CV for Spanish consultancy applications.
The output is complete, ready-to-paste CV text in Spanish — copy it into your Word or PDF template.

Three modes:
- **`create`** — builds the CV from scratch using your profile, projects, and existing personal data
- **`review`** — audits an existing CV and rewrites any weak sections (read from `job-search` or pasted)
- **`tailor`** — adapts your base CV to one specific job offer, keyword-matched to what that offer asks

> **▶ Run first:** `progress-update`, and its drift repaired, not merely run — it audits `PROGRESS.md`, it does not repair it. Optional: `portfolio-audit` for polished `cv-bullets`.
> Mind ROADMAP.md's **CV gate**: update the CV only once project 07 is live on GitHub with a README
> that includes at least one architecture decision — not before.

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
EDUCATION  = [your degree, university, and year — e.g. "Grado en Administración de Empresas, Universidad Complutense de Madrid, 2017" | "no university degree" | auto — read it from my existing CV in job-search]
CAMBRIDGE  = [obtained (B2) | in progress (B1→B2) | not yet started]
LOCATION   = [your city — e.g. "Madrid" | "Barcelona" | auto]
PHONE      = [your phone number — e.g. "+34 612 345 678" | auto — read it from my existing CV]
PROJECTS   = [comma-separated list of projects to include — e.g. "07-timetrack, 06-hr-portal, 05-task-manager" | auto — let the prompt choose the 2-3 strongest that fit one page]
BASE_CV    = [tailor mode only: path to the master CV to start from | auto — the most recent in job-search/master]

---

> **Run-start check (step 0):** before any content work, execute `_single-shot-self-report.md` Step 5
> against `notes/prompts/strategy/apply/_internal/_last-run-report-cv.md`; never restate the shared
> `Status:` meanings here.

---

## Before starting

First read `notes/prompts/strategy/apply/_internal/_application-standard.md` — the shared
job-application standard. It defines the **sources to read** (`notes/prompts/_internal/_session-rules.md`,
`notes/prompts/_internal/_shared-context.md`, `PROGRESS.md`, `ROADMAP.md`, the optional
`notes/cv/cv-bullets.md`, your existing CV in `job-search`, and `notes/coverage/junior.md` for
defensibility), the **universal bullet format**, the **Project-bullet spec** (the eight conditions a
sourced `cv-bullets.md` entry is re-checked against), the **ATS keyword pool** (required +
preferred), the **Spanish / no-buzzword voice**, the **defensibility rule**, and the
**project-selection heuristic**. This prompt does not repeat those rules — it adds only the
CV-specific flow on top.

---

## Where CVs live and are saved

Finished CVs are personal documents with your phone and email — they are **never committed to the
repo**. They live outside it, at `C:\Users\Victor\Documents\main\job-search\`:
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
chat, or, if nothing is pasted, the most recent file in `job-search/master/` (or `archive/`, including
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

If PROJECTS = auto: apply the **project-selection heuristic from the standard** to choose the **2-3**
strongest projects (full-stack first, then the most complex Angular project, then one more that shows
a different skill). **Two or three, not always three** — this is a one-page CV, which is the tighter of
the two bands in the standard's source 8 (`_application-evidence.md`), and the same evidence states a
weak entry as subtracting rather than adding nothing. **The 2-3 rests on a web-search extract, not on a
fetched quote** — it is the weakest support in that file, and the honest thing to say if it is ever
challenged. What the evidence founds directly is the **page**, not the count — "una página para menos
de 7 años de experiencia" — so the real upper bound is what fits on it, and 3 is where the extract puts
that for a junior. Take the third slot only when its project earns
it on the heuristic; where it would be filled by a project the heuristic ranks low, ship two and say so
on the run's output. Wherever a slot's own rule leaves more than one candidate, the
standard ranks a project whose **premise is not reconstructible from its name** above one whose is,
before recency and concept coverage.

If PROJECTS is a specific list: use those exact projects, in that order.

For each chosen project, follow the standard's rule on sourcing bullets: use the polished entry in
`notes/cv/cv-bullets.md` as the primary bullet if it exists (use it as-is — it was already polished by
`portfolio-audit`), otherwise draft the primary bullet from the project's `README.md`. In both
cases, read the README.md to find supporting details for the 2nd and 3rd bullets in the project section.

**Re-check every sourced entry against the standard's Project-bullet spec here, and report — do not
repair.** The eight conditions, run over the entry as it stands. Keep the bullet as it is whatever the
result, and carry the failures to Step 6, naming the project, the conditions and the run that repairs
them (`/portfolio-audit` on that project — **and, when the entry's heading carries `[refined]`, that it
repairs nothing until Victor removes the marker**, since that run refuses to replace a frozen section). An
entry that is merely weak is never replaced by a
README-drafted substitute; that route exists only for a project with no entry at all.

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
*(example structure — regenerate the real cells at run time from the standard's keyword pool under its
Precedence and Defensibility rules; never copy this table as-is, and never source them from `PROGRESS.md`,
which holds no technology inventory)*

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

**One exception, and it is the standard's, not this step's: a project bullet sourced from
`notes/cv/cv-bullets.md` is never rewritten here.** It was already checked in Step 1 against the
Project-bullet spec, whose condition 5 **supersedes this step's concrete-result rule** for a persisted
project bullet — so a sourced bullet that names a technical decision and no result is correct here, not
weak — and which is stricter on length besides. It reaches the CV as-is and its failures are reported at
Step 6 — the *as-is* rule is
what keeps the CV and the committed file in step, and a bullet quietly improved here is the drift that
rule exists to prevent.

---

## Step 4 — ATS keyword audit

Go through the **required keyword list from the standard** (`Angular`, `Spring Boot`, `Java`,
`PostgreSQL`, `REST API`, `JWT`, `Docker`, `TypeScript`, `SQL`, `JUnit`, `Jasmine`, `Git`, `Maven`).
For each keyword: ✅ present and defensible / ⚠️ present but not defensible / ❌ missing — the standard's
**Defensibility rule** names the evidence that decides it (source 7's project markers first, the project
itself when a marker is absent). A ⚠️ keyword is
struck from the CV and printed on Step 6's **ATS keywords not defensible** line, next to the missing
keywords that fail the same test.

For each missing required keyword, apply the standard's **precedence rule** before proposing anything:
if Victor can defend it in an interview, propose a natural place to add it without forcing it; if he
cannot, it stays out of the CV and is reported as a **gap** — no placement, no softened wording.

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
- `create` / `review` → `C:\Users\Victor\Documents\main\job-search\master\cv-<yyyy-mm>.md`
- `tailor` → `C:\Users\Victor\Documents\main\job-search\applications\<empresa>-<puesto>.md`

Writing outside the project directory may prompt for permission the first time — that is expected.
Never commit a CV to the repo; export the final version to PDF yourself for sending.

Then print:

**ATS keywords present:** list of keywords found in the CV
**ATS keywords missing:** required keywords not found but defensible (with suggested placement)
**ATS keywords not defensible:** required keywords left out under the standard's precedence rule — the
gap to close in a project, not in the CV
**Project bullets needing a re-run:** for each entry sourced from `notes/cv/cv-bullets.md` that fails
the Project-bullet spec, the project, the conditions it fails, and `/portfolio-audit` on that project as
the run that repairs it — **naming the marker first where the entry is `[refined]`, since that run refuses
a frozen section and repairs nothing until Victor removes it** — print `none` when every sourced entry
passes, since the line is the only
route those failures have out of this run
**Projects featured:** how many, and — when Step 1 shipped two rather than three — which project was
left out and on which point of the heuristic it lost its slot; this line is never dropped
**Estimated length:** fits on one page / slightly over (X lines to cut)
**Saved to:** the exact path written above
**(tailor mode) Gap analysis:** the `HAVE / PARTIAL / MISSING` table against the offer, so you know
what to shore up before the interview

---

## Step 7 — Feed the job-market evidence (tailor mode only)

A full, real job offer is high-value evidence for what the target market actually asks — stronger than
the web-search extracts already on file. After tailoring, record it in
`notes/prompts/_internal/_job-market-evidence.md`. That file **is** in the repo (public posting data, no personal
information) and feeds `coverage-prompt` / `coverage-audit-prompt` as the required floor — so every offer
you tailor to also sharpens what you study.

> **Do not re-derive the procedure here — run the canonical one.** The intake steps live in
> `notes/prompts/knowledge/coverage/evidence-intake-prompt.md`, Steps 2–4: add the Raw-posting block in
> the file's exact format (**including the `Captured: <yyyy-mm>` line** — it is what makes the file
> trend-readable), mark this offer `full posting` (a full pasted offer outranks web-search extracts),
> deduplicate, re-tally the Synthesis frequencies, and update the footer count. Follow those steps as
> written — this prompt adds nothing to them.

Commit it **separately** from the CV (the CV is never committed; the evidence is):

```
git add notes/prompts/_internal/_job-market-evidence.md
```

```
git commit -m "docs: add <company> <role> posting to job-market-evidence"
```

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/strategy/apply/_internal/_last-run-report-cv.md`, its own commit, then the refinement step.

[paste your current CV (review mode) or the full job offer (tailor mode) below this line]
````
