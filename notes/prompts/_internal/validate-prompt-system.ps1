[CmdletBinding()]
param(
    [string]$RepositoryRoot
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
}

$expectedRunnableCount = 26
$promptRoot = Join-Path $RepositoryRoot 'notes\prompts'
$claudeRoot = Join-Path $RepositoryRoot '.claude\commands'
$codexRoot = Join-Path $RepositoryRoot '.codex\commands'
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
            'notes/prompts/(?!_internal/)[A-Za-z0-9_./-]+\.md'
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
    'projects\plan\plan-audit.md',
    'projects\portfolio\portfolio-audit.md',
    'projects\readme\readme-audit.md',
    'projects\review\review-audit.md',
    'strategy\tracking\progress-update-prompt.md',
    'strategy\tracking\roadmap-review-prompt.md'
)

if ($pipelinePromptPaths.Count -ne 14) {
    Add-ValidationError "Expected 14 pipeline prompts; found $($pipelinePromptPaths.Count)."
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

$markdownPathPattern = 'notes/prompts/[A-Za-z0-9_./-]+\.md'
foreach ($file in Get-ChildItem -LiteralPath $promptRoot -Recurse -File -Filter '*.md') {
    $text = [System.IO.File]::ReadAllText($file.FullName)
    foreach ($match in [regex]::Matches($text, $markdownPathPattern)) {
        $relativePath = $match.Value.Replace('/', '\')
        if ([System.IO.Path]::GetFileName($relativePath) -like '_last-run-report*') {
            continue # Declared report outputs may legitimately not exist before their first run.
        }
        $resolvedPath = Join-Path $RepositoryRoot $relativePath
        if (-not (Test-Path -LiteralPath $resolvedPath -PathType Leaf)) {
            Add-ValidationError "Missing internal Markdown reference: $relativePath (from $($file.FullName))."
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
    $errors | ForEach-Object { Write-Error $_ }
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
