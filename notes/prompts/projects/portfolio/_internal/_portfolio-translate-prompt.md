# Portfolio translate prompt — the question-bank TRANSLATOR (en/ → es/)

**Internal component.** This is stage **T** of the portfolio question bank: author (A) → cold reviewer
(B), once per section, then **translator (T)**, once per project. `portfolio-audit.md` dispatches it in
Phase 1b; you normally don't launch it, though you can run it standalone to (re-)build one project's
Spanish twin. It does **not** compute the verdict, write the CV bullet, or commit — the orchestrator
owns those.

**What it does.** Reads the finished English bank
`notes/interview-prep/projects/en/{PROJECT_NAME}.md` and produces (or re-syncs) its Spanish twin
`notes/interview-prep/projects/es/{PROJECT_NAME}.md` as natural, first-class Spanish.

**Why translation is its own stage, after every section.** Victor answers out loud **in Spanish**, so
the `es/` file is the one that matters at the moment of use — but the code, the identifiers and
PLANNING.md are English, so a question is written once in the language of its own evidence and then
rendered. Running per section instead would translate a draft its reviewer has not audited yet, and
every fix B makes would force a re-sync; running it inside the author would give the Spanish whatever
attention was left after walking Java. This is the same split the notes family runs
(`_notes-translate-prompt.md`), for the same two reasons, and this prompt is the Q&A family's first
implementation of it.

**You do not audit or change the English.** The `en/` bank has already been through its cold reviewer
and is canonical. If you believe an English question or answer is wrong, do **not** fix it — say so in
your report; the English is not yours to touch.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ... — the project folder path]

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}. Derive {PROJECT_NAME} as the last path
segment (e.g. `07-timetrack`). **The filename is identical in both languages** — the project folder is
an identifier, not prose, so it is never translated (the levelled banks keep `angular.md` in `en/` and
`es/` for the same reason).

---

## Before starting, read

- `notes/interview-prep/projects/en/{PROJECT_NAME}.md` — the canonical source, in full.
- `notes/interview-prep/projects/es/{PROJECT_NAME}.md` — the existing twin, if there is one. You are
  re-syncing it, not starting blind.
- `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` →
  **"The bilingual en/es contract"** — the Spanish rules themselves. That section is the authority and
  it is not copied here: `en/` is the master of record for identity, structure and position; every
  change is mirrored in the same section at the same position; Spanish prose reads as **natural
  Spanish**, not a calque; and the technical vocabulary Victor will hear in English on the job stays in
  English inside the Spanish. Read it before writing a line. *That one section, and no other part of
  that standard — the two **standards** are otherwise disjoint and this is the single crossing. It does
  not fence you out of `notes/interview-prep/` itself: the Spanish reference file below is a levelled
  bank, and reading it is the point.*
- `notes/prompts/projects/portfolio/_internal/_portfolio-standard.md` — the file template and the five
  fixed bank sections, including the Spanish heading names.
- `notes/interview-prep/junior/es/architecture.md` — the reference for what finished, native Spanish
  Q&A reads like. It is a levelled bank, not a project one; read it for the register, not the content.

**Verifiable read (the shared session rules non-negotiable):** run `wc -l` on the `en/` file (and the
existing `es/`, if any) before reading — the Read tool truncates at 2000 lines **silently**, and a
truncated read here is a silently missing tail in the translation. A question bank is long by design;
if a file is near or over 2000 lines, read it in passes with `offset` to the real end. Your report must
state **"N lines, read to EOF"** for each file read whole.

---

## STOP conditions — check all three before writing anything

**Stop if the `es/` carries `TODO:` markers Victor wrote.** Do not clear them and do not re-translate
over them. A TODO is resolved **in the language of the file carrying it**, so an `es/` TODO is answered
in Spanish, in his wording, and the English is brought into line with *that* — the opposite of this
stage's direction. Re-syncing from `en/` here would overwrite the exact phrasing he asked for, which is
the whole payload of the marker. Return **`TODO-STOPPED`**, list the markers and the questions they sit
on, and write nothing.

`TODO-STOPPED` is **not** `BLOCKED` and the orchestrator treats it differently: nothing was written, the
`es/` on disk is Victor's and is intact, and re-dispatching you would deterministically stop again. It
is the one outcome where the twin exists, is correct, and must be left out of the run's commit.

> This is a **guard, not a channel.** The project bank has no TODO contract of its own yet — that half
> of `REC-180` is still open, along with stable IDs, priority markers and the `[refined]` freeze. What
> this clause does is refuse to destroy a Spanish edit if Victor makes one; it does not license the
> loop. Until that freeze exists, report any place the `es/` differs from a faithful rendering of the
> `en/` in a way a hand edit would explain, rather than silently overwriting it.

**Stop if the `en/` bank does not exist.** There is nothing to mirror, and creating an `es/` file from
nothing is how a twin with no source ends up on disk. Report `BLOCKED — <reason>`.

**Skip — do not stop on — a section the orchestrator names as left half-written.** A `blocked — partial`
section is English nobody finished, and translated it becomes a Spanish section that *looks* finished,
which is worse than an absent one. Omit that section's heading from the `es/` entirely, mark it
`skipped — blocked upstream` in your trace, and translate every other section normally: four good
sections are worth having, and stopping the whole twin over one of them buys nothing. Parity is owed on
every section except the ones you were told to skip.

---

## What you produce

An `es/` file that is **structurally identical** to the `en/` bank — the same sections in the same
order, the same questions in the same positions, the same code blocks — but whose prose reads as native
Spanish.

- **Structural parity is exact.** Every section heading in the `en/` exists in the `es/`, translated per
  the standard's Spanish heading names. Every question has exactly one counterpart, in the same
  position under the same heading. Do not add a question, do not drop one, do not reorder — this is a
  mirror, and parity is the only property a later reader can check cheaply.
- **The header is translated too**, per the standard's file template.
- **Questions are rendered as an interviewer would ask them in Spanish** — not word for word. A
  question that sounds like a translation sounds like a test, and Victor is preparing to hear these in
  a room. Same question, same emphasis, different words where Spanish needs them.
- **Answers stay in the first person, and "I chose" / "I decided" become `elegí` / `decidí`.** The whole
  bar of this bank is that the answer sounds like the person who wrote the code; an answer rendered
  into impersonal Spanish (`se utiliza`, `se decidió`) fails it exactly as the English passive would.
- **Identifiers, code, filenames, class and method names stay verbatim.** `WeatherService`,
  `takeUntilDestroyed`, `@Transactional`, `HttpParams`, `signal()` — never translated, never accented,
  never re-cased. The same goes for the technical English Victor uses at work (*deploy, refactor,
  stack, edge case, trade-off*): that is correct Spanish for this domain, not calque.
- **Fix calque as you translate** — `escanear`→`leer`, `retornar`→`devolver`, English word order,
  literal idioms.
- **Meaning is identical.** Do not summarise, do not expand, and do not "improve" an answer you find
  thin: render it and report it.

---

## Section-by-section trace (mandatory — proof you translated the whole bank)

List **every section heading in order** and, next to each, its English question count, its Spanish
question count, and `translated` (new) or `re-synced` (it already existed and you updated it). The two
counts must be equal for every section. A report without this trace is not accepted — it is your proof
you reached the last question instead of stopping in the middle of a long bank.

---

## Finish — no commit

Do **not** commit. Leave the `es/` file in the working tree; the orchestrator bundles it into the one
atomic commit with the `en/` bank and the CV bullet. Report:

- `TRANSLATED` (created the `es/`), `RE-SYNCED` (updated an existing one), or `TODO-STOPPED` (you wrote
  nothing because the `es/` carries Victor's markers) — and `BLOCKED` only where you were unable to
  finish. The four are disjoint: only the first two mean you changed the file.
- The **"N lines, read to EOF"** line for each file you read whole.
- The section-by-section trace, with the per-section counts.
- The total question count, `en/` and `es/`, which must match.
- Any English question or answer you believe is wrong (for a follow-up author run — you did **not**
  change it), and any place the existing Spanish diverged in a way that looked deliberate.

**If you cannot finish**, stop and open your report with `BLOCKED — <reason>`, then state exactly which
sections you had already written into the `es/`. You are writing a file the orchestrator commits
wholesale, so that line is the only thing that lets it restore or declare a half-translated twin
instead of committing it as a finished pair.
