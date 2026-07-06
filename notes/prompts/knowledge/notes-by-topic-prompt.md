# Notes by Topic Prompt — RETIRED (split in two)

This monolithic prompt tried to do too much in one conversation: on a whole folder it combined
folder setup, `en`/`es` sync, coverage gap analysis, TODO resolution, quality auditing, and the full
writing standard applied to every section of every file. That overloaded the model's attention — the
heaviest work (the writing standard) was the first thing to slip, and parts of the audit got skipped.

It has been **split by kind of work** into a small pipeline:

| Use | Prompt |
|-----|--------|
| Survey a whole topic folder → produce an ordered worklist (no prose written) | **`notes-plan-prompt.md`** |
| Deep, high-standard work on **one** file (resolve TODOs, complete it, mirror to `es/`) | **`notes-write-prompt.md`** |
| The shared writing standard both read (format modes, rule 3, signature elements, etc.) | **`_note-quality-standard.md`** |

**How to run:** `notes-plan-prompt.md` once on the folder, then `notes-write-prompt.md` once per file
from the worklist — one file per conversation, which is what keeps the standard fully applied.

For a combined notes + interview-prep audit, use `notes-and-interview-prep-prompt.md`.
