# Project plan review prompt — second-pass auditor for ONE plan

This is the **reviewer half** of the project-plan pipeline. It audits one `PLANNING.md` against the
contract in `_planning-standard.md`, **fixes what falls short directly in the file**, and commits it
(unless dry-run). It serves two callers:

- **`new` mode** — `plan-audit.md` dispatches it as subagent **B** right after the author
  (subagent A) writes a fresh plan. It is the independent second pass: a reviewer with no stake in the
  draft catches what the author, close to their own text, missed. It commits the plan + the ROADMAP.md
  / PROGRESS.md edits the author left staged.
- **`review` mode** — run on an existing plan (one project, or batched across all) to bring it back to
  standard. Same audit, same fixes, same commit.

You can also run it standalone on one finished plan.

---

## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

PROJECT = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker |
           angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal |
           projects/07-timetrack | ... — the folder path of the plan to audit]
DRY_RUN = [false | true]

Use PROJECT and DRY_RUN wherever the prompt refers to {PROJECT} and {DRY_RUN}.

> `PROJECT` is a **folder path**. Angular projects live at `angular/0X-name/PLANNING.md`, full-stack at
> `projects/0X-name/PLANNING.md`. Derive the plan path from it.

---

You are the independent reviewer for one project plan: `{PROJECT}/PLANNING.md`. In `new` mode the
author already believed it was done — do not be generous; assume something is below bar until you have
checked. In `review` mode the plan may be stale or hand-written. Either way: audit hard, fix directly,
then let it through.

Before starting, read:
- `notes/prompts/projects/plan/_planning-standard.md` — **the bar you audit against, in full.** The
  23-section template (what each must contain + what makes it pass), the two project formats, the
  done-condition formats, the HTTP status conventions, the professional implementation order, the
  branch-strategy rules, and the consistency invariants.
- `CLAUDE.md` — conventions, testing rules, project standards.
- `PROGRESS.md` — what has been learned and what phase the project is at.
- `{PROJECT}/PLANNING.md` — the file to audit.

**Apply the right format.** Per the standard's "Two project formats": full-stack (07+) → the full
23-section audit; Angular (01–06) → audit only the sections that project actually has, plus the
universal checks (done-condition format, no vague/TBD rules, internal consistency of present
sections). Never flag full-stack-only sections as missing on an Angular project. Derive the format
from the path prefix and project number — do not ask.

---

## Audit — run every check against the standard

**1. Section coverage.** For a full-stack plan, check all 23 sections (0–22) are present. Report each
as ✅ present or ❌ missing. Missing sections are critical — they block the project from starting
clearly, so **add them** (see "Fix, don't just report").

**2. Quality per section.** For each present section, check it against its "what makes it pass" line in
the standard. The highest-value ones:
- **§0** — if in progress, Current step is real, Done condition specific and valid.
- **§3** — each concept specific, each with a reason.
- **§7** — every field has all five columns; every relationship states fetch type + cascade + reason.
- **§8** — no vague rule, no TBD; state diagram present if there are transitions.
- **§10** — every endpoint complete; status codes match the conventions.
- **§15** — every step has a valid done condition; one major concept per step; the three dedicated
  steps (backend tests, Angular tests, SQL complement) are present.
- **§16** — specific method/service names; edge cases named (not just the happy path).
- **§22** — every branch name follows `feat/short-description`; concrete open/close conditions; the
  branches cover every §15 step with none unassigned or double-assigned; no more than one branch per
  coherent phase.

**3. Done-condition format.** For every done condition in §15 (and §0), mark ✅ valid or ⚠️ vague
against the four formats in the standard. For each ⚠️, rewrite it to a valid format.

**4. Internal consistency.** Run all six invariants from the standard (entities↔repos, API↔controllers,
pages↔wireframes, new-concepts↔steps, testing-plan↔steps, branches↔steps). Fix each mismatch.

---

## Fix, don't just report

Where a check fails, **fix it directly** in `{PROJECT}/PLANNING.md` — you are the last quality pass,
not an advisor that hands back a report to paste. Add missing sections, rewrite vague done conditions,
fill incomplete tables, reconcile inconsistencies. Preserve the author's correct work; only change what
misses the bar. If the plan is genuinely already at bar, change nothing and record it as PASS — do not
rewrite good text to leave a mark.

---

## Finish

**If `{DRY_RUN}` = false:**
- **`new` mode** (the author left ROADMAP.md + PROGRESS.md staged alongside the new plan): commit all
  three atomically. `git add {PROJECT}/PLANNING.md ROADMAP.md PROGRESS.md`, then
  `git commit -m "docs: add PLANNING.md for project 0X [name] — closes [main gap], introduces [key concept] (reviewed)"`.
- **`review` mode** (only the plan changed): commit just the plan. Use the project's real path prefix
  (`angular/` for 01–06, `projects/` for 07+):
  `git add {PROJECT}/PLANNING.md`, then
  `git commit -m "docs: improve PLANNING.md for {PROJECT} — fix done conditions, add missing sections"`.

**If `{DRY_RUN}` = true:** do not commit. Leave every change in the working tree for Victor to review.
Print the atomic commit sequence he should run, one command per code block.

Then report your **verdict** for this plan:
- `PASS` (no changes needed) or `FIXED` (a short bullet list of what you corrected and why).
- The audit summary: X critical (missing sections) · Y quality · Z consistency issues found and fixed.
- The files touched, and — if committed — the commit hash.
