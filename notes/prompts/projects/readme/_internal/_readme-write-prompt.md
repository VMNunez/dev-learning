# README write prompt — the AUTHOR component (one README)

**Internal component.** This is the **author** in the readme pipeline. You normally don't launch it —
`readme-audit.md` dispatches it as a cold subagent, one per README, then hands the result to
`_readme-review-prompt.md` (the reviewer). It is documented here so the orchestrator can point a subagent
at it; you can also run it standalone to fix one README.

**What it does.** Writes and fixes **one** README (the `TARGET`) to the contract in `_readme-standard.md`
— it reads only that target's rules, so its whole attention budget stays on one audience. It edits the
file directly and does **not** commit (the reviewer runs next; the orchestrator commits at the end).

**Why one README at a time.** The rule set is long and each README serves a different audience (recruiter
vs backend interviewer vs Angular interviewer). Writing all three in one pass is exactly where the rules
for the last one slip — so each README gets its own focused author.

---

## Configuration — edit only this block

PROJECT_PATH = [projects/06-hr-portal | projects/07-timetrack | ...]
TARGET       = [global | backend | frontend]

Use PROJECT_PATH and TARGET wherever the prompt refers to {PROJECT_PATH} and {TARGET}. `backend` and
`frontend` exist only for full-stack projects; Angular projects have only `global`. Derive the project
type from the path prefix.

---

You write **one** README: the `{TARGET}` one for `{PROJECT_PATH}`. **Do NOT commit** — leave your edits
in the working tree; the reviewer runs next and the **orchestrator** makes the project's single commit at
the end: `_readme-standard.md` → "Summary + commit rule" owns who commits and at what granularity.

Before starting, read:
- `notes/prompts/projects/readme/_internal/_readme-standard.md` — the bar. Focus on the **universal rules** and
  the section for your `{TARGET}` (Global README rules — with the full-stack additions if the project is
  full-stack; or the Backend / Frontend README rules). This is what you write against.
- `{PROJECT_PATH}/PLANNING.md` — extract the app concept, learning objectives, and key patterns; the
  README must reflect what was actually built.
- The existing target README (`{PROJECT_PATH}/README.md` for `global`, `.../backend/README.md` for
  `backend`, `.../frontend/README.md` for `frontend`) — if it exists.

Do **not** re-read `notes/prompts/_internal/_session-rules.md` — it is already injected into your context automatically; Victor's
profile and the market live in `notes/prompts/_internal/_shared-context.md` if a section genuinely needs them.

**Scoped code reading.** When a section must be checked against the real code (API endpoints, tests,
security measures, folder structure), read **only the files that section needs** — e.g. the
`controller/` package for the endpoint table, the `test/` tree for the Tests section, `ls` output for
folder trees. Never sweep the whole project; your attention budget belongs to the README, not the repo.

## Step 1 — Scan for in-progress markers
Run the standard's in-progress-marker scan on this README: resolve completed markers, leave one clean
placeholder per genuinely-unbuilt section, remove any "updated after each step" working note.

## Step 2 — Fix every section to the standard
Check this README's sections against the standard's rules for your `{TARGET}`, in the required order.
- Add every missing section; fix every present-but-wrong one **directly** in the file.
- Move any out-of-order section to its correct position.
- Apply the **quality filter** (recruiter + interviewer lens) to each section — cut or rewrite noise.
- Do **not** rewrite sections that are already correct — only touch what misses the bar.
- **`What I learned` is the exception to the line above**, because its defect is invisible section by
  section: every bullet can be well formed while the section as a whole restates Architecture decisions.
  Run rule 9's **placement**, **behaviour** and **one-bullet-per-concept** tests here, after Architecture
  decisions and Tradeoffs are final, and cut what they cut. Without this the author adds on every pass
  what the reviewer then removes.
- For visual sections (`global` only), output the **Visual brief** and add placeholders as the standard
  specifies — never skip silently.

## Output — report (no commit)
Do not commit. Report, in **at most 15 lines** (the orchestrator collects many of these — keep it
tight; the detail lives in the file itself):
- The README you worked on (`{TARGET}`) and whether it existed or was created.
- A **summary of changes** — one line per section changed: `[Section] — what was wrong → what was fixed`.
  If more sections changed than fit the budget, group minor ones into a single line.
- Any section left as a placeholder (genuinely not built yet), so the reviewer knows it is intentional.
