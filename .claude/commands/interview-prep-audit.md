---
description: Build or audit the interview Q&A for a topic (orchestrator, runs inside Claude Code)
argument-hint: LEVEL=junior|middle|senior FILE=<topic>|all SECTION=all MODE=full|correct [DRY_RUN=true|false]
---

Read `notes/prompts/knowledge/interview-prep/interview-prep-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly
  (coverage-bounded level gate → market analysis → adversarial gap-hunt → per-section author →
  per-section reviewer → stable IDs and bilingual selected-level commit).
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- If DRY_RUN was not given, default it to `true`.
