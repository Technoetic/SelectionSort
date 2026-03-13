# ================================================================
# Lighthouse CI Validator Hook
# ================================================================
# 목적: Step 09 (Lighthouse CI 웹 성능 감사 환경 설치 검증)
# 기능: @lhci/cli 설치, lighthouserc.js 생성, 테스트 결과 기록
# ================================================================

param()

$ErrorActionPreference = "Continue"
$script:exitCode = 0
$script:results = @()
$logFile = "$PSScriptRoot\lhci-validator.log"
$resultFile = "$PSScriptRoot\..\step09_lhci_test.md"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding UTF8
}

function Add-Result {
    param([string]$Test, [bool]$Passed, [string]$Detail = "")
    $status = if ($Passed) { "PASS" } else { "FAIL" }
    $script:results += [PSCustomObject]@{
        Test = $Test
        Status = $status
        Detail = $Detail
    }
    if (-not $Passed) { $script:exitCode = 1 }
    Write-Log "$status - $Test $(if ($Detail) { ": $Detail" })" $(if ($Passed) { "INFO" } else { "ERROR" })
}

# Clear previous log
if (Test-Path $logFile) { Remove-Item $logFile -Force }

Write-Log "=== Lighthouse CI Validator Start ==="

$projectRoot = Join-Path $PSScriptRoot "..\.."

# ================================================================
# 0. @lhci/cli 설치 및 lighthouserc.js 생성
# ================================================================
Write-Log "Step 0: @lhci/cli 설치 확인 및 설치"

# package.json 존재 확인 (없으면 생성)
$packageJsonPath = Join-Path $projectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Log "package.json 미존재 - npm init -y 실행" "INFO"
    try {
        Push-Location $projectRoot
        npm init -y 2>&1 | Out-Null
        Pop-Location
        Write-Log "package.json 생성 완료" "INFO"
    } catch {
        Write-Log "package.json 생성 실패: $_" "ERROR"
        Pop-Location
    }
}

# @lhci/cli 설치
try {
    Push-Location $projectRoot
    npm install -D @lhci/cli 2>&1 | Out-Null
    Pop-Location
    Write-Log "@lhci/cli 설치 완료" "INFO"
} catch {
    Write-Log "@lhci/cli 설치 실패: $_" "ERROR"
    Pop-Location
}

# lighthouserc.js 생성 (미존재 시)
$rcPath = Join-Path $projectRoot "lighthouserc.js"
if (-not (Test-Path $rcPath)) {
    Write-Log "lighthouserc.js 생성" "INFO"
    $rcContent = @"
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.claude/lhci-results/',
    },
  },
};
"@
    Set-Content -Path $rcPath -Value $rcContent -Encoding UTF8
    Write-Log "lighthouserc.js 생성 완료" "INFO"
}

# Test 1: package.json에 @lhci/cli 등록 확인
Write-Log "Test 1: package.json devDependencies check"
$packageJsonPath = Join-Path $PSScriptRoot "..\..\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    if ($packageJson.devDependencies -and $packageJson.devDependencies.'@lhci/cli') {
        Add-Result "package.json @lhci/cli" $true "Version: $($packageJson.devDependencies.'@lhci/cli')"
    } else {
        Add-Result "package.json @lhci/cli" $false "@lhci/cli not found in devDependencies"
    }
} else {
    Add-Result "package.json @lhci/cli" $false "package.json not found"
}

# Test 2: node_modules에 설치 확인
Write-Log "Test 2: node_modules installation check"
$lhciModulePath = Join-Path $PSScriptRoot "..\..\node_modules\@lhci\cli"
if (Test-Path $lhciModulePath) {
    Add-Result "node_modules @lhci/cli" $true "Installed at $lhciModulePath"
} else {
    Add-Result "node_modules @lhci/cli" $false "Not found in node_modules"
}

# Test 3: npx lhci --version
Write-Log "Test 3: npx lhci --version"
try {
    Push-Location (Join-Path $PSScriptRoot "..\..")
    $version = & npx lhci --version 2>&1
    Pop-Location
    $versionStr = $version | Out-String
    if ($versionStr -match "\d+\.\d+") {
        Add-Result "lhci --version" $true "Version: $($versionStr.Trim())"
    } else {
        Add-Result "lhci --version" $false "Unexpected output: $($versionStr.Trim())"
    }
} catch {
    Pop-Location
    Add-Result "lhci --version" $false "Error: $_"
}

# Test 4: npx lhci --help
Write-Log "Test 4: npx lhci --help"
try {
    Push-Location (Join-Path $PSScriptRoot "..\..")
    $help = & npx lhci --help 2>&1
    Pop-Location
    $helpStr = $help | Out-String
    if ($helpStr -match "lighthouse" -or $helpStr -match "autorun" -or $helpStr -match "collect") {
        Add-Result "lhci --help" $true "Help output available"
    } else {
        Add-Result "lhci --help" $false "Unexpected help output"
    }
} catch {
    Pop-Location
    Add-Result "lhci --help" $false "Error: $_"
}

# Test 5: lighthouserc.js 존재 확인
Write-Log "Test 5: lighthouserc.js check"
$rcPath = Join-Path $PSScriptRoot "..\..\lighthouserc.js"
if (Test-Path $rcPath) {
    Add-Result "lighthouserc.js" $true "Config file exists"
} else {
    Add-Result "lighthouserc.js" $false "Config file not found at project root"
}

# Generate result file
Write-Log "=== Generating Result File ==="

$resultContent = @"
# Step 09 - Lighthouse CI 설치 검증 결과

**검증 시각**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**검증 스크립트**: ``.claude/hooks/lhci-validator.ps1``

## 검증 결과

| 테스트 | 상태 | 상세 |
|--------|------|------|
"@

foreach ($r in $script:results) {
    $emoji = if ($r.Status -eq "PASS") { "PASS" } else { "FAIL" }
    $resultContent += "| $($r.Test) | $emoji | $($r.Detail) |`n"
}

$totalTests = $script:results.Count
$passedTests = ($script:results | Where-Object { $_.Status -eq "PASS" }).Count
$failedTests = $totalTests - $passedTests

$resultContent += @"

## 요약

- **총 테스트**: $totalTests
- **통과**: $passedTests
- **실패**: $failedTests
- **최종 결과**: $(if ($script:exitCode -eq 0) { "SUCCESS" } else { "FAILURE" })
"@

$resultContent | Out-File -FilePath $resultFile -Encoding UTF8 -NoNewline

Write-Log "=== Lighthouse CI Validator End (Exit Code: $script:exitCode) ==="

exit $script:exitCode
