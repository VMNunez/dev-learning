# Breach log — linkedin-prompt

Append-only event sink for `linkedin-prompt.md`, governed by `_pipeline-self-report.md` → "The breach log",
which owns every field and disposition below.

| ID | Date | Target | Breached step | Scope | Evidence | Disposition |
|---|---|---|---|---|---|---|
| BRCH-0001 | 2026-10-03 | global | `linkedin-prompt.md` → `Step 5 — Skills section` | own | Deviation: the step opens "Add the skills from the standard's keyword pool" and then gives three lists, none of which places `JWT`, a Required-pool keyword carrying project markers in source 7; the run added it to the next tier after `REST APIs` and reported it, where a literal reading of the lists leaves a defensible required skill out of the Skills section that "Profile ready when" owes | open |
