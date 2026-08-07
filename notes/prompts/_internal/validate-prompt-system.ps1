[CmdletBinding()]
param(
    [string]$RepositoryRoot
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
}

$expectedRunnableCount = 28
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

$exclusivePattern = 'Claude Code|CLAUDE\.md|model: (opus|sonnet|haiku)|general-purpose|run_in_background|/model opus|\b(Opus|Sonnet|Haiku)\b'
$canonicalFiles = Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md' |
    Where-Object {
        $_.Name -ne 'README.md' -and
        $_.Name -notlike '_last-run-report*' -and
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
    'knowledge\interview-prep\notes-and-interview-prep-prompt.md',
    'knowledge\notes\notes-audit.md',
    'knowledge\notes\notes-plan-prompt.md',
    'practice\sql\sql-plan-audit.md',
    'practice\sql\sql-plan-prompt.md',
    'projects\plan\plan-audit.md',
    'projects\plan\project-brief-prompt.md',
    'projects\portfolio\portfolio-audit.md',
    'projects\readme\readme-audit.md',
    'projects\review\review-audit.md',
    'strategy\tracking\progress-update-prompt.md',
    'strategy\tracking\roadmap-review-prompt.md'
)

if ($pipelinePromptPaths.Count -ne 16) {
    Add-ValidationError "Expected 16 pipeline prompts; found $($pipelinePromptPaths.Count)."
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
    # Both bounded to the real filename shape: an unbounded `.+` swallowed a typo or a rename in the
    # very file names the SQL track resolves "the current exercise file" by.
    '^practice/sql/(junior|middle|senior)/([0-9]{2}|R[1-9])-[a-z0-9-]+\.sql$'  # sql-exercises
    '^practice/simulations/[a-z-]+/[0-9]{2}-[a-z0-9-]+\.md$'                   # simulation-generator
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
    # `_coverage-standard.md`. That command is `sed | sha256sum` under Git Bash,
    # whose sed does text-mode I/O and drops every CR before the expressions run,
    # so the stored digests are over CR-free bytes. Reproduce it, do not "fix" it:
    # this must agree with what every prompt computes, not with what is tidier.
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
$fingerprintReports = [System.Collections.Generic.List[string]]::new()
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
# `/code-review` - true of both adapters, see README.md "The 28 runnable prompts".
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
Write-Output 'PASS: runnable prompt entry-point and self-report contracts'
Write-Output 'PASS: representative contract dry runs'
Write-Output 'PASS: external-path failure simulation'
Write-Output 'PASS: thin session adapters share one rules source'
Write-Output "PASS: path references resolve ($($referenceScan.Count) files scanned, both path forms)"
Write-Output "PASS: skill mirror parity ($($claudeManifest.Count) files per adapter)"
Write-Output "PASS: coverage mirror parity ($($topicCoverageRoots.Count) topics x $($coverageLevels.Count) levels)"
Write-Output "PASS: both maps know the machinery exists ($($diskSkills.Count) skills, $expectedRunnableCount prompts registered)"
if ($fingerprintReports.Count -eq 0) {
    Write-Output 'PASS: every notes plan agrees with its coverage fingerprint'
} else {
    Write-Output "REPORT: $($fingerprintReports.Count) notes plan(s) disagree with their coverage fingerprint - reported, never repaired:"
    $fingerprintReports | ForEach-Object { Write-Output "  - $_" }
}
