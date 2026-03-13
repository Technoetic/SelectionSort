# ================================================================
# c8 Validator Hook
# ================================================================
# 목적: Step 04 (c8 코드 커버리지 환경 설치 검증)
# 기능: c8 패키지 설치 확인 및 테스트 결과 기록
# ================================================================

param(
    [string]$ProjectRoot = $PWD
)

$ErrorActionPreference = "Stop"
$LogFile = Join-Path $ProjectRoot ".claude\hooks\c8-validator.log"
$ResultFile = Join-Path $ProjectRoot ".claude\step04_c8_test.md"

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

Write-Log "=== c8 Validator 시작 ===" "INFO"

# ================================================================
# 1. package.json 존재 확인
# ================================================================
$packageJsonPath = Join-Path $ProjectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Log "package.json이 존재하지 않습니다." "ERROR"
    exit 1
}

# ================================================================
# 2. c8 package.json 등록 확인
# ================================================================
$c8Registered = $false
$c8Version = ""

try {
    $packageJson = Get-Content $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

    if ($packageJson.dependencies -and $packageJson.dependencies.'c8') {
        $c8Registered = $true
        $c8Version = $packageJson.dependencies.'c8'
    }

    if ($packageJson.devDependencies -and $packageJson.devDependencies.'c8') {
        $c8Registered = $true
        $c8Version = $packageJson.devDependencies.'c8'
    }

    if ($c8Registered) {
        Write-Log "c8이 package.json에 등록되어 있습니다. (버전: $c8Version)" "INFO"
    } else {
        Write-Log "c8이 package.json에 없습니다." "WARN"
    }
} catch {
    Write-Log "package.json 파싱 실패: $_" "ERROR"
}

# ================================================================
# 3. node_modules에서 실제 설치 확인
# ================================================================
$c8Installed = $false
$c8ModulePath = Join-Path $ProjectRoot "node_modules\c8"
if (Test-Path $c8ModulePath) {
    $c8Installed = $true

    $c8PackageJson = Join-Path $c8ModulePath "package.json"
    if (Test-Path $c8PackageJson) {
        try {
            $c8Pkg = Get-Content $c8PackageJson -Raw -Encoding UTF8 | ConvertFrom-Json
            $c8Version = $c8Pkg.version
            Write-Log "c8 설치 확인 (실제 버전: $c8Version)" "INFO"
        } catch {
            Write-Log "c8 버전 확인 실패" "WARN"
        }
    }
} else {
    Write-Log "c8이 node_modules에 설치되지 않았습니다." "ERROR"
    Write-Log "설치 명령: npm install -D c8" "INFO"
}

# ================================================================
# 4. npx c8 --version 실행 테스트
# ================================================================
$versionSuccess = $false
$c8ActualVersion = ""
if ($c8Installed) {
    try {
        $c8ActualVersion = npx c8 --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $versionSuccess = $true
            Write-Log "c8 --version 성공: $c8ActualVersion" "INFO"
        } else {
            Write-Log "c8 --version 실패: $c8ActualVersion" "ERROR"
        }
    } catch {
        Write-Log "c8 --version 실행 오류: $_" "ERROR"
    }
}

# ================================================================
# 5. c8 help 실행 테스트 (기본 동작 확인)
# ================================================================
$helpSuccess = $false
if ($c8Installed) {
    try {
        $helpOutput = npx c8 --help 2>&1
        if ($LASTEXITCODE -eq 0) {
            $helpSuccess = $true
            Write-Log "c8 --help 성공" "INFO"
        } else {
            Write-Log "c8 --help 실패" "ERROR"
        }
    } catch {
        Write-Log "c8 --help 실행 오류: $_" "ERROR"
    }
}

# ================================================================
# 6. 결과를 step04_c8_test.md에 기록
# ================================================================
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$overallSuccess = $c8Installed -and $versionSuccess -and $helpSuccess

$resultContent = @"
# Step 04 - c8 코드 커버리지 환경 테스트 결과

## 테스트 정보
- **실행 시간**: $timestamp
- **c8 버전**: $c8ActualVersion
- **전체 결과**: $(if ($overallSuccess) { "Pass" } else { "Fail" })

## 설치 상태
- c8 패키지: $(if ($c8Installed) { "설치됨" } else { "미설치" })

## 검증 항목
1. package.json 등록 확인: $(if ($c8Registered) { "등록됨 ($c8Version)" } else { "미등록" })
2. node_modules 설치 확인: $(if ($c8Installed) { "설치됨" } else { "미설치" })
3. c8 --version 테스트: $(if ($versionSuccess) { "성공 ($c8ActualVersion)" } else { "실패" })
4. c8 --help 테스트: $(if ($helpSuccess) { "성공" } else { "실패" })

## 미설치 시 설치 명령
``````
npm install -D c8
``````

## 다음 단계
Step 05: 전체 조사
"@

Set-Content -Path $ResultFile -Value $resultContent -Encoding UTF8
Write-Log "결과 파일 생성: $ResultFile" "INFO"

Write-Log "=== c8 Validator 완료 ===" "INFO"

if (-not $overallSuccess) {
    Write-Log "c8 환경이 준비되지 않았습니다." "ERROR"
    exit 1
} else {
    Write-Log "모든 검증 통과" "INFO"
    exit 0
}
