# Breach log — evidence-intake-prompt

Append-only event sink for `evidence-intake-prompt.md`, governed by `_pipeline-self-report.md` → "The breach log",
which owns every field and disposition below.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-14 | `search` · FOCUS blank | `evidence-intake-prompt.md` → `Configuration — edit only this block` | own | Deviation: `MODE` arrived blank with no posting text and the block gives it no default or blank-value rule; the run resolved it to `search` without asking — had Victor meant `paste`, the whole batch would have been the wrong input | open |
| BRCH-0002 | 2026-10-14 | `search` · FOCUS blank | `evidence-intake-prompt.md` → `Step 2 — Add each posting to Raw postings` | own | Deviation: silent on (a) an offer page read whole by fetch in `search` mode — labelled `web-search extract` with a note, `full posting` being defined as pasted — and (b) two identical-text vacancies under different titles at one company (Merkle, SlashMobility), folded into one block counted once; the dedup rule covers only same company + role + source, so a run choosing otherwise shifts the Synthesis | open |
