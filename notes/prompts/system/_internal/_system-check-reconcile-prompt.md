# System-check reconciliation — one bounded map concern

**Internal component. Not runnable.** `system/system-check-prompt.md` Step 4 dispatches one cold
`analyst`, tier `standard`, per concern with this file as its mandate. A dispatch is exactly one of two
kinds: `DIRECTION = claim` rules one contiguous span of one map against the accepted manifests;
`DIRECTION = evidence` rules one manifest concern's facts against both maps. Neither authors, edits or
commits anything — every return is cited evidence the orchestrator merges and the cold final reviewer
re-gates.

**Why the ruling is divided, and what the division must never become.** Two consecutive admitted runs
(2026-08-12, 2026-08-13) closed the 168-file manifest gate and then failed to disposition 1,959 claim rows
against 4,988 manifest facts in one orchestrator context — `REC-109`. What is divided is the **ruling**;
the **source** is never divided. No agent extracts, summarises or paraphrases a map for another agent to
rule on: that was `REC-079`'s deleted `2C`, whose 434-line extraction of 1,101 map lines could omit a claim
in a way nothing downstream could see. You read the map file itself and the accepted manifests themselves,
and what you return is checked against the physical-line denominator of your own span — the completeness
property an extraction can never have.

## Boundary

- **Machinery only** — `system-check-prompt.md`'s `Boundaries` owns this fence and this is its dispatch
  copy, carried here because a cold concern will not follow a pointer. Do not open the active project's
  `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md`, SQL doctrine or routes, coverage or notes-plan
  state, practice trackers, simulation specs, application/job-search state, or their debt counts — not
  even for orientation, and not even when a source prompt names one as its own input or output. A path
  pattern, schema, ownership rule or gate **declared** by a prompt or skill is in scope as machinery; the
  live artifact governed by it is not.
- **You edit nothing** — not the maps, not a prompt, skill, standard, launcher or report. You propose
  wording; the orchestrator applies only what the final reviewer approves.
- **The machinery wins.** A disagreement between a map and its source is the map's bug. Never propose
  correcting a source to make a map look right.
- **Whole-file reads are declared.** Count lines first, read to the real EOF, and open your return with
  one `N lines, read to EOF` line per file you read whole. The Read tool truncates past 2000 lines in
  silence.

## Received input

Both directions receive `MANIFEST_DIR` (the Step 3 accepted manifests, one file per concern), `OUT` (your
own scratch return path), and this boundary repeated in the payload. Then:

- `DIRECTION = claim` — `MAP` (one of the two map paths), `SPAN` (first and last physical line of your
  concern, inclusive), and that map's total physical-line count.
- `DIRECTION = evidence` — `MANIFEST` (exactly one accepted concern manifest), `CLAIM_LEDGER_DIR` (every
  accepted `DIRECTION = claim` return), and both map paths.

## `DIRECTION = claim` — claim → evidence

1. Count the map's lines, read the **whole map** to EOF, and declare it. The whole read is mandatory and
   costs little — each map is under 800 lines — but you **rule only inside `SPAN`**. A claim about a line
   outside it belongs to another concern: report it as `out of span` and never disposition it. (The budget
   this protects is the *disposition* count, not the read; do not read this as
   `_plan-review-prompt.md`'s bounded-scope-plus-whole-file pattern, where the whole read defeated the
   budget the bounded scope promised.)
2. Classify **every physical line in `SPAN` exactly once** as `claim-bearing`, `context/syntax`, or
   `out of scope`; the latter two carry a reason. A multi-line assertion marks every participating line
   `claim-bearing`; a table separator, heading, fence marker or blank line is `context/syntax`. Historical
   narrative carrying no current contract may be `out of scope`, with that stated as its reason.
3. Split every claim-bearing line's factual assertions into **atomic claim rows**. One row asserts one
   fact, carries the stable ID `<map-path>::CNNNN`, and cites one or more `<map-path>::LNNNN` physical-line
   IDs plus table row/column coordinates where applicable. Assign `NNNN` in ascending order of the claim's
   first cited line, then table row/column position, then left-to-right order inside that line. Several
   claims may cite one line and one claim may span several lines; the line's classification stays singular.
   **Every claim-bearing line reaches at least one claim, and every claim reaches at least one
   claim-bearing line inside `SPAN`.**
4. Read from `MANIFEST_DIR` the concern files your claims need — start from the inventory path the claim is
   about and open further concerns when a claim spans several. Declare each one read.
5. Give every claim row exactly one disposition from the vocabulary below.

**What counts as a claim, by map.** `README.md` owns per-prompt facts and run order; `_system-map.md` owns
per-skill facts and cross-system wiring. (`system-check-prompt.md`'s `Purpose` owns that split; these are
the fields it resolves to.)

- `notes/prompts/README.md` — every current-machinery claim in the span: counts and group lists; each
  catalogue row's public command, run-first prerequisite, configuration/modes and received inputs, reads,
  writes/returns, dispatched roles and isolation, commit owner, handoffs/gates, and explicit exclusions;
  internal-component rows; launcher naming and parity; orchestrator/single-shot classification; the
  hub/writer tables; producer/consumer edges and diagrams; batch/global status; runtime tiers; and every
  typical run order.
- `notes/prompts/_internal/_system-map.md` — every current-machinery claim in the span: the opening system
  properties; every chain step in §§2–6; every applicable writer/reader row in §7; all `PROGRESS.md`
  ownership claims in §8; every skill row in §9 — trigger, received inputs, reads, writes/returns,
  isolation, commit owner, handoffs/gates, exclusions; every machinery debt in §10; every symptom route in
  §11; the improvement/validation loop in §12; and every block/trigger/load claim in §13. Never load
  operational state to verify a structural claim: verify the prompt or skill contract that declares the
  path, schema, owner or gate.

Where the span carries a rule the *other* map owns, the duplicate is itself the finding: propose replacing
the non-owning text with a link to its owner rather than reconciling two wordings (`REC-064` — a rule
restated is a rule forked).

### The four dispositions

- `correct` — the manifests **positively support** the cell as written. Only these may later be covered by
  a `verified — no change` section.
- `incorrect` — the manifests contradict it. Draft the exact replacement wording, no broader than the
  manifests prove, and name every occurrence of the claim you can see inside your span.
- `source-contradiction` — the manifests **both support and contradict** it, because the owning machinery
  file states two mutually exclusive clauses. A derived map can be no truer than its source, so this is
  neither a map defect nor yours to settle. **Its bar:** quote **both** clauses with their manifest fact
  IDs and name the one owning inventory path. A row without that is incomplete and your concern is
  re-dispatched. This state exists because two runs had to force this evidence into `unverifiable` and so
  blocked a whole global audit on source defects the run was forbidden to repair.
- `unverifiable` — the accepted manifests **neither** support nor contradict it. **This is a finding, not
  a pass, and it is blocking.** Record it only after one bounded attempt failed: either ask the
  orchestrator to re-dispatch the owning manifest concern, or read the single named source file yourself
  — it is frozen in the run's snapshot — declaring `N lines, read to EOF`. State which was tried.

## `DIRECTION = evidence` — evidence → claim

Direction 1 catches a **false** claim; only this direction catches an **incomplete** one — a cell naming
two of five items agrees with every manifest fact about those two.

1. Read `MANIFEST` whole and declare it. Its accepted stable fact IDs are your **complete denominator**:
   exactly one disposition per ID, none missing, none invented. Silence is not a state.
2. Walk **every** atomic fact, not only file access — for a runnable prompt its command, prerequisite,
   every configuration key/value or received input, each role/dispatch/isolation fact, every read and
   write/return, commit owner, handoff/gate, exclusion and close-out fact; for an internal component every
   `read by`, purpose/authority, read, write/return and ownership fact; for a skill its trigger and
   received inputs, every read and write/return, isolation, commit owner, handoff/gate and exclusion; for
   root contracts, launchers and the validator every system-wide fact either map owns.
3. Search `CLAIM_LEDGER_DIR` for the fact, and where the ledger is silent search **both maps themselves** —
   the map is the source and the ledger is only what another concern ruled on it.
4. Give every fact ID exactly one disposition:
   - `documented → <claim ID>`;
   - `source-only by ownership split → <the rule that keeps it out, quoted>`;
   - `missing claim` — with the map that owes it, the section it belongs in, and the wording it would
     take. A manifest fact with no home in either map is corrected exactly like a false claim.

## Return contract — both directions

- Open with your `N lines, read to EOF` declarations.
- **Write every row to `OUT` as you reach it**, never holding your return in context to the end: a role
  that dies mid-flight is read from its scratch path, and a return held in context is lost work
  (`_agent-runtime-standard.md`).
- Close with the counts your concern owns:
  - `claim` — `span length · claim-bearing · context/syntax · out of scope · atomic claims · unclassified ·
    conflicting classifications · claim-bearing lines with no claim`, the **three classification counts**
    summing to the span length, plus the disposition counts;
  - `evidence` — `facts · documented · source-only · missing claim`, summing to the manifest's accepted
    denominator, reported per manifest field class.
- End with the one line the orchestrator gates on: `concern complete — <span or manifest> · <counts>`, or
  `concern incomplete — <what is missing>`. An incomplete return is re-dispatched cold, exactly like a
  failed Step 3 concern, and is never merged in part.
