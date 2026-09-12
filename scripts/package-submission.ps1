$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$workspacePath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$outputDirectory = Join-Path $workspacePath '.dist'
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
$zipPath = Join-Path $outputDirectory 'airbnb-clone-submission.zip'

# Enumerate only submission source directories and named root configuration.
# Private environment files, installed dependencies and build output are omitted.
Push-Location -LiteralPath $workspacePath
try {
    $sourceFiles = @(& rg --files --hidden --no-ignore client server api ai docs scripts tests -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/.env*' -g '!**/*.log' -g '!**/test-results/**')
    if ($LASTEXITCODE -ne 0) { throw 'Source enumeration failed; rg is required.' }
    $rootFiles = @('package.json', 'package-lock.json', 'README.md', '.gitignore', 'vercel.json', 'playwright.config.js')
    $sourceFiles = @($sourceFiles + $rootFiles | Sort-Object -Unique)
    $zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
    $archive = [System.IO.Compression.ZipArchive]::new($zipStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
    try {
        foreach ($relativePath in $sourceFiles) {
            $absolutePath = [System.IO.Path]::GetFullPath((Join-Path $workspacePath $relativePath))
            if (-not $absolutePath.StartsWith($workspacePath + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
                throw "Source path is outside the workspace: $relativePath"
            }
            $entryPath = $relativePath.Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $absolutePath, $entryPath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $archive.Dispose() }
    $readback = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    try {
        foreach ($required in @('package.json', 'package-lock.json', 'client/package.json', 'server/package.json', 'docs/architecture/marketplace-architecture.png', 'ai/AI_WORKFLOW.md')) {
            if (-not $readback.GetEntry($required)) { throw "Missing required ZIP entry: $required" }
        }
        $entryCount = $readback.Entries.Count
    } finally { $readback.Dispose() }
    $sizeMB = [math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 2)
    Write-Output "Created $zipPath ($entryCount files, $sizeMB MB)"
} finally { Pop-Location }
