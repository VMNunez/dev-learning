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
# names that cannot be an ordinary English word or a unix tool are listed - `Bash`, `Grep`,
# `Read`, `Write`, `Edit` and `Glob` are deliberately absent, because "Git Bash" and "Grep all
# three topic files" are legitimate prose and a check that cries wolf on them gets disabled.
# That half stays uncovered on purpose; it is named here so nothing reads this as complete.
$exclusivePattern = 'Claude Code|CLAUDE\.md|model: (opus|sonnet|haiku)|general-purpose|run_in_background|/model opus|\b(Opus|Sonnet|Haiku)\b|\b(SendMessage|WebFetch|WebSearch|TodoWrite|NotebookEdit|ExitPlanMode|AskUserQuestion|TaskOutput)\b'
$canonicalFiles = Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md' |
    Where-Object {
        $_.Name -ne 'README.md' -and
        $_.Name -notlike '_last-run-report*' -and
        # Generated report, same class as `_last-run-report*`: its content is copied from a run, not authored.
        $_.Name -ne '_last-drift-report.md' -and
        $_.Name -notin @(
            '_session-rules.md',
            '_agent-runtime-standard.md',
            '_recommendation-ledger.md'
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
$referencePathPattern = '(?<![A-Za-z0-9_./-])(notes|practice|projects|personal|knowledge|strategy)/[A-Za-z0-9_./{}-]+\.(md|ps1|sql)'

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
    '^practice/simulations/(junior|middle|senior)/PLANNING-(junior|middle|senior)\.md$' # level route
    '^notes/prompts/system/_internal/_system-gaps-report\.md$'                 # system-gaps first run
    # Both path forms: the prompt writes the repo-root one, both maps the notes/prompts-relative one.
    '^(notes/prompts/)?strategy/tracking/_internal/_last-drift-report\.md$'    # progress-update, every run
)
# Deliberately outside the repository; _external-path-preflight.md governs these.
$externalPathPatterns = @('^personal/')
# A dead path is legitimate when a file recounts history or names a legacy shape
# it must still recognise. Scoped to the citing file on purpose: the same path in
# a live instruction is still a defect.
$historicalReferences = @{
    'knowledge\coverage\_internal\_coverage-prompt-rationale.md' = @('notes/coverage.md')
    '_internal\_recommendation-ledger.md'                        = @('notes/coverage.md', 'practice/sql/01-basics.sql')
    'strategy\tracking\progress-update-prompt.md'                = @('practice/sql/01-basics.sql', 'practice/sql/02-joins/exercises.sql')
    'practice\sql\_internal\_last-run-report-sql-exercises.md'   = @('practice/sql/01-basics.sql')
    'strategy\tracking\_internal\_last-run-report.md'            = @('practice/sql/02-joins.sql')
}

$referenceScan = @()
$referenceScan += Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md'
foreach ($skillRoot in @($claudeSkills, $agentSkills)) {
    $referenceScan += Get-ChildItem -LiteralPath $skillRoot -Recurse -File -Filter '*.md'
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
        if ([System.IO.Path]::GetFileName($reference) -like '_last-run-report*') { continue }
        if ($declaredOutputPatterns | Where-Object { $reference -match $_ }) { continue }
        if ($externalPathPatterns | Where-Object { $reference -match $_ }) { continue }
        $exempt = $false
        foreach ($citingFile in $historicalReferences.Keys) {
            if ($relativeSource.EndsWith($citingFile) -and $reference -in $historicalReferences[$citingFile]) {
                $exempt = $true
                break
            }
        }
        if ($exempt) { continue }
        $windowsPath = $reference.Replace('/', '\')
        if (Test-Path -LiteralPath (Join-Path $RepositoryRoot $windowsPath) -PathType Leaf) { continue }
        if (Test-Path -LiteralPath (Join-Path $promptRoot $windowsPath) -PathType Leaf) { continue }
        Add-ValidationError "Dead path reference '$reference' resolves against neither the repository root nor notes/prompts/ (from $relativeSource)."
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
        $levelStatusMatch = [regex]::Match($simulationText, '(?m)^Level status:\s*(?<status>open|closed ✅)\s*$')
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
        # First declaration wins: a key restated further down the block is the same key.
        if (-not $arguments.Contains($declaration.Groups['key'].Value)) {
            $arguments[$declaration.Groups['key'].Value] = $value.Trim()
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
    $tokens = @(($Value -split '\|') | ForEach-Object { $_.Trim() })
    if ($tokens.Count -lt 2) { return $null }
    foreach ($token in $tokens) {
        if ($token -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._-]*$') { return $null }
    }
    return @($tokens | Sort-Object)
}

# Counted and published, because a value check that quietly compares nothing passes just as
# loudly as one that compares everything. Roughly half of these keys are metavariables or
# free-form fields (`EMPRESA`, `<path>`, an exact heading) and are deliberately not compared;
# the PASS line says how many were, so the number is falsifiable by reading it.
$argumentKeysChecked = 0
$argumentValuesCompared = 0

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

    $target = [regex]::Match($claudeText, 'notes/prompts/(?![A-Za-z0-9_./-]*_internal/)[A-Za-z0-9_./-]+\.md')
    if (-not $target.Success) { continue }  # already reported by Get-LauncherTargets
    $promptPath = Join-Path $RepositoryRoot $target.Value.Replace('/', '\')
    if (-not (Test-Path -LiteralPath $promptPath -PathType Leaf)) { continue }  # already reported as a dead path

    $hintArguments = Get-HintArguments $claudeHint.Groups['hint'].Value
    $configBlock = Get-PromptConfigBlock ([System.IO.File]::ReadAllText($promptPath))
    # A prompt that takes no arguments has no block, and its launcher advertises no key. Both
    # halves are read off shape, so no prompt is exempt by name.
    if ($null -eq $configBlock) {
        if ($hintArguments.Count -gt 0) {
            Add-ValidationError "$($claudeLauncher.Name) advertises $($hintArguments.Count) argument(s) but $($target.Value) has no locatable '## Configuration' block."
        }
        continue
    }
    $configArguments = Get-ConfigArguments $configBlock
    if ($hintArguments.Count -eq 0 -and $configArguments.Count -gt 0) {
        Add-ValidationError "$($target.Value) declares $($configArguments.Count) configuration key(s) that $($claudeLauncher.Name) advertises none of."
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
        if (@(Compare-Object $configValues $hintValues -CaseSensitive).Count -gt 0) {
            Add-ValidationError "$($claudeLauncher.Name) advertises '$key = $($hintValues -join '|')' where $($target.Value) accepts '$($configValues -join '|')'."
        }
    }
    foreach ($key in $configArguments.Keys) {
        # The hint is not the whole contract: an optional derived key such as coverage's
        # NOTES_PATH is deliberately kept out of the hint and explained in the launcher's
        # Rules instead. Named anywhere in the launcher is the test - bounded and
        # case-sensitive, per REC-065.
        if ($claudeText -cnotmatch "(?<![A-Za-z0-9_])$([regex]::Escape($key))(?![A-Za-z0-9_])") {
            Add-ValidationError "$($target.Value) accepts '$key', which $($claudeLauncher.Name) never mentions."
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
Write-Output "PASS: launcher argument contracts ($expectedRunnableCount identical hint pairs, $argumentKeysChecked keys both ways, $argumentValuesCompared closed enumerations compared)"
Write-Output 'PASS: runnable prompt entry-point and self-report contracts'
Write-Output 'PASS: representative contract dry runs'
Write-Output 'PASS: external-path failure simulation'
Write-Output 'PASS: thin session adapters share one rules source'
Write-Output "PASS: path references resolve ($($referenceScan.Count) files scanned, both path forms)"
Write-Output "PASS: skill mirror parity ($($claudeManifest.Count) files per adapter)"
if ($MachineryOnly) {
    Write-Output 'SKIP: live coverage, notes-plan, SQL-route, and simulation-route state (machinery-only mode)'
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
