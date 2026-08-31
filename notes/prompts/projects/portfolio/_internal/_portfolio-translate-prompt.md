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

> This is the channel's **guard**, and the channel is now real: `_portfolio-standard.md` → "Question
> identity, the refined freeze and the TODO channel" gives this bank the `[refined]` freeze and the
> `TODO:` reopen, and names `study-content-writer` as the only role that resolves one. You are still not
> that role. What this clause does is refuse to destroy a Spanish edit while its repair is owed
> elsewhere; a whole-file stop is deliberate and is not softened by the channel existing. Report any
> other place the `es/` differs from a faithful rendering of the `en/` in a way a hand edit would
> explain, rather than silently overwriting it. (Priority markers are the one half of that row still
> open, so neither file carries a `⭐` and you never add one.)

**Stop if the `en/` bank does not exist.** There is nothing to mirror, and creating an `es/` file from
nothing is how a twin with no source ends up on disk. Report `BLOCKED — <reason>`.

**Skip — do not stop on — a section the orchestrator names as left half-written.** A `blocked — partial`
section is English nobody finished, and translated it becomes a Spanish section that *looks* finished,
which is worse than an absent one. Omit that section's heading from the `es/` entirely, mark it
`skipped — blocked upstream` in your trace, and translate every other section normally: four good
sections are worth having, and stopping the whole twin over one of them buys nothing. Parity is owed on
every section except the ones you were told to skip.

---

## A refined question is frozen — in your file too

A question whose bold line carries `[refined]` was accepted by Victor in **both** languages, and the
standard's freeze binds you as it binds the author and the reviewer. Concretely, on a **re-sync**:

- **Keep the existing Spanish block byte-for-byte.** Do not re-render it, do not improve its wording, do
  not "bring it into line" with an English sentence that reads differently now. You are the role most
  likely to break this by accident, because your normal operation is to rewrite the whole twin from the
  English — and a frozen block is precisely the one whose Spanish is not derived from today's English.
- **It still counts** in that section's parity numbers, and it still appears in your trace, marked
  `frozen — kept`.
- **If the English side of a frozen question has changed** — the two no longer say the same thing — that
  is not yours to reconcile in either direction. Report it, naming the ID, and leave both files alone: a
  frozen block whose English moved means some role edited what it may not, and overwriting the Spanish
  would destroy the evidence.

On a **first translation** the twin has no counterpart to keep, so a frozen English question is rendered
like any other and reported by ID — a freeze cannot be honoured by preserving bytes that never existed.

**Two things you do write on a frozen question:** its **ID**, verbatim (identity is mastered in `en/` and
carrying it across is the whole reason it exists), and the **`[refined]` marker** onto the Spanish bold
line where the twin lacks it. Mirroring an existing marker is not assigning one — you are the pair's
parity role, and a twin whose questions are unmarked while the English is frozen is a pair no later
reader can trust. You never write that marker on a question the `en/` does not already carry it on.

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
- **Question IDs are copied verbatim, never renumbered and never re-ordered.** `[01-todo-list-004]` is
  the same question in both files; that is the only thing tying a Spanish block to its English twin once
  a rewrite has changed every word around it.
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
question count, how many of them were `frozen — kept`, and `translated` (new) or `re-synced` (it already
existed and you updated it). The two counts must be equal for every section, and the frozen count is
part of the trace because a frozen block you silently re-rendered is invisible in a count that only
compares totals. A report without this trace is not accepted — it is your proof
you reached the last question instead of stopping in the middle of a long bank.

---

## Finish — no commit

Do **not** commit. Leave the `es/` file in the working tree; the orchestrator bundles it into the one
atomic commit with the `en/` bank and the CV bullet. Report:

- `TRANSLATED` (created the `es/`), `RE-SYNCED` (updated an existing one), or `TODO-STOPPED` (you wrote
  nothing because the `es/` carries Victor's markers) — and `BLOCKED` only where you were unable to
  finish. The four are disjoint: only the first two mean you changed the file.
- The **"N lines, read to EOF"** line for each file you read whole.
- The section-by-section trace, with the per-section counts and the per-section frozen count.
- The total question count, `en/` and `es/`, which must match.
- The IDs of every `[refined]` question you kept, of every one you rendered for the first time, and of
  any whose English has moved under the freeze — which you did not reconcile.
- Any English question or answer you believe is wrong (for a follow-up author run — you did **not**
  change it), and any place the existing Spanish diverged in a way that looked deliberate.

**If you cannot finish**, stop and open your report with `BLOCKED — <reason>`, then state exactly which
sections you had already written into the `es/`. You are writing a file the orchestrator commits
wholesale, so that line is the only thing that lets it restore or declare a half-translated twin
instead of committing it as a finished pair.
