# Interview-prep review prompt — second-pass auditor (one section under the orchestrator; one topic standalone)

This is the **reviewer half** of a two-subagent build: the write prompt authors a topic's Q&A, then
this prompt audits and fixes it before it is committed. It exists because, under the orchestrator, the
Q&A is committed unread — a fresh reviewer with no stake in the draft catches the questions the author,
close to their own work, waved through. Run it on **one topic**, right after the write prompt produced it.

It is normally launched by `interview-prep-audit.md` as subagent **B**, once per section (the write
prompt is subagent A). You can also run it standalone to audit a single topic's finished Q&A.

---

**How to use:**

1. Fill in `LEVEL`, `FILE` (the topic filename without extension), and `SECTION`.
2. Fill in `MODE` — the **same** value the author ran under (`full` or `correct`).
3. Fill in `DRY_RUN` — `false` (fix, then commit) or `true` (fix only).
4. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

LEVEL   = [junior | middle | senior]
FILE    = [angular | css | javascript | typescript | sql | java | spring | spring-boot | architecture | git | general | security]
SECTION = [all | ## Routing | ## Forms | ...]   ← must match the author's run
MODE    = [full | correct]                      ← must match the author's run
DRY_RUN = [false | true]

Use LEVEL, FILE, SECTION, MODE, and DRY_RUN wherever the prompt refers to their placeholders.

---

You are the independent reviewer for one just-authored topic of Victor's interview prep:
`notes/interview-prep/{LEVEL}/en/{FILE}.md` and its selected-level `es/{FILE}.md` twin. You did not write them. Your job is to
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
- notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md — the bar you audit against, in full.
- notes/prompts/_internal/_shared-context.md — Victor's profile, projects, and the Spanish job market 2026 (you
  judge "realistic" and "in Victor's voice" against this).
- Both `en/{FILE}.md` and `es/{FILE}.md`, scoped to `{SECTION}` (or the whole file if `all`).
- When a code block's citation looks doubtful, open the cited project file (paths in "Sourcing real
  code" of the write prompt) to confirm the snippet is real — a spot-check, not a full source read.

## Mode — what you may fix

Check `{MODE}` first. It decides **what you fix and what you only report** — never how hard you look:
run every checklist point and trace every question in both modes, because a defect you may not fix is
still a defect you must name.

- **`full`** — the complete pass. Fix everything below, inside the lifecycle scope in "Fix, don't just
  report".
- **`correct`** — Victor has just written or edited this section himself and asked for it to be
  **corrected, not rewritten**. The author ran under the same mode and its Step 6.2 handed you weak
  answers as a *report* precisely so that nobody rewrites them; a reviewer that rewrites them behind it
  produces exactly the `full`-mode diff the mode was chosen to avoid.

| Check | `full` | `correct` |
|---|---|---|
| Priority markers · format · type **classification** · stable identity · bilingual integrity | fix | **fix** — these are the author's Steps 1, 4 and 5, which run in both modes |
| Realistic question · well-worded · Victor's voice · every word defensible | fix | **report** — this is the standard's answer quality bar, which is what the author's 6.2 withholds |
| The type **ratio** and the ≥1 Decision-based floor · a warranted code block that is missing | fix | **report** — closing either needs a question added or rewritten, and `correct` adds none |
| A **false** citation or project anchor — code or a claim the named source does not contain | fix | **fix** — the one thing corrected in both modes. It is a falsehood, not a weakness, and the standard ranks an invented anchor as *worse than none*; `correct` narrows rewriting for quality, never the truthfulness of a claim about Victor's own code |

**The one carve-out on the quality-bar row is Victor's own TODO**, and it is the author's rule taken
verbatim — 6.2 is "report only, **never rewrite without a TODO**". A weak answer he has marked is a
rewrite he asked for, and TODO resolution runs in both modes; anything unmarked is reported and left
exactly as he wrote it.

## Audit checklist — run every point on every question in scope

This is the highest-value pass. Most misses are in the first three checks — they are what makes the
file worth studying:

- **Realistic question** — an interviewer at NTT Data / Capgemini / Indra would actually ask this of a
  candidate at `{LEVEL}` for this stack. Not trivia, not another level's question, and not a phrasing
  no human uses. If it is unrealistic at the selected level, rewrite it into the real question or cut it.
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
- **Stable identity** — every question has one valid selected-level topic ID, identical in both
  languages and not reused anywhere in the bank.
- **Format** — blank line between question and answer; the level-appropriate tip on every Conceptual question; Red flag
  on Decision-based/Pressure where warranted.
- **Real code where warranted** — every question an interviewer would pose with code (Pressure
  snippets, "how do you write/configure X?", tight confusable-pair contrasts) carries a code block that
  is **real and cited to a project file** (`// projects/07-timetrack · …`), minimal (3–10 lines), and
  actually supports the answer. Fix invented code (replace with a real fragment from the project source,
  or mark it `// illustrative — not from a project`), and add a snippet where one is clearly missing.
  Same code in `en/` and `es/`.
- **Project anchor real** — when an answer names a project and a concrete use ("I used it in project 06
  to add the JWT header…"), spot-check that the named project actually contains that usage — same
  criterion as code citations, and worse when it fails: an invented anecdote about Victor's own code is
  exactly what an interviewer's follow-up exposes. Fix a false anchor by pointing it at where the
  pattern really lives (or dropping the anchor), never by leaving it plausible-but-unverified.
- **Bilingual integrity** — `en/` and `es/` have the same sections, same questions, same order; `es/`
  reads as native Spanish, not a calque; the Junior-tip label is `Consejo de entrevista:`. **The test
  runs in both directions**, because repair does (standard → *The bilingual en/es contract*): where a
  TODO was resolved in `es/`, the `en/` twin is a re-translation, so read it as English — an answer
  that reads as a back-translation of Spanish (Spanish word order, calqued connectors, an idiom carried
  across intact) fails this check exactly as a calqued `es/` does.

## The adversary gap list (who gets it)

Under the orchestrator, the market/gap slice (M questions + G gaps) is handed to the **author**, not to
you — your acceptance is checked afterwards by the orchestrator against that slice, so your
question-by-question trace must be complete enough to confirm each slice item is covered. In
`MODE = correct` there is no **market/gap** slice: the orchestrator skips both discovery stages because
that mode adds no questions, so a gap list pasted alongside `correct` is a configuration conflict — add
nothing, and name the conflict in your verdict. The slice is not empty, though — the orchestrator still
routes its en/es sync mismatches into it in both modes, and those are yours to fix. If you are
run **standalone** in `MODE = full` and a gap list is pasted into your prompt, then add every genuine gap yourself to
the correct section of both `en/` and `es/`, in the standard's full format (bold question + marker +
blank line + answer in Victor's voice + level-appropriate tip / Red flag / real cited code as the type warrants),
skipping — and noting — any gap truly outside `{LEVEL}` scope. Then run the audit below over everything in
scope, including any questions you just added.

## Fix, don't just report

Where a check fails, **fix it directly** in both `{FILE}` files — you are the last quality pass, not an
advisor. Your freedom to rewrite is bounded twice over, and the two bounds are independent: `{MODE}`
above decides **which checks** you may act on, and the lifecycle below decides **which questions**. A
check the mode makes report-only is reported even on an unrefined question; a `[refined]` question is
reported even on a check the mode lets you fix. Taking the lifecycle bound as the only one is how a
`correct` run comes to rewrite the answers it was told to leave alone.

On the lifecycle: any question carrying `[refined]`
in either file is frozen byte-for-byte, whether or not it also carries `[studied]`. Mirror a missing
state marker only; otherwise **report** anything below bar and do not edit that block. **A `TODO:`
Victor wrote inside a refined block is not a defect you report — it is his reopening** (standard →
*Question identity and lifecycle*), and the author's 6.2 carve-out above already treats a marked
answer as a rewrite he asked for: both state markers come off both languages, the repair runs on the
side carrying the marker, and the twin is re-translated from it. Every unrefined
question is fair game: rewording an unrealistic question, tightening an answer into Victor's voice,
assigning its stable ID and reclassifying a type are all your job. Never assign `[refined]` or
`[studied]`; only Victor and the study closing ritual own those transitions. Preserve every question that is already at bar; only
change what misses it. If the topic is genuinely already at bar, change nothing and record it as PASS.

## Finish

**If `{DRY_RUN}` = false:** commit the two files atomically —
```
git add notes/interview-prep/{LEVEL}/en/{FILE}.md notes/interview-prep/{LEVEL}/es/{FILE}.md
```
```
git commit -m "docs: audit {FILE} interview prep — <one-line summary> (reviewed)"
```

**If `{DRY_RUN}` = true:** do not commit. Leave every change in the working tree for Victor to read.

**If you cannot finish the section**, stop and open your report with `BLOCKED — <reason>`, then state
which of the two files you already edited, which headings, and whether any edit is one-sided across
`en/` and `es/`. You fix directly in the tree, so a review abandoned halfway leaves the section in a
state no one authored; the orchestrator restores or declares it from this line, and cannot from a
missing one. A partial audit is reported as **nothing but `BLOCKED`** — not `PASS`, not
`PASS (with findings)`, not `FIXED`; the enumeration is closed on purpose, so a later verdict token
cannot slip through it. **And it never commits — including
on a standalone `DRY_RUN = false` run**, where the commit above is yours to make: committing a
half-audited pair under a message that says it was reviewed is exactly the silent partial write this
return exists to prevent. Leave the bytes, name them, and let Victor read the diff.

Then report your **verdict**:
- `PASS` (no changes) or `FIXED` (a short bullet list of what you corrected and why — especially any
  question you rewrote for realism/wording or any answer you tightened into Victor's voice). A section
  you changed nothing in **but filed report-only findings against** is `PASS (with findings)`, never a
  bare `PASS`, which claims the section is at bar.
- The coverage status (✅/🔧/➕), the files touched, and — if committed — the commit hash.
- **Your own report-only findings**, each with the check it failed and what a passing version would
  need. In `MODE = correct` this is most of your output and it is the run's product, not a footnote:
  the mode exists so Victor decides which of these become rewrites, next run, by marking them with a TODO.
- Carry forward the author's summary blocks (weak answers, coverage gaps, TODO patterns) so Victor sees
  them in the final report — merged with the block above into one weak-answer list, each line saying
  whether the author or you found it.
````
