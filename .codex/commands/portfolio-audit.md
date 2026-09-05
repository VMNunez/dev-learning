---
description: Final go/no-go portfolio gate for a project — question bank + CV bullet (orchestrator, runs inside Codex)
argument-hint: PROJECT_PATH=<path>|all [PORTFOLIO_SCOPE=full|backend|frontend|global] [DRY_RUN=true|false]
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/projects/portfolio/portfolio-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (author + cold reviewer build the project-specific question bank in `en/`, then one translator per project renders its `es/` twin; the orchestrator computes the verdict and, if not ❌, writes the CV bullet — unless that section is frozen with [refined], which it reports and leaves — plus the GitHub description).
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- If DRY_RUN was not given, default it to `true`.
- If PORTFOLIO_SCOPE was not given, default it to `full`.
