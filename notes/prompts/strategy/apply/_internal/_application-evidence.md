# Application evidence — real sources that anchor how the materials are presented

**Purpose.** Presentation decisions should be anchored to what the 2026 market and its parsers
*actually do*, not only to what a model believes they do. This file holds that ground truth for the
apply family: quoted text from real sources about how many projects a document features, how an ATS
parses a bullet, how long a recruiter actually reads a CV, and what a project entry must contain — and,
in its own section read by `cover-letter-prompt.md` alone, whether a cover letter is still read and how
a letter and a recruiter message must be shaped.
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
  carries its `Captured:` month and whether it is a `full article` or a `web-search extract`. **One block
  is the labelled exception**: `## Cover letters and recruiter messages` → "Derived criteria" states
  conclusions, each naming the quote it follows from or marked `reasoning — no source`, and it is never
  cited as evidence.

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

### archisacademy.com — Portfolio de Programador vs CV (2026) · full article

URL: https://archisacademy.com/es/blogs/portfolio-programador-vs-cv-2026
Published 2026-05-12 · Captured: 2026-09

> "Tres a cinco proyectos que cada uno demuestre algo diferente son mucho más efectivos que diez clones"

> "Un perfil de GitHub lleno de clones de tutoriales y aplicaciones de lista de tareas a medio terminar
> apenas es mejor que no tener portfolio"

Third, independent Spanish source on the 3-5 band, and the **first fetched source anywhere in this file
to state the tutorial-genre exclusion** — the claim that had stood unfounded here since 2026-08, when
the only page naming it returned 403. Fetched 2026-09 by the `REC-193` evidence build for the readme
family and filed here rather than there, per that file's scope rule: project count and project genre
are this file's question. Its README-composition quotes stayed in
`notes/prompts/projects/readme/_internal/_readme-evidence.md`.

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

### soltech.net — What Do Hiring Managers Actually Look For in a GitHub Portfolio? · full article

URL: https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/
No date displayed on the page · Captured: 2026-09

> "A strong GitHub portfolio typically includes: Three to five well-documented projects"

Captured 2026-09-02 while resolving `REC-196`, whose subject was the README standard; this sentence is
the **project-count** half of that fetch and belongs here rather than in
`projects/readme/_internal/_readme-evidence.md`, which files the same source for what a README explains.
It is the **fourth** source for the 3-5 portfolio band and the **first anglophone one** — the band had
rested on three Spanish sources, and the evidence quality note above says why that mattered. It raises
the floor rather than moving it: the number is the same, and what changes is that the band no longer
depends on one language's career writing.

---

## Failed captures

Recorded so the next run does not re-derive them and does not read their absence as evidence:

- `codeworks.me` — HTTP 403 on one fetch, partial content on another (2026-08).
- `coderhouse.com/coderlibrary/portfolio-programador-junior-guia-2026` — page returned metadata only,
  no article body (2026-08). Repeatedly surfaced by search as a 3-5 source; **unverified**.
- `devbyces4r.me/blog/portafolio-github-pages-2026/` — HTTP 403 (2026-08). This is the page a search
  synthesis attributed the explicit tutorial-genre exclusion to ("no incluyas proyectos de tutorial:
  app de tareas, app del clima, base de datos de películas"). **That sentence stays unquoted here** —
  but the exclusion it states is no longer unfounded: archisacademy founded it on 2026-09-01, see that
  row of the Assertions table.
- `interviewpal.com` data study (11.2s average over 4,289 resume reviews) — HTTP 403 (2026-08).
  Reported by search only; **not usable**.

---

## Synthesis

What recurs across the fetched sources, and what it means for `_application-standard.md`:

1. **The project count is a band, and it differs by document.** Three independent Spanish sources give
   **3-5 for a portfolio** ("Entre 3 y 5 proyectos, no más."; "Mostrar entre 3 y 5 trabajos es más que
   suficiente."; "Tres a cinco proyectos que cada uno demuestre algo diferente son mucho más efectivos
   que diez clones", the third added 2026-09-01), and soltech.net gives the same band in English — "A
   strong GitHub portfolio typically includes: Three to five well-documented projects" — the fourth
   source for it and the first not in Spanish, added 2026-09-02. The anglophone extract gives **2-3 for a one-page
   CV**. No fetched source anywhere states a flat 3 for every document. The standard used to assert a
   single "3 strongest projects", applied equally by `cv-prompt` and `linkedin-prompt`; that is not
   what the evidence says, and all three sites were corrected to per-document bands
   (`Resolved 2026-08-31` — see the Assertions table).
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

## Cover letters and recruiter messages

**Scope and reader.** Everything above measures **CVs and portfolios**; this section measures the two
documents `cover-letter-prompt.md` produces — the formal *carta de presentación* and the short recruiter
message — and nothing else reads it. `cover-letter-prompt` declares the project-selection heuristic out
of its scope, so the CV-scoped sections above do not bind it, and this one binds no other prompt. Added
2026-10-08 (`REC-188`). The population is the whole prompt, not the one line `REC-187` walked past.

**Two layers, kept apart on purpose.** The quoted evidence below obeys this file's `Quote, do not
invent` rule like every other entry. Beneath it, **Derived criteria** states what a good letter or
message must satisfy, and it is **not evidence**: each criterion either names the quote it follows from
or is marked `reasoning — no source`. A reasoned criterion is legitimate; it is simply never cited as
founded, which is the one confusion this file exists to prevent.

All quotes below were fetched and then checked character for character against the downloaded page text
on 2026-10-08. Spanish sources carry more weight here for the same reason as above.

### Quoted evidence

#### airesume.guru — ¿La carta de presentación ha muerto en 2026? · full article

URL: https://airesume.guru/es/blog/carta-de-presentacion-ha-muerto-2026
Published 2026-07-17 · Captured: 2026-10 · scope: Spain and Latin America

> "No, la carta de presentación no ha muerto en 2026, pero ya no es obligatoria por defecto."

> "En España y Latinoamérica es un documento opcional"

> "cuando la leen, cuenta."

Its when-to-send table, one row:

> "Solo enviarías una plantilla genérica Sáltala; la plantilla resta más que la ausencia"

On technical roles:

> "Para la mayoría de puestos de desarrollo o producto, tu portfolio, tu GitHub, las pruebas técnicas y
> las recomendaciones pesan mucho más que el texto."

On length, reading and order:

> "Los reclutadores ojean las primeras frases y dedican menos de un minuto al conjunto."

> "Apunta a 250 a 400 palabras, media página o tres cuartos, en tres párrafos ajustados: por qué este
> puesto concreto, una prueba concreta y un cierre limpio. Pon el encaje al frente para que la parte que
> de verdad se lee haga el trabajo. En portales como InfoJobs el límite ronda los 2000 caracteres."

The page is a vendor's (it sells a letter generator) and cites no study for the reading claim.

#### capgemini.com — Proceso de selección (Spain) · full page, primary source

URL: https://www.capgemini.com/es-es/talento/trabaja-en-capgemini/proceso-seleccion/
Modified 2025-12-04 · Captured: 2026-10

> "Es obligatorio proporcionar tu CV al enviar tu solicitud. Sin embargo, enviar una carta de
> presentación es opcional."

The only entry in this file written by **one of the target companies themselves** rather than about the
market. One company, not the market: it settles Capgemini and nothing else.

#### jobrise.io — Carta de presentación sin experiencia (2026) · full article

URL: https://jobrise.io/es/blog/carta-presentacion-sin-experiencia-2026/
Published 2026-05-20 · Captured: 2026-10

> "Para puestos muy técnicos, puede que algunas empresas apenas la lean. Pero para prácticas, roles
> junior, atención al cliente, marketing, administración, ventas, recursos humanos, diseño, comunicación
> o puestos trainee, una carta bien hecha puede marcar diferencia."

> "Mínimo: 200 palabras. Ideal: 250 a 400 palabras."

> "Si tu carta ocupa más de una página, probablemente sobra texto."

> "En tecnología, la carta debe ser concreta. Si aplicas a junior developer, data analyst trainee, QA
> tester o soporte técnico, menciona proyectos, repositorios, lenguajes y herramientas."

> "Si tu carta sirve igual para BBVA, Inditex, Glovo y una clínica dental, es demasiado genérica."

> "La carta no debe ser un resumen plano de tu CV."

> "Si suena demasiado perfecta, puede parecer genérica."

On a junior's framing and voice:

> "Cuando no tienes experiencia laboral, tu carta no debe intentar fingir que la tienes."

> "Lo que busca no es perfección, sino señales de potencial."

> "Nada de frases vacías tipo “soy una persona proactiva y con muchas ganas de aprender” sin pruebas."

> "Mal ejemplo: “Me dirijo a ustedes para expresar mi profundo interés en formar parte de su prestigiosa
> empresa, donde espero poder desarrollarme profesionalmente”. Suena genérico."

On a short message where the form allows one:

> "Si el formulario tiene espacio para mensaje, usa una versión corta de 5 a 7 líneas."

> "La estructura más segura es esta: Saludo breve. Primer párrafo con el puesto y tu motivación
> específica. Segundo párrafo con habilidades, estudios o proyectos relacionados. Tercer párrafo con
> conexión con la empresa. Cierre con llamada a entrevista."

(The page renders those five as a numbered list.) Like the other consumer pages here, it is a vendor's.

#### kickresume.com — ¿Cuánto debe durar una carta de presentación? · full article

URL: https://www.kickresume.com/es/centro-orientacion/cuanto-debe-durar-una-carta-de-presentacion/
Published 2023-03-02, modified 2026-06-09 · Captured: 2026-10

> "tu carta de presentación nunca debe superar una página. En la mayoría de los casos, eso significa
> entre 250 y 400 palabras y entre 3 y 6 párrafos cortos"

> "Si estás al inicio de tu carrera y solicitas un puesto junior en el que se espera que no tengas
> experiencia práctica, escribir unas 200 palabras es perfectamente aceptable."

> "Como sugieren los estudios y las investigaciones, los reclutadores suelen dedicar menos de 30
> segundos a echar un vistazo a tu carta"

**Flagged:** the 30 seconds is attributed to "los estudios" and the page names none. It is the only
reading-time figure found for a letter, and it is an unsourced claim, not a measurement.

> "La estructura importa: introducción → logros → adecuación a la empresa → cierre."

#### kanbox.io — Cómo contactar a un reclutador en LinkedIn · full article

URL: https://www.kanbox.io/es/blog/contactar-reclutador-linkedin
Published 2026-04-09 · Captured: 2026-10

> "Mantenlo por debajo de 150 palabras para mensajes directos y por debajo de 300 caracteres para
> invitaciones."

> "Los primeros mensajes directos deben tener entre 80 y 150 palabras."

> "Nunca adjuntes un CV en el primer mensaje"

Among the asks it offers: "una indicación hacia la persona adecuada o un enlace a tu CV. Facilita el sí."

**Its 300-character figure for invitations is contradicted by LinkedIn's own page below**, which states
200; the platform's statement about its own limit wins.

#### linkedin.com — Personalize invitations to connect · platform help page

URL: https://www.linkedin.com/help/linkedin/answer/46662
Captured: 2026-10

> "You can add a personalized message to up to three connection requests per month"

> "Each message can be up to 200 characters"

> "LinkedIn Premium members can send unlimited personalized invitations to all their connection
> requests (connection request limits may still apply)"

A platform fact, not career advice — the strongest kind of source this file holds.

#### resumego.net — Cover Letters: Just How Important Are They? · full article, field experiment

URL: https://resumego.net/research/cover-letters
Published 2020-01-21, modified 2023-01-17 · Captured: 2026-10 · US job boards

7,287 fictitious applications, July 2019 to January 2020:

> "applications that included cover letters tailored specifically to the job at hand had a 53% higher
> callback rate than applications with no cover letter at all"

> "the overwhelming majority (87%) of hiring professionals do read cover letters"

The only **experiment** in this section — the others are surveys or advice. Anglophone and pre-AI, so it
says what a tailored letter was worth, not what it is worth to a Spanish consultancy in 2026.

#### novoresume.com — Cover Letter Statistics · full article

URL: https://novoresume.com/career-blog/cover-letter-statistics
Published 2026-03-04, modified 2026-08-03 · Captured: 2026-10

> "About 60% of the HR professionals we surveyed read cover letters, and 21.3% read the letter before
> the resume. The read rate depends on the reader: only 22.9% of HR managers skip cover letters, while
> 52.8% of agency recruiters do."

Its own survey of "200+ HR professionals". The reader split is the finding that matters here: the
in-house hiring manager reads, the agency recruiter mostly does not.

### Not usable, or absent

- **Search-only figures** — "55% of Spanish recruiters value a personalised letter", "77% prefer
  candidates who send one", "63% discard a candidate over a generic letter", "92% of Spanish-speaking
  recruiters prefer 250-400 words", "Spanish recruiters spend 7 seconds on a letter". Each was reported
  by a search synthesis, none was fetched, and none is quoted here.
- **NTT DATA** — a search for its Spanish application FAQ returned no page stating whether a letter is
  asked for. Absent, not refuting.
- **keepcoding.io**, *Empleabilidad programador junior en España* (2025-11-07) — fetched; it says nothing
  about cover letters or recruiter messages. Its one relevant sentence, "A los reclutadores les interesa
  tu portafolio de proyectos antes que cualquier brillante currículum", was reported by the fetch and not
  checked against the page text, so it is not quoted as evidence.

### Derived criteria — not evidence

What a good letter or message must satisfy, derived from the quotes above. **A line naming a source is
founded on that quote; a line marked `reasoning — no source` is a judgement this file does not found.**

- **CL-1 · The prompt earns its place, conditionally.** A letter is optional in Spain and at Capgemini,
  weighs less than portfolio, GitHub and technical tests for development roles, and is skipped by most
  agency recruiters — but a tailored one beat no letter by 53% on callbacks, and "cuando la leen,
  cuenta". So write one when the offer asks for it or when it can be tailored, never as a reflex. ←
  airesume, capgemini, novoresume, resumego. **What no fetched source measures is the question the row
  asked first: whether Spanish consultancies read a letter.** Every read rate here is anglophone; the
  Spanish evidence shows only that it is optional.
- **CL-2 · Generic is worse than none.** The letter must name what this offer asks and match it to a
  specific project; one that would serve any company fails. ← jobrise ("BBVA, Inditex, Glovo"),
  airesume ("la plantilla resta más que la ausencia"). resumego's one quoted result is for a *tailored*
  letter; its generic-letter group's result was not captured, so nothing here says what a generic one is
  worth against none.
- **CL-3 · Length for a junior: at least 200 words, never over one page** — which also fits the ~2000
  characters a portal like InfoJobs allows. The general band is 250-400; 200 is the stated junior figure
  and jobrise's floor. ← kickresume, jobrise, airesume. **The 250 ceiling is `reasoning — no source`**:
  no source caps a junior letter there, and the prompt keeps it as a convention for brevity.
- **CL-4 · Write for a skim, with the fit in the opening lines.** Recruiters skim the first sentences;
  the two figures for the whole read (under 30 seconds, under a minute) are both unsourced on their own
  pages, so **no number is cited**. ← airesume ("ojean las primeras frases", "Pon el encaje al frente"),
  kickresume (flagged).
- **CL-5 · Three to six short paragraphs; four is inside the band.** ← kickresume ("entre 250 y 400
  palabras y entre 3 y 6 párrafos cortos"), airesume ("tres párrafos ajustados").
- **CL-6 · For a tech role, the evidence is projects, repositories, languages and tools** — concrete,
  not a summary of the CV. ← jobrise (both quotes).
- **CL-7 · Order: contested, so no order is founded.** airesume puts "por qué este puesto concreto" first
  and the proof second; kickresume ("introducción → logros → adecuación a la empresa → cierre") and
  jobrise put skills and projects before the company paragraph — two of three against the prompt's Why
  them before Why you, and none arguing against it. What all three share is CL-4: the fit is stated
  early. `reasoning — no source` for any fixed order.
- **CL-8 · No empty phrases and no stock opening; too polished reads as generic.** ← jobrise ("Nada de
  frases vacías", the "Me dirijo a ustedes…" bad example, "Si suena demasiado perfecta"). This founds the
  prompt's no-buzzword rule and its "No *Me dirijo a ustedes*" for a letter; the standard's banned list
  itself is not founded here.
- **CL-9 · A first direct message stays short — 80-150 words at most.** ← kanbox. The prompt's 5-6 lines
  sit inside or below that, and close to jobrise's "5 a 7 líneas" — which is about an application form's
  message field, so it supports the figure by analogy only.
- **CL-10 · A LinkedIn connection note is a different, harder limit: 200 characters, and three
  personalised notes a month without Premium.** ← linkedin.com (platform), over kanbox's 300. That a
  recruiter who is not yet a connection is reached this way, and that a 5-6 line message cannot travel
  there, is `reasoning — no source`: the page says nothing about non-connections or InMail.
- **CL-11 · No CV attached or pasted into a first message.** ← kanbox. One link is offered as a
  legitimate ask by the same source, so "no links dump" means no *dump*, not no link.
- **CL-12 · Forward-looking framing: do not fake experience, show potential.** ← jobrise ("tu carta no
  debe intentar fingir que la tienes", "señales de potencial").
- **CL-13 · Two drafted versions.** `reasoning — no source` — the prompt's own workflow, not a claim
  about how a letter is read.

---

## Assertions in `_application-standard.md` this file bears on

**This table describes the standard as it stands after 2026-08-31, and `cover-letter-prompt.md` as it
stands after 2026-10-08** — every row naming that prompt is ruled by the Derived criteria `CL-N` it cites,
so the criterion and not this cell is where the reasoning lives. A row marked `Resolved` names an
assertion this file's first fill contradicted and whose text was corrected in the same commit — kept so
a later run can see what was changed and why, and never read as a rule still to be repaired. Every
other row is live: the assertion is still in the file, and its status is what a run must respect.

| Assertion | Site | Status against this file |
|---|---|---|
| project count is a band, declared per document, not a flat 3 | standard, Project-selection heuristic | **Founded** — 3-5 portfolio (three Spanish sources as of 2026-09-01, archisacademy the third, plus soltech.net in English from 2026-09-02, the fourth and the first not in Spanish), 2-3 one-page CV (extract). `Resolved 2026-08-31`: this replaced "3 strongest projects", which no fetched source supported |
| `PROJECTS = auto` chooses 2-3 that fit one page | `cv-prompt.md` | **Founded on an extract only**, not a fetched quote — the weakest support in this file. `Resolved 2026-08-31`: replaced "the 3 strongest" |
| Step 4 features 3-5 projects | `linkedin-prompt.md` | **Reasoned, not founded** — the 3-5 band is measured for a *portfolio*; no fetched source measures a LinkedIn profile. Carried across by analogy and marked as such at the site. `Resolved 2026-08-31`: replaced "top 3 projects" |
| recruiter spends 17-46s, ~10s anecdotal first judgement | standard, Expert stance | **Founded**, with the two kept apart: the range is Tegze's measurement, the ten seconds is one recruiter's account. `Resolved 2026-08-31`: replaced an unfounded "~20 seconds" |
| bullet length 15-30 words | standard, cond. 1 | **Unfounded** — no fetched source states a word count; stated at the site as a convention. `Resolved 2026-08-31` in part: the "~6-second first pass" that justified it was contradicted by the 17-46s range and removed |
| no emphasis, arrows, checkmarks | standard, cond. 2 | **Founded** |
| no em dash | standard, cond. 2 | **Founded only for date ranges** — the source's sentence is "Avoid em dashes (—) in date ranges"; the blanket ban is wider than the quote and is not thereby refuted |
| `%` and `/` only inside a figure | standard, cond. 2 | **Unfounded and stricter than evidence** — left standing pending a ruling |
| exact-string keyword matching | standard, cond. 4 | **Unfounded** — not addressed by any fetched source |
| tutorial-genre projects rank lower | standard, Project-selection heuristic | **Founded 2026-09-01** — archisacademy: "Un perfil de GitHub lleno de clones de tutoriales y aplicaciones de lista de tareas a medio terminar apenas es mejor que no tener portfolio". It had stood **unfounded** since 2026-08, when the only page naming the exclusion returned 403 |
| CV written in Spanish | standard, Voice rules | **Unfounded** — cvapp.es was checked for it and says nothing; see `REC-182` |
| CV fits one page | `cv-prompt`, and the standard throughout | **Founded** — "una página para menos de 7 años de experiencia" |
| a recruiter reads a cover letter "in 20 seconds" | `cover-letter-prompt.md`, MODE = letter | **Unfounded — removed.** `Resolved 2026-10-08` (`REC-188`): the two figures found for a letter (under 30 seconds, under a minute) are both unsourced on their own pages, so no number replaced it; the prompt now says only to write for a skim with the fit up front (CL-4) |
| letter "under ~250 words" | `cover-letter-prompt.md`, MODE = letter | **Floor founded, ceiling reasoned** (CL-3): 200 is the stated junior figure and a floor; no source caps a junior letter at 250, which stays as a convention. `Resolved 2026-10-08`: the open-ended "under" gained the 200 floor |
| one page | `cover-letter-prompt.md`, MODE = letter | **Founded** (CL-3) — "nunca debe superar una página" |
| four short paragraphs | `cover-letter-prompt.md`, MODE = letter | **Founded as inside a 3-6 band** (CL-5) |
| fixed order Opening / Why them / Why you / Close | `cover-letter-prompt.md`, MODE = letter | **Contested** (CL-7) — two of three sources put the proof before the company paragraph, one the reverse, and none argues against either; left standing pending Victor's ruling |
| tailored to the offer, never mail-merge; concrete evidence over adjectives | `cover-letter-prompt.md`, shared rules + Why them | **Founded** (CL-2, CL-6), and the strongest finding in the section — the one measured gain on record is for a tailored letter |
| no buzzwords; no "Me dirijo a ustedes" opening | `cover-letter-prompt.md`, shared rules + Opening | **Founded** (CL-8) — jobrise's empty-phrase rule and its own bad example of that exact opening |
| when to run it: an offer asks, or a direct approach | `cover-letter-prompt.md`, intro | **Founded** (CL-1) — optional in Spain and at Capgemini, and the one measured gain is for a tailored letter; whether Spanish consultancies read one is not measured by any source here |
| message "5-6 lines maximum" | `cover-letter-prompt.md`, MODE = message | **Reasoned, compatible** (CL-9) — at or under the 80-150 words one source gives a first direct message, and close to another's "5 a 7 líneas" for a form field (analogy only); stricter than the evidence, not contradicted |
| a message fits any LinkedIn channel | `cover-letter-prompt.md`, MODE = message | **Contradicted for a connection note** (CL-10) — 200 characters on a free account, three a month (LinkedIn Help). `Resolved 2026-10-08`: the mode now also drafts a counted ≤200-character note |
| no CV pasted in the body; no links dump | `cover-letter-prompt.md`, MODE = message | **Founded for the CV** (CL-11); one link is a legitimate ask in the same source, so the *dump* is what the rule forbids |
| forward-looking framing | `cover-letter-prompt.md`, shared rules | **Founded** (CL-12) — "no debe intentar fingir que la tienes"; "señales de potencial" |
| two drafted versions | `cover-letter-prompt.md`, MODE = message | **Out of scope** (CL-13) — the prompt's own workflow, not a claim about how a letter is read |

---

*Sources captured 2026-08, the cover-letter section 2026-10. Feed new ones by fetching the page and
quoting it — never from a search synthesis alone, which is how the weakest entry above got in.*
