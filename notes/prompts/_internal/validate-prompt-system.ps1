[CmdletBinding()]
param(
    [string]$RepositoryRoot,
    [switch]$MachineryOnly
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
}

$expectedRunnableCount = 31
$promptRoot = Join-Path $RepositoryRoot 'notes\prompts'
$claudeRoot = Join-Path $RepositoryRoot '.claude\commands'
$codexRoot = Join-Path $RepositoryRoot '.codex\commands'
$claudeSkills = Join-Path $RepositoryRoot '.claude\skills'
$agentSkills = Join-Path $RepositoryRoot '.agents\skills'
$errors = [System.Collections.Generic.List[string]]::new()

function Add-ValidationError {
    param([string]$Message)
    $errors.Add($Message)
}

function Get-RunnablePrompts {
    Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md' |
        Where-Object {
            $_.Name -notlike '_*' -and
            $_.Name -ne 'README.md' -and
            $_.Directory.Name -ne '_internal'
        }
}

function Get-LauncherTargets {
    param([string]$LauncherRoot)

    $targets = @()
    foreach ($launcher in Get-ChildItem -LiteralPath $LauncherRoot -File -Filter '*.md') {
        $text = [System.IO.File]::ReadAllText($launcher.FullName)
        $matches = [regex]::Matches(
            $text,
            'notes/prompts/(?![A-Za-z0-9_./-]*_internal/)[A-Za-z0-9_./-]+\.md'
        )
        $canonical = @($matches.Value | Sort-Object -Unique)
        if ($canonical.Count -ne 1) {
            Add-ValidationError "$($launcher.FullName) must reference exactly one canonical prompt; found $($canonical.Count)."
            continue
        }
        $targets += $canonical[0].Replace('/', '\')
    }
    return $targets
}

function Get-Sha256Hex {
    # Windows PowerShell 5.1 runs on .NET Framework, which has no SHA256.HashData.
    param([byte[]]$Bytes)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { $digest = $sha.ComputeHash($Bytes) } finally { $sha.Dispose() }
    return (-join ($digest | ForEach-Object { $_.ToString('x2') }))
}

function Get-SqlRouteFileNames {
    # Invariant 7's second source: the authorised exercise and revision file names for one
    # level, taken from its route's section 1.
    #
    # Harvested from the FIRST CELL of each table row, never from a parsed table. Section 1 holds
    # two tables whose headers are in different languages - `| File | Step(s) |` for the exercises
    # and `| Archivo | Punto |` for the revision points - so any locator that keys on a header
    # reads one table and reports the other's five files as typos. Reading a row's first cell is
    # blind to the header and works on both.
    #
    # The first cell and not the whole row, because only that column names the authorised file;
    # every other cell is free prose that legitimately names OTHER files. Five of the twenty rows
    # already do - each revision row's trigger cell names the exercise that fires it - and a
    # whole-row harvest let a retired name or a typo sitting in a status or trigger cell authorise
    # itself, which is the exact hole this invariant exists to close.
    #
    # Rows and not the whole section, for the same reason one step out: the section's prose names
    # retired files - `02-joins.sql` appears as "the old ..., now renumbered `03-joins.sql`".
    param([string]$PlanPath)

    # The section sign is built from its code point and never written as a literal. This file
    # carries no UTF-8 BOM, so Windows PowerShell 5.1 reads it as ANSI and a literal section sign
    # arrives as two mojibake characters that match nothing. The first draft of this locator did
    # write it literally, harvested zero names, and compared nothing while printing a clean PASS.
    $sectionSign = [char]0x00A7
    $names = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    $inSection = $false
    foreach ($line in [System.IO.File]::ReadAllLines($PlanPath)) {
        if ($line -cmatch "^##\s+$($sectionSign)1\b") { $inSection = $true; continue }
        if ($inSection -and $line -cmatch "^##\s+$sectionSign") { break }
        if (-not $inSection -or $line -notmatch '^\|') { continue }
        $cells = $line.Split('|')
        if ($cells.Count -lt 2) { continue }
        # Every backticked name in that one cell, not just the first: a cell naming two authorised
        # files would otherwise authorise one and leave the other reading as a typo, and the reach
        # number would quietly drop by one with nothing announcing it.
        foreach ($row in [regex]::Matches($cells[1], '`(?<name>(?:[0-9]{2}|R[1-9])-[a-z0-9-]+\.sql)`')) {
            [void]$names.Add($row.Groups['name'].Value)
        }
    }
    # `,` so the set is returned as one object: a bare `return` enumerates a collection into the
    # pipeline, and the caller would receive 20 loose strings instead of the set.
    return ,$names
}

function Test-ExternalPathPreflight {
    param([string[]]$RequiredInputs)

    foreach ($path in $RequiredInputs) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
            return $false
        }
    }
    return $true
}

$runnable = @(Get-RunnablePrompts)
$claudeLaunchers = @(Get-ChildItem -LiteralPath $claudeRoot -File -Filter '*.md')
$codexLaunchers = @(Get-ChildItem -LiteralPath $codexRoot -File -Filter '*.md')

if ($runnable.Count -ne $expectedRunnableCount) { Add-ValidationError "Expected $expectedRunnableCount runnable prompts; found $($runnable.Count)." }
if ($claudeLaunchers.Count -ne $expectedRunnableCount) { Add-ValidationError "Expected $expectedRunnableCount Claude launchers; found $($claudeLaunchers.Count)." }
if ($codexLaunchers.Count -ne $expectedRunnableCount) { Add-ValidationError "Expected $expectedRunnableCount Codex launchers; found $($codexLaunchers.Count)." }

$expectedTargets = @(
    $runnable |
        ForEach-Object { $_.FullName.Substring($RepositoryRoot.Length + 1) } |
        Sort-Object
)

foreach ($catalog in @(
    @{ Name = 'Claude'; Targets = @(Get-LauncherTargets $claudeRoot) },
    @{ Name = 'Codex'; Targets = @(Get-LauncherTargets $codexRoot) }
)) {
    $actualTargets = @($catalog.Targets | Sort-Object)
    $difference = @(Compare-Object -ReferenceObject $expectedTargets -DifferenceObject $actualTargets)
    if ($difference.Count -gt 0) {
        Add-ValidationError "$($catalog.Name) launcher catalog does not match the canonical runnable prompt set."
    }
}

foreach ($claudeLauncher in $claudeLaunchers) {
    $codexLauncher = Join-Path $codexRoot $claudeLauncher.Name
    if (-not (Test-Path -LiteralPath $codexLauncher -PathType Leaf)) {
        Add-ValidationError "Missing Codex launcher matching $($claudeLauncher.Name)."
        continue
    }

    $claudeText = [System.IO.File]::ReadAllText($claudeLauncher.FullName)
    $codexText = [System.IO.File]::ReadAllText($codexLauncher)
    foreach ($launcherContract in @(
        @{ Name = 'Claude'; Text = $claudeText },
        @{ Name = 'Codex'; Text = $codexText }
    )) {
        if ($launcherContract.Text -notmatch 'execute it in full') {
            Add-ValidationError "$($launcherContract.Name) launcher does not delegate full execution: $($claudeLauncher.Name)."
        }
    }
}

# The tool names are REC-086's residue: this pattern carried none, which is why two canonical
# files told the agent to call a Claude tool by name and still passed 30 files at PASS. Only
# names that cannot be an ordinary English word or a unix tool are listed.
#
# What stays UNCOVERED, named so nothing reads this as complete:
#   - the bare words `Bash`, `Grep`, `Read`, `Write`, `Edit`, `Glob`. "Git Bash" and "Grep all
#     three topic files" are legitimate prose, and a check that cries wolf gets disabled.
#   - the `X tool` form, which is live in 13 canonical files. Twelve of them are "the Read tool
#     truncates at 2000 lines silently", which restates `_session-rules.md` - a file exempt from
#     this pattern by name, and the owner of that rule. Policing the restatements while the
#     owner is exempt would fail files for using their own rulebook's words; the fork itself is
#     a REC-064 problem for whoever unifies that sentence, not a runtime-isolation defect.
#     The one instruction-form use, `progress-update-prompt.md`'s "Edit tool", was reworded;
#     `_coverage-prompt-rationale.md`'s "Grep tool" is retained history and stays as written.
$exclusivePattern = 'Claude Code|CLAUDE\.md|model: (opus|sonnet|haiku)|general-purpose|run_in_background|/model opus|\b(Opus|Sonnet|Haiku)\b|\b(SendMessage|WebFetch|WebSearch|TodoWrite|NotebookEdit|ExitPlanMode|AskUserQuestion|TaskOutput|MultiEdit|BashOutput|SlashCommand|KillShell)\b'
$canonicalFiles = Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md' |
    Where-Object {
        # THIS SET HOLDS TWO CLASSES AND STATED ONLY ONE (REC-174, the residue of REC-172 (i)).
        # Every entry belongs to exactly one of them, and membership is decided by what a file's own
        # header and its `_system-map.md` section 7 writer row say PRODUCED it - never by its filename:
        #
        #   CLASS A - WRITTEN BY A RUN OR A HOOK. Generated reports, runtime state, transcribed
        #     evidence sinks. The content is copied from what happened, so a line naming a tool or a
        #     model is EVIDENCE and not an instruction any runtime could obey.
        #   CLASS B - AUTHORED, AND THE NAME IS WHAT THE FILE IS FOR. Exempt for the opposite reason
        #     to class A: not because nobody wrote the line, but because the file cannot do its job
        #     without it. Two sub-cases, kept apart because they are not the same claim:
        #       B-i  the runtime is the SUBJECT - `README.md`, `_session-rules.md` and
        #            `_agent-runtime-standard.md`, which exist to say what an adapter is.
        #       B-ii authored prose that QUOTES transcribed evidence - both ledgers, whose rows and
        #            closed lines quote the tool and model names the finding was about. This one
        #            borrows class A's reason inside a class B file, which is why it is named: filing
        #            it under B-i without saying so is how `_recommendation-resolution-doctrine.md`
        #            below came to sit unruled.
        #     RULED AND LEFT SCANNED, 2026-08-29: `_recommendation-resolution-doctrine.md`, split out
        #     of the ledger on the same date as its closed half and sharing the habit of quoting rows,
        #     is NOT exempt. It is case law that INSTRUCTS - "a resolution must", "the reviewer reads" -
        #     so a model or subagent name in it would be an instruction to a runtime, which is exactly
        #     what this invariant is for. Zero pattern hits today; if a future quotation needs one, the
        #     repair is to name the runtime neutrally, not to exempt the file.
        #
        # Ruled over all 108 `.md` files under `notes/prompts/` on 2026-08-29, in BOTH directions - a
        # class-A file outside the set, and a set member that turns out to be ordinary authored prose.
        # Six class-A files were outside it that day and are added below. Nothing here DETECTS a class:
        # a new file of either joins its list in the commit that creates it, which is the standing cost
        # of naming rather than deriving, and is why the census date above is stated and not implied.

        # --- CLASS A: written by a run or a hook -------------------------------------------------
        $_.Name -notlike '_last-run-report*' -and
        # Generated report, same class as `_last-run-report*`: its content is copied from a run, not authored.
        $_.Name -ne '_last-drift-report.md' -and
        # The two friction sinks are the same class again: a row is transcribed from what
        # happened, so a `FRIC` line saying which tool died is evidence, not an instruction.
        $_.Name -notin @('_skill-friction.md', '_ritual-friction.md') -and
        # The breach logs are that class a third time, and there are TWO families with two
        # filename shapes - which is the REC-172 (i) defect: this exemption was one glob whose
        # comment described the family the glob does not select.
        #   `_breach-log-<prompt-name>.md` - the per-prompt logs of `_pipeline-self-report.md`
        #     -> "The breach log", each read by its own close-out. The first one exists as of
        #     2026-08-27 (`_breach-log-notes-plan.md`, three `BRCH` rows quoting the step each run
        #     broke); until then this glob selected an empty set and was here for the population it
        #     would select.
        #   `_skill-breach-log.md` - the single `SBRC-NNNN` log read by `skill-refine` alone, and
        #     the sharpest case of all: a `Scope: shared` row over `_agent-runtime-standard.md`
        #     records a model or dispatch policy the run broke, so its Evidence clause names the
        #     model or the subagent type by construction. It is live, carries rows today, and did
        #     not match the glob above - it passed only because no row had yet quoted such a name.
        # Named separately rather than merged into one wider glob: the two contracts differ, and a
        # pattern loose enough to span both would also select any future `*breach*` file unread.
        $_.Name -notlike '_breach-log-*' -and
        $_.Name -ne '_skill-breach-log.md' -and
        # `_note-todo-harvest.md` (REC-171) is that class a fourth time, and it inherits the reason
        # exactly: its `Quote` column holds one or two of Victor's OWN words, copied verbatim and never
        # paraphrased, so a TODO of his naming a tool or a model is transcribed evidence and not an
        # instruction to any runtime. Unlike the three above, this one is NOT a machinery sink - it
        # measures the prose bar of the notes - but the exemption turns on how the cell was produced,
        # not on what it is about. Named separately for the same reason the two breach families are:
        # a glob wide enough to span all four would select any future `*harvest*` file unread.
        $_.Name -ne '_note-todo-harvest.md' -and
        # The two audit reports, added 2026-08-29 (REC-174). Section 7 gives each ONE writer - its own
        # audit prompt, "overwritten on each explicit run" - and both are git-tracked, which is why
        # they read like canonical prose and sat here unexempted: a report quoting a `/system-gaps`
        # candidate about runtime dispatch, or a `/system-check` finding about a model mapping, is the
        # run's transcript of a defect and not a canonical instruction. Neither trips the pattern
        # today; latent is how REC-172 (i) sat for months.
        $_.Name -notin @('_system-check-report.md', '_system-gaps-report.md') -and
        # `_skill-runs.md`, added with them, is the only member written by NO agent at all: the
        # `PostToolUse` hook appends a row straight from raw tool-call input, so its `Args` column can
        # hold whatever was typed. It is also the only member git ignores - which is not a reason to
        # skip it, because this scan walks the DISK.
        $_.Name -ne '_skill-runs.md' -and
        # The three runtime/evidence-state files, added with them and found by the same cross-check:
        # `system-check-prompt.md`'s inventory exclusion already grouped them as "runtime/evidence
        # state" and this list did not. Their writers, per section 7 and each file's own header:
        #   `_run-tracker.md` - every prompt's close-out, plus `coverage-bullet-add`; "Victor never
        #     fills it by hand (though he may correct it)".
        #   `_cross-topic-inbox.md` - FIVE writers and its header calls the list exhaustive: the three
        #     coverage prompts, the `coverage-bullet-add` skill, AND a BY-HAND entry on a boundary
        #     change, which `_topic-ownership.md` mandates. So "written by runs" is false of it, and
        #     the class-A verdict survives anyway: a hand-filed routing row is still a transcript of a
        #     gap some run found, not an instruction to a runtime. Stated rather than smoothed over,
        #     because the definer is the writer and this one has a writer that is a person.
        #   `_job-market-evidence.md` - `/evidence-intake` and `/cv tailor`, out of real postings:
        #     transcription from OUTSIDE the system and the least controllable text in the tree.
        #   `_application-evidence.md` - added 2026-08-31 (`REC-187`), the presentation sibling of the
        #     row above and the same class for the same reason: quoted text fetched from career and ATS
        #     articles, so the least controllable text in the tree now has two files, not one. Written
        #     by hand in the session that needs it - no prompt owns it, which changes its writer but
        #     not its class, exactly as `_cross-topic-inbox.md`'s by-hand entry did not change that
        #     file's. Exempted BEFORE it ever trips the scan: nothing in the first fill hits the
        #     pattern, and a later quote naming a tool or a model would be transcribed evidence.
        # All four carry an authored header above transcribed rows, and that mixture is class A
        # whole: the pattern scans the file, not the section, and the friction sinks - the same shape -
        # settled it that way.
        $_.Name -notin @('_run-tracker.md', '_cross-topic-inbox.md', '_job-market-evidence.md', '_application-evidence.md') -and

        # --- CLASS B: authored, and the runtime is the subject ------------------------------------
        $_.Name -notin @(
            # The hub: its "Platform adapters" section names Claude Code and Codex to say what an
            # adapter IS. FOUR pattern hits today, measured, not assumed: `CLAUDE.md` (l.32) in the
            # shared-runtime-context block ABOVE that section, which starts at l.38; `Claude Code`
            # (l.45) in the section itself; and `general-purpose` plus `run_in_background` (l.54) in
            # the passage that publishes this very exemption, added 2026-08-29. All four correct. The
            # first draft of this comment said "two, both that section" without counting, which is
            # REC-174's own failure mode committed inside its own repair. It was the first line of
            # this filter and carried no reason at all until 2026-08-29 - the other-direction finding
            # of REC-174: an exemption whose class nobody could read is one nobody can audit.
            'README.md',
            '_session-rules.md',
            '_agent-runtime-standard.md',
            '_recommendation-ledger.md',
            # Split out of the ledger 2026-08-18 and it inherits the same reason: closed lines
            # quote the tool and runtime names the rows were about.
            '_recommendation-ledger-closed.md'
        )
    }
foreach ($file in $canonicalFiles) {
    $text = [System.IO.File]::ReadAllText($file.FullName)
    if ([regex]::IsMatch($text, $exclusivePattern)) {
        Add-ValidationError "Platform-exclusive runtime syntax remains in canonical file: $($file.FullName)."
    }
}

foreach ($prompt in $runnable) {
    $text = [System.IO.File]::ReadAllText($prompt.FullName)
    if ($text -notmatch '_agent-runtime-standard\.md') {
        Add-ValidationError "Runnable prompt lacks the runtime contract: $($prompt.FullName)."
    }
    if ($text -notmatch 'Run first') {
        Add-ValidationError "Runnable prompt lacks a Run first declaration: $($prompt.FullName)."
    }
}

$pipelinePromptPaths = @(
    'knowledge\coverage\coverage-audit-prompt.md',
    'knowledge\coverage\coverage-prompt.md',
    'knowledge\coverage\coverage-verify-prompt.md',
    'knowledge\interview-prep\interview-prep-audit.md',
    'knowledge\interview-prep\interview-prep-route-prompt.md',
    'knowledge\notes\notes-audit.md',
    'knowledge\notes\notes-plan-prompt.md',
    'practice\sql\sql-plan-audit.md',
    'practice\sql\sql-plan-prompt.md',
    'practice\simulations\simulation-plan-prompt.md',
    'projects\plan\plan-audit.md',
    'projects\plan\project-brief-prompt.md',
    'projects\portfolio\portfolio-audit.md',
    'projects\readme\readme-audit.md',
    'projects\review\review-audit.md',
    'strategy\tracking\progress-update-prompt.md',
    'strategy\tracking\roadmap-review-prompt.md',
    'system\system-check-prompt.md',
    'system\system-gaps-prompt.md'
)

if ($pipelinePromptPaths.Count -ne 19) {
    Add-ValidationError "Expected 19 pipeline prompts; found $($pipelinePromptPaths.Count)."
}

foreach ($prompt in $runnable) {
    $relativePath = $prompt.FullName.Substring($promptRoot.Length + 1)
    $text = [System.IO.File]::ReadAllText($prompt.FullName)
    $expectedSelfReport = if ($relativePath -in $pipelinePromptPaths) {
        '_pipeline-self-report.md'
    } else {
        '_single-shot-self-report.md'
    }
    if ($text -notmatch [regex]::Escape($expectedSelfReport)) {
        Add-ValidationError "Runnable prompt lacks its expected self-report contract ($expectedSelfReport): $($prompt.FullName)."
    }
}

$trackerText = [System.IO.File]::ReadAllText((Join-Path $promptRoot '_internal\_run-tracker.md'))
$singleShotPrompts = @($runnable | Where-Object {
    $_.FullName.Substring($promptRoot.Length + 1) -notin $pipelinePromptPaths
})
if ($singleShotPrompts.Count -ne 12) {
    Add-ValidationError "Expected 12 single-shot prompts; found $($singleShotPrompts.Count)."
}
foreach ($prompt in $singleShotPrompts) {
    $promptName = [System.IO.Path]::GetFileNameWithoutExtension($prompt.Name)
    if ($trackerText -notmatch "(?m)^\|\s*$([regex]::Escape($promptName))\s*\|") {
        Add-ValidationError "Single-shot tracker row missing: $promptName."
    }
}
foreach ($requiredTrackerContract in @('## Notes file executions', '## Single-shot prompt executions', 'completed|blocked|dry-run')) {
    if ($trackerText -notmatch [regex]::Escape($requiredTrackerContract)) {
        Add-ValidationError "Run tracker lacks '$requiredTrackerContract'."
    }
}

# --- Invariant 4: no file points at a path that is not there -----------------
# Two path forms are both legitimate and both must resolve: repository-relative,
# and relative to notes/prompts/ (which is how README.md writes every prompt).
# Checking only the first form left README.md - the one file whose whole job is
# to inventory the others - structurally unverifiable, and it carried 30 paths
# stranded by the 2026-07-22 _internal/ reorg while the validator stayed green.
#
# THE ROOT ALTERNATION IS AN EXEMPTION LIST, and it must be read as one (REC-172 (iv)): a root
# missing from it is not "unchecked pending a decision", it is silently outside the invariant. It
# names every form's roots at once - `notes`, `practice`, `projects` are the repository's own
# top-level directories (`scripts/` and `tools/` are deliberately out: no machinery file cites
# either, verified 2026-08-27, and they hold no contracts), `personal` is the external root the
# exemption below governs, and `knowledge`, `strategy`, `system`, `_internal` are the relative
# forms. `system` and `_internal` were both absent until 2026-08-27, which put every `system/...`
# path in README.md and _system-map.md outside the scan - the audit prompts, the reconcile prompt
# and all three system reports - and every `_internal/...` path with them: 43 distinct citations, the
# most cited being `_internal/_system-map.md` at 17, from README.md, `_session-rules.md`, both
# `map-sync/SKILL.md` mirrors and both `system-gaps` launchers.
# Adding a subfolder under notes/prompts/ means adding it here in the same commit.
$referencePathPattern = '(?<![A-Za-z0-9_./-])(notes|practice|projects|personal|knowledge|strategy|system|_internal)/[A-Za-z0-9_./{}-]+\.(md|ps1|sql)'
# THE THIRD RESOLUTION FORM, and `_internal/` is the only root that takes it. That prefix is written
# two ways and both are canonical, sometimes in the same file: notes/prompts-relative
# (`_internal/_system-map.md`, from README.md) and FAMILY-relative - a prompt naming the `_internal/`
# folder beside itself (`_internal/_topic-ownership.md`, from `knowledge/coverage/coverage-prompt.md`).
# Measured 2026-08-27 over 43 distinct (reference, citing file) pairs: 10 resolve family-relative, 21
# notes/prompts-relative, and 12 are `_last-run-report*` declared outputs the skip below exempts. The
# 10 are the only reason this form exists - `_topic-ownership.md`, `_cross-topic-inbox.md` and
# `_coverage-standard.md` (three citers each, all under `knowledge/coverage/_internal/`) and
# `_system-check-reconcile-prompt.md` under `system/_internal/`. No target exists in two places, so
# the two senses cannot collide today and the resolution order cannot mis-credit one. Scoped to this root on purpose - resolving every
# reference against its citing file's own directory would let `notes/...` cited from a prompt folder
# pass on a path that means nothing.
$familyRelativeRootPattern = '^_internal/'

# A path a prompt is told to create. Same class as the _last-run-report exemption:
# it is a declared output, so its absence means "not run yet", never "wrong path".
$declaredOutputPatterns = @(
    '^notes/cv/cv-bullets\.md$'                       # portfolio-audit
    '^notes/interview-prep/(hr-screen|SESSION-LOG)\.md$'  # hr-screen, simulator
    '^notes/interview-prep/routes/(junior|middle|senior)\.md$' # interview-prep-route
    # Both bounded to the real filename shape: an unbounded `.+` swallowed a typo or a rename in the
    # very file names the SQL track resolves "the current exercise file" by.
    '^practice/sql/(junior|middle|senior)/([0-9]{2}|R[1-9])-[a-z0-9-]+\.sql$'  # sql-exercises
    '^practice/simulations/[a-z-]+/[0-9]{2}-[a-z0-9-]+\.md$'                   # simulation-generator
    '^practice/simulations/PLANNING\.md$'                                      # simulation-plan first run
    # Backreferenced, not two free groups: `junior/PLANNING-senior.md` is a cross-level path no
    # prompt can ever write, and the unlinked form exempted all nine combinations to license three.
    '^practice/simulations/(?<level>junior|middle|senior)/PLANNING-\k<level>\.md$' # level route
)
# RETIRED 2026-08-27 (REC-172): `notes/prompts/system/_internal/_system-gaps-report.md` and
# `(notes/prompts/)?strategy/tracking/_internal/_last-drift-report.md` were "first run" and "every
# run" exemptions for files that now exist on disk and are tracked by git, so both patterns had
# stopped selecting anything. Kept as a note rather than deleted silently, because the ledger's own
# rot mode is an allowlist entry that outlives its case with nothing pointing back at it: if either
# report is ever un-tracked or its owner renamed, restore the entry rather than rediscovering it.
# Deliberately outside the repository; _external-path-preflight.md governs these.
$externalPathPatterns = @('^personal/')
# A dead path is legitimate when a file recounts history or names a legacy shape
# it must still recognise. Scoped to the citing file on purpose: the same path in
# a live instruction is still a defect.
$historicalReferences = @{
    # The ledger's entry was dropped 2026-08-18: both of its dead paths left the file in 91740735,
    # the 2026-08-07 collapse of 46 resolved rows, and the exemption outlived them by eleven days.
    # An exemption is a claim about another file's text, so it rots when that file is rewritten and
    # nothing points back at it - re-verify this table whenever a cited file is compacted.
    #
    # THE KEY IS THE CITING FILE, AND ONE TOMBSTONE IS ROUTINELY RECOUNTED BY SEVERAL OF THEM
    # (REC-172 (ii)). `/progress-update` writes two artifacts from one measurement pass - its
    # report and its drift report, one directory apart - so the deleted `practice/sql/02-joins.sql`
    # it resolves against route section 1's tombstone is named in both, and only the report was
    # keyed here. The drift report failed the run on 2026-08-27 for recounting the same dead file
    # for the same reason. When adding a key, ask which OTHER file the same run writes.
    'knowledge\coverage\_internal\_coverage-prompt-rationale.md' = @('notes/coverage.md')
    'strategy\tracking\progress-update-prompt.md'                = @('practice/sql/01-basics.sql', 'practice/sql/02-joins/exercises.sql')
    'practice\sql\_internal\_last-run-report-sql-exercises.md'   = @('practice/sql/01-basics.sql')
    'strategy\tracking\_internal\_last-run-report.md'            = @('practice/sql/02-joins.sql')
    'strategy\tracking\_internal\_last-drift-report.md'          = @('practice/sql/02-joins.sql')
    # The project question bank became an `en/`+`es/` pair on 2026-08-31 (REC-180, bilingual half), so
    # the 2026-08-29 portfolio run's declared output moved under `en/`. A self-report records what a
    # run did on the day it ran, and per this map's own registry row a self-report is written by its
    # prompt's close-out alone and OVERWRITTEN, never hand-appended - so neither rewriting the path nor
    # annotating the file was available. The tombstone is the whole disposition.
    'projects\portfolio\_internal\_last-run-report.md'           = @('notes/interview-prep/projects/01-todo-list.md')
}
# A path a LEDGER ROW PROPOSES: machinery the row is arguing should exist, which by construction
# does not (REC-172 (iii)). `$declaredOutputPatterns` cannot cover it - no prompt is told to write
# it, and it never will exist if the row is rejected - so before this class REC-171 had to split
# its own sink's path across two backticked fragments to avoid failing the run, and REC-172 could
# not write REC-172 (ii)'s dead path at all. A ledger that cannot name the file it proposes, or the
# dead path it is reporting, is being shaped by its checker.
#
# Scoped by CITING FILE, like the historical table above and unlike a pattern, because the licence
# belongs to the two files whose whole content is proposals and closed rulings - not to the shape of
# any path. And it REPORTS rather than exempts: a dead path here is printed with its citing file on
# its own `REPORT:` line and counted there, so a real typo in a live ledger row is still visible to
# a reader. What a check cannot settle needs a name, or it silently becomes a pass.
$proposedPathCiters = @(
    '_internal\_recommendation-ledger.md',
    '_internal\_recommendation-ledger-closed.md'
)

# THE SCANNED POPULATION IS ITSELF AN EXEMPTION LIST (REC-172 (vi)): a machinery file left out of
# it is not checked, and nothing says so. Both launcher catalogues were outside until 2026-08-27
# while carrying 35 path references between them - in the very files invariants 5 and 6 already
# treat as machinery, which is the asymmetry that named the hole. `.ps1` files stay out and this is
# the published limit, not an oversight. There are TWO tracked machinery scripts, not one: this
# validator, whose "paths" are regex literals with `(`, `|` and `\` in them, so scanning it would
# measure its own patterns rather than its claims; and `.claude/hooks/log-skill-run.ps1`, the
# `PostToolUse` hook that writes the `_skill-runs.md` counter, which builds its one path with
# `Join-Path` rather than writing it whole, so no pattern here would see it either. Both files'
# prose citations are proofread by hand instead.
$sqlExerciseReferences = [System.Collections.Generic.List[object]]::new()
$proposedPathReports = [System.Collections.Generic.List[string]]::new()
$referenceScan = @()
$referenceScan += Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md'
foreach ($skillRoot in @($claudeSkills, $agentSkills)) {
    $referenceScan += Get-ChildItem -LiteralPath $skillRoot -Recurse -File -Filter '*.md'
}
foreach ($launcherRoot in @($claudeRoot, $codexRoot)) {
    $referenceScan += Get-ChildItem -LiteralPath $launcherRoot -Recurse -File -Filter '*.md'
}
$referenceScan += @('CLAUDE.md', 'AGENTS.md' | ForEach-Object { Get-Item -LiteralPath (Join-Path $RepositoryRoot $_) })

foreach ($file in $referenceScan) {
    $relativeSource = $file.FullName.Substring($RepositoryRoot.Length + 1)
    $text = [System.IO.File]::ReadAllText($file.FullName)
    foreach ($match in [regex]::Matches($text, $referencePathPattern)) {
        $reference = $match.Value
        # Placeholders: a template stands for a path, it is not one.
        # `-...` is the only elision form on disk (practice/sql/{middle,senior}/01-....sql). A bare
        # `...` anywhere in a path suppressed real dead references such as `.../en/...nope.md`.
        if ($reference -cmatch '[{}]|0X|NN-|-\.\.\.') { continue }
        # A self-report is a declared output, so its absence means "that prompt has not run yet",
        # never "wrong path" - 15 of the 24 report paths cited on disk are legitimately absent for
        # exactly that reason. But the exemption was keyed on the FILENAME alone, so it also
        # swallowed a wrong DIRECTORY, which is not a declared output at all: shape is not name
        # (REC-172 (v)). Every real citation this invariant can SEE resolves to `<family>/_internal/`,
        # verified over all of them on 2026-08-27, so requiring that segment keeps every one exempt and
        # lets a report path with the `_internal/` dropped be reported as the dead path it is. Four of
        # the 24 report names are also cited as a BARE FILENAME with no directory at all; those never
        # match `$referencePathPattern` in the first place and so never reach this line.
        if ([System.IO.Path]::GetFileName($reference) -like '_last-run-report*') {
            if ($reference -cmatch '(^|/)_internal/_last-run-report[A-Za-z0-9_.-]*\.md$') { continue }
        }
        # The historical allowlist is consulted FIRST, ahead of both the shape exemptions and
        # invariant 7's collection below. It is the narrowest exemption in the chain - an exact
        # path, scoped to the one file allowed to cite it - so nothing downstream should be able
        # to overrule it. Ordered after the collection, it could not: a retired exercise path
        # named by a file recounting the renumbering that retired it was banked as a live
        # reference before its own exemption was ever reached, and failed the run.
        $exempt = $false
        foreach ($citingFile in $historicalReferences.Keys) {
            if ($relativeSource.EndsWith($citingFile) -and $reference -cin $historicalReferences[$citingFile]) {
                $exempt = $true
                break
            }
        }
        if ($exempt) { continue }
        # Invariant 7's population, collected here because this is the last point at which a
        # declared SQL exercise path is still visible: the next line exempts it from existence
        # by shape, and shape is not name. Adjudicated after this loop, against the level route.
        $sqlExerciseReference = [regex]::Match(
            $reference,
            '^practice/sql/(?<level>junior|middle|senior)/(?<file>(?:[0-9]{2}|R[1-9])-[a-z0-9-]+\.sql)$'
        )
        if ($sqlExerciseReference.Success) {
            $sqlExerciseReferences.Add([pscustomobject]@{
                Level  = $sqlExerciseReference.Groups['level'].Value
                File   = $sqlExerciseReference.Groups['file'].Value
                Source = $relativeSource
            })
        }
        # -cmatch / -cin, not -match / -in: PowerShell's default comparisons are case-insensitive,
        # which is how invariant 5 came to exempt two prompts by accident. Every pattern here
        # already carries its real casing, so this narrows nothing legitimate - it stops
        # `03-JOINS.sql` being waved through as a declared output it is not.
        if ($declaredOutputPatterns | Where-Object { $reference -cmatch $_ }) { continue }
        if ($externalPathPatterns | Where-Object { $reference -cmatch $_ }) { continue }
        $windowsPath = $reference.Replace('/', '\')
        if (Test-Path -LiteralPath (Join-Path $RepositoryRoot $windowsPath) -PathType Leaf) { continue }
        if (Test-Path -LiteralPath (Join-Path $promptRoot $windowsPath) -PathType Leaf) { continue }
        # The family-relative form, above. Tried last of the three so a path that resolves globally
        # is never credited to the citing file's neighbourhood by accident.
        if ($reference -cmatch $familyRelativeRootPattern -and
            (Test-Path -LiteralPath (Join-Path $file.DirectoryName $windowsPath) -PathType Leaf)) { continue }
        # LAST in the chain, unlike the historical allowlist which is first. That one is an exact
        # path and may not be overruled; this one is a whole file's licence to name what does not
        # exist, so every narrower test - placeholder, declared output, external, and existence
        # itself - gets to settle the reference before the licence is reached. A proposed path that
        # has since been BUILT must therefore resolve normally and never reach this line.
        if ($proposedPathCiters | Where-Object { $relativeSource.EndsWith($_) }) {
            # Deduped: a row naming its proposed path several times is one proposal, and N identical
            # lines would inflate a count whose whole purpose is to be read off the line.
            $proposedLine = "$reference (from $relativeSource)"
            if ($proposedLine -cnotin $proposedPathReports) { $proposedPathReports.Add($proposedLine) }
            continue
        }
        $rootsTried = if ($reference -cmatch $familyRelativeRootPattern) {
            "the repository root, notes/prompts/, or the citing file's own directory"
        } else {
            # The family-relative form is attempted for the `_internal/` root only, so naming it in
            # every message would tell a reader a resolution was tried that never was.
            'the repository root or notes/prompts/'
        }
        Add-ValidationError "Dead path reference '$reference' resolves against none of $rootsTried (from $relativeSource)."
    }
}

# --- Invariant 7: a declared exercise path is a real file name ---------------
# Invariant 4 exempts declared outputs by SHAPE, because a file a prompt has not written yet
# must not fail the run. Shape is not name: `03-jions.sql` has the same shape as `03-joins.sql`,
# so a plausible typo was exempt and the run stayed green. No pattern can close that - it needs
# a second source holding the real names, which is why REC-057 left it as a design change.
#
# That source is the level's own route. It is load-bearing rather than cosmetic because
# `sql-exercises-prompt.md` restates the file list twice - once as the `FILE` config values and
# once as the `TOPIC` -> file table a run resolves its target by - so a typo in the second one
# writes an exercise to a new, wrong file.
#
# ONE DIRECTION: reference -> route. A route file that nothing cites is not a defect; the route
# plans files years before a prompt mentions them. The reverse reading fails on that alone.
#
# SKIPPED under -MachineryOnly, alongside the live coverage and fingerprint checks, even though
# what it blocks on is a machinery file. The test is not who owns the file that fails, it is who
# owns the ORACLE: this invariant's second source is PLANNING-{LEVEL}.md, a live learning artifact
# written by /sql-plan, and the switch exists precisely so live plan and route state cannot enter
# /system-check's blocking conditions. Ungated, a legitimate route rename fails an audit that is
# contractually barred from opening the route to see why. Ordinary manual runs keep the check.
$sqlRouteNames = @{}
$sqlRouteReports = [System.Collections.Generic.List[string]]::new()
$sqlNamesHarvested = 0
$sqlReferencesChecked = 0
$sqlReferencesUnverified = 0
foreach ($level in @('junior', 'middle', 'senior')) {
    if ($MachineryOnly) { break }
    $sqlRoutePath = Join-Path $RepositoryRoot "practice\sql\$level\PLANNING-$level.md"
    if (-not (Test-Path -LiteralPath $sqlRoutePath -PathType Leaf)) { continue }
    $sqlRouteNames[$level] = Get-SqlRouteFileNames $sqlRoutePath
    # `$null -eq` explicitly: a property access on $null yields $null rather than throwing, so a
    # locator that returned nothing at all would have added $null here and slipped past a bare
    # `.Count -eq 0` test. That is precisely how the first draft of this check passed.
    if ($null -eq $sqlRouteNames[$level] -or $sqlRouteNames[$level].Count -eq 0) {
        # A route whose section 1 yields nothing is a locator failure, not an empty level:
        # a comparison against an empty set passes every reference exactly as loudly as a
        # real one would, which is the one outcome this invariant must never produce.
        Add-ValidationError "SQL route $level exists but no exercise file names were harvested from its section 1; the locator no longer matches the route's tables."
    } else {
        $sqlNamesHarvested += $sqlRouteNames[$level].Count
    }
}
foreach ($sqlReference in $sqlExerciseReferences) {
    if ($MachineryOnly) { break }
    if (-not $sqlRouteNames.ContainsKey($sqlReference.Level)) {
        # Named, not swallowed: what a check cannot settle must not become a silent pass.
        $sqlReferencesUnverified++
        $sqlRouteReports.Add("$($sqlReference.Level)/$($sqlReference.File) (from $($sqlReference.Source)) - no practice/sql/$($sqlReference.Level)/PLANNING-$($sqlReference.Level).md to check the name against; run /sql-plan $($sqlReference.Level) to make it verifiable.")
        continue
    }
    $sqlReferencesChecked++
    if (-not $sqlRouteNames[$sqlReference.Level].Contains($sqlReference.File)) {
        Add-ValidationError "Declared SQL exercise '$($sqlReference.File)' is well-formed but is not a file in practice/sql/$($sqlReference.Level)/PLANNING-$($sqlReference.Level).md section 1 (from $($sqlReference.Source))."
    }
}

# --- Invariant 8: an applied self-report carries its cold-review verdict -----
# _system-map.md section 12 step 5: "The verdict line is the only trace the gate ran; an applied
# edit without one is indistinguishable on disk from a self-approval and must be read as one."
# Nothing looked for it, so the one rule that stops a saturated context from editing a prompt on
# its own say-so was checked only by the context it constrains.
#
# NOT skipped under -MachineryOnly, unlike invariant 7 above. The test is who owns the ORACLE, and
# here the object under test and the oracle are the same file - a report under notes/prompts/.
# No live learning artifact is opened. The two exemptions these files already carry (the
# runtime-isolation pattern and invariant 4's path resolution, both because a report is transcribed
# from a run rather than authored) say their CONTENT is evidence; they do not make them live state.
#
# TWO PASSES, and they are deliberately different.
#   Status detection is per PHYSICAL LINE. The field is written four ways - bare or bolded, hash
#   bare or backticked, one hash or two joined by a middle dot or by `and`, with or without
#   trailing prose - and every one of them keeps `Status:` and `applied in` on one line. It is
#   matched as a FIELD and not as a substring: prose legitimately quotes the field ("the previous
#   report's `Status: applied` needed no surfacing"), so the text before it must be empty or end at
#   a middle-dot separator.
#   Verdict detection allows ONE OPTIONAL WRAP at each seam inside the token, and nothing more. The
#   token appears on its own line, inline in the Status line, indented and bolded inside a bullet,
#   backticked mid-paragraph, and - in system/_internal/_last-run-report.md - SPLIT ACROSS A HARD
#   LINE BREAK.
#   These files are hand-wrapped at ~100 columns, so a line-anchored or single-line pattern reads
#   that last form as a missing gate. The first draft healed the wrap by flattening the WHOLE FILE,
#   and the cold reviewer proved that is a false pass: with every newline collapsed, a paragraph
#   ending "...went to the cold reviewer:" and the next one opening "approve, with two tightenings"
#   satisfies it, as does any report quoting its own contract. `\n?` at each seam covers the same
#   five forms and cannot cross a blank line, because a blank line is two newlines.
#
# The token is required verbatim and case-sensitively; prose is not the trace. "Two cold reviews
# passed" and "the cold reviewer approved" both appear in reports that ran the gate correctly, and
# accepting them would trade a bounded test for a judgement about English.
#
# Made to fail before it was trusted, which is where three of these rules come from. Injected at
# once: an applied report carrying only the prose form; a report with no Status field; `Cold
# Reviewer:` (wrong case); `cold reviewer: approved` (unbounded token); a real verdict deleted; a
# real verdict re-wrapped. All six were reported, none masked another, and a report quoting
# `Status: applied in <hash>` in prose correctly stayed OUT of the population. The two defects the
# injection pass did NOT find are the two the cold reviewer did - the flattening above, and a
# Status VALUE outside the closed set - which is why the value is now enforced rather than counted.
#
# The middle dot is built from its code point. This file carries no UTF-8 BOM, so PowerShell 5.1
# reads it as ANSI and a literal one arrives as two characters that match nothing, for ever, in
# silence - the trap that made the first draft of the section-1 locator harvest zero names.
$middleDot = [char]0x00B7
$emDash = [char]0x2014
$statusTerminatorPattern = "(?:[ \t]*\*{0,2})?(?:[ \t]*`$|[ \t]+(?:$middleDot|$emDash)[ \t]+.+`$)"
$settledStatusPattern = "^[ \t]*(?:clean|open|rejected)$statusTerminatorPattern"
$appliedStatusPattern = "^[ \t]*applied in[ \t]+[0-9a-f]{7,40}(?:[ \t]+and[ \t]+[0-9a-f]{7,40})*$statusTerminatorPattern"
$selfReports = @(Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '_last-run-report*.md')
$reportsScanned = 0
$reportsApplied = 0
$selfReportReports = [System.Collections.Generic.List[string]]::new()
foreach ($report in $selfReports) {
    $reportName = $report.FullName.Substring($RepositoryRoot.Length + 1).Replace('\', '/')
    $reportText = [System.IO.File]::ReadAllText($report.FullName) -replace "`r`n", "`n"
    $reportsScanned++

    $statusCandidates = @([regex]::Matches($reportText, '(?m)^(?<prefix>.*?)\*{0,2}Status:\*{0,2}(?<rest>.*)$'))
    $statusFields = @(
        $statusCandidates | Where-Object {
            $_.Groups['prefix'].Value -eq '' -or
            $_.Groups['prefix'].Value -cmatch "$middleDot[ \t]*`$"
        }
    )
    # The schema first. A report with no Status field would drop out of the population in silence,
    # and a check that exempts part of its own population is worse than no check.
    if ($statusFields.Count -eq 0) {
        Add-ValidationError "Self-report carries no 'Status:' field, so nothing can tell an applied edit from an open finding: $reportName."
        continue
    }
    # The VALUE is a closed set of four, and it is enforced rather than merely counted. A settled value
    # may end there or carry historical prose after one declared separator; `applied in` additionally
    # requires one real abbreviated/full hex hash and permits the historical `and <hash>` shape.
    # Prefix matching is deliberately insufficient: `open-ended`, `clean garbage`, or `applied in`
    # would otherwise satisfy the public invariant while naming no legitimate state.
    foreach ($statusField in $statusFields) {
        $statusValue = $statusField.Groups['rest'].Value
        if ($statusValue -cnotmatch $settledStatusPattern -and $statusValue -cnotmatch $appliedStatusPattern) {
            Add-ValidationError "Self-report's 'Status:' field is not clean|open|rejected|applied in <hash>: $reportName."
        }
    }
    # A Status-shaped line the prefix filter dropped is prose quoting the field, which is legitimate
    # and common - but one carrying `applied in` is the one shape where a real field could be hiding
    # behind a bullet marker. Named rather than swallowed; it cannot be settled without reading it.
    foreach ($dropped in @($statusCandidates | Where-Object { $_ -notin $statusFields })) {
        if ($dropped.Groups['rest'].Value -cmatch '\bapplied in\b') {
            $selfReportReports.Add("$reportName has a 'Status: ... applied in' outside the field position, read as prose and not counted.")
        }
    }
    if (-not @($statusFields | Where-Object { $_.Groups['rest'].Value -cmatch $appliedStatusPattern })) { continue }
    $reportsApplied++

    # One optional wrap per seam, never a flattened file: see the note above.
    if ($reportText -cnotmatch 'cold[ \t]*\n?[ \t`*]*reviewer:[ \t`*]*\n?[ \t`*]*(approve-with-tightening|approve|reject)(?![A-Za-z0-9-])') {
        Add-ValidationError "Self-report declares 'applied in <hash>' but carries no 'cold reviewer: approve|approve-with-tightening|reject' verdict; on disk that is indistinguishable from a self-approval: $reportName."
    }
}

# --- Invariant 9: a closed ledger line carries its closure schema ------------
# `_recommendation-ledger.md` step 4 and `_recommendation-ledger-closed.md`'s own header state one
# closure schema - the ID, what the item was, the cold-review verdict, the two-map declaration and
# the implementation commit, on ONE line - and until this invariant nothing read it. That is the
# shape `REC-143` names: a convention enumerated in three files with no checker whose scope reaches
# it, where the enumeration is the symptom. It is also what let the 2026-08-18 collapse leave six
# rejected rows carrying the literal template `{commit}` where their em dash belonged.
#
# NOT skipped under -MachineryOnly: the object under test and the oracle are the same machinery
# file, which is invariant 8's test, not invariant 7's.
#
# THE FORMS WERE COUNTED BEFORE THE PATTERN WAS WRITTEN (`REC-067`). Over the 156 rows on disk:
#   the two-map field is written `maps unaffected` and `maps: <...>`, both legitimate;
#   the commit field is one backticked hash, a comma-joined pair of them, or a backticked em dash
#     for a row that implemented nothing (a rejection, or a decision with no code change);
#   the verdict field is `approve`, `approve-with-tightening`, and the historical
#     `reject, then approve...` shapes, so the test is that an approving token is REACHED, not that
#     the field opens on one;
#   one row is a `residue` continuation of the ID above it (`REC-086`), which is why the ordering
#     test admits an equal ID on that shape alone and on no other.
#
# THE THRESHOLDS. The header publishes `REC-107` for the verdict field and dates the two-map field to
# "the first item collapsed after 2026-08-07" without naming an ID. The unnamed one is read off disk -
# `REC-057` is the last row carrying no two-map declaration, so `REC-058` is exactly tight. The named
# one is taken as published and NOT re-derived: on disk the verdict field runs continuously from
# `REC-104`, and enforcing that would fail three rows the header exempts by name. Below a threshold
# the field is optional and above it required - the older lines are explicitly not retrofitted, and
# inventing a retrofit here would fail the run for history rather than for a defect.
#
# WHAT IT CANNOT SETTLE, published rather than left to be assumed (`REC-076`, `REC-084`):
#   it proves the fields are PRESENT, never that a cold reviewer ran or that the hash names the
#     edit - the same limit invariant 8 publishes over the self-reports;
#   the verdict is owed by a row that names a real commit, because a rejection gates no edit. A row
#     that applied something and wrote the em dash escapes, and nothing on the line can settle that;
#   the one-line budget is a PROXY. Step 4 prices a closure at one line plus at most one promotion,
#     and the engine it was written against was a "line" of about a thousand characters restating
#     the whole resolution. The character count is reported with the longest row and never fails a
#     run. 700 was set when it sat above the 90th percentile (662 characters) and below that named
#     pathology; over the 168 rows on disk on 2026-08-27 the 90th percentile is 709 and 18 rows are
#     over, so the threshold no longer sits where that reasoning put it. It still moves before a
#     reader notices the file growing, but it is now measuring a file that has already grown.
#
# Made to fail before it was trusted (`REC-057`). Eight defects injected at once - a wrapped second
# line under `## Closed`, a row with no commit field, `{commit}` restored on one row, a post-107
# applied row with its verdict deleted, a post-58 row with its two-map declaration deleted, two rows
# swapped out of ID order, a duplicate ID that is not a residue row, and an ID present in both
# `## Open` and this file - then two more in a second pass, because the first left two branches
# unexercised: a verdict field that opens and closes on `reject`, and a residue line detached from
# the ID it continues. All ten were reported and none masked another; the `{commit}` row correctly
# drew two findings, since a template is also not a hash.
$ledgerOpenPath = Join-Path $promptRoot '_internal\_recommendation-ledger.md'
$ledgerClosedPath = Join-Path $promptRoot '_internal\_recommendation-ledger-closed.md'
$closedBudget = 700
$closedRowsScanned = 0
$closedLongest = 0
$closedOverBudget = 0
$closedUnrecorded = 0
# $emDash is built from its code point by invariant 8 above: this file carries no UTF-8 BOM, so a
# literal one arrives as two characters under PowerShell 5.1 and matches nothing, in silence.
$closedRowPattern = '^- `REC-(?<id>[0-9]{3})`(?<residue> residue)? ' + $emDash + ' '
$closedTailPattern = '(?:`[0-9a-f]{7,40}`(?:, `[0-9a-f]{7,40}`)*|`' + $emDash + '`)$'
$closedText = [System.IO.File]::ReadAllText($ledgerClosedPath) -replace "`r`n", "`n"
$closedSplit = [regex]::Split($closedText, '(?m)^## Closed[ \t]*$')
if ($closedSplit.Count -ne 2) {
    Add-ValidationError "Closed recommendation ledger holds $($closedSplit.Count - 1) '## Closed' headings; the archive is one section by contract."
} else {
    $closedIds = [System.Collections.Generic.List[int]]::new()
    $previousId = 0
    foreach ($line in @($closedSplit[1] -split "`n" | Where-Object { $_.Trim() -ne '' })) {
        $row = [regex]::Match($line, $closedRowPattern)
        if (-not $row.Success) {
            # A wrapped continuation, a heading or a paragraph. The archive is one line per closure,
            # so prose here is the growth the 2026-08-18 split removed, arriving back.
            $excerpt = $line.Substring(0, [Math]::Min(60, $line.Length))
            Add-ValidationError "Closed ledger carries a line that is not a one-line REC-NNN closure row: '$excerpt'."
            continue
        }
        $rowId = $row.Groups['id'].Value
        $closedRowsScanned++
        if ($line.Length -gt $closedLongest) { $closedLongest = $line.Length }
        if ($line.Length -gt $closedBudget) { $closedOverBudget++ }
        $id = [int]$rowId
        if ($row.Groups['residue'].Success) {
            if ($id -ne $previousId) {
                Add-ValidationError "REC-$rowId residue does not sit under its own row; a residue line continues the ID above it."
            }
        } elseif ($id -le $previousId) {
            Add-ValidationError "Closed ledger is out of ID order or repeats an ID at REC-$rowId; the archive is ordered by ID, one line per closure."
        } else {
            $closedIds.Add($id)
        }
        $previousId = $id
        # Both tests are anchored to the FIELD, not to the shape anywhere on the line: a closure line
        # legitimately quotes a template or a hash inside the sentence saying what the item was - this
        # invariant's own closure row quotes the template it was written to catch.
        $tail = [regex]::Match($line, $closedTailPattern)
        if (-not $tail.Success) {
            if ($line -cmatch '\{commit\}`?[ 	]*$') {
                Add-ValidationError "REC-$rowId ends with the literal '{commit}' template instead of the hash it stands for."
            } else {
                Add-ValidationError "REC-$rowId ends with no implementation commit; the schema's last field is a hash, or an em dash for a closure that implemented nothing."
            }
        }
        if ($id -ge 58 -and $line -cnotmatch 'maps(?: unaffected|:)') {
            Add-ValidationError "REC-$rowId carries no two-map declaration; the line itself is what tells a later reader a checked map from a forgotten one."
        }
        # Keyed on the CLOSURE'S OWN COMMIT FIELD - the tail - and not on any hash anywhere on the
        # line: a rejection gates no edit and owes no reviewer, and a rejection reason legitimately
        # cites hashes. REC-078 names two and REC-087 one, inside the reasons that decline them.
        # REC-130 is the live post-107 instance: a false positive, closed with an em dash.
        $implemented = $tail.Success -and $tail.Value -cne ('`' + $emDash + '`')
        if ($id -ge 107 -and $implemented) {
            $verdictAt = $line.IndexOf('cold reviewer:')
            # The escape, and why it is not a loophole (`REC-195`). A verdict the collapse never
            # wrote cannot be recovered afterwards: `REC-190` was closed on 2026-09-01 with no
            # token, and neither the deleted row, the commit message nor any report holds it.
            # `REC-209` admitted a SECOND case this check cannot tell from the first - a field whose
            # rounds ran and never reached a closing one - and the round count plus the words
            # `no closing round` that separate them are prose the archive header requires and no
            # test here can see.
            # Silence and an invented `approve` are the two wrong answers - the first is
            # indistinguishable from a skipped gate, the second IS the self-approval this invariant
            # exists to expose. So an explicit `unrecorded` is accepted under three conditions that
            # keep it a record rather than a way out: it opens the field it is read from, it names a
            # `REC-NNN` row accounting for it, and every use is COUNTED ON THE PASS LINE, so the
            # escape cannot accumulate unseen. It is deliberately not offered to invariant 8's
            # self-reports: that report is written by the run that held the gate, so there a verdict
            # is never lost, only omitted.
            #
            # ORDER AND POSITION, both from this fix's own two cold-review rounds. The approve test
            # runs FIRST and keeps its original reach - the tail from the FIRST occurrence, scanned
            # forward - so a row whose prose *quotes* the escape ahead of its real field still
            # passes on the real one; the draft tested `unrecorded` first, from that same first
            # occurrence, and would have read the quotation as the verdict and never checked the
            # field at all (round 1's `reject`). The escape is then tested against EVERY occurrence
            # rather than one chosen position, and the citation may sit on any of them: reading only
            # the last failed a real cited field that its own line echoed afterwards, and reading
            # only the first is the rejected draft. This row's own closure line, which has to quote
            # the formula to say what it shipped, is the instance both single-position readings get
            # wrong.
            #
            # WHAT IT STILL CANNOT SETTLE, published rather than assumed: a line that quotes
            # `cold reviewer: unrecorded` in prose and carries no real verdict field is admitted as
            # unrecorded rather than failing. It is not silent - it needs the `REC-NNN` citation and
            # it moves the PASS-line count - and no reading of the characters on disk can separate
            # that line from one meaning it.
            if ($verdictAt -lt 0) {
                Add-ValidationError "REC-$rowId applied an edit and carries no 'cold reviewer:' field; on disk that is indistinguishable from a row that skipped the gate."
            } elseif ($line.Substring($verdictAt) -cmatch '(?<![A-Za-z0-9-])approve(?:-with-tightening)?(?![A-Za-z0-9-])') {
                # Bounded on BOTH sides (`REC-065`) so `disapprove` cannot satisfy it, and searched
                # only from the field onwards, so the word appearing in the row's prose cannot. The
                # historical `reject, then approve-with-tightening` shape still passes, as it must.
            } elseif ($line -cmatch 'cold reviewer:[ ]*unrecorded(?![A-Za-z0-9-])') {
                $closedUnrecorded++
                $cited = $false
                foreach ($fieldMatch in [regex]::Matches($line, 'cold reviewer:[ ]*unrecorded(?![A-Za-z0-9-])')) {
                    if ($line.Substring($fieldMatch.Index) -cmatch 'unrecorded.*REC-[0-9]{3}') { $cited = $true }
                }
                if (-not $cited) {
                    Add-ValidationError "REC-$rowId writes 'cold reviewer: unrecorded' and names no REC-NNN row accounting for it; a verdict that was lost, or one whose rounds never reached a closing one, is admitted by pointing at the row that adjudicates it, never by the word alone."
                }
            } else {
                Add-ValidationError "REC-$rowId carries a 'cold reviewer:' field that never reaches an approving verdict; only approve or approve-with-tightening may reach step 4."
            }
        }
    }
    # An ID cannot be queued and resolved at once. A collapse that adds the line and forgets to
    # remove the row leaves one item in two states, and the ledger is the current-status source.
    $openText = [System.IO.File]::ReadAllText($ledgerOpenPath) -replace "`r`n", "`n"
    $openSection = [regex]::Split($openText, '(?m)^## Open[ \t]*$')
    if ($openSection.Count -ge 2) {
        $openBody = [regex]::Split($openSection[1], '(?m)^## ')[0]
        foreach ($openRow in [regex]::Matches($openBody, '(?m)^\|[ \t]*REC-(?<id>[0-9]{3})[ \t]*\|')) {
            $openId = $openRow.Groups['id'].Value
            if ($closedIds -contains [int]$openId) {
                Add-ValidationError "REC-$openId is open in the ledger and closed in the archive at once; a collapse removes the row it adds the line for."
            }
        }
    }
}

# --- Invariant 1: the two skill adapters are one artifact -------------------
# Editing one without the other let Codex run a ritual two revisions old for
# three days in Jul 2026 with nothing announcing it.
function Get-SkillManifest {
    param([string]$SkillRoot)
    $manifest = @{}
    foreach ($file in Get-ChildItem -LiteralPath $SkillRoot -Recurse -File) {
        $relative = $file.FullName.Substring($SkillRoot.Length + 1)
        # Hash the content, not the bytes: with core.autocrlf=true a file's line
        # endings depend on whether git checked it out or a tool wrote it, so a
        # raw byte compare reports drift between two identical files.
        $latin1 = [System.Text.Encoding]::GetEncoding(28591)
        $content = $latin1.GetString([System.IO.File]::ReadAllBytes($file.FullName)) -replace "`r`n", "`n"
        $manifest[$relative] = Get-Sha256Hex ($latin1.GetBytes($content))
    }
    return $manifest
}
$claudeManifest = Get-SkillManifest $claudeSkills
$agentManifest = Get-SkillManifest $agentSkills
foreach ($relative in ($claudeManifest.Keys + $agentManifest.Keys | Sort-Object -Unique)) {
    if (-not $claudeManifest.ContainsKey($relative)) {
        Add-ValidationError "Skill mirror: .agents/skills/$relative has no .claude/skills counterpart."
    } elseif (-not $agentManifest.ContainsKey($relative)) {
        Add-ValidationError "Skill mirror: .claude/skills/$relative has no .agents/skills counterpart."
    } elseif ($claudeManifest[$relative] -ne $agentManifest[$relative]) {
        Add-ValidationError "Skill mirror: $relative differs between the two adapters."
    }
}

# --- Invariant 2: topic coverage file and its global mirror section ----------
# `_coverage-standard.md` calls the mirrors generated artifacts over the topic
# sources; a writer that touches one and not the other introduces drift that
# nothing else announces.
$coverageLevels = @()
$topicCoverageRoots = @()
$fingerprintReports = [System.Collections.Generic.List[string]]::new()
if (-not $MachineryOnly) {
$coverageLevels = @('junior', 'middle', 'senior')
$topicCoverageRoots = @(
    Get-ChildItem -LiteralPath (Join-Path $RepositoryRoot 'notes') -Directory |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'coverage') -PathType Container } |
        Where-Object { $_.Name -ne 'prompts' }
)
foreach ($level in $coverageLevels) {
    $mirrorPath = Join-Path $RepositoryRoot "notes\coverage\$level.md"
    $sectionBullets = @{}
    $currentSection = $null
    foreach ($line in [System.IO.File]::ReadAllLines($mirrorPath)) {
        if ($line -match '^##\s+(?<name>[^#].*)$') {
            # The folder name is the section name lowercased with spaces hyphenated,
            # so the map stays true when a topic is added.
            $currentSection = ($Matches['name'].Trim() -replace '\s+', '-').ToLowerInvariant()
            if (-not $sectionBullets.ContainsKey($currentSection)) {
                $sectionBullets[$currentSection] = [System.Collections.Generic.List[string]]::new()
            }
        } elseif ($null -ne $currentSection -and $line -like '- *') {
            $sectionBullets[$currentSection].Add($line)
        }
    }
    foreach ($topic in $topicCoverageRoots) {
        $topicFile = Join-Path $topic.FullName "coverage\$level.md"
        if (-not (Test-Path -LiteralPath $topicFile -PathType Leaf)) {
            Add-ValidationError "Coverage mirror: notes/$($topic.Name)/coverage/$level.md is missing."
            continue
        }
        if (-not $sectionBullets.ContainsKey($topic.Name)) {
            Add-ValidationError "Coverage mirror: notes/coverage/$level.md has no section for topic '$($topic.Name)'."
            continue
        }
        $topicRows = @([System.IO.File]::ReadAllLines($topicFile) | Where-Object { $_ -like '- *' })
        $mirrorRows = @($sectionBullets[$topic.Name])
        # -CaseSensitive: Compare-Object is case-insensitive by default, so without it a bullet
        # differing only in capitalisation reads as identical and the mirror diverges in silence.
        $drift = @(Compare-Object -ReferenceObject $topicRows -DifferenceObject $mirrorRows -CaseSensitive -SyncWindow ([int]::MaxValue))
        if ($drift.Count -gt 0) {
            $onlyTopic = @($drift | Where-Object { $_.SideIndicator -eq '<=' }).Count
            $onlyMirror = @($drift | Where-Object { $_.SideIndicator -eq '=>' }).Count
            Add-ValidationError "Coverage mirror drift at $level/$($topic.Name): $onlyTopic bullet(s) only in the topic file, $onlyMirror only in notes/coverage/$level.md."
        }
    }
    foreach ($section in $sectionBullets.Keys) {
        if ($section -notin $topicCoverageRoots.Name) {
            Add-ValidationError "Coverage mirror: notes/coverage/$level.md section '$section' has no notes/{topic}/coverage/ source."
        }
    }
}

# --- Invariant 3: a notes plan's Plan status agrees with its fingerprint -----
# Reports, never repairs: clearing a stale flag without running /notes-plan is
# the exact lie the flag exists to prevent.
function Get-CoverageDigest {
    param([string]$Path)
    # Byte-faithful reimplementation of the canonical command in
    # `_coverage-standard.md`: `tr -d '\r'` normalises LF, CRLF, and mixed-line-ending
    # checkouts before sed strips the two marker forms. The CR removal is explicit in
    # both implementations so the digest does not depend on sed's text-mode behaviour.
    $latin1 = [System.Text.Encoding]::GetEncoding(28591)
    $text = $latin1.GetString([System.IO.File]::ReadAllBytes($Path)) -replace "`r", ''
    $mark = [regex]::Escape($latin1.GetString([System.Text.Encoding]::UTF8.GetBytes([char]0x2705)))
    $dash = [regex]::Escape($latin1.GetString([System.Text.Encoding]::UTF8.GetBytes([char]0x2014)))
    $lines = $text -split "`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $lines[$i] = [regex]::Replace($lines[$i], " $mark [0-9]{2}-[a-z0-9-]+( $dash .*)?`$", '')
        $lines[$i] = [regex]::Replace($lines[$i], " $mark sql:[0-9]{2}-[a-z0-9-]+`$", '')
    }
    return Get-Sha256Hex ($latin1.GetBytes($lines -join "`n"))
}
foreach ($topic in $topicCoverageRoots) {
    foreach ($level in $coverageLevels) {
        $planPath = Join-Path $topic.FullName "coverage\notes-plan-$level.md"
        if (-not (Test-Path -LiteralPath $planPath -PathType Leaf)) { continue }
        $coveragePath = Join-Path $topic.FullName "coverage\$level.md"
        $planText = [System.IO.File]::ReadAllText($planPath)
        $storedMatch = [regex]::Match($planText, '(?m)^Coverage SHA-256:\s*(?<sha>[0-9a-f]{64})\s*$')
        $statusMatch = [regex]::Match($planText, '(?m)^Plan status:\s*(?<status>current|stale)\s*$')
        $planName = "notes/$($topic.Name)/coverage/notes-plan-$level.md"
        if (-not $storedMatch.Success) {
            Add-ValidationError "Notes plan lacks a 64-character Coverage SHA-256: $planName."
            continue
        }
        if (-not $statusMatch.Success) {
            Add-ValidationError "Notes plan lacks a 'Plan status: current|stale' line: $planName."
            continue
        }
        # The digest is computed from the plan's location, never from its `Coverage:` line, so a wrong
        # header would fingerprint one file while naming another.
        $coverageMatch = [regex]::Match($planText, '(?m)^Coverage:\s*(?<path>\S+)\s*$')
        $expectedCoverage = "notes/$($topic.Name)/coverage/$level.md"
        if (-not $coverageMatch.Success -or $coverageMatch.Groups['path'].Value -ne $expectedCoverage) {
            Add-ValidationError "Notes plan declares Coverage '$($coverageMatch.Groups['path'].Value)' but is fingerprinted against '$expectedCoverage': $planName."
            continue
        }
        # Not $matches: that name shadows PowerShell's automatic regex-capture variable.
        $digestAgrees = $storedMatch.Groups['sha'].Value -eq (Get-CoverageDigest $coveragePath)
        $status = $statusMatch.Groups['status'].Value
        if ($status -eq 'current' -and -not $digestAgrees) {
            # Hard failure: notes-audit runs against this plan on the strength of
            # the word `current`, and the scope it was mapped against has moved.
            Add-ValidationError "Notes plan claims 'current' but its Coverage SHA-256 no longer matches its coverage file: $planName."
        } elseif ($status -eq 'stale' -and $digestAgrees) {
            # Not a failure: the flag may be owed to something other than the
            # fingerprint, and clearing it here would be the forbidden repair.
            $fingerprintReports.Add("$planName is flagged stale while its Coverage SHA-256 matches its coverage file.")
        }

        # `Pending study` grammar and its one cross-field invariant. Five writers touch study state and
        # none of them can see each other's runs, so a malformed or stranded entry would otherwise sit
        # in a plan indefinitely: nothing else in the system reads this field except the ritual that
        # clears it, and that ritual clears by exact line match. Every string below stays ASCII for the
        # same reason `$dash` above is built from a code point: this file has no BOM, so PowerShell 5.1
        # reads it as ANSI and a literal em dash decodes to a smart quote that closes the string early.
        $entryPattern = '(?m)^##\s+(?<num>\d{2})\b.*?(?=^##\s|\z)'
        foreach ($entry in [regex]::Matches($planText, $entryPattern, 'Singleline')) {
            $body = $entry.Value
            $entryName = "$planName entry $($entry.Groups['num'].Value)"
            $studiedMatch = [regex]::Match($body, '(?m)^Studied:\s*(?<v>pending|\d{4}-\d{2}-\d{2})\s*$')
            $gapMatch = [regex]::Match($body, '(?m)^Pending study:(?<v>[^\r\n]*)')
            if (-not $gapMatch.Success) { continue }   # legacy entry; the next reconciliation adds it

            $inline = $gapMatch.Groups['v'].Value.Trim()
            $listBlock = [regex]::Match($body, '(?m)^Pending study:[^\r\n]*\r?\n(?<rest>(?:[ \t]*-[^\r\n]*\r?\n?)*)')
            $listed = @()
            if ($listBlock.Success) {
                $listed = @($listBlock.Groups['rest'].Value -split '\r?\n' | Where-Object { $_.Trim() -ne '' })
            }

            if ($inline -eq 'none') {
                if ($listed.Count -gt 0) {
                    Add-ValidationError "Pending study says 'none' but is followed by $($listed.Count) listed section line(s): $entryName."
                }
            } elseif ($inline -ne '') {
                Add-ValidationError "Pending study must be 'none' or an empty header above a list, got '$inline': $entryName."
            } elseif ($listed.Count -eq 0) {
                Add-ValidationError "Pending study is neither 'none' nor followed by a listed section: $entryName."
            }

            # Shape: - "## 5 ... " (added 2026-08-22). The quoted English heading is what
            # study-block-close deletes by exact match, so a drifted shape is an entry nothing can clear.
            foreach ($line in $listed) {
                if ($line -notmatch '^\s*-\s+"##\s+\S.*"\s+\(added\s+\d{4}-\d{2}-\d{2}\)\s*$') {
                    Add-ValidationError ("Pending study line does not match the required shape: {0} :: {1}" -f $entryName, $line.Trim())
                }
            }

            # The field describes sections that landed after the date, so a pending study state has
            # nothing to describe. Every reset path is required to write `none` in the same edit.
            if ($studiedMatch.Success -and $studiedMatch.Groups['v'].Value -eq 'pending' -and $listed.Count -gt 0) {
                Add-ValidationError "Pending study lists $($listed.Count) section line(s) while Studied is 'pending', so they are stranded: $entryName."
            }
        }
    }
}

# The same `Coverage SHA-256` contract lives in two shapes the loop above cannot reach.
foreach ($routePlan in Get-ChildItem -LiteralPath (Join-Path $RepositoryRoot 'practice\sql') -Recurse -File -Filter 'PLANNING-*.md') {
    $routeName = $routePlan.FullName.Substring($RepositoryRoot.Length + 1).Replace('\', '/')
    $routeText = [System.IO.File]::ReadAllText($routePlan.FullName)
    $routeCoverage = [regex]::Match($routeText, '(?m)^Coverage:\s*(?<path>\S+)\s*$')
    $routeSha = [regex]::Match($routeText, '(?m)^Coverage SHA-256:\s*(?<sha>[0-9a-f]{64})\s*$')
    $routeStatus = [regex]::Match($routeText, '(?m)^Plan status:\s*(?<status>current|stale)\s*$')
    if (-not ($routeCoverage.Success -and $routeSha.Success -and $routeStatus.Success)) {
        Add-ValidationError "SQL route plan lacks Coverage / Coverage SHA-256 / Plan status: $routeName."
        continue
    }
    $routeDigest = Get-CoverageDigest (Join-Path $RepositoryRoot $routeCoverage.Groups['path'].Value.Replace('/', '\'))
    if ($routeStatus.Groups['status'].Value -eq 'current' -and $routeSha.Groups['sha'].Value -ne $routeDigest) {
        Add-ValidationError "SQL route plan claims 'current' but its Coverage SHA-256 no longer matches its coverage file: $routeName."
    }
}

# Simulation routes fingerprint a manifest rather than one coverage file. Each §1 row carries the
# canonical scope digest, and the header hashes the sorted path<TAB>digest manifest. A literal
# `Plan status: current` is a safety claim because the opener may allow a timed attempt on its strength.
$simulationRoot = Join-Path $RepositoryRoot 'practice\simulations'
if (Test-Path -LiteralPath $simulationRoot -PathType Container) {
    foreach ($simulationRoute in Get-ChildItem -LiteralPath $simulationRoot -Recurse -File -Filter 'PLANNING-*.md') {
        $routePathMatch = [regex]::Match(
            $simulationRoute.FullName,
            '[\\/](?<level>junior|middle|senior)[\\/]PLANNING-\k<level>\.md$'
        )
        if (-not $routePathMatch.Success) { continue }
        $routeLevel = $routePathMatch.Groups['level'].Value
        $simulationName = $simulationRoute.FullName.Substring($RepositoryRoot.Length + 1).Replace('\', '/')
        $simulationText = [System.IO.File]::ReadAllText($simulationRoute.FullName)
        $statusMatch = [regex]::Match($simulationText, '(?m)^Plan status:\s*(?<status>current|stale)\s*$')
        $manifestMatch = [regex]::Match($simulationText, '(?m)^Coverage manifest SHA-256:\s*(?<sha>[0-9a-f]{64})\s*$')
        $progressMatch = [regex]::Match($simulationText, '(?m)^Progress snapshot:\s*(?<sha>[0-9a-f]{64})\s*$')
        # Same encoding trap as Get-SqlRouteFileNames: written as a literal, this check mark is
        # read as ANSI mojibake and `closed` can never match, so the first level to close would
        # have been failed for "lacking level status metadata" it plainly carries. Found while
        # adding invariant 7; no route file exists yet, so it has never run.
        $closedMark = [char]0x2705
        $levelStatusMatch = [regex]::Match($simulationText, "(?m)^Level status:\s*(?<status>open|closed $closedMark)\s*`$")
        if (-not ($statusMatch.Success -and $manifestMatch.Success -and $progressMatch.Success -and $levelStatusMatch.Success)) {
            Add-ValidationError "Simulation route lacks Plan status / manifest / progress snapshot / level status metadata: $simulationName."
            continue
        }

        $rowMatches = [regex]::Matches(
            $simulationText,
            '(?m)^\|\s*(?<path>notes/[a-z0-9-]+/coverage/(junior|middle|senior)\.md)\s*\|\s*(?<sha>[0-9a-f]{64})\s*\|\s*$'
        )
        if ($rowMatches.Count -eq 0) {
            Add-ValidationError "Simulation route has no parseable Coverage file | Scope SHA-256 manifest rows: $simulationName."
            continue
        }

        $manifestRows = [System.Collections.Generic.List[string]]::new()
        $seenCoveragePaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
        $scopeMoved = $false
        foreach ($row in $rowMatches) {
            $coverageRelative = $row.Groups['path'].Value
            if (-not $seenCoveragePaths.Add($coverageRelative)) {
                Add-ValidationError "Simulation route manifest repeats coverage path '$coverageRelative': $simulationName."
                $scopeMoved = $true
                continue
            }
            if ($coverageRelative -notmatch "/coverage/$([regex]::Escape($routeLevel))\.md$") {
                Add-ValidationError "Simulation route level '$routeLevel' names cross-level coverage '$coverageRelative': $simulationName."
                $scopeMoved = $true
                continue
            }
            $coverageAbsolute = Join-Path $RepositoryRoot $coverageRelative.Replace('/', '\')
            if (-not (Test-Path -LiteralPath $coverageAbsolute -PathType Leaf)) {
                Add-ValidationError "Simulation route manifest names a missing coverage file '$coverageRelative': $simulationName."
                $scopeMoved = $true
                continue
            }
            $actualScope = Get-CoverageDigest $coverageAbsolute
            if ($actualScope -ne $row.Groups['sha'].Value) { $scopeMoved = $true }
            $manifestRows.Add("$coverageRelative`t$actualScope")
        }

        $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
        $manifestText = (($manifestRows | Sort-Object) -join "`n") + "`n"
        $actualManifest = Get-Sha256Hex ($utf8NoBom.GetBytes($manifestText))
        $manifestMoved = $scopeMoved -or $manifestMatch.Groups['sha'].Value -ne $actualManifest
        if ($statusMatch.Groups['status'].Value -eq 'current' -and $manifestMoved) {
            Add-ValidationError "Simulation route claims 'current' but its coverage manifest no longer matches disk: $simulationName."
        } elseif ($statusMatch.Groups['status'].Value -eq 'stale' -and -not $manifestMoved) {
            $fingerprintReports.Add("$simulationName is flagged stale while its coverage manifest matches disk.")
        }

        $actualProgress = Get-Sha256Hex ([System.IO.File]::ReadAllBytes((Join-Path $RepositoryRoot 'PROGRESS.md')))
        if ($progressMatch.Groups['sha'].Value -ne $actualProgress) {
            $fingerprintReports.Add("$simulationName has an unadjudicated PROGRESS.md snapshot; /simulation-plan must rule before the next attempt.")
        }
    }
}

# `superseded` is the schema's own word for "the digest moved" (`coverage-verify-prompt.md`). Claiming
# `complete` against a moved digest is the same assertion as `Plan status: current` against one, so it
# reports rather than repairs - only the owning prompt may re-verify.
foreach ($topic in $topicCoverageRoots) {
    foreach ($level in $coverageLevels) {
        $verifyPath = Join-Path $topic.FullName "coverage\verify-$level.md"
        if (-not (Test-Path -LiteralPath $verifyPath -PathType Leaf)) { continue }
        $verifyName = "notes/$($topic.Name)/coverage/verify-$level.md"
        $verifyText = [System.IO.File]::ReadAllText($verifyPath)
        $verifyVerdict = [regex]::Match($verifyText, '(?m)^Verdict:\s*(?<verdict>complete|gaps|superseded)\s*$')
        $verifySha = [regex]::Match($verifyText, '(?m)^Coverage SHA-256:\s*(?<sha>[0-9a-f]{64})\s*$')
        if (-not ($verifyVerdict.Success -and $verifySha.Success)) {
            Add-ValidationError "Coverage verification lacks a 'Verdict:' or a 64-character Coverage SHA-256: $verifyName."
            continue
        }
        if ($verifyVerdict.Groups['verdict'].Value -ne 'superseded' -and
            $verifySha.Groups['sha'].Value -ne (Get-CoverageDigest (Join-Path $topic.FullName "coverage\$level.md"))) {
            $fingerprintReports.Add("$verifyName claims '$($verifyVerdict.Groups['verdict'].Value)' while its Coverage SHA-256 no longer matches its coverage file - the schema's word for that state is 'superseded'.")
        }
    }
}
}

# --- Invariant 5: the maps know the machinery exists -------------------------
# The two-map rule and the `map-sync` ritual both fire on judgement, so neither
# can catch a run where they simply did not fire. This is the layer that can:
# it never asks whether a cell is *true* - only a read can - but it does catch
# machinery added while a map never learned of it. It found `profile-readme`
# absent from every section of the map on its first run.
# ASCII only: PowerShell 5.1 reads a BOM-less .ps1 as ANSI, so an em dash in a
# pattern here silently becomes mojibake and the section match returns nothing.
$mapPath = Join-Path $promptRoot '_internal\_system-map.md'
$mapText = [System.IO.File]::ReadAllText($mapPath)
$readmeText = [System.IO.File]::ReadAllText((Join-Path $promptRoot 'README.md'))

$diskSkills = @()
$skillSection = [regex]::Match($mapText, '(?sm)^##\s*9\b.*?(?=^##\s*10\b)')
if (-not $skillSection.Success) {
    Add-ValidationError '_system-map.md has no section 9 (the skills registry) to check the skill directories against.'
} else {
    # The name is the first backticked token in the row, wherever the row puts it.
    # Anchoring it to column 1 meant that adding a column to the table - an ordinary
    # editorial act - reported all twelve skills as missing while every row was present.
    $mapSkills = @(
        [regex]::Matches($skillSection.Value, '(?m)^\|.*$') |
            ForEach-Object { [regex]::Match($_.Value, '`(?<name>[a-z0-9-]+)`') } |
            Where-Object { $_.Success } |
            ForEach-Object { $_.Groups['name'].Value }
    )
    # .agents parity is invariant 1's job: it fails on any skill present in one adapter
    # and not the other, so reading .claude alone here cannot hide an .agents-only
    # directory. Weakening invariant 1 would silently open that hole.
    $diskSkills = @(Get-ChildItem -LiteralPath $claudeSkills -Directory | Select-Object -ExpandProperty Name)
    # -SyncWindow is left at its default, which is already [int]::MaxValue; the coverage
    # mirror sets it explicitly. Both are correct - do not "reconcile" them by guessing.
    foreach ($drift in @(Compare-Object -ReferenceObject @($mapSkills | Sort-Object) -DifferenceObject @($diskSkills | Sort-Object) -CaseSensitive)) {
        if ($drift.SideIndicator -eq '=>') {
            Add-ValidationError "Skill '$($drift.InputObject)' exists on disk but has no row in _system-map.md section 9."
        } else {
            Add-ValidationError "_system-map.md section 9 has a row for '$($drift.InputObject)', which is not a skill directory."
        }
    }

    # The count is written as an English word, and it goes stale exactly one commit
    # after a skill is added - the failure REC-057 caught in README.md's own prose.
    $numberWords = @('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
        'eighteen', 'nineteen', 'twenty')
    # The number may be emphasised - _system-map.md bolds most of its load-bearing words -
    # and a cosmetic `All **twelve**` must not read as "the count sentence is gone".
    $countClaim = [regex]::Match($skillSection.Value, '(?m)^All\s+[*_]{0,2}(?<word>[a-z]+)[*_]{0,2}\s+are mirrored')
    if (-not $countClaim.Success) {
        Add-ValidationError '_system-map.md section 9 no longer states how many skills are mirrored.'
    } elseif ($diskSkills.Count -ge $numberWords.Count -or $countClaim.Groups['word'].Value -ne $numberWords[$diskSkills.Count]) {
        Add-ValidationError "_system-map.md section 9 claims 'All $($countClaim.Groups['word'].Value)' skills; $($diskSkills.Count) exist on disk."
    }
}

# The slash command is the launcher's own filename, never the prompt name minus its
# suffix. Guessing it is wrong for `code-review-prompt`, which launches deliberately as
# `/code-review-practice` because the host agent's own diff review already owns
# `/code-review` - true of both adapters, see README.md "The 31 runnable prompts".
$launcherCommands = @{}
foreach ($claudeLauncher in $claudeLaunchers) {
    $launcherTarget = [regex]::Match(
        [System.IO.File]::ReadAllText($claudeLauncher.FullName),
        'notes/prompts/(?![A-Za-z0-9_./-]*_internal/)[A-Za-z0-9_./-]+\.md'
    )
    if ($launcherTarget.Success) {
        $launcherCommands[[System.IO.Path]::GetFileName($launcherTarget.Value)] = $claudeLauncher.BaseName
    }
}

foreach ($prompt in $runnable) {
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($prompt.Name)
    $command = if ($launcherCommands.ContainsKey($prompt.Name)) { $launcherCommands[$prompt.Name] } else { $stem -replace '-prompt$', '' }
    # Either form counts as being on the map: the file's own name, or its slash command,
    # which is how the chain sections in 3-6 refer to a prompt.
    # Both tests are BOUNDED and CASE-SENSITIVE, and both had to be. A bare substring
    # test let `sql-plan-audit` satisfy `plan-audit`, so every mention of the prompt that
    # plans a project could leave both maps unnoticed; and -notmatch is case-insensitive
    # by default, so `/tracker` was satisfied by the path `practice/simulations/TRACKER.md`
    # in a different section - the same blindness the coverage mirror was caught with.
    $bounded = "(?<![A-Za-z0-9-])$([regex]::Escape($stem))(?![A-Za-z0-9-])"
    $boundedCommand = "/$([regex]::Escape($command))(?![A-Za-z0-9-])"
    if ($mapText -cnotmatch $bounded -and $mapText -cnotmatch $boundedCommand) {
        Add-ValidationError "Runnable prompt '$stem' is named nowhere in _system-map.md."
    }
    if ($readmeText -cnotmatch "(?<![A-Za-z0-9-])$([regex]::Escape($prompt.Name))") {
        Add-ValidationError "Runnable prompt '$($prompt.Name)' has no entry in README.md."
    }
}

# --- Invariant 6: a launcher's public argument contract matches its prompt ---
# Filename parity, target parity, delegation and runtime isolation were all checked; what a
# launcher *advertises* was not. Two /system-check runs found eight such mismatches by prose
# review alone, and the fix that closed them was itself verified by hand - which is the
# evidence that the guarantee is manual and will drift again in silence.
#
# The canonical config block is written in TWO forms and both are legitimate:
#   (a) `## Configuration` as the first content line INSIDE the fence - the fence is what
#       Victor pastes into a fresh chat, so the heading has to travel with it;
#   (b) a `## Configuration` markdown heading whose next non-blank line opens the fence.
# It is tied to that heading and never guessed, because a `## How to use - recipes` block
# uses the very same `KEY = value` shape: a locator that takes the first fenced block with a
# key finds the recipe instead, and reports 15 of 31 prompts as broken while all 31 are right.
function Get-PromptConfigBlock {
    param([string]$Text)
    # LF first. Some of these files are checked out CRLF and some LF (core.autocrlf decides,
    # not the author), and a `$`-anchored fence pattern silently matches nothing on the CRLF
    # half - it reported 9 of 31 prompts as having no config block while all 31 had one.
    $Text = $Text -replace "`r`n", "`n"
    $insideForm = [regex]::Match($Text, '(?ms)^(?<fence>`{3,})[a-z]*\n(?<body>##[ \t]*Configuration\b.*?)^\k<fence>[ \t]*$')
    $headingForm = [regex]::Match($Text, '(?ms)^##[ \t]*Configuration\b[^\n]*\n(?:[ \t]*\n)*(?<fence>`{3,})[a-z]*\n(?<body>.*?)^\k<fence>[ \t]*$')
    $candidates = @(@($insideForm, $headingForm) | Where-Object { $_.Success } | Sort-Object Index)
    if ($candidates.Count -eq 0) { return $null }
    return $candidates[0].Groups['body'].Value
}

# `KEY = [a | b]  <- comment`: the brackets are syntax and everything after them is prose for
# the reader, so both are stripped before a value is ever compared.
function Get-ConfigArguments {
    param([string]$Block)
    $arguments = [ordered]@{}
    foreach ($line in ($Block -split "`r?`n")) {
        $declaration = [regex]::Match($line, '^(?<key>[A-Z][A-Z0-9_]{1,})[ \t]*=[ \t]*(?<value>.*)$')
        if (-not $declaration.Success) { continue }
        $value = $declaration.Groups['value'].Value.Trim()
        if ($value.StartsWith('[')) {
            $value = $value.Substring(1)
            $close = $value.IndexOf(']')
            if ($close -ge 0) { $value = $value.Substring(0, $close) }
        }
        # A key declared twice is UNIONED, not overwritten and not first-wins. Two prompts
        # declare one per mode - `plan-audit`'s `PROJECT` (blank in new mode, a path list in
        # review mode) and `tracker`'s `EMPRESA`/`PUESTO` (log vs update) - so taking either
        # declaration alone states half a contract, and the half it picks is an accident of
        # order.
        $key = $declaration.Groups['key'].Value
        if ($arguments.Contains($key)) {
            $arguments[$key] = ($arguments[$key] + ' | ' + $value.Trim()).Trim()
        } else {
            $arguments[$key] = $value.Trim()
        }
    }
    return $arguments
}

# An `argument-hint` is one line of space-separated tokens, and an optional argument is
# written `[KEY=...]` - so a value runs to the closing bracket or to the next key, never to
# the next space: `[SECTION=all|exact heading]` is one value list containing a space.
function Get-HintArguments {
    param([string]$Hint)
    $arguments = [ordered]@{}
    $keys = @([regex]::Matches($Hint, '(?<![A-Za-z0-9_])(?<key>[A-Z][A-Z0-9_]{1,})='))
    for ($i = 0; $i -lt $keys.Count; $i++) {
        $start = $keys[$i].Index + $keys[$i].Length
        $end = if ($i + 1 -lt $keys.Count) { $keys[$i + 1].Index } else { $Hint.Length }
        $value = $Hint.Substring($start, $end - $start)
        # A value ends at its own closing bracket or at the one that OPENS the next optional
        # argument - `MODE=paste|search [FOCUS=...]` is two arguments, not a value list whose
        # last token is `[`. Cutting only on `]` left nine keys with an unmatched bracket in
        # their value, which the closed-enumeration test then declined to compare: a silent
        # exemption of a third of the population, which is worse than no check.
        $close = $value.IndexOfAny([char[]]@(']', '['))
        if ($close -ge 0) { $value = $value.Substring(0, $close) }
        # In a HINT - and only in a hint - a value list is written without spaces, so the first
        # whitespace ends it and what follows is prose for the reader. Keeping the prose made
        # `MODE=update|dryrun (default update)` a token containing a space, which the closed
        # test then declined to compare and the wrong value passed. (The config block writes
        # `[a | b]` WITH spaces, which is why this cut belongs here and not in that test: doing
        # it there truncated every prompt-side list to its first value and failed 30 launchers.)
        $value = ($value.Trim() -split '\s')[0]
        # First wins, and the caller compares this count against the raw `KEY=` token count to
        # catch the duplicate: a hint declaring one key twice is malformed rather than a union,
        # since only one of the two can be what the launcher accepts.
        if (-not $arguments.Contains($keys[$i].Groups['key'].Value)) {
            $arguments[$keys[$i].Groups['key'].Value] = $value.Trim()
        }
    }
    return $arguments
}

# Only a CLOSED enumeration is comparable. `STEP = [current | <n>]` and `SECTION = [all |
# ## Routing | ...]` are metavariables and open lists: the two files legitimately describe
# them in different vocabularies, and REC-074's rule is that two statements of a rule cannot
# be compared until their terms are defined in one place. So the shape decides - a set every
# one of whose tokens is a bare identifier is compared exactly, anything else is not compared
# at all, and neither side may quietly widen the other.
function Get-ClosedEnumeration {
    param([string]$Value)
    $tokens = @(($Value -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
    # A ONE-value list is comparable and used to be exempt: `[MODE=updat]` against
    # `[update | dry-run]` passed silently. One token is a membership claim, not a set claim,
    # and the caller tests it as one.
    if ($tokens.Count -lt 1) { return $null }
    foreach ($token in $tokens) {
        if ($token -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._-]*$') { return $null }
    }
    # `,@(...)`: PowerShell unrolls a returned array, so a ONE-value list came back as a bare
    # string and `$values[0]` then indexed its first character - the membership finding read
    # "advertises 'MODE = u'". The unary comma preserves the array through the return.
    return ,@($tokens | Sort-Object)
}

# Counted and published, because a value check that quietly compares nothing passes just as
# loudly as one that compares everything. Roughly half of these keys are metavariables or
# free-form fields (`EMPRESA`, `<path>`, an exact heading) and are deliberately not compared;
# the PASS line says how many were, so the number is falsifiable by reading it.
$argumentKeysChecked = 0
$argumentValuesCompared = 0
$argumentHintPairs = 0

foreach ($claudeLauncher in $claudeLaunchers) {
    $codexLauncher = Join-Path $codexRoot $claudeLauncher.Name
    if (-not (Test-Path -LiteralPath $codexLauncher -PathType Leaf)) { continue }  # already reported above
    $claudeText = [System.IO.File]::ReadAllText($claudeLauncher.FullName)
    $codexText = [System.IO.File]::ReadAllText($codexLauncher)
    $claudeHint = [regex]::Match($claudeText, '(?m)^argument-hint:[ \t]*(?<hint>.*)$')
    $codexHint = [regex]::Match($codexText, '(?m)^argument-hint:[ \t]*(?<hint>.*)$')
    if (-not ($claudeHint.Success -and $codexHint.Success)) {
        Add-ValidationError "Launcher lacks an argument-hint contract: $($claudeLauncher.Name)."
        continue
    }
    # Catalogue equality first. It is exact, it costs nothing, and it is what lets every test
    # below run once over the Claude catalogue and still cover both - do not "fix" that into
    # a second loop.
    if ($claudeHint.Groups['hint'].Value.Trim() -cne $codexHint.Groups['hint'].Value.Trim()) {
        Add-ValidationError "The two catalogues advertise different arguments for $($claudeLauncher.Name)."
        continue
    }
    # Counted here, where the pair was actually compared. Printing the runnable-prompt count in
    # its place was true only by an argument the reader of the PASS line cannot see.
    $argumentHintPairs++

    $target = [regex]::Match($claudeText, 'notes/prompts/(?![A-Za-z0-9_./-]*_internal/)[A-Za-z0-9_./-]+\.md')
    if (-not $target.Success) { continue }  # already reported by Get-LauncherTargets
    $promptPath = Join-Path $RepositoryRoot $target.Value.Replace('/', '\')
    if (-not (Test-Path -LiteralPath $promptPath -PathType Leaf)) { continue }  # already reported as a dead path

    $hintArguments = Get-HintArguments $claudeHint.Groups['hint'].Value
    $hintKeyTokens = @([regex]::Matches($claudeHint.Groups['hint'].Value, '(?<![A-Za-z0-9_])[A-Z][A-Z0-9_]{1,}='))
    # .PSBase.Count throughout, never .Count: member access on a dictionary resolves a KEY of
    # that name first, and `sql-exercises` has a `COUNT` argument - so `$hintArguments.Count`
    # returned the string `N` and reported that launcher as declaring a duplicate key.
    if ($hintKeyTokens.Count -ne $hintArguments.PSBase.Count) {
        Add-ValidationError "$($claudeLauncher.Name) declares the same argument key twice in its argument-hint."
        continue
    }
    $configBlock = Get-PromptConfigBlock ([System.IO.File]::ReadAllText($promptPath))
    # A prompt that takes no arguments has no block, and its launcher advertises no key. Both
    # halves are read off shape, so no prompt is exempt by name.
    if ($null -eq $configBlock) {
        if ($hintArguments.PSBase.Count -gt 0) {
            Add-ValidationError "$($claudeLauncher.Name) advertises $($hintArguments.PSBase.Count) argument(s) but $($target.Value) has no locatable '## Configuration' block."
        }
        continue
    }
    $configArguments = Get-ConfigArguments $configBlock
    if ($hintArguments.PSBase.Count -eq 0 -and $configArguments.PSBase.Count -gt 0) {
        Add-ValidationError "$($target.Value) declares $($configArguments.PSBase.Count) configuration key(s) that $($claudeLauncher.Name) advertises none of."
        continue
    }

    foreach ($key in $hintArguments.Keys) {
        $argumentKeysChecked++
        if (-not $configArguments.Contains($key)) {
            Add-ValidationError "$($claudeLauncher.Name) advertises '$key', which is not a configuration key of $($target.Value)."
            continue
        }
        $hintValues = Get-ClosedEnumeration $hintArguments[$key]
        $configValues = Get-ClosedEnumeration $configArguments[$key]
        if ($null -eq $hintValues -or $null -eq $configValues) { continue }
        $argumentValuesCompared++
        # A single advertised value is a MEMBERSHIP claim against the prompt's set; two or more
        # are a claim to be the same set. Testing only the second exempted every one-value hint.
        if ($hintValues.Count -eq 1 -and $configValues.Count -gt 1) {
            if ($hintValues[0] -cnotin $configValues) {
                Add-ValidationError "$($claudeLauncher.Name) advertises '$key = $($hintValues[0])', which is not one of the values $($target.Value) accepts ('$($configValues -join '|')')."
            }
        } elseif (@(Compare-Object $configValues $hintValues -CaseSensitive).Count -gt 0) {
            Add-ValidationError "$($claudeLauncher.Name) advertises '$key = $($hintValues -join '|')' where $($target.Value) accepts '$($configValues -join '|')'."
        }
    }
    foreach ($key in $configArguments.Keys) {
        # The hint is not the whole contract: an optional derived key such as coverage's
        # NOTES_PATH is deliberately kept out of the hint and explained in the launcher's
        # Rules instead. Named anywhere in EITHER launcher is the test - the two hints are
        # identical by the clause above, but the Rules bodies are genuinely platform-specific
        # and are not mirrored, so reading only the Claude one would pass a key documented
        # exclusively in the Codex catalogue. Bounded and case-sensitive, per REC-065.
        $named = "(?<![A-Za-z0-9_])$([regex]::Escape($key))(?![A-Za-z0-9_])"
        if ($claudeText -cnotmatch $named -and $codexText -cnotmatch $named) {
            Add-ValidationError "$($target.Value) accepts '$key', which neither launcher for $($claudeLauncher.BaseName) mentions."
        }
    }
}

foreach ($adapterName in @('AGENTS.md', 'CLAUDE.md')) {
    $adapterPath = Join-Path $RepositoryRoot $adapterName
    $adapterText = [System.IO.File]::ReadAllText($adapterPath)
    if ($adapterText -notmatch '_session-rules\.md') {
        Add-ValidationError "$adapterName does not delegate to the shared session rules."
    }
    if (($adapterText -split '\r?\n').Count -gt 25) {
        Add-ValidationError "$adapterName is no longer a thin adapter."
    }
}

$representativeContracts = @{
    'knowledge\notes\notes-audit.md' = @('Runtime contract', 'coverage-fingerprinted plan', 'TOPIC + LEVEL + NOTE', 'commit')
    'projects\review\review-audit.md' = @('Runtime contract', 'PROJECT-BACKLOG.md', 'commit')
    'practice\sql\sql-exercises-prompt.md' = @('Runtime contract', 'Brief blocking questions', 'MODE')
    'strategy\tracking\progress-update-prompt.md' = @('Runtime contract', 'PROGRESS.md', 'active branch')
}
foreach ($relativePath in $representativeContracts.Keys) {
    $text = [System.IO.File]::ReadAllText((Join-Path $promptRoot $relativePath))
    foreach ($requiredTerm in $representativeContracts[$relativePath]) {
        if ($text -notmatch [regex]::Escape($requiredTerm)) {
            Add-ValidationError "Representative contract dry run failed: $relativePath lacks '$requiredTerm'."
        }
    }
}

$missingProbe = Join-Path $RepositoryRoot '__prompt_preflight_missing__\input.md'
if (Test-ExternalPathPreflight @($missingProbe)) {
    Add-ValidationError 'External-path preflight simulation accepted a missing input.'
}
if (Test-Path -LiteralPath (Split-Path $missingProbe -Parent)) {
    Add-ValidationError 'External-path preflight simulation created state for a missing input.'
}

if ($errors.Count -gt 0) {
    # -ErrorAction Continue, because the script-wide 'Stop' preference otherwise
    # makes the first Write-Error terminating and hides every later finding.
    $errors | ForEach-Object { Write-Error $_ -ErrorAction Continue }
    exit 1
}

Write-Output "PASS: $expectedRunnableCount canonical prompts"
Write-Output "PASS: $expectedRunnableCount Claude launchers"
Write-Output "PASS: $expectedRunnableCount Codex launchers"
Write-Output 'PASS: launcher target parity, full delegation, and canonical runtime isolation'
Write-Output "PASS: launcher argument contracts ($argumentHintPairs identical hint pairs, $argumentKeysChecked keys both ways, $argumentValuesCompared closed enumerations compared)"
Write-Output 'PASS: runnable prompt entry-point and self-report contracts'
Write-Output 'PASS: representative contract dry runs'
Write-Output 'PASS: external-path failure simulation'
Write-Output 'PASS: thin session adapters share one rules source'
Write-Output "PASS: path references resolve ($($referenceScan.Count) files scanned, all three path forms)"
if ($proposedPathReports.Count -gt 0) {
    # Reported and counted, never a silent exemption: a ledger row may name machinery that does not
    # exist yet, and a typo in one of those names looks exactly the same from here.
    Write-Output "REPORT: $($proposedPathReports.Count) path(s) proposed by a ledger row do not exist - verify each is a proposal and not a typo:"
    $proposedPathReports | ForEach-Object { Write-Output "  - $_" }
}
if (-not $MachineryOnly) {
    # The counts are incremented where the comparison happens, not derived afterwards: a comparison
    # that quietly compares nothing passes exactly as loudly as one that compares everything.
    Write-Output "PASS: declared SQL exercise names match their level route ($sqlNamesHarvested names harvested, $sqlReferencesChecked references checked, $sqlReferencesUnverified unverified)"
    if ($sqlRouteReports.Count -gt 0) {
        Write-Output "REPORT: $($sqlRouteReports.Count) declared SQL exercise path(s) have no route to check against:"
        $sqlRouteReports | ForEach-Object { Write-Output "  - $_" }
    }
}
# Outside the -MachineryOnly branch on purpose: the oracle is a machinery file, so this one runs in
# both modes. Two numbers, not three: a verdict mismatch is a hard error, so a "verdicts matched"
# count could never differ from the applied count on any run that reaches this line - unlike
# invariant 7's `unverified`, which can. The second number is the reach: a scan that found no
# applied report compared no gates and would otherwise pass as loudly as one that checked them all.
Write-Output "PASS: applied self-reports carry a cold-review verdict ($reportsScanned scanned, $reportsApplied applied)"
if ($selfReportReports.Count -gt 0) {
    Write-Output "REPORT: $($selfReportReports.Count) self-report(s) name an applied hash outside the Status field:"
    $selfReportReports | ForEach-Object { Write-Output "  - $_" }
}
# Outside -MachineryOnly for invariant 8's reason: the ledger archive is machinery and so is the
# ledger that indexes it. Four numbers. The middle two are the budget proxy, never a gate - a
# closure that restates its whole resolution moves them before the file is visibly growing again -
# and the fourth is `REC-195`'s escape, printed for exactly the same reason: an unrecorded verdict
# that nobody counts is one nobody notices accumulating.
Write-Output "PASS: closed ledger lines carry their closure schema ($closedRowsScanned rows, longest $closedLongest chars, $closedOverBudget over the $closedBudget-char one-line budget, $closedUnrecorded with an unrecorded verdict)"
Write-Output "PASS: skill mirror parity ($($claudeManifest.Count) files per adapter)"
if ($MachineryOnly) {
    Write-Output 'SKIP: live coverage, notes-plan, SQL-route (including declared exercise names), and simulation-route state (machinery-only mode)'
} else {
    Write-Output "PASS: coverage mirror parity ($($topicCoverageRoots.Count) topics x $($coverageLevels.Count) levels)"
}
Write-Output "PASS: both maps know the machinery exists ($($diskSkills.Count) skills, $expectedRunnableCount prompts registered)"
if (-not $MachineryOnly) {
    if ($fingerprintReports.Count -eq 0) {
        Write-Output 'PASS: every notes plan agrees with its coverage fingerprint'
    } else {
        Write-Output "REPORT: $($fingerprintReports.Count) notes plan(s) disagree with their coverage fingerprint - reported, never repaired:"
        $fingerprintReports | ForEach-Object { Write-Output "  - $_" }
    }
}
