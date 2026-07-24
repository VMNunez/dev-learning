---
description: Feed real Spanish junior job postings into _job-market-evidence.md (runs inside Codex)
argument-hint: MODE=paste|search  (paste: append full postings you provide · search: web-search a batch)
---

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching roles; use its Codex mapping and do not invent model identifiers.

Read `notes/prompts/knowledge/coverage/evidence-intake-prompt.md` and execute it in full, running inside Codex.

Configuration from the user: $ARGUMENTS

Rules:
- The prompt's own config block and instructions are authoritative — execute them exactly (append Raw-posting blocks, re-tally the Synthesis, commit).
- In `paste` mode, if the user did not include the posting text, ask them to paste the full "Requisitos" blocks before continuing.
