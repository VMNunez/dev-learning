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
  explicitly permits a single-agent fallback; otherwise stop without partial commits. **A launch
  failure, a runtime error and a session limit that kills a role mid-flight are the same case**: read
  whatever the role persisted, else resume it where the runtime allows, else re-dispatch it once — a
  prompt's own retry rule overrides that count — and only one that still returns no usable result is a
  role that could not be dispatched. Silence is never acceptance.
- **A role that *returns* blocked after editing the tree is the other half of that case, and it is not
  the same half.** A dead role is handled above. A role that came back and said it could not finish has
  already written bytes into the target, and where the orchestrator's commit stages that target
  **wholesale** — one file, one pair, one bank — those bytes ride into a commit that reports the work as
  done. So a component that writes into a shared target declares, in its return, that it is `BLOCKED`
  and **what it already changed**; and the orchestrator disposes of that explicitly rather than only
  skipping the next role. The two dispositions are: **restore** the affected span from the run's recorded
  baseline when one is available — never the whole file, which holds work other roles finished this run —
  or **leave it and declare it** in the commit message and the report when it is not. A partial write is
  never left to ride in silently, and a target still holding bytes nobody finished never receives the
  freshness marker its consumers gate on — a fingerprint, a `complete` status — nor a `completed`
  outcome, which the close-out contract below already governs. Each prompt owns what its baseline, its
  span and its freshness marker are; this bullet owns that the branch must exist.
  **What separates this from the bullet above, which forbids the partial commit outright:** there, the
  extent of the partial write is *unknown* — nothing came back to declare it, so nothing can label it
  and no reader could tell the finished work from the abandoned. Here it is declared, bounded and named
  in the commit itself. The rule is not "labelling makes a partial commit acceptable"; it is that an
  undeclared partial write may not be committed at all.
- **A `reviewer` is dispatched with a scratch path, writes each finding there as it reaches it, and
  writes its verdict there before returning** — never holding its judgement in context to the end; the
  orchestrator reads that path when the reviewer dies. A persisted file is the verdict only if it
  carries the `N lines, read to EOF` proof and one of the three verdict tokens; anything else is a
  partial return and takes the ladder above, never an approval. On a final review gate this is the one
  dispatch failure that destroys work already done: it runs once, and nothing downstream recovers it.

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
- A runtime scratch write outside the repository is not a repository write and crosses no authorship or
  commit boundary.
- A dry run never commits target artifacts.
- Before every authorized commit, inspect status immediately before staging and immediately before
  committing. Stage only the declared outputs.
