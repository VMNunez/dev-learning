# Evidence Intake Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Use in a **separate conversation** (ideally inside the supported agent runtime, so `search` mode can web-search). Fill
the config block, paste the prompt into a new chat, and — in `paste` mode — paste the offers at the end.

This is the dedicated way to **nourish `notes/prompts/_internal/_job-market-evidence.md`** — the real-postings file
that anchors coverage. Feeding it is a first-class action: it does not need the CV machinery. The evidence
is public posting data (no personal information), so it **is** committed to the repo.

> **▶ Run first:** nothing — this is a starting point (it produces evidence others consume).

> **Run-start check (step 0):** read `_internal/_last-run-report-evidence-intake.md`. If it does not
> exist, say "first run of this prompt" in one line and continue. If its `Status` is `open`, print one
> line naming the finding — then leave it alone; do not apply it in this run.

> Why this matters: `_job-market-evidence.md` feeds `coverage-prompt` / `coverage-audit` as the
> **complement** to the deep market analysis (see `_coverage-standard.md`, "Two sources"). More real
> postings = a sharper frequency signal and better wording, which keeps coverage matched to the market.

---

```
## Configuration — edit only this block

MODE  = [paste | search]
FOCUS = [optional, search mode only — leave BLANK for the normal run. Narrow the search to a company,
         a city, or a sub-stack (e.g. "Capgemini", "Madrid", "Angular testing"). Blank = your full job
         target, which is the default and the simplest way to run it.]

## paste  — you paste one or more full job offers at the very end of this chat; the prompt adds them.
##          Full pasted offers outrank web-search extracts — marked as "full posting".
## search — NO topic needed. It defaults to YOUR job target (junior Angular + Spring Boot at Spanish
##          consultancies, read from ROADMAP + _shared-context) and web-searches current matching
##          postings. FOCUS only narrows it; leave FOCUS blank for the standard run.
```

---

## Step 0 — Read the current state

> **Branch guard:** run `git branch --show-current`. The evidence file commits on whatever branch is
> currently active — a feature branch is the normal case. If you are on **`main`**, stop and ask
> Victor which branch to use — `main` never receives direct commits, only merges via PR.

Read before touching anything:
1. `notes/prompts/_internal/_job-market-evidence.md` — learn its **exact format** (the `### Company — Role · year ·
   source` Raw-posting blocks, the Synthesis frequencies `~N/M`, the footer count) and what is already on file.
2. `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` — the "Two sources" section: the evidence is
   the **complement** to the deep analysis, a floor to raise, never a ceiling. Keep that framing.
3. `ROADMAP.md` + `notes/prompts/_internal/_shared-context.md` — the **target profile**: role, companies, stack,
   seniority. Only postings that fit this profile belong in the file (see the filter in Step 2).

Today's date is in the session context — use its month/year for the footer and for dating searched postings.

---

## Step 1 — Gather the postings

**MODE = paste:** read the offer(s) pasted at the very end of this chat. Each should include the real
"Requisitos" / responsibilities text. Treat them as **full postings** (higher quality than extracts).

**MODE = search:** you need to pass **nothing** — the search is defined by Victor's job target read in
Step 0 (junior Angular + Spring Boot at the target Spanish consultancies). Run a **live web search** for
current Spanish **junior** postings on that stack — the target companies plus Tecnoempleo / InfoJobs /
LinkedIn España / careers pages. If `FOCUS` is set, narrow to it (a company, city, or sub-stack); if it
is blank, use the full target profile. Collect the real requirement text from each result and record its
source URL. Individual postings expire fast (410 Gone); quote what you can actually read now. If web
search is unavailable, say so and stop — do not invent postings.

---

## Step 2 — Add each posting to Raw postings

For every gathered posting, in the file's format, under `## Raw postings`:

```
### <Company> — <Role> · <source>
Captured: <yyyy-mm> · <full posting | web-search extract>
Requisitos: <real requirement text — stack, DB, testing, methodology, English, seniority>.
```

Rules:
- **Stamp the capture date.** `Captured: <yyyy-mm>` = the current month (from the session context). This
  is what makes the file **trend-readable** — a later reader can compare how requirements shift over time.
- **Filter to the target profile.** Only add junior (or "recién titulado / prácticas") postings on the
  target stack at target-type companies to `## Raw postings`. This keeps the evidence anchored to
  Victor's objectives. Off-stack postings are dropped entirely (note them in the report with a one-line
  reason). Mid/senior postings on the target stack are **not dropped** — they go to `## Techo`, see below.
- **Seniority not declared?** If a posting states no years and no senior gate (e.g. "Nivel: Empleado/a"),
  it may go in `## Raw postings`, but its block must open with a line saying seniority is undeclared —
  never let it read as stronger junior evidence than it is.
- **Mark quality** on the `Captured:` line: `full posting` for pasted full offers (they outrank extracts),
  `web-search extract` for partial ones pulled from search.
- **Deduplicate.** If a posting with the same company + role + source is already on file, update that block
  rather than adding a duplicate.
- **Quote, do not invent.** Only write requirement text that actually appears in the offer/search result.

---

## Step 2b — Mid/senior postings on the target stack → `## Techo`

A posting that is **on Victor's stack but above his level** (3+ años, or an explicit senior gate) is not
waste: it shows **where the bar is heading**, which informs `coverage-middle.md` and
`coverage-senior.md`. Add it to `## Techo` instead of `## Raw postings`, with the
required years on the `Captured:` line.

The separation is the whole point — keep it strict:
- `## Techo` postings **never** enter the Synthesis denominator and **never** raise a frequency. The
  Synthesis counts `## Raw postings` only.
- They never justify adding a junior item. They may corroborate middle or senior placement when the
  responsibility level matches; a single posting is still not sufficient evidence by itself.
- After adding a posting, update the "Qué señala este techo" bullets at the end of the section, and route
  each signal to its topic and proposed level (`coverage-middle.md` or `coverage-senior.md`).

If a posting is off-stack entirely (not Java/Spring/Angular), drop it — it goes in neither section, only
in the report's skipped line.

---

## Step 3 — Re-synthesize the recurring requirements

Update the `## Synthesis` section so it reflects the new total:
- Increment "postings on file" by the number of postings actually added.
- **Re-tally each recurring requirement's frequency** (e.g. `~6/8` → `~7/9`) including the new postings.
- Add any skill that now recurs across several postings but was not listed.
- Respect the honesty rule: a skill appearing only in a single senior-ish posting is a **"signal to watch"**,
  not a junior floor — put it in the "Signals to watch" list, not in the recurring-requirements floor.

---

## Step 4 — Update the footer

Rewrite the footer line: `_Last updated: <yyyy-mm>  ·  postings on file: <new N>_`.

---

## Step 5 — Report and commit

Print a short summary:

| | Detail |
|--|--------|
| Postings added (junior → Raw postings) | [company — role — source, one per line] |
| Postings added to `## Techo` (mid/senior) | [company — role — years required, or "none"] |
| Postings dropped (off-stack) | [company — role — reason, or "none"] |
| later-level signals from `## Techo` | [signal → target topic + middle/senior level, or "none"] |
| Synthesis changes | [requirement — old freq → new freq; new skills added] |
| New "signals to watch" | [list or "none"] |
| Footer count | [old N → new N] |

The evidence file is committed (public data, no personal info). It lives under `notes/prompts/`, so
**commit it directly** (the shared session rules' notes/prompts exception — do not hand the commands to Victor),
with the mandatory double check:
1. `git status` — confirm only `notes/prompts/_internal/_job-market-evidence.md` is about to be staged.
2. `git add notes/prompts/_internal/_job-market-evidence.md`
3. `git status` — confirm nothing else is staged (`git restore --staged` anything that is).
4. `git commit -m "docs: add <N> postings to job-market-evidence — <main stacks/companies>"`

Then update this prompt's row in `notes/prompts/_internal/_run-tracker.md` (the "Global prompts" table)
with today's date and commit that file on its own (`docs: run tracker — evidence-intake run`).

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs, the three bullets written to
`notes/prompts/knowledge/coverage/_internal/_last-run-report-evidence-intake.md`, its own commit, then
the refinement step behind a cold reviewer.

This prompt was once the only runnable entry point without a self-report, on the reasoning that the tracker row
already recorded that it ran. That records *that* it ran, never *how* — and it writes
`_job-market-evidence.md`, the root three other prompts anchor their market analysis to, so a silent
defect here propagates into coverage and the interview Q&A with nothing downstream able to see it.

[paste your full job offer(s) below this line — only needed in `paste` mode]
