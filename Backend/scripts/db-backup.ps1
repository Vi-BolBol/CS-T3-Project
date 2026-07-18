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

$BackupDir = if ($env:BACKUP_DIR) { $env:BACKUP_DIR } else { Join-Path $ScriptDir "..\backups" }
$RetentionDays = if ($env:RETENTION_DAYS) { [int]$env:RETENTION_DAYS } else { 14 }
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$Filename = "internship_finder_$Timestamp.dump"

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$OutFile = Join-Path $BackupDir $Filename
& pg_dump $env:DIRECT_URL -F c -f $OutFile --no-owner --no-privileges --verbose

Get-ChildItem $BackupDir -Filter "internship_finder_*.dump" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
    ForEach-Object {
        Write-Host "Pruning old backup: $($_.Name)"
        Remove-Item $_.FullName
    }

Write-Host "Backup done: $OutFile"
