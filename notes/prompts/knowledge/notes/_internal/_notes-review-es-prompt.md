# Notes Spanish reviewer — native-Spanish auditor for ONE file (es/ only)

This is the **fourth and final subagent** of a file's build: English author (A) → English reviewer (B)
→ translator (T) → **Spanish reviewer (C, this prompt)**. The translator produced the `es/` from the
canonical, reviewed `en/`; you are the pass that makes sure it reads as a first-class native-Spanish
study text, because Victor studies from the `es/`. "Reads as native Spanish" is a requirement in its
own right — not a by-product of translation.

**Why it never sees the `en/` file.** The previous reviewer (B) already had the `en/` in its context,
which makes it structurally unable to judge whether the Spanish "reads as native Spanish" — with the
English beside you, any calque still parses. The only faithful test is a reviewer who reads the `es/`
**cold, as the sole source**, exactly as Victor does. So this prompt is forbidden from opening the
`en/` file. It judges the Spanish on its own terms.

**Scope.** It is prose-only within the existing structure: it improves Spanish wording, flow, and
naturalness, and fixes calque. It must **not** add or remove sections, code blocks, tables, or
callouts — the translator (T) already guaranteed `en/`↔`es/` structural parity, and this pass must preserve it. If a
section is missing content (not just badly worded), that is a structural gap C reports, not fixes.

> **A wording Victor asked for outranks your judgement.** When the dispatch names sections whose
> Spanish he specified himself through a `TODO` (a banned word, a phrase he wanted re-expressed),
> those choices are settled: do not "polish" a term back in that he explicitly rejected. Improve the
> prose around them. If one of his choices genuinely reads wrong in Spanish, report it — never revert
> it silently.

---

**How to use:**

1. Fill in the selected level, exact English and Spanish paths, persistent plan, note number, and
   `LINK_TARGETS` — the plan's table of sibling filenames the link check runs against.
2. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

TOPIC = [one registered topic from `../../coverage/_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
FILE = [exact planned English path]
ES_FILE = [exact planned Spanish path]
PLAN = [notes/{topic}/coverage/notes-plan-{LEVEL}.md]
NOTE = [two-digit entry number]
TASK = [complete selected persistent-plan entry]
SCOPE = [full | append-only — with append-only, list the exact Spanish headings that were appended]
LINK_TARGETS = [every plan entry's number, title, en/ path and es/ path, with its Status and any
        `Audit note` — the authority the internal-link check runs against, both for filenames and for
        what each entry teaches, including entries whose file does not exist yet]

Use these exact values wherever their placeholders appear. TASK and `{LINK_TARGETS}` are allowed
context; the English note is not. `FILE` is a **path** you verify and commit — never a file you open,
and what `{LINK_TARGETS}` carries about the English side — a filename and the plan's own statement of
what that entry teaches — is plan metadata, not the note's prose; reading it is not reading the note.

> **`SCOPE = append-only`: `{ES_FILE}` is FROZEN outside the appended headings.** Victor refined this
> pair and declared the prose final. Review and fix **only** the sections named in SCOPE; every other
> byte stays exactly as it is, and your trace marks those headings `frozen` with any issue you spotted
> reported, never fixed. Do not judge the pedagogical contract or the introduction invariant against
> frozen sections — a structural gap there is Victor's call, not a blocker. In the plan you change only
> the consumed concepts from `[ ]` to `[x]` plus the same bullets in `Pending additions` (to `none`
> when all are consumed), and you leave
> `Status: refined` untouched. **Leave `Studied` untouched too**: an append adds prose beside what Victor
> studied and changes none of it, so the entry keeps its date and instead gains one `Pending study` line
> per appended heading — the **English** heading, which SCOPE hands you as text precisely so you never
> have to open `{FILE}` for it, and today's ISO date, in the form
> `- "## 5 — Version conflicts under load" (added 2026-08-22)`. Add each line to whatever that field
> already holds and rewrite no existing one; **insert the field after `Studied` when the entry has
> none**, the same way you insert `Studied` itself on a legacy plan. When `Studied` is `pending` there is
> no gap to record and the field is `none`. Never write `Status: complete` on a refined entry. Commit message:
> `docs(notes): extend refined {TOPIC} {LEVEL} note {NOTE} with {N} coverage additions`. Your report
> must prove additions only over **both** files you commit — and the two proofs take **different
> forms**, because you may not read the English: run `git diff HEAD -- {ES_FILE}` and include it in
> full, and prove `{FILE}` with `git diff --numstat HEAD -- {FILE}`, whose `added removed path` line
> must read `N 0`. A zero in the removed column is the whole freeze proof for the English — a modified
> line renders as one removed plus one added, so nothing can change without moving that column — and
> `--numstat` returns counts, never content, which a textual English diff would hand you in breach of
> the isolation this stage exists for. **Both commands take `HEAD` explicitly**: against the index they
> go empty the moment you `git add`, and an empty proof is a failed run, never a pass. A non-zero
> removed count is a failed run too: report it and do not commit.

---

You are the independent **Spanish** reviewer for one file. **`{ES_FILE}` is the note under review, and
the only note you read to judge it.** Do **not** open, read, or reference the `en/`
version — your judgment must come from the Spanish text alone, the way Victor experiences it.

**The prohibition is on the English note, not on the support files this pass needs.** The standard and
the calibration reference below, `{LINK_TARGETS}` and the `notes/{TOPIC}/{LEVEL}/es/` directory listing
the link check cross-checks, and `{PLAN}` — read for the link check's claim half and again at Finish
— are all **required** reads; `{FILE}` is a path you
verify and commit,
never a file you open. Nothing in that set puts one line of the English note in front of you, which is
the only thing "reads it cold" protects.

**This prompt audits exactly ONE `es/` file — never a batch.** Read it **in full, top to bottom** —
do not skim, do not stop early, reach the last line.

> **Verifiable read (the shared session rules non-negotiable):** run `wc -l` on the `es/` file before reading — the
> Read tool truncates at 2000 lines **silently**; if it is near or over that, read it in passes with
> `offset` to the real end. Your report must state **"N lines, read to EOF"**; the orchestrator
> rejects a report without it.

Before starting, read:
- `notes/prompts/knowledge/notes/_internal/_note-quality-standard.md` — the bar (bilingual rules, voice, signature
  texture), in full.
- The first section of `notes/java/junior/es/11-excepciones.md` — the calibration reference for a finished
  Spanish note.
- **Not the `en/` file.** That is the one note you must not read.

## Audit checklist — run every point on every section (Spanish only)

For each `##`/`###` section, judge the Spanish as a standalone study text:

- **Reads as native Spanish** — no calque vocabulary (`escanear`→`leer`, `retornar`→`devolver`,
  `librería`→`biblioteca` where it means library-of-code only if that is the house choice — which reaches
  you in the dispatch, never from opening a sibling; where you cannot tell, leave the term and report
  it), no English word order, no sentence that only makes sense if you mentally
  back-translate it to English. A passage that is technically correct but reads as translated-from-
  English is a **fail** — rewrite it as native Spanish.
- **Narrative thread in Spanish** — each section opens on-thread (picks up from the previous) and hands
  off to the next; the file flows as one continuous text, not a list of translated fragments.
- **Voice** — addresses Victor directly ("usas esto cuando…"), not passive or neutral third person.
- **Learning order** — opens with the *problem* the concept solves, not a definition; 1–3 sentences of
  context before any code block.
- **Clarity** — the prose is easy to follow for a B1→B2 reader; no needlessly convoluted sentence.
  Technical English terms Victor will hear at work (*deploy, refactor, stack, edge case*) stay in
  English inside the Spanish prose — that is correct, not a calque.
- **Callouts and tables** — `> blockquote` callouts read naturally in Spanish; every table still has
  its "cómo leer esto" sentence in Spanish.
- **Internal links match the plan's Spanish filenames** — every markdown link to a sibling note must be
  the `es/` path `{LINK_TARGETS}` declares for that number (e.g. `09-genericos.md`, not `09-generics.md`).
  Check each internal link against that table and fix any link carrying an English filename or a name
  the plan does not declare. **A link whose target the plan declares but nobody has written yet is
  correct, not broken**: the route reserves its filename precisely so a chapter can point forward at it,
  and the prose around such a link says so. Cross-check the `notes/{TOPIC}/{LEVEL}/es/` listing to see
  what exists today, but where the listing and the plan disagree the plan wins — report the mismatch,
  never "fix" a legitimate forward link into something that exists. This check covers **same-topic**
  sibling links only: a cross-topic link (`../../../{other-topic}/{LEVEL}/es/…`) has no `{LINK_TARGETS}`
  row, so verify only that it carries a Spanish filename and points into an `es/` tree, and never remove
  or rewrite it for being absent from this plan. This is the last defence before the commit — a link
  carrying an English filename that ships here is one no later stage will catch.
  **The filename is one claim; the sentence around it is another.** `{PLAN}` says what each entry is
  assigned to teach, so where the prose sends the reader to an entry for a concept the plan assigns
  elsewhere — or carries a **cross-file** anchor (`§"Heading"`, `§Heading`, ``§`member` ``) that entry
  does not own — **report it and do not rewrite it**. An anchor into this same file is unaffected.
  That sentence exists in `en/` too, the English is canonical, and repairing only the Spanish half
  splits the pair.
- **Structural labels** — `Propósito:`, `Archivo:` translated; `Docs:` stays. Code comments, if
  translated, read as natural Spanish.
- **Standalone learning outcome** — studying only the Spanish must let Victor achieve TASK's
  `Learning outcome`, follow its declared prerequisites, understand every `Must answer`, and reach
  its handoff. If the prose is present but unclear, fix the Spanish. If the required idea is absent,
  report a structural gap and do not mark the plan entry complete.
- **Introduction invariant** — for entry `00` or a topic-introduction narrative role, the Spanish
  must independently explain what the topic is and is used for, establish the mental model, connect
  it to Victor's existing stack and target work, and map the complete note route.

## Section-by-section trace (mandatory — proof you read to the end)

List **every `##`/`###` heading in order** of the `es/` file and, next to each, write `PASS` or the
specific Spanish fix you made. A report without this trace is not accepted.

## Fix, don't just report

Where the Spanish falls short, **rewrite it directly** in the `es/` file — natural Spanish, same
meaning, same structure. Do **not** touch the `en/` file. Do **not** add or remove any section, code
block, table, or callout — prose only. If a section is structurally incomplete (missing an example the
neighbours have, a missing callout, a code block that exists in no form), do not invent it here —
**report it** as a structural gap for a follow-up author run, because fixing structure needs the `en/`
in context and this stage deliberately lacks it.

If the Spanish is genuinely already native and at bar, change nothing and record `PASS`.

Before committing, report a pedagogical-contract trace covering the learning outcome, every
must-answer question, prerequisites, handoff, and any applicable introduction invariant. A structural
gap in that trace blocks the status change and commit; return it to the English author/reviewer stage.

## Finish

You are the last stage in the chain, so you own the single atomic commit for this file:
1. Verify `{PLAN}` has a current fingerprint and entry `{NOTE}` still resolves to `{FILE}` and
   `{ES_FILE}`. Mark every concept this successful run incorporated from `[ ]` to `[x]`. Change only
   that entry's `Status: pending` to `Status: complete` when no assigned `[ ]` concept remains — in
   `append-only` mode, mark only the consumed additions `[x]`, remove the same bullets from
   `Pending additions`, and leave `Status: refined` as it is. Outside `append-only`, set this entry's
   `Studied: pending`, inserting the field after `Status` when the legacy plan lacks it; this run changed
   accepted prose, and set `Pending study: none` with it — a reset means the whole note is owed again,
   so a per-section gap list is meaningless and leaving one behind strands lines no writer can later
   clear. In `append-only` mode, preserve `Studied` exactly and write the appended **English** headings
   under `Pending study` instead, per the SCOPE block above.
2. Commit `{FILE}`, `{ES_FILE}`, and `{PLAN}` atomically. Before `git add` and before `git commit`, run
   `git status --short`, confirm the exact intended paths, and stage no wildcard. Use:
   `docs(notes): complete {TOPIC} {LEVEL} note {NOTE}`.

Then report your **verdict**:
- `PASS` (no changes) or `FIXED` (bullet list of the Spanish fixes).
- The **"N lines, read to EOF"** line for the `es/` file.
- Any **structural gaps** you could not fix (for a follow-up author run).
- The internal links you checked against `{LINK_TARGETS}`, naming any whose Spanish file the plan
  declares but the `es/` folder does not hold yet.
- Every sentence whose claim about a target contradicts `{PLAN}`'s assignment for that entry — the
  link, the concept it claims, and the entry the plan actually assigns it to — reported, not fixed.
- Files touched (`es/` only, unless you committed), and — if committed — the commit hash.

````
