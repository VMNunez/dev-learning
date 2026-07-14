---
description: Build or audit the interview Q&A for a topic (orchestrator, runs inside Claude Code)
argument-hint: TOPIC=<topic>|all [DRY_RUN=true|false]
---

Read `notes/prompts/knowledge/interview-prep/interview-prep-audit.md` and execute it in full as the hands-off orchestrator it describes, running inside Claude Code.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (market-analysis → author → gap-hunt → reviewer cold subagents per topic, bilingual en/es, atomic commit per topic).
- If the configuration is empty or incomplete, ask for the missing config-block values before launching any subagent.
- If DRY_RUN was not given, default it to `true`.
