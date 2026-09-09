---
description: Decide the next project and record why, as a durable one-page brief (orchestrator, runs inside Codex)
argument-hint: [NUMBER=08] [CANDIDATE=name]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/projects/plan/project-brief-prompt.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- If the user left the configuration empty, that is the normal case: both keys are blank by design and
  the prompt resolves the number from `projects/` itself.
- It writes exactly one file, `projects/briefs/project-brief-{NUMBER}.md`. It never edits `ROADMAP.md`,
  `PROGRESS.md`, or any `PLANNING.md` — the plan registers the choice when it is written.
- The cold second opinion is mandatory, and the prompt owns what its verdict gates and how each case is
  reported. Do not take a gate rule from this launcher.
- Run it before `plan-audit` `MODE = new`, or let that prompt dispatch it as its Phase 0.
