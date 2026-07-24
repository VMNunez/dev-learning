# Agent runtime standard

This file is the platform boundary for every prompt in `notes/prompts/`. Canonical prompts describe
roles and reasoning tiers using this vocabulary; launchers translate it to the active runtime.

## Role contract

| Canonical role | Responsibility | Independence requirement |
|---|---|---|
| `author` | Create or materially rewrite an artifact | May receive the target, sources, and standard |
| `reviewer` | Challenge an author's result against a standard | Must be cold: do not pass the author's reasoning or verdict |
| `analyst` | Gather facts, evidence, or mappings without authoring the final artifact | Pass evidence, not conclusions framed as instructions |
| `orchestrator` | Resolve configuration, dispatch roles, enforce gates, merge results | Must verify returned evidence before editing or committing |
| `mechanical checker` | Run deterministic counts, parity checks, or formatting checks | Must not make product/content judgments |

One subagent owns one bounded concern. Do not combine author and reviewer in the same context.

## Reasoning tiers

| Canonical tier | Use | Claude Code adapter | Codex adapter |
|---|---|---|---|
| `deep` | Authoring, architecture, adversarial review, nuanced judgment | strongest available model; historically `opus` | inherited frontier model with high reasoning when an override is supported |
| `standard` | Conformance checks, translation, structured extraction | balanced model; historically `sonnet` | inherited model at normal reasoning |
| `mechanical` | Counts, command execution, deterministic formatting | fastest capable model; historically `haiku` | local/orchestrator execution or the lightest available reasoning |

If the runtime cannot select a model or reasoning tier, use its strongest available agent and preserve
the role split. Correct isolation matters more than reproducing a historical model name.

## Dispatch contract

- `sequential`: wait for the prior role because its artifact is the next role's input.
- `parallel`: dispatch only independent targets or concerns. Never parallelize two writers over the
  same file.
- `foreground`: the orchestrator waits and validates the result before continuing.
- `cold`: pass only the target, required sources, relevant standard, and acceptance format.
- Every whole-file assignment inherits the repository rule: count lines first, read to the real EOF,
  and begin the report with `N lines, read to EOF`.
- If a role cannot be dispatched, the orchestrator performs the role locally only when the prompt
  explicitly permits a single-agent fallback; otherwise stop without partial commits.

## Runnable close-out contract

Every runnable entry point ends through its declared `_pipeline-self-report.md` or
`_single-shot-self-report.md`. After configuration and target resolution, an instruction to `stop`
means stop content work, record the failed gate as `blocked`, and execute that close-out; it does not
mean silently abandon the run. Successful dry runs close out as `dry-run`. Only a run that satisfies
its content acceptance gates closes out as `completed`. The report and `_run-tracker.md` update are
execution evidence, not target artifacts, so they are still written and committed for blocked and
dry-run outcomes.

## Runtime mappings

### Claude Code

- Use the Agent/subagent facility available in Claude Code.
- Map `deep`, `standard`, and `mechanical` to the strongest, balanced, and fastest capable models.
- Existing `.claude/commands/` files are launch adapters, not sources of workflow truth.

### Codex

- Use Codex collaboration tools for bounded subagent work.
- `parallel` means dispatching independent agents concurrently; `sequential` means waiting for and
  validating one result before dispatching the next dependent role.
- Do not invent model identifiers. Omit model overrides unless the runtime exposes an applicable
  model/reasoning option.
- Existing `.codex/commands/` files are launch adapters, not sources of workflow truth.

## Authorship and commit boundary

The runtime never changes who owns an artifact:

- Prompt-system machinery and explicitly authorized study documentation may be committed by the
  orchestrator when the canonical prompt permits it.
- Victor's project code and practice answers are never auto-committed.
- A dry run never commits target artifacts.
- Before every authorized commit, inspect status immediately before staging and immediately before
  committing. Stage only the declared outputs.
