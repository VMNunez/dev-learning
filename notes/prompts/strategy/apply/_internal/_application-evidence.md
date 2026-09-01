# Application evidence — real sources that anchor how the materials are presented

**Purpose.** Presentation decisions should be anchored to what the 2026 market and its parsers
*actually do*, not only to what a model believes they do. This file holds that ground truth for the
apply family: quoted text from real sources about how many projects a document features, how an ATS
parses a bullet, how long a recruiter actually reads a CV, and what a project entry must contain.
`_application-standard.md` reads it as a **source**, so the five prompts that read that standard
inherit it without being edited one by one.

It is the sibling of `notes/prompts/_internal/_job-market-evidence.md` and deliberately not the same
file. That one is scoped to **what a junior is asked to know** — it anchors *coverage*, and its own
header says so. This one is scoped to **how what he knows is presented**. A stack requirement read off
a job posting belongs there and never here; a rule about bullet length, project count or ATS parsing
belongs here and never there.

**How the apply prompts use it.** Same discipline as its counterpart:

- Where it has evidence, it is a **required floor**: an assertion in `_application-standard.md` that
  contradicts a quoted source here is wrong and gets corrected, not defended.
- It only ever **raises** that floor, never lowers it. A source saying a character is safe does not
  license loosening a stricter rule that costs nothing — it only removes that rule's claim to be
  *founded*. Such a rule is marked unfounded and left standing until Victor rules on it.
- A **partial extract never proves an absence.** These sources are consumer-facing career articles,
  not studies; several are behind 403s. A rule missing from this file is not thereby refuted.
- **Quote, do not invent.** Only text that actually appears at the URL is written here. Every entry
  carries its `Captured:` month and whether it is a `full article` or a `web-search extract`.

**Evidence quality note.** The sources below were captured **2026-08** by direct fetch, except where
marked. Four fetches failed and are recorded under `## Failed captures` rather than dropped, because a
failed fetch is not evidence of anything and the next run should not silently re-derive them. The
Spanish sources carry more weight for the project-count question than the anglophone ones: the target
market is Spanish consultancies, and the two markets' articles do not agree on the number.

---

## Raw sources

### prometeo-fp.com — Guía: crea tu primer portafolio como programador junior · full article

URL: https://www.prometeo-fp.com/blog/guia-para-crear-tu-primer-portafolio-como-programador-junior
Published 2025-06-12, updated 2026-07-24 · Captured: 2026-08

> "Entre 3 y 5 proyectos, no más."

> "Diez proyectos flojos restan; tres sólidos suman."

> "Cada proyecto debería llevar: una captura o demo en vivo, el enlace al repositorio, una descripción
> de una o dos frases y las tecnologías usadas."

Spanish, FP-track audience — the closest source found to Victor's own profile.

### ilerna.es — Cómo hacer un portafolio de programador junior · full article

URL: https://www.ilerna.es/blog/como-hacer-portafolio-programador-junior
Published 2025-08-22 · Captured: 2026-08

> "Mostrar entre 3 y 5 trabajos es más que suficiente."

> "Es preferible añadir pocos pero bien explicados que muchos sin desarrollar."

Second, independent Spanish source giving the same band as prometeo-fp.

### valhallaresume.com — CV para desarrolladores de software · full article

URL: https://www.valhallaresume.com/es/blog/cv-para-desarrolladores-de-software
No publication date shown · Captured: 2026-08

> "una página para menos de 7 años de experiencia. Dos páginas son aceptables para ingenieros senior"

> "los PDFs bonitos con columnas o cajas de texto a menudo fallan el parseo ATS"

### standout-cv.com — How long do recruiters spend looking at your CV? · full article

URL: https://standout-cv.com/stats/how-long-recruiters-spend-looking-at-cv
Updated 2025-08-01 · Captured: 2026-08

> "On average, recruiters will read your CV for 30 seconds before deciding if you are a good fit or not."

Citing Jan Tegze's 2023 study — "114 experienced recruiters, each asked to review three different CVs",
tracked with Microsoft Clarity without the recruiters' awareness:

> "The average time recruiters spent reviewing a CV was between 17 and 46 seconds"

Citing ResumeGo's 2024 survey of "418 U.S.-based hiring professionals":

> "47% spend 30-seconds to 1-minute reviewing a CV"

Recruiter interview, Hannah Cornish (CV-Library), on the initial fit judgement as distinct from the read:

> "As soon as I open a CV, it only takes me around 10 seconds to usually know if the candidate is a
> potential fit."

### airesume.guru — Special characters that break ATS · full article

URL: https://airesume.guru/blog/special-characters-that-break-ats-what-to-avoid-on-your-resume
Updated 2026-03-23 · Captured: 2026-08

On decorative symbols, listed under "Avoid These": `→ ➤ ➜ ▸` and `☑ ☐ ✓ ✗`, and:

> "Avoid em dashes (—) in date ranges"

> "ATS software often maps them to completely different character codes — or nothing at all."

On two characters the standard currently restricts, this source marks both **safe**:

> "Percentage: % Safe — use for quantified achievements"

> "Forward slash: / Safe — useful for 'and/or', date formats"

### cvapp.es — Ejemplo de currículum de desarrollador de software · full article

URL: https://cvapp.es/ejemplos-de-curriculum/desarrollador-de-software
Dated 2026-08-09 · Captured: 2026-08

> "Solo tendrás oportunidad de impresionar al encargado de selección después de que los programas ATS
> hayan dado el visto bueno a tu CV."

Recorded with a flag: `REC-186` step 1 falsified an earlier citation of this same domain by finding it
absent from disk. This quote was verified by fetching the page, and the page carries no guidance on CV
length, project count or CV language — it was checked for all three and has none.

### codeworks.me — What to Include in Your 2026 Junior Dev Portfolio · partial fetch

URL: https://codeworks.me/blog/junior-dev-portfolio-projects-coding-5-skills/
No date shown · Captured: 2026-08

> "A strong junior developer portfolio in 2026 doesn't need dozens of projects."

**No number appeared in the portion fetched**, and this fetch was partial — by this file's own rule that
is not proof the page states none. Its project-entry guidance, in what was retrieved, is about narrating
the problem-solving process and the obstacles overcome, not about format.

### Anglophone CV guidance — web-search extract, not fetched

Captured: 2026-08 · sources listed by the search: resumeworded.com junior software engineer / junior
software developer resume examples (2026)

The search synthesis reported **2-3 projects** on a junior developer *resume*, prioritised by matching
tech stack, measurable outcomes, and being discussable in a technical screen, and excluding tutorial
reproductions and bootcamp homework unless genuinely strong. **This is an extract, not a fetched quote**,
and is the weakest entry in this file. It is kept only because it is the sole source separating the CV
number from the portfolio number, which is the distinction the Synthesis below turns on.

---

## Failed captures

Recorded so the next run does not re-derive them and does not read their absence as evidence:

- `codeworks.me` — HTTP 403 on one fetch, partial content on another (2026-08).
- `coderhouse.com/coderlibrary/portfolio-programador-junior-guia-2026` — page returned metadata only,
  no article body (2026-08). Repeatedly surfaced by search as a 3-5 source; **unverified**.
- `devbyces4r.me/blog/portafolio-github-pages-2026/` — HTTP 403 (2026-08). This is the page a search
  synthesis attributed the explicit tutorial-genre exclusion to ("no incluyas proyectos de tutorial:
  app de tareas, app del clima, base de datos de películas"). **That sentence is therefore unquoted and
  unfounded here**, even though it matches what the standard already says.
- `interviewpal.com` data study (11.2s average over 4,289 resume reviews) — HTTP 403 (2026-08).
  Reported by search only; **not usable**.

---

## Synthesis

What recurs across the fetched sources, and what it means for `_application-standard.md`:

1. **The project count is a band, and it differs by document.** Two independent Spanish sources give
   **3-5 for a portfolio** ("Entre 3 y 5 proyectos, no más."; "Mostrar entre 3 y 5 trabajos es más que
   suficiente."). The anglophone extract gives **2-3 for a one-page CV**. No fetched source anywhere
   states a flat 3 for every document. The standard used to assert a single "3 strongest projects",
   applied equally by `cv-prompt` and `linkedin-prompt`; that is not what the evidence says, and all
   three sites were corrected to per-document bands (`Resolved 2026-08-31` — see the Assertions table).
2. **Quality over quantity is stated as subtraction, not as zero.** "Diez proyectos flojos restan; tres
   sólidos suman." A weak project makes the document worse, which is why the band has an upper bound at
   all.
3. **One page for a junior CV** is founded: "una página para menos de 7 años de experiencia."
4. **Each project entry needs a one-or-two-sentence description, the stack, and a working link**, per
   prometeo-fp's list (screenshot/live demo, repo link, description, technologies). The "one technical
   challenge" element that the chat draft carried is **not** in any fetched quote — ilerna's "objective,
   problem solved, role, learnings" is adjacent but was reported, not quoted.
5. **Recruiter scan time is 17-46 seconds measured** (Tegze, 114 recruiters), with ~30 seconds given
   as the average. A **~10-second initial fit judgement is one recruiter's own account in the same
   source, not a measurement** — keep the two apart wherever either is cited. No fetched source supports
   a 6-second read as a current measurement.
6. **Decorative symbols, arrows and checkmarks do break ATS parsing** — founded. **The em dash is
   founded only for date ranges**, which is the whole scope of the source's sentence; a blanket ban is
   wider than the quote, and is not thereby refuted.
7. **`%` and `/` are marked safe by the one fetched ATS source** — the standard's restriction on them
   is stricter than the evidence, not contradicted by it.

---

## Assertions in `_application-standard.md` this file bears on

**This table describes the standard as it stands after 2026-08-31.** A row marked `Resolved` names an
assertion this file's first fill contradicted and whose text was corrected in the same commit — kept so
a later run can see what was changed and why, and never read as a rule still to be repaired. Every
other row is live: the assertion is still in the file, and its status is what a run must respect.

| Assertion | Site | Status against this file |
|---|---|---|
| project count is a band, declared per document, not a flat 3 | standard, Project-selection heuristic | **Founded** — 3-5 portfolio (two Spanish sources), 2-3 one-page CV (extract). `Resolved 2026-08-31`: this replaced "3 strongest projects", which no fetched source supported |
| `PROJECTS = auto` chooses 2-3 that fit one page | `cv-prompt.md` | **Founded on an extract only**, not a fetched quote — the weakest support in this file. `Resolved 2026-08-31`: replaced "the 3 strongest" |
| Step 4 features 3-5 projects | `linkedin-prompt.md` | **Reasoned, not founded** — the 3-5 band is measured for a *portfolio*; no fetched source measures a LinkedIn profile. Carried across by analogy and marked as such at the site. `Resolved 2026-08-31`: replaced "top 3 projects" |
| recruiter spends 17-46s, ~10s anecdotal first judgement | standard, Expert stance | **Founded**, with the two kept apart: the range is Tegze's measurement, the ten seconds is one recruiter's account. `Resolved 2026-08-31`: replaced an unfounded "~20 seconds" |
| bullet length 15-30 words | standard, cond. 1 | **Unfounded** — no fetched source states a word count; stated at the site as a convention. `Resolved 2026-08-31` in part: the "~6-second first pass" that justified it was contradicted by the 17-46s range and removed |
| no emphasis, arrows, checkmarks | standard, cond. 2 | **Founded** |
| no em dash | standard, cond. 2 | **Founded only for date ranges** — the source's sentence is "Avoid em dashes (—) in date ranges"; the blanket ban is wider than the quote and is not thereby refuted |
| `%` and `/` only inside a figure | standard, cond. 2 | **Unfounded and stricter than evidence** — left standing pending a ruling |
| exact-string keyword matching | standard, cond. 4 | **Unfounded** — not addressed by any fetched source |
| tutorial-genre projects rank lower | standard, Project-selection heuristic | **Unfounded here** — the only source naming the genre exclusion returned 403 |
| CV written in Spanish | standard, Voice rules | **Unfounded** — cvapp.es was checked for it and says nothing; see `REC-182` |
| CV fits one page | `cv-prompt`, and the standard throughout | **Founded** — "una página para menos de 7 años de experiencia" |
| a recruiter reads a cover letter "in 20 seconds" | `cover-letter-prompt.md` Step / ~250-word rule | **Out of scope, deliberately** — every source here measures *CVs*, not cover letters, and a partial extract never proves an absence. Found by this file's own sweep on 2026-08-31 and left standing, unfounded and uncontradicted, rather than corrected by analogy to the CV figure. **`REC-188` opened the same day** to source the cover letter properly — that row's population is the whole prompt, not this one line |

---

*Sources captured 2026-08. Feed new ones by fetching the page and quoting it — never from a search
synthesis alone, which is how the weakest entry above got in.*
