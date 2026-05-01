param(
  [string]$ProjectRoot = $PSScriptRoot,
  [string]$ConfigPath = ".obfuscator-hard.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $ProjectRoot

if (-not (Test-Path -LiteralPath $ConfigPath)) {
  throw "Missing obfuscator config: $ConfigPath"
}

$frontendDir = Join-Path $ProjectRoot "js"
if (-not (Test-Path -LiteralPath $frontendDir)) {
  throw "Missing frontend directory: $frontendDir"
}

$obfuscatorRunner = "C:\Program Files\nodejs\npx.cmd"
if (-not (Test-Path -LiteralPath $obfuscatorRunner)) {
  $obfuscatorRunner = "npx"
}

$files = Get-ChildItem -LiteralPath $frontendDir -Recurse -File -Filter "*.js" |
  Where-Object { $_.Name -notlike "*.obf.tmp.js" -and $_.Name -notlike "*.bak" }

if ($files.Count -eq 0) {
  Write-Host "No frontend .js files found."
  exit 0
}

$ok = 0
$fail = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $jsPath = $file.FullName
  $bakPath = "$jsPath.bak"
  $tmpPath = "$jsPath.obf.tmp.js"

  if (-not (Test-Path -LiteralPath $bakPath)) {
    Copy-Item -LiteralPath $jsPath -Destination $bakPath -Force
  }

  # Always obfuscate from the clean backup source to keep deterministic output.
  Copy-Item -LiteralPath $bakPath -Destination $jsPath -Force

  if (Test-Path -LiteralPath $tmpPath) {
    Remove-Item -LiteralPath $tmpPath -Force
  }

  & $obfuscatorRunner javascript-obfuscator $jsPath --config $ConfigPath --output $tmpPath *> $null
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $tmpPath)) {
    $fail.Add($jsPath)
    continue
  }

  Move-Item -LiteralPath $tmpPath -Destination $jsPath -Force

  node --check $jsPath 2>$null
  if ($LASTEXITCODE -ne 0) {
    $fail.Add($jsPath)
    continue
  }

  $ok++
}

Write-Host "FRONTEND_OBF_OK=$ok"
Write-Host "FRONTEND_OBF_FAIL=$($fail.Count)"
Write-Host "API untouched (directory ./api was not processed)."

if ($fail.Count -gt 0) {
  foreach ($path in $fail) {
    Write-Host $path
  }
  exit 1
}
