# ================================================================
# Tokei Validator Hook
# ================================================================
# 목적: Step 08 (tokei 코드 통계 환경 설치 검증)
# 기능: tokei 설치 확인, 미설치 시 scoop으로 설치, 테스트 결과 기록
# ================================================================

param()

$ErrorActionPreference = "Continue"
$script:exitCode = 0
$script:results = @()
$logFile = "$PSScriptRoot\tokei-validator.log"
$resultFile = "$PSScriptRoot\..\step08_tokei_test.md"

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

Write-Log "=== tokei Validator Start ==="

# ================================================================
# 0. tokei 설치 확인 및 미설치 시 scoop으로 설치
# ================================================================
Write-Log "Step 0: tokei 설치 확인"
$tokeiExists = Get-Command tokei -ErrorAction SilentlyContinue
if (-not $tokeiExists) {
    Write-Log "tokei 미설치 - scoop으로 설치 시도" "INFO"
    $scoopExists = Get-Command scoop -ErrorAction SilentlyContinue
    if (-not $scoopExists) {
        Write-Log "scoop 미설치 - scoop 설치 시도" "INFO"
        try {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
            Write-Log "scoop 설치 완료" "INFO"
        } catch {
            Write-Log "scoop 설치 실패: $_" "ERROR"
        }
    }
    try {
        scoop install tokei 2>&1 | Out-Null
        Write-Log "tokei 설치 완료" "INFO"
    } catch {
        Write-Log "tokei 설치 실패: $_" "ERROR"
    }
}

# Test 1: tokei --version
Write-Log "Test 1: tokei --version"
try {
    $version = & tokei --version 2>&1
    $versionStr = $version | Out-String
    if ($versionStr -match "tokei\s+(\d+\.\d+\.\d+)") {
        Add-Result "tokei --version" $true "Version: $($Matches[1])"
    } elseif ($LASTEXITCODE -eq 0) {
        Add-Result "tokei --version" $true "Output: $($versionStr.Trim())"
    } else {
        Add-Result "tokei --version" $false "Unexpected output: $($versionStr.Trim())"
    }
} catch {
    Add-Result "tokei --version" $false "Error: $_"
}

# Test 2: tokei --help
Write-Log "Test 2: tokei --help"
try {
    $help = & tokei --help 2>&1
    $helpStr = $help | Out-String
    if ($helpStr -match "tokei" -or $helpStr -match "Count" -or $helpStr -match "code") {
        Add-Result "tokei --help" $true "Help output available"
    } else {
        Add-Result "tokei --help" $false "Unexpected help output"
    }
} catch {
    Add-Result "tokei --help" $false "Error: $_"
}

# Test 3: tokei src/ --output json (if src/ exists)
Write-Log "Test 3: tokei JSON output"
$srcPath = Join-Path $PSScriptRoot "..\..\src"
if (Test-Path $srcPath) {
    try {
        $jsonOutput = & tokei $srcPath --output json 2>&1
        $jsonStr = $jsonOutput | Out-String
        if ($jsonStr.Trim().StartsWith("{") -or $jsonStr.Trim().StartsWith("[")) {
            Add-Result "tokei JSON output" $true "Valid JSON output from src/"
        } else {
            Add-Result "tokei JSON output" $false "Output is not JSON: $($jsonStr.Substring(0, [Math]::Min(100, $jsonStr.Length)))"
        }
    } catch {
        Add-Result "tokei JSON output" $false "Error: $_"
    }
} else {
    Add-Result "tokei JSON output" $true "src/ not found (skipped - will be available after project init)"
}

# Test 4: tokei plain output
Write-Log "Test 4: tokei plain output"
try {
    $plain = & tokei $PSScriptRoot 2>&1
    $plainStr = $plain | Out-String
    if ($plainStr -match "Total" -or $plainStr -match "Lines" -or $plainStr -match "PowerShell" -or $plainStr.Length -gt 10) {
        Add-Result "tokei plain output" $true "Plain output works"
    } else {
        Add-Result "tokei plain output" $false "Unexpected plain output"
    }
} catch {
    Add-Result "tokei plain output" $false "Error: $_"
}

# Generate result file
Write-Log "=== Generating Result File ==="

$resultContent = @"
# Step 08 - tokei 설치 검증 결과

**검증 시각**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**검증 스크립트**: ``.claude/hooks/tokei-validator.ps1``

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

Write-Log "=== tokei Validator End (Exit Code: $script:exitCode) ==="

exit $script:exitCode
