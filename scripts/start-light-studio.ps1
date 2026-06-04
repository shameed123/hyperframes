$ErrorActionPreference = "Stop"

$ProjectPath = ""
$ProjectName = ""
$HostName = "127.0.0.1"
$Port = 5192
$Relink = $false

$inputArgs = @($args | Where-Object { $_ -ne "--" })
for ($i = 0; $i -lt $inputArgs.Count; $i++) {
  switch ($inputArgs[$i]) {
    "-ProjectPath" {
      $i++
      $ProjectPath = $inputArgs[$i]
    }
    "-ProjectName" {
      $i++
      $ProjectName = $inputArgs[$i]
    }
    "-HostName" {
      $i++
      $HostName = $inputArgs[$i]
    }
    "-Port" {
      $i++
      $Port = [int]$inputArgs[$i]
    }
    "-Relink" {
      $Relink = $true
    }
    default {
      if ([string]::IsNullOrWhiteSpace($ProjectPath)) {
        $ProjectPath = $inputArgs[$i]
      } else {
        throw "Unknown argument: $($inputArgs[$i])"
      }
    }
  }
}

if ([string]::IsNullOrWhiteSpace($ProjectPath)) {
  throw "Usage: bun run studio:project -- -ProjectPath C:\path\to\hyperframes-project [-ProjectName name] [-Port 5192] [-Relink]"
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$studioDir = Join-Path $repoRoot "packages\studio"
$viteCandidates = @(
  (Join-Path $studioDir "node_modules\.bin\vite.CMD"),
  (Join-Path $studioDir "node_modules\.bin\vite.exe"),
  (Join-Path $studioDir "node_modules\.bin\vite.bunx")
)
$vitePath = $viteCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $vitePath) {
  throw "Light Studio dependencies are missing. Run `bun install` in $repoRoot first."
}

function Resolve-NormalizedPath {
  param([Parameter(Mandatory = $true)][string]$Path)

  $resolved = (Resolve-Path -LiteralPath $Path).Path
  $fullPath = [System.IO.Path]::GetFullPath($resolved)
  $root = [System.IO.Path]::GetPathRoot($fullPath)
  if ($fullPath.Length -gt $root.Length) {
    return $fullPath.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
  }

  return $fullPath
}

$resolvedProjectPath = Resolve-NormalizedPath $ProjectPath
if (-not (Test-Path -LiteralPath (Join-Path $resolvedProjectPath "index.html"))) {
  throw "Project path does not look like a HyperFrames project because index.html was not found: $resolvedProjectPath"
}

if ([string]::IsNullOrWhiteSpace($ProjectName)) {
  $ProjectName = Split-Path $resolvedProjectPath -Leaf
}

if ($ProjectName.IndexOfAny([System.IO.Path]::GetInvalidFileNameChars()) -ge 0 -or $ProjectName -match "[\\/]+") {
  throw "ProjectName must be a single safe folder name, not a path: $ProjectName"
}

$projectsDir = Join-Path $studioDir "data\projects"
$projectLink = Join-Path $projectsDir $ProjectName
New-Item -ItemType Directory -Force -Path $projectsDir | Out-Null

$projectsDirFullPath = [System.IO.Path]::GetFullPath($projectsDir)
$projectLinkFullPath = [System.IO.Path]::GetFullPath($projectLink)
if (-not $projectLinkFullPath.StartsWith($projectsDirFullPath + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to create project link outside Studio projects directory: $projectLinkFullPath"
}

if (Test-Path -LiteralPath $projectLink) {
  $item = Get-Item -LiteralPath $projectLink
  $target = if ($item.Target) { [string]$item.Target } else { "" }
  if ($target) {
    $resolvedTarget = Resolve-NormalizedPath $target
    if (-not [string]::Equals($resolvedTarget, $resolvedProjectPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      if (-not $Relink) {
        throw "Studio project link '$ProjectName' already exists but points to $resolvedTarget. Re-run with -Relink to point it at $resolvedProjectPath, or use a different -ProjectName."
      }

      if ($item.LinkType -ne "Junction" -and $item.LinkType -ne "SymbolicLink") {
        throw "Studio project path '$ProjectName' already exists and is not a junction or symlink: $projectLink"
      }

      [System.IO.Directory]::Delete($projectLinkFullPath)
      if (Test-Path -LiteralPath $projectLink) {
        throw "Could not remove the existing Studio project link: $projectLink"
      }
      New-Item -ItemType Junction -Path $projectLink -Target $resolvedProjectPath | Out-Null
    }
  } elseif (-not [string]::Equals((Resolve-NormalizedPath $item.FullName), $resolvedProjectPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Studio project path '$ProjectName' already exists and is not a junction: $projectLink"
  }
} else {
  New-Item -ItemType Junction -Path $projectLink -Target $resolvedProjectPath | Out-Null
}

$url = "http://$HostName`:$Port/#project/$ProjectName"
Write-Host "Starting light HyperFrames Studio..."
Write-Host "Project: $resolvedProjectPath"
Write-Host "Open:    $url"

Push-Location $studioDir
try {
  & $vitePath --host $HostName --port $Port
} finally {
  Pop-Location
}
