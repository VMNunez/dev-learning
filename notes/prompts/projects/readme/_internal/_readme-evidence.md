# README evidence — real sources that anchor how a project README is composed

**Internal component. Not runnable.** Presentation decisions should be anchored to what the 2026 market
and its readers *actually do*, not only to what a model believes they do. This file holds that ground
truth for the readme family: quoted text from real sources about **which sections a project README
carries, how big each one is, how long anyone reads it, and who — or what — reads it**.
`_readme-standard.md` names it as the source that founds its bars.

It is the sibling of `notes/prompts/strategy/apply/_internal/_application-evidence.md`, built by
`REC-187`, and deliberately not the same file. That one is scoped to the **documents that carry the
projects** — how many projects a CV or a portfolio features, how an ATS parses a bullet, how long a
recruiter reads a CV. This one is scoped to **the README of one project**: its sections and their
sizes. A rule about project count, CV bullets or LinkedIn belongs there and never here; a rule about
what a README's Features or Tradeoffs section must contain belongs here and never there.
`notes/prompts/_internal/_job-market-evidence.md` is the first of the family and is scoped to **what a
junior is asked to know** — it anchors coverage, not presentation. This file is the third.

**How the readme pipeline uses it.** Same discipline as its counterpart:

- Where it has evidence, it is a **required floor**: an assertion in `_readme-standard.md` that
  contradicts a quoted source here is wrong and gets corrected, not defended.
- It only ever **raises** that floor, never lowers it. A source that is silent about a rule does not
  license dropping it — it only removes that rule's claim to be *founded*. Such a rule is marked
  unfounded and left standing until Victor rules on it.
- A **partial extract never proves an absence.** These sources are consumer-facing career articles and
  documentation guides, not studies, and some pages refuse a fetch outright. A rule missing from this
  file is not thereby refuted.
- **Quote, do not invent.** Only text that actually appears at the URL is written here. Every entry
  carries its `Captured:` month and whether it is a `full article` or a `web-search extract`.
- **The run prompts do not read this file.** `_readme-write-prompt.md` and `_readme-review-prompt.md`
  read the standard, which is where a rule founded here is written down; a second read added to every
  run is a cost the evidence does not need.

**Evidence quality note.** The sources below were captured **2026-09** by direct fetch. One fetch
returned 403 and one 404; both are recorded under `## Failed captures` rather than dropped, together
with three numbers that only ever appeared in a search synthesis. **Twelve sources** are quoted here
and authority is uneven, so it is stated per source: four are Spanish career/bootcamp sites, six are
anglophone career articles, one is an arXiv paper, and one — the only source found that gives numeric
section sizes — is a personal blog writing about **open-source library READMEs**, a different genre
from a portfolio README.

---

## Raw sources

### archisacademy.com — Portfolio de Programador vs CV (2026) · full article

URL: https://archisacademy.com/es/blogs/portfolio-programador-vs-cv-2026
Published 2026-05-12 · Captured: 2026-09

> "Un README que explica qué hace el proyecto, por qué lo construiste, cómo ejecutarlo en local y qué
> tecnologías usaste es un detalle pequeño que tiene un peso desproporcionado."

> "Los responsables técnicos revisan perfiles de GitHub, portfolios y enlaces a proyectos"

> "Cómo estructuras el código y cómo tomas decisiones de arquitectura"

Spanish, 2026, and the closest source to this file's question: it names the four things a README must
explain, in that order — what it does, why you built it, how to run it, what it is built with. It
counts none of them. The same fetch also returned a project-count quote and a tutorial-genre quote,
which answer `_application-evidence.md`'s question and not this one; per this file's scope rule they
were **filed there**, in the same pass, rather than parked here.

### fonzi.ai — Do Recruiters Actually Check Your GitHub? · full article

URL: https://fonzi.ai/blog/do-recruiters-check-github
Published 2026-05-06 · Captured: 2026-09 · every quote below re-fetched and verified verbatim

> "Non-technical recruiters at large enterprises typically skim GitHub links for basic activity,
> spending seconds to minutes confirming that the profile exists and shows recent engagement."

> "Engineering managers and staff-level interviewers, by contrast, often perform detailed code and
> repository reviews during later interview stages."

> "Each pinned repo should have a clear README file describing the problem, approach, tech stack, and
> how to run or reproduce results."

> "Many recruiting teams have added AI tooling that parses GitHub profiles and repositories as part of
> sourcing and screening."

> "LLM-based code summarization tools analyze repositories to tag skills and frameworks, rank candidates
> by public activity volume, and generate summaries that help recruiters triage large candidate pools."

> "However, simplistic automation such as star-count filters or shallow keyword matches can produce
> noisy or biased signals."

The only fetched source that states the two-reader fact Victor named — a human skim and a machine pass —
for **repositories** specifically rather than for CVs.

### nexusitgroup.com — Recruit on GitHub: Step-by-Step Playbook 2026 · full article

URL: https://nexusitgroup.com/recruit-on-github/
Published 2026 (title) · Captured: 2026-09

> "A weak README often signals weak communication, weak packaging, or weak empathy for other engineers."

> "Does the repo explain setup, usage, and purpose clearly, or does it assume insider knowledge?"

> "If a repo makes another engineer's job easier to understand, run, extend, or review, that's usually a
> strong hiring signal."

> "A recruiter doesn't need extensive knowledge of Rust, Go, or TypeScript to notice when a developer
> communicates well, maintains responsibly, and collaborates constructively."

Written **for the recruiter**, not for the candidate — the only source here on that side of the desk.
Asked directly about AI tooling it says nothing, which is why the AI claim rests on fonzi alone.

### hakia.com — Developer Portfolio Guide 2026 · full article

URL: https://hakia.com/skills/building-portfolio/
Updated 2026-07-28 · Captured: 2026-09

> "Employers spend an average of 15 seconds on portfolio sites during initial screening."

> "Include a compelling screenshot or GIF of the app in action."

> "List the main technologies, frameworks, and libraries. Explain why you chose each one for this
> project."

Its README template is a seven-section list — Project Overview, Live Demo and Repository Links,
Technologies Used, Key Features, Installation and Setup, Challenges and Solutions, Future Improvements —
and gives **no count for any of them**. Asked directly for a length rule it has none.

### codarium.substack.com — Write clear READMEs to increase your chances to find your first coding job · full article

URL: https://codarium.substack.com/p/write-clear-readmes-to-increase-your-chances-to-find-your-first-coding-job-c2408786b27a
Published 2020-06-16 · Captured: 2026-09

> "Make a short self-explanatory repository name"

> "Concise one-liner" — within "60 characters"

> "Show me what it does. A screenshot or a GIF would be nice to have."

> "Explain which purpose it serves"

> "They do not have time for that. They are not technical."

The oldest source here and the only one written **for a junior job-seeker's README specifically**. Its
prescribed order is repository name → one-liner → demo → purpose. It states no overall length.

### bulldogjob.com — How to write a good README for your GitHub project · full article

URL: https://bulldogjob.com/readme/how-to-write-a-good-readme-for-your-github-project
Published 2018-10-16 · Captured: 2026-09

> "Two or three sentences are enough in case of a small project."

> "IT recruiters browse through their candidates' GitHub accounts."

> "A good README is for others to understand what our code includes, and why it's noteworthy."

> "The illustrations aren't necessary - nevertheless, they can aesthetical value to our project."

Its "always include" set is titles, introduction (the project's aim), technologies, launch; everything
else — table of contents, illustrations, scope of functionalities, examples, project status — is
"consider adding". Its two-or-three-sentence bound is one of the two size limits any fetched career
source states — the other is codarium's 60-character one-liner — and between them they bound an opening
paragraph and a first line, not a body section. It is also the nearest thing here to support for the
standard's rule 2, "**Why this project** — one paragraph".

### platzi.com — Aprende a crear un excelente README para tus proyectos · full article

URL: https://platzi.com/blog/aprende-a-crear-un-excelente-readme-para-tus-proyectos/
Updated 2022-06-22 · Captured: 2026-09

> "README es el primer archivo que una persona verá cuándo entre a tu proyecto."

Its ten sections are: name, "Describe el proyecto de forma breve y concisa", table of contents,
examples, main features, install and run, how you built it, useful resources, licence, authors — and the
README must answer "el qué, el por qué y el cómo del proyecto". No counts, no length.

### aluracursos.com — Cómo escribir un README increíble en tu Github · full article

URL: https://www.aluracursos.com/blog/como-escribir-un-readme-increible-en-tu-github
Published 2022-05-22 · Captured: 2026-09

> "Además, si es posible, es interesante presentar las funcionalidades con un ejemplo visual del
> proyecto, como un gif, imágenes o vídeo."

> "Algunas personas utilizan el perfil de GitHub como portafolio, si es tu caso, es interesante apostar
> por los archivos README para hacer más atractivos tus proyectos incluso para los reclutadores."

Section list: título e imagen de portada, insignias, índice, descripción, estado del proyecto,
demostración de funciones, acceso al proyecto, tecnologías, contribuyentes, desarrolladores, licencia.
No count for any of them.

### corecode.school — Crea un buen README para tu proyecto en Github · full article

URL: https://www.corecode.school/en/blog/git-readme-repositorio
Published 2025-03-24 · Captured: 2026-09

> "Funcionamiento: en este apartado la idea principal es explicar de forma resumida qué hace nuestro
> código."

> "Imágenes y vídeos: imagenes y videos sobre el funcionamiento, un logo, una explicación gráfica del
> funcionamiento siempre ayudan a comprender mejor."

> "Roadmap: de esta forma podras dar a conocer los siguientes pasos en tu código."

> "Los archivos readme sirven para comunicar tu proyecto con cualquier otra persona que ingrese a
> observarlo"

Spanish bootcamp, 2025. Names a Roadmap section — the nearest fetched analogue of Future improvements —
and does not count it. Never names recruiters as the audience.

### cvwon.com — AI Engineer CV 2026 · full article

URL: https://cvwon.com/blog/ai-engineer-cv-2026
Published 2026-08-04 · Captured: 2026-09

> "The AI engineer CV 2026 candidates need is being read twice before a recruiter opens it — once by the
> classic ATS, once by the LLM ranking layer sitting on top."

> "Half of AI engineer CVs in 2026 are pre-screened by an LLM before a human reads them."

> "Single column, no sidebars, no tables in the body. Both the classic ATS and the LLM parser need a
> clean top-to-bottom text flow."

> "The LLM is not counting keywords — it is checking whether the tools you list are supported by
> concrete achievements."

> "Bullets with numbers get quoted verbatim in the LLM's rationale. Bullets without numbers get
> compressed to 'worked on X'."

**Scoped to CVs, not READMEs, and to AI-engineer roles specifically.** Carried here because it is the
only fetched source that describes what an LLM screening layer *rewards*; every use of it for a README
rule is an analogy and must be marked `reasoned`. Asked directly what such a layer **cannot** read, it
does not say — so nothing here founds a claim that a screenshot is invisible to it.

### arXiv 2504.09798v2 — ReadMe.LLM: A Framework to Help LLMs Understand Your Library · full article

URL: https://arxiv.org/html/2504.09798v2
Wijaya, Bolano, Gomez Soteres, Kode, Huang, Sahai · 2025-04-12 · Captured: 2026-09

> "Current documentation, such as ReadMe.md files, is written for human readers, but LLMs interpret
> information differently and are less effective with human-targeted formats."

> "DeepSeek R1 saw a decrease in performance when only given ReadMe.md as context – a potential sign
> that LLMs do not respond well to human-facing documentation."

> "We used XML tags to separate different types of content (e.g. <<examples>>). This formatting improves
> readability for LLMs and helps them easily parse the rules, description, and code snippets."

> "In the first version of Supervision's ReadMe.LLM...it became evident that this initial version's
> extensive length led to hallucinations."

The only measured source in this file, and its task is **code generation from a library's docs**, not
candidate screening. What transfers is narrow and worth having: a human-shaped README is not
automatically machine-legible, and length hurts the machine reader before it hurts the human one.

### ryudi84.github.io (Forge Tools) — Perfect README Template Guide 2026 · full article

URL: https://ryudi84.github.io/sovereign-tools/blog/readme-template-guide.html
Published 2026-02-22 · Captured: 2026-09

> "List 3-7 features as bullet points"

> "Include 3-5 badges maximum. Too many badges create visual noise."

> "Include 2-4 examples that cover the most common use cases"

> "developers spend an average of **less than 30 seconds** evaluating a project's README"

> "One sentence, maximum two" — for the project description

**This is the only source found that states numeric section sizes, and its authority is the weakest in
the file**: a personal GitHub Pages blog, no author credentials, no citation for its 30-second figure,
and — decisively — it is written for **open-source library READMEs** (badges, API reference,
contributing guide, usage examples), a genre whose reader is a developer deciding whether to adopt a
dependency, not a recruiter deciding whether to interview a junior. Its 3-7 band is recorded because it
exists, not because it founds anything.

---

## Failed captures

- `slategit.com/blog/github-profile-readme-advanced-sections` — HTTP 403 (2026-09). Surfaced by search
  as the source of "recruiters typically spend 11 seconds scanning your profile"; **that number is
  therefore unverified and is used nowhere in this file**.
- `holamundo.io/2023/03/02/tu-perfil-github-importa-para-conseguir-trabajo/` — HTTP 404 (2026-09).
- Two further scan-time figures appeared **only in search synthesis** and were contradicted or absent
  when the page was actually fetched: "6 to 7 seconds on an initial portfolio scan" and "if your README
  takes more than 30 seconds to scan, it's too long", both attributed to `hakia.com`, whose fetched text
  gives 15 seconds for portfolio sites and no README length rule at all. **Not usable** — and a reminder
  that a synthesis is not a source.
- `vexlint.com/es/blog/desarrollador-junior-2026-guia-supervivencia` (2026-01-10) — fetched
  successfully but carries nothing quotable on README composition; recorded so the next run does not
  re-fetch it.
- `resumly.ai/blog/how-to-organize-github-repos-for-recruiter-review` (2025-10-07) — fetched
  successfully; prescribes seven README sections and, asked directly, gives **no bullet count and no
  length**. Recorded as a measured silence, not a failure. It does carry one scan-time claim, verbatim
  and unsourced: "**Quick tip:** A recruiter can skim 10 repos in under a minute. Make each name
  instantly understandable." — about repository *names*, not README bodies.

---

## Synthesis

What recurs across the fetched sources, and what it means for `_readme-standard.md`:

1. **No source measures the size of a portfolio README's sections.** This is the direct answer to
   `REC-191` and it is negative. Every source here that prescribes a README prescribes a **section
   list**; exactly one gives numbers (Forge Tools: 3-7 features, 3-5 badges, 2-4 examples) and it is a
   low-authority blog about open-source library READMEs. Two career sources bound a *first line* rather
   than a section — bulldogjob's "Two or three sentences are enough in case of a small project", about
   the introduction, and codarium's "Concise one-liner" within "60 characters" — and nothing else in
   this file bounds anything. **Every one of the standard's six numeric bars is therefore `unfounded`**:
   no source measures them, and none is being carried across by analogy either, which is the sibling
   file's meaning of `reasoned`. (`REC-193`'s own row anticipated the label `reasoned`; the measured
   status is the stricter one, and `REC-191` should read `unfounded` off the table below.) The numbers
   were never findable, which makes an inclusion test the honest shape rather than a fallback.
2. **What every source does prescribe is content, and they agree.** A README must say *what it does*,
   *why it exists*, *what it is built with* and *how to run it* — archisacademy names all four in one
   sentence, platzi as "el qué, el por qué y el cómo", fonzi as "the problem, approach, tech stack, and
   how to run", nexusitgroup as "setup, usage, and purpose". That is a founded floor for the standard's
   section *set*, and it is silent on section *sizes*.
3. **Reading time is short, and every figure for it is weak in a different way.** hakia's "15 seconds"
   is measured but is about **portfolio sites**, not READMEs. Forge Tools' "less than 30 seconds
   evaluating a project's README" is about the right artefact but carries no citation and comes from the
   weakest source here. resumly's "A recruiter can skim 10 repos in under a minute" is about repository
   *names*. fonzi gives a qualitative "seconds to minutes" for a recruiter's skim and separates it from
   the engineering manager's later "detailed code and repository reviews"; the widely repeated 11-second
   and 6-second figures are unverified (403). **Two readers, two depths** is founded — a specific time
   budget is not, and the standard's "scanned in seconds" is the widest claim the evidence supports.
4. **A second reader exists that the standard predates.** fonzi: "Many recruiting teams have added AI
   tooling that parses GitHub profiles and repositories"; cvwon: a CV is "read twice… once by the classic
   ATS, once by the LLM ranking layer". What that layer rewards is stated only for CVs — clean
   top-to-bottom text flow, claims backed by concrete achievements, bullets with numbers quoted verbatim
   — and the arXiv paper adds, from a different task, that human-shaped documentation underperforms for
   an LLM and that **length causes hallucination**. Everything the standard could take from this is
   `reasoned`, never `founded`.
5. **No fetched source says a machine reader cannot see a screenshot.** The absence is recorded rather
   than resolved: the standard's largest investment — screenshots for Angular projects, the
   GIF/screenshot mix for full-stack — is **founded for the human reader by four independent sources**
   (codarium, hakia, alura, corecode) and simply unmeasured for the machine one. A partial extract never
   proves an absence, so nothing here licenses trimming visuals.
6. **Every source that prescribes visuals prescribes them without a number** — "a screenshot or a GIF
   would be nice to have", "un gif, imágenes o vídeo", "Include a compelling screenshot or GIF". The
   standard's own rule 4 ("optimal count for the project (no fixed number)") is the one section already
   in the shape the evidence supports, which is why `REC-191` reads it as the precedent.
7. **The Spanish sources agree with the anglophone ones about content and are equally silent about
   counts.** There is no Spanish-market divergence to carry here — unlike `_application-evidence.md`,
   where the 3-5 portfolio band is specifically Spanish. Where a rule rests only on an anglophone source
   (the LLM layer, in full), it is marked `reasoned`.
8. **Two of the standard's sections are named by no source at all**: *Tradeoffs* (hakia's "Challenges
   and Solutions" is adjacent, not the same) and *What I learned*. Both are uncontradicted; both are this
   repository's own inventions for an interview audience, and the file says so rather than pretending
   otherwise.
9. **Section order is prescribed by every source that prescribes a list, and they agree on the opening
   and disagree on nothing else that matters.** Identity first, then what it does, then proof: codarium
   orders it repository name → one-liner → demo → purpose; hakia opens with Project Overview, then Live
   Demo and Repository Links; Forge Tools with title + one-line description → badges → hero image or
   demo GIF → key features; platzi with name → short description → table of contents; alura with título
   e imagen de portada → insignias → índice → descripción; archisacademy states the four questions in
   the order what → why → how to run → stack. **Three of the five open with identity, then what it does,
   then the visual** — codarium, hakia and Forge Tools; platzi names no visual section at all, and alura
   inverts it, putting the cover image in slot 1 and the description in slot 4. Nothing in the five
   contradicts the standard's slots 1 and 3, and those three match them — rule 1 already carries
   "what it does" ("Says what the app does and who uses it"). What no list has is its **slot 2**:
   *Why this project* sits where the sources put something else entirely, and they do not agree on
   what — codarium a
   one-liner, Forge Tools badges, platzi a table of contents, alura insignias, hakia the demo. Inserting
   one section there is what four of the five do too, so the insertion itself is unremarkable; what is
   quotable is the **position of "why"**. One source gives it a section of its own — codarium's step 3,
   "Explain which purpose it serves" — and puts it **fourth, after the demo**, where the standard puts it
   second, before. That the README must answer *why* is founded twice over (archisacademy names it
   second of the four things a README must explain; platzi requires "el qué, el por qué y el cómo"); its
   **placement ahead of the visual proof is unfounded**, and one fetched source positively disagrees with
   it. The order rule is therefore founded in kind and unfounded in that one slot.

---

## Assertions in `_readme-standard.md` this file bears on

**This table describes the standard as it stood on 2026-09-01, before `REC-191` rewrote the six numeric
bars into inclusion tests** — each of which now cites its row here, so the rows are read as the
provenance of the test that replaced the number, not as live bars. Line numbers are that commit's and
will drift — the quoted bar text is what identifies the site. A row's status is what a run must respect; `Unfounded` never means "delete
it" — it means the rule stands on its author's authority and a ruling is owed. The three labels are the
sibling file's: **founded** (a quoted source states it), **reasoned** (carried across by analogy from a
source that measures something adjacent, and marked as such at the site), **unfounded** (no source
addresses it). None of the six numeric bars is `reasoned`: nothing is being carried across to them.

| Assertion | Site | Status against this file |
|---|---|---|
| Features — `5–6` bullets | rule 5, l.137 | **Number unfounded; content founded.** No career source counts features. The only band found anywhere (`3-7`, Forge Tools) is a library-README blog, and it happens to contain 5–6 without founding it. The user-perspective rule is founded in kind by hakia's "Key Features" and fonzi's "the problem, approach" |
| Architecture decisions — `3 to 8`, interview test | rule 6, l.139 | **Number unfounded; the section is founded.** archisacademy: "Cómo estructuras el código y cómo tomas decisiones de arquitectura"; hakia: "Explain why you chose each one for this project". Neither counts them |
| Tradeoffs — `3 to 4` bullets | rule 7, l.142 | **Unfounded, and the section itself is named by no fetched source.** hakia's "Challenges and Solutions" is the nearest and is not the same thing. Uncontradicted; a deliberate choice of this repository for an interview reader |
| Future improvements — `3 max` | rule 8, l.145 | **Number unfounded; the section is founded.** corecode's "Roadmap: … los siguientes pasos en tu código" and hakia's "Future Improvements". Neither counts them |
| Backend Security considerations — `≥4` bullets | backend rule 4, l.194 | **Unfounded.** No fetched source addresses a per-tier technical README at all. It is also a **floor**, which is what forces padding — the specific risk Victor named on 2026-09-01 |
| Backend Tradeoffs — "the 3 most important" | backend rule 7, l.202 | **Unfounded**, same silence as above |
| Section order (Angular) — Title → Why this project → Live demo → Screenshots → … | l.113, and the full-stack variant l.166 | **Founded in kind, unfounded in one slot.** Three of the five sources that prescribe a list open with identity, then what it does, then the visual (codarium, hakia, Forge Tools; platzi names no visual, alura leads with its cover image), and none of the five contradicts the standard's slots 1 and 3. Its slot 2, *Why this project*, is where the five disagree with each other and with it; the one source that gives "why" a section of its own — codarium's "Explain which purpose it serves" — puts it **after** the demo. See Synthesis 9 |
| Length — recruiter lens — "scanned in seconds", depth pushed to the tier READMEs | l.68 | **Founded in kind, unfounded as a number.** fonzi's "seconds to minutes" and hakia's 15 s support a short scan; no fetched source measures a README's own length, and the two figures that do exist (Forge Tools' 30 s, resumly's 10 repos a minute) are uncited or about repository names |
| Screenshots — "optimal count for the project (no fixed number)" | rule 4, l.126 | **Founded.** Four independent sources prescribe a demo image and **none** gives a count. This is the shape the evidence supports, and the precedent for the other six |
| Full-stack Visuals — GIF/screenshot mix, no fixed count | Visuals rule, l.170 | **Founded for a human reader** (codarium, hakia, alura, corecode). **Unmeasured for a machine reader** — no source says an LLM screen can or cannot read an image; the absence is recorded, and nothing licenses trimming |
| The README is what a recruiter meets first, and is skimmed | standard purpose, throughout | **Founded.** platzi: "el primer archivo que una persona verá"; bulldogjob: "IT recruiters browse through their candidates' GitHub accounts"; fonzi: "seconds to minutes"; hakia: 15 s on portfolio sites; codarium: "They do not have time for that. They are not technical." |
| Title + one sentence, plain language, no tech words | rule 1, l.117 | **Founded in kind, not in size.** codarium's "Concise one-liner" within "60 characters" and Forge Tools' "One sentence, maximum two" both support one sentence; the *plain-language* rule is this repository's own and is uncontradicted |
| The README must answer what / why / stack / how to run | section set, rules 1-3 + 10-12 | **Founded** by four sources that agree almost word for word (archisacademy, platzi, fonzi, nexusitgroup) |
| "What I learned" section | rule 9, l.148 | **Unfounded and unmentioned by every source.** A learning-diary artefact, uncontradicted, and worth keeping only if it survives an interview-reader test — not an evidence question |
| A README is read by an LLM as well as a human | universal rule *A third reader, and it is not human* | **Founded that the reader exists** (fonzi, for repositories; cvwon, for CVs); **reasoned at best** for what it rewards, so the rule is marked `reasoned` at its site. `REC-194` adopted exactly one test on this evidence — every claim the README makes is stated in the README's own text, a sentence, a bullet or a table cell, and never only inside a visual — and refused three things the same evidence does not carry: any trimming of visuals (founded for a human reader, **unmeasured** for a machine one, and absence is not a negative result), any word or length budget, and XML-style tagging, which arXiv 2504.09798v2 measures for an LLM consuming a library's docs and not for a human reading a portfolio. Two further candidates were dropped: **headings that name the thing**, already enforced by the fixed, named section list each target carries; and **the stack named in text**, which is subsumed by the test above — a badge is an image on the page GitHub draws — with rule 10 supplying only the *where* (`Layer` / `Technology`, every layer the project uses) and no source-backed rule about badges owed |

---

*Sources captured 2026-09. Feed new ones by fetching the page and quoting it — never from a search
synthesis alone, which is exactly how the three discarded scan-time figures above got into circulation.*
