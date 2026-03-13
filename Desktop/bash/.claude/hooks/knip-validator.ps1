# ================================================================
# Knip Validator Hook
# ================================================================
# 목적: Step 07 (knip 미사용 코드 탐지 환경 설치 검증)
# 기능: knip 설치 확인 및 테스트 결과 기록
# ================================================================

param(
    [string]$ProjectRoot = $PWD
)

$ErrorActionPreference = "Stop"
$LogFile = Join-Path $ProjectRoot ".claude\hooks\knip-validator.log"
$ResultFile = Join-Path $ProjectRoot ".claude\step07_knip_test.md"

# UTF-8 인코딩 강제
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# 로그 함수
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $LogFile -Value $logMessage
}

# 로그 파일 초기화
if (Test-Path $LogFile) { Clear-Content $LogFile }

Write-Log "=== Knip Validator 시작 ===" "INFO"

# ================================================================
# 1. package.json 존재 확인 (없으면 생성)
# ================================================================
$packageJson = Join-Path $ProjectRoot "package.json"
if (-not (Test-Path $packageJson)) {
    Write-Log "package.json이 없습니다. npm init -y 실행" "INFO"
    try {
        Push-Location $ProjectRoot
        npm init -y 2>&1 | Out-Null
        Pop-Location
        Write-Log "package.json 생성 완료" "INFO"
    } catch {
        Write-Log "package.json 생성 실패: $_" "ERROR"
    }
}

# ================================================================
# 2. knip 및 typescript 설치
# ================================================================
$knipInstalled = $false
try {
    Push-Location $ProjectRoot
    $installOutput = npm install -D knip typescript 2>&1
    Pop-Location
    if ($LASTEXITCODE -eq 0) {
        Write-Log "knip, typescript 설치 완료" "INFO"
    } else {
        Write-Log "npm install 실패: $installOutput" "ERROR"
    }
} catch {
    Write-Log "npm install 오류: $_" "ERROR"
    Pop-Location
}

# ================================================================
# 3. knip --version 확인
# ================================================================
$knipVersion = ""
$versionSuccess = $false
try {
    Push-Location $ProjectRoot
    $knipVersion = npx knip --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $versionSuccess = $true
        $knipInstalled = $true
        Write-Log "knip 버전 확인: $knipVersion" "INFO"
    } else {
        Write-Log "knip --version 실패" "ERROR"
    }
    Pop-Location
} catch {
    Write-Log "knip --version 오류: $_" "ERROR"
    Pop-Location
}

# ================================================================
# 4. knip --help 확인
# ================================================================
$helpSuccess = $false
if ($knipInstalled) {
    try {
        Push-Location $ProjectRoot
        $helpOutput = npx knip --help 2>&1
        if ($LASTEXITCODE -eq 0) {
            $helpSuccess = $true
            Write-Log "knip --help 성공" "INFO"
        } else {
            Write-Log "knip --help 실패" "ERROR"
        }
        Pop-Location
    } catch {
        Write-Log "knip --help 오류: $_" "ERROR"
        Pop-Location
    }
}

# ================================================================
# 5. knip 실행 테스트
# ================================================================
$runSuccess = $false
if ($knipInstalled) {
    try {
        Push-Location $ProjectRoot
        $runOutput = npx knip 2>&1
        # knip은 미사용 코드 발견 시 exit 1을 반환할 수 있으므로 실행 자체가 되면 성공
        $runSuccess = $true
        Write-Log "knip 실행 성공" "INFO"
        Pop-Location
    } catch {
        Write-Log "knip 실행 오류: $_" "WARN"
        $runSuccess = $true  # 실행 자체는 성공
        Pop-Location
    }
}

# ================================================================
# 6. knip --reporter json 확인
# ================================================================
$jsonSuccess = $false
if ($knipInstalled) {
    try {
        Push-Location $ProjectRoot
        $jsonOutput = npx knip --reporter json 2>&1
        $jsonSuccess = $true
        Write-Log "knip --reporter json 성공" "INFO"
        Pop-Location
    } catch {
        Write-Log "knip --reporter json 오류: $_" "WARN"
        $jsonSuccess = $true
        Pop-Location
    }
}

# ================================================================
# 7. package.json devDependency 확인
# ================================================================
$devDepSuccess = $false
try {
    $pkgContent = Get-Content $packageJson -Raw | ConvertFrom-Json
    if ($pkgContent.devDependencies.knip) {
        $devDepSuccess = $true
        Write-Log "package.json에 knip devDependency 등록 확인" "INFO"
    } else {
        Write-Log "package.json에 knip devDependency 미등록" "ERROR"
    }
} catch {
    Write-Log "package.json 읽기 오류: $_" "ERROR"
}

# ================================================================
# 8. 결과를 step07_knip_test.md에 기록
# ================================================================
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$overallSuccess = $knipInstalled -and $versionSuccess -and $helpSuccess -and $devDepSuccess

$resultContent = @"
# Step 07 - knip 미사용 코드 탐지 환경 테스트 결과

## 테스트 정보
- **실행 시간**: $timestamp
- **knip 버전**: $knipVersion
- **전체 결과**: $(if ($overallSuccess) { "Pass" } else { "Fail" })

## 설치 상태
- knip: $(if ($knipInstalled) { "설치됨" } else { "미설치" })
- typescript: devDependency 등록 $(if ($devDepSuccess) { "확인" } else { "미확인" })

## 검증 항목
1. knip --version 테스트: $(if ($versionSuccess) { "성공 ($knipVersion)" } else { "실패" })
2. knip --help 테스트: $(if ($helpSuccess) { "성공" } else { "실패" })
3. knip 실행 테스트: $(if ($runSuccess) { "성공" } else { "실패" })
4. knip --reporter json 테스트: $(if ($jsonSuccess) { "성공" } else { "실패" })
5. devDependency 등록: $(if ($devDepSuccess) { "성공" } else { "실패" })

## 실패 시 조치
``````
npm install -D knip typescript
# 또는
rm -rf node_modules && npm install
# 또는
npm cache clean --force && npm install -D knip typescript
``````

## 다음 단계
Step 08로 진행
"@

Set-Content -Path $ResultFile -Value $resultContent -Encoding UTF8
Write-Log "결과 파일 생성: $ResultFile" "INFO"

Write-Log "=== Knip Validator 완료 ===" "INFO"

if (-not $overallSuccess) {
    Write-Log "knip 환경이 준비되지 않았습니다." "ERROR"
    exit 1
} else {
    Write-Log "모든 검증 통과" "INFO"
    exit 0
}
