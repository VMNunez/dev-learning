# Notes review prompt — the ENGLISH REVIEWER component (one file, en/ only)

This is stage **B** of a four-stage build: English author (A) → **English reviewer (B)** → translator
(T) → Spanish reviewer (C). A authors the `en/` file, B audits and fixes it, T then translates the
finished English into `es/`, and C reads the `es/` cold and commits. B exists because, under the
orchestrator, notes are committed unread — a fresh reviewer with no stake in the draft catches what the
author, close to their own text, misses.

**You review English only.** At the point you run, the `es/` file has **not been created yet** (T runs
after you), so there is nothing bilingual to check and no `es/` to open. Your whole job is: is this
`en/` file at the full standard? You never commit and never touch `es/` — you fix the English and hand
off to the translator.

It is normally launched by `notes-audit.md` as subagent **B**. You can also run it standalone to audit
a single finished `en/` file (it still won't commit — pair it with the translator + Spanish reviewer
to land the file).

---

**How to use:**

1. Fill in `TOPIC`, `FILE` (the exact `en/` file just authored), and `TASK` (the complete selected
   persistent-plan entry).
2. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

TOPIC = [one registered topic from `../../coverage/_internal/_topic-ownership.md`]
FILE  = [exact en/ file path just authored, e.g. notes/java/junior/en/08-exceptions.md]
TASK  = [complete selected persistent-plan entry]
SCOPE = [full | append-only — with append-only, list the exact headings the author appended]

Use TOPIC, FILE, TASK, and SCOPE wherever the prompt refers to their placeholders.

> **`SCOPE = append-only` overrides every "fix it directly" instruction below for existing prose.**
> Victor has refined this file and declared it final; the run exists only to add coverage that arrived
> later. Audit and fix **only the appended headings named in SCOPE**. Every other byte of `{FILE}` is
> immutable — you still read the whole file (you need it to judge the seams, duplication, and
> terminology of the new sections) and you still produce the full section trace, but outside the
> appended sections the trace records `frozen` plus any issue you found, never a fix. Do not enforce the
> plan contract, the introduction invariant, or `Docs:` links against frozen sections. Your report must
> include a `git diff` proving your changes are confined to the appended sections; a diff touching a
> pre-existing line is a failed review.

---

You are the independent English reviewer for one just-authored notes file: {FILE}. You did not write
it. Your job is to audit it hard against the standard, fix what falls short in English, and only then
let it through to the translator. Do not be generous — the author already believed it was done. Assume
something is below bar until you have checked.

**This prompt audits exactly ONE `en/` file — never a batch, never the `es/`.** Read `{FILE}` **in
full, top to bottom** — do not skim, do not stop early, reach the last line. A folder loaded into one
context is what makes a reviewer skim the tail; that is why the audit is one file per subagent. At the
end you MUST produce a **section-by-section trace**: list every `##`/`###` heading in order and, next
to each, write PASS or the specific fix you made in it. That trace is your proof you read to the end —
a review without it is not accepted.

> **Verifiable read (the shared session rules non-negotiable):** run `wc -l {FILE}` before reading — the Read tool
> truncates at 2000 lines **silently**; if the file is near or over that, read it in passes with
> `offset` to the real end. Your report must state **"N lines, read to EOF"**; the orchestrator
> rejects a review without it.

Before starting, read:
- notes/prompts/knowledge/notes/_internal/_note-quality-standard.md — the bar you audit against, in full.
- The first section of notes/java/junior/es/08-excepciones.md — the calibration reference for "finished"
  (read it for depth/texture; you audit English).
- The sibling files already in `{FILE}`'s `en/` folder — to catch duplicated examples/concepts and
  broken or missing forward/cross-topic references.

Treat TASK as an acceptance contract. Coverage bullets define required scope, but a file that names
or demonstrates them without achieving TASK's `Learning outcome`, resolving every `Must answer`, and
respecting `Prerequisites` is below bar.

## Audit checklist — run every point on every section

For each section of the file, check:
- **Voice** — addresses Victor directly ("you use this when…"), not passive/third-person.
- **Learning order** — opens with the *problem*, not a definition; 1–3 sentences of context before
  any code block.
- **Documentation test** — no sentence could be copy-pasted onto the official docs unchanged.
- **Zero-assumption** — every term/annotation/method introduced is explained in that same section.
- **Second-order completeness** — mechanism explained (not just behaviour); confusable pairs
  contrasted; exact scope stated; JS/TS anchored only where genuinely equivalent.
- **Anticipate-the-TODO** — the mechanism doubts Victor would raise ("why…?", "in what order…?")
  are already answered in the prose. This is the highest-value check — most misses are here.
- **Signature texture** — worked example carried through; ASCII diagram for anything structural;
  analogy for abstract mechanisms; abundant `> blockquote` callouts; every table has a "how to read
  it" sentence; exact error messages quoted; wrong-vs-right labelled. No section drops below its
  neighbours.
- **Docs links** — file-level link present; each section links an exact sub-section (not a homepage);
  correct priority (Baeldung for Spring/Java, MDN for CSS/JS, angular.dev for Angular, jjwt for JWT);
  no guessed URLs (a guess must be `Docs: TODO — add link`).
- **References** — forward references within the topic marked; cross-topic references opened with a
  preview callout; links to sibling notes carry a one-sentence reminder.
- **Narrative seams** — the file opens by picking up the thread from the previous file (not a cold
  definition) and closes by handing off to the next; where a sibling uses a shared example domain, this
  file stays consistent with it. Read the neighbouring files to check the seams.
- **No duplication** — no example or concept repeats a sibling file in the same folder.
- **Plan contract** — the learning outcome is achieved, every must-answer question is resolved in
  the prose, no undeclared or later prerequisite is assumed, and the closing handoff is real.
- **Introduction invariant** — when the entry prefix is `00` or its narrative role is topic
  introduction, the file defines the topic and its practical purpose, establishes the recurring
  mental model, connects it honestly to Victor's existing stack and target work, and maps the
  complete learning route. Apply this to both created and pre-existing files.

Covering every assigned bullet is necessary but not sufficient. Fix a file that still reads like
reference documentation instead of a chapter capable of teaching the planned outcome from zero.

## Fix, don't just report

Where a check fails, **fix it directly** in `{FILE}` — you are the last English quality pass before
translation, not an advisor. Preserve the author's correct work; only change what misses the bar. Keep
code blocks and `Purpose:`/`Docs:` labels intact unless a `File:` path is invalid.

If the file is genuinely already at bar, change nothing and record it as PASS — do not rewrite good
text to leave a mark.

## Finish

**You never commit, never mark the persistent plan entry, and never touch the `es/` file.** Leave your fixed
`en/` file in the working tree and hand off to the translator (T), which produces the `es/` from your
finished English; the Spanish reviewer (C) then commits.

Report your **verdict** for this file:
- `PASS` (no changes needed) or `FIXED` (with a short bullet list of what you corrected and why).
- The **"N lines, read to EOF"** line for `{FILE}`.
- The **section-by-section trace** (every heading → PASS or the fix).
- A **pedagogical-contract trace**: learning outcome; each must-answer question; prerequisites;
  handoff; and, when applicable, every introduction invariant → PASS or the fix.
- The coverage status (✅/🔧/➕) and the files touched (`en/` only).

````
