# Interview-prep review prompt — second-pass auditor for ONE topic

This is the **reviewer half** of a two-subagent build: the write prompt authors a topic's Q&A, then
this prompt audits and fixes it before it is committed. It exists because, under the orchestrator, the
Q&A is committed unread — a fresh reviewer with no stake in the draft catches the questions the author,
close to their own work, waved through. Run it on **one topic**, right after the write prompt produced it.

It is normally launched by `interview-prep-audit.md` as subagent **B** (the write prompt is subagent
A). You can also run it standalone to audit a single topic's finished Q&A.

---

**How to use:**

1. Fill in `FILE` (the topic filename without extension) and `SECTION` (must match the author's run).
2. Fill in `DRY_RUN` — `false` (fix, then commit) or `true` (fix only, leave everything staged).
3. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

FILE    = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
SECTION = [all | ## Routing | ## Forms | ...]   ← must match the author's run
DRY_RUN = [false | true]

Use FILE, SECTION, and DRY_RUN wherever the prompt refers to {FILE}, {SECTION}, or {DRY_RUN}.

---

You are the independent reviewer for one just-authored topic of Victor's interview prep:
`notes/interview-prep/en/{FILE}.md` and its `es/{FILE}.md` twin. You did not write them. Your job is to
audit them hard against the standard, fix what falls short, and only then let them through. Do not be
generous — the author already believed the work was done. Assume a question is below bar until you have
checked it.

**Your unit is `{SECTION}` — usually one section, not the whole file.** When the audit orchestrator
dispatches you it passes one exact `##` heading; audit only that section (in both `en/` and `es/`).
Read every question in scope **in full, top to bottom** — do not skim, do not stop early — and at the
end return a **question-by-question trace**: list every question in the section in order and, next to
each, write PASS or the specific fix you made. That trace is your proof you read to the end; a review
without it is not accepted. (`SECTION = all` on a standalone run means the whole file is your scope —
then trace section by section.)

Before starting, read:
- notes/prompts/knowledge/interview-prep/_interview-prep-standard.md — the bar you audit against, in full.
- notes/prompts/_shared-context.md — Victor's profile, projects, and the Spanish job market 2026 (you
  judge "realistic" and "in Victor's voice" against this).
- Both `en/{FILE}.md` and `es/{FILE}.md`, scoped to `{SECTION}` (or the whole file if `all`).
- When a code block's citation looks doubtful, open the cited project file (paths in "Sourcing real
  code" of the write prompt) to confirm the snippet is real — a spot-check, not a full source read.

## Audit checklist — run every point on every question in scope

This is the highest-value pass. Most misses are in the first three checks — they are what makes the
file worth studying:

- **Realistic question** — an interviewer at NTT Data / Capgemini / Indra would actually ask this of a
  junior for this stack. Not trivia, not a mid/senior-level question, not a phrasing no human uses. If
  it is unrealistic, either rewrite it into the real question behind it or cut it.
- **Well-worded** — phrased the way an interviewer says it out loud: natural, specific, one clear ask.
  Rewrite textbook-heading-as-a-sentence phrasings.
- **Spoken in Victor's voice** — first person, what he would say in the room ("I used it in project 06
  to…", not "it is used to…"), concise (1–2 sentences), anchored to a named real project when the
  question is about a pattern or decision.
- **Every word defensible** — apply the standard's test: could Victor explain every word if pressed? A
  padded or memorised-sounding answer fails.
- **Type classification and ratio** — each question is correctly Conceptual / Decision-based / Pressure
  (definitions in the standard); the section is roughly on the 55/35/10 ratio, with at least 1
  Decision-based question present (the floor).
- **Priority markers** — every question has one; the proportion check holds (not more than half a
  section is ⭐⭐⭐); each section runs ⭐⭐⭐ → ⭐⭐ → ⭐.
- **Format** — blank line between question and answer; Junior tip on every Conceptual question; Red flag
  on Decision-based/Pressure where warranted.
- **Real code where warranted** — every question an interviewer would pose with code (Pressure
  snippets, "how do you write/configure X?", tight confusable-pair contrasts) carries a code block that
  is **real and cited to a project file** (`// projects/07-timetrack · …`), minimal (3–10 lines), and
  actually supports the answer. Fix invented code (replace with a real fragment from the project source,
  or mark it `// illustrative — not from a project`), and add a snippet where one is clearly missing.
  Same code in `en/` and `es/`.
- **Bilingual integrity** — `en/` and `es/` have the same sections, same questions, same order; `es/`
  reads as native Spanish, not a calque; the Junior-tip label is `Consejo de entrevista:`.

## The adversary gap list (who gets it)

Under the orchestrator, the market/gap slice (M questions + G gaps) is handed to the **author**, not to
you — your acceptance is checked afterwards by the orchestrator against that slice, so your
question-by-question trace must be complete enough to confirm each slice item is covered. If you are
run **standalone** and a gap list is pasted into your prompt, then add every genuine gap yourself to
the correct section of both `en/` and `es/`, in the standard's full format (bold question + marker +
blank line + answer in Victor's voice + Junior tip / Red flag / real cited code as the type warrants),
skipping — and noting — any gap truly out of junior scope. Then run the audit below over everything in
scope, including any questions you just added.

## Fix, don't just report

Where a check fails, **fix it directly** in both `{FILE}` files — you are the last quality pass, not an
advisor. Rewriting an unrealistic or badly-worded question, tightening an answer into Victor's voice,
reclassifying a type, and reordering by priority are all part of your job here (the author already ran;
you are finishing the same build, so the "existing content is final" rule does not bind the reviewer
for questions authored in this same run — it protects content Victor has studied across runs, which is
untouched by definition on a fresh audit). Preserve every question that is already at bar; only change
what misses it. If the topic is genuinely already at bar, change nothing and record it as PASS.

## Finish

**If `{DRY_RUN}` = false:** commit the two files atomically —
```
git add notes/interview-prep/en/{FILE}.md notes/interview-prep/es/{FILE}.md
```
```
git commit -m "docs: audit {FILE} interview prep — <one-line summary> (reviewed)"
```

**If `{DRY_RUN}` = true:** do not commit. Leave every change in the working tree for Victor to read.

Then report your **verdict**:
- `PASS` (no changes) or `FIXED` (a short bullet list of what you corrected and why — especially any
  question you rewrote for realism/wording or any answer you tightened into Victor's voice).
- The coverage status (✅/🔧/➕), the files touched, and — if committed — the commit hash.
- Carry forward the author's summary blocks (weak answers, coverage gaps, TODO patterns) so Victor sees
  them in the final report.
````
