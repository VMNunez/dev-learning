# Notes by Topic Prompt — RETIRED (replaced by notes-audit)

This monolithic prompt tried to do too much in one conversation: on a whole folder it combined folder
setup, `en`/`es` sync, coverage gap analysis, TODO resolution, quality auditing, and the full writing
standard applied to every section of every file. That overloaded the model's attention — the heaviest
work (the writing standard) was the first thing to slip, and parts of the audit got skipped.

It was replaced by a single hands-off entry point that dispatches cold subagents:

**→ Use `notes-audit.md`.** Run it inside Claude Code with `SCOPE = folder` (a whole topic) or
`SCOPE = file` (one file). Per file it runs an **author** subagent then an independent **reviewer**
subagent, and commits atomically — no worklist approval, no per-file launching.

Internal pieces it orchestrates (you never launch these directly): `_note-quality-standard.md`
(the writing standard), `notes-plan-prompt.md` (folder analysis), `notes-write-prompt.md` (author),
`notes-review-prompt.md` (reviewer).

For a combined notes + interview-prep audit, use `notes-and-interview-prep-prompt.md`.
