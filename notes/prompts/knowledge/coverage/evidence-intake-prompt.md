# Evidence Intake Prompt

Use in a **separate conversation** (ideally inside Claude Code, so `search` mode can web-search). Fill
the config block, paste the prompt into a new chat, and — in `paste` mode — paste the offers at the end.

This is the dedicated way to **nourish `notes/prompts/_job-market-evidence.md`** — the real-postings file
that anchors coverage. Feeding it is a first-class action: it does not need the CV machinery. The evidence
is public posting data (no personal information), so it **is** committed to the repo.

> **▶ Run first:** nothing — this is a starting point (it produces evidence others consume).

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

Read before touching anything:
1. `notes/prompts/_job-market-evidence.md` — learn its **exact format** (the `### Company — Role · year ·
   source` Raw-posting blocks, the Synthesis frequencies `~N/M`, the footer count) and what is already on file.
2. `notes/prompts/knowledge/coverage/_coverage-standard.md` — the "Two sources" section: the evidence is
   the **complement** to the deep analysis, a floor to raise, never a ceiling. Keep that framing.
3. `ROADMAP.md` + `notes/prompts/_shared-context.md` — the **target profile**: role, companies, stack,
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
  target stack at target-type companies. Skip senior-only or off-stack postings; note skipped ones in the
  report with a one-line reason. This keeps the evidence anchored to Victor's objectives.
- **Mark quality** on the `Captured:` line: `full posting` for pasted full offers (they outrank extracts),
  `web-search extract` for partial ones pulled from search.
- **Deduplicate.** If a posting with the same company + role + source is already on file, update that block
  rather than adding a duplicate.
- **Quote, do not invent.** Only write requirement text that actually appears in the offer/search result.

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
| Postings added | [company — role — source, one per line] |
| Postings skipped (off-profile) | [company — role — reason, or "none"] |
| Synthesis changes | [requirement — old freq → new freq; new skills added] |
| New "signals to watch" | [list or "none"] |
| Footer count | [old N → new N] |

The evidence file is committed (public data, no personal info). It lives under `notes/prompts/`, so
**commit it directly** (CLAUDE.md's notes/prompts exception — do not hand the commands to Victor),
with the mandatory double check:
1. `git status` — confirm only `notes/prompts/_job-market-evidence.md` is about to be staged.
2. `git add notes/prompts/_job-market-evidence.md`
3. `git status` — confirm nothing else is staged (`git restore --staged` anything that is).
4. `git commit -m "docs: add <N> postings to job-market-evidence — <main stacks/companies>"`

[paste your full job offer(s) below this line — only needed in `paste` mode]
