param(
    [Parameter(Mandatory=$true)]
    [string]$DumpFile
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir "..\.env"

if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

if (-not $env:DIRECT_URL) {
    Write-Error "DIRECT_URL is not set - check Backend\.env"
    exit 1
}

if (-not (Test-Path $DumpFile)) {
    Write-Error "File not found: $DumpFile"
    exit 1
}

Write-Host "=============================================================="
Write-Host " Target DB : $($env:DIRECT_URL)"
Write-Host " Dump file : $DumpFile"
Write-Host "=============================================================="
$Confirm = Read-Host "This will overwrite the target DB. Type restore to continue"
if ($Confirm -ne "restore") {
    Write-Host "Aborted."
    exit 1
}

& pg_restore --clean --if-exists --no-owner --no-privileges -j 4 -d $env:DIRECT_URL $DumpFile

Write-Host "Restore done. Run: npx prisma generate"
