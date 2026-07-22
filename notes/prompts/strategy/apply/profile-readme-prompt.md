# Profile README Prompt

Use in a **separate conversation**, ideally inside Claude Code so it can read across both repos.
No configuration needed — paste the whole prompt into a new chat.

> **▶ Run first:** `portfolio-audit` if a project just reached ✅ Ready (its Phase 3 already updates
> this README) — otherwise nothing.

Run this whenever you want the **GitHub profile README** (`dev/portfolio/VMNunez`) reviewed, refreshed,
or optimized for the job target — without re-explaining the context each time. Claude is the one
responsible for keeping that README current and optimized; this prompt is the repeatable entry point
for that job, so you never have to re-brief it from scratch.

Two modes:
- **`sync`** — refresh facts only: pull in anything new from `PROGRESS.md` / a project that just passed
  `portfolio-audit` / a corrected fact, without rethinking the framing
- **`optimize`** — a full review pass: re-evaluate whether the README is actually optimized for the
  current job target, apply the pending polish list, and flag anything new

---

```
## Configuration — edit only this block

MODE = [sync | optimize]
```

---

## Before starting

1. Read `dev/portfolio/VMNunez/CLAUDE.md` first — it is the **standing context** for this repo: who
   maintains it, the source-of-truth hierarchy, the voice/defensibility rules, and the running list of
   known gaps. This prompt does not repeat that file; it only adds the flow on top.
2. Read `dev/portfolio/VMNunez/README.md` — the current state.
3. Read the sources that file's CLAUDE.md points to (`PROGRESS.md`, the active project's `PLANNING.md`
   Section 0, `personal/job-search/internship-daw.md`, `notes/cv/cv-bullets.md` if it exists,
   `notes/prompts/_internal/_shared-context.md`).

---

## MODE = sync

Fast pass — only pull in what changed, don't re-architect the page:

1. Diff the current README against the sources above. Look specifically for:
   - A project whose status changed (e.g. moved from in-progress to a ✅ Ready `portfolio-audit` verdict
     — see that prompt's Phase 3 rule for how it hands off here).
   - A fact that drifted (dates, stack, project links).
2. Apply only the deltas. Do not touch sections that are still accurate.
3. Update the "Known gaps" list in `CLAUDE.md` if anything was resolved or newly discovered.

## MODE = optimize

Full pass — re-evaluate the whole README against the job target (junior/junior-mid Angular + Java at
Spanish consultancies):

1. Work through the **"Known gaps — pending polish"** list in `CLAUDE.md` first — these were already
   identified as real gaps; apply the fixes unless something has since changed.
2. Beyond that list, actively look for:
   - Is the headline using the keywords a recruiter/ATS actually searches for?
   - Does the page give a next step (contact/LinkedIn/location) or does it dead-end?
   - Is there anything stated that Víctor could not defend line-by-line in a technical interview?
   - Is the flagship project framed so the weight falls on what's already built, not on what's left?
   - Any visual gap (screenshots/GIFs) worth flagging, even if you can't produce the asset yourself?
3. Present findings as a short, ranked list (High / Medium / Low) **before editing** — same bar as a
   code review, not a rewrite-everything pass. Apply the ones Víctor confirms; note the rest back into
   `CLAUDE.md`'s gap list if deferred.
4. Update `CLAUDE.md`'s "Known gaps" section to reflect what's resolved and what's still open, so the
   next run starts from an accurate list instead of re-discovering the same gaps.

---

## After generating

- Edit `dev/portfolio/VMNunez/README.md` (and `CLAUDE.md`'s gap list) directly — Víctor does not want to
  paste blocks by hand.
- **Never commit or push `dev/portfolio/VMNunez`** — it is a separate repo from `learning`. Print the
  commit + push commands to run **from that repo**, with a commit message you give him, one command per
  code block.
- If this project run originated from a `portfolio-audit` ✅ Ready verdict, say so explicitly in the
  summary, so Víctor can tie the two together.

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/strategy/apply/_internal/_last-run-report-profile-readme.md`, its own commit, then the refinement step.

> **Run-start check (step 0):** that file's Step 5 — before anything else, read
> `notes/prompts/strategy/apply/_internal/_last-run-report-profile-readme.md` and surface its Verdict in one line if `Status` is `open`.

