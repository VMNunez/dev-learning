# Appends one row to the skill-invocation counter on every Skill tool call.
# Deterministic denominator for _skill-breach-log.md: it does not depend on the
# model remembering anything. The file is gitignored - a rolling counter, not
# durable evidence. Never fails a tool call: every path exits 0.
$ErrorActionPreference = 'SilentlyContinue'
try {
    $raw = [Console]::In.ReadToEnd()
    if (-not $raw) { exit 0 }
    $payload = $raw | ConvertFrom-Json
    if ($payload.tool_name -ne 'Skill') { exit 0 }

    $skillName = [string]$payload.tool_input.skill
    if (-not $skillName) { exit 0 }

    $skillArgs = [string]$payload.tool_input.args
    if ($skillArgs.Length -gt 60) { $skillArgs = $skillArgs.Substring(0, 60) }
    $skillArgs = $skillArgs -replace '\|', '\|'

    $root = [string]$payload.cwd
    if (-not $root) { exit 0 }
    $dir = Join-Path $root 'notes/prompts/_internal'
    if (-not (Test-Path -LiteralPath $dir)) { exit 0 }
    $log = Join-Path $dir '_skill-runs.md'

    if (-not (Test-Path -LiteralPath $log)) {
        $header = @(
            '# Skill runs',
            '',
            'Invocation counter, written by the `PostToolUse` hook on every `Skill` tool call.',
            'Gitignored on purpose: a rolling denominator, not durable evidence. Its only consumer is',
            '`skill-refine`, which reads it to tell "this skill ran 20 times and logged nothing" apart',
            'from "this skill ran clean". Durable evidence lives in `_skill-breach-log.md`.',
            '',
            'It counts the moment the ritual was **loaded**, not the moment it finished.',
            '',
            '| When | Skill | Args |',
            '|---|---|---|'
        )
        Set-Content -LiteralPath $log -Value $header -Encoding utf8
    }

    $row = '| {0} | `{1}` | {2} |' -f (Get-Date -Format 'yyyy-MM-dd HH:mm'), $skillName, $skillArgs
    Add-Content -LiteralPath $log -Value $row -Encoding utf8
} catch { }
exit 0
