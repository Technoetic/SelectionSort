# ================================================================
# jscpd Validator Hook
# ================================================================
# 목적: Step 05 (jscpd 코드 중복 탐지 환경 설치 검증)
# 기능: jscpd 패키지 설치 확인 및 테스트 결과 기록
# ================================================================

param(
    [string]$ProjectRoot = $PWD
)

$ErrorActionPreference = "Stop"
$LogFile = Join-Path $ProjectRoot ".claude\hooks\jscpd-validator.log"
$ResultFile = Join-Path $ProjectRoot ".claude\step05_jscpd_test.md"

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

Write-Log "=== jscpd Validator 시작 ===" "INFO"

# ================================================================
# 1. package.json 존재 확인
# ================================================================
$packageJsonPath = Join-Path $ProjectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Log "package.json이 존재하지 않습니다." "ERROR"
    exit 1
}

# ================================================================
# 2. jscpd package.json 등록 확인
# ================================================================
$jscpdRegistered = $false
$jscpdVersion = ""

try {
    $packageJson = Get-Content $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

    if ($packageJson.dependencies -and $packageJson.dependencies.'jscpd') {
        $jscpdRegistered = $true
        $jscpdVersion = $packageJson.dependencies.'jscpd'
    }

    if ($packageJson.devDependencies -and $packageJson.devDependencies.'jscpd') {
        $jscpdRegistered = $true
        $jscpdVersion = $packageJson.devDependencies.'jscpd'
    }

    if ($jscpdRegistered) {
        Write-Log "jscpd가 package.json에 등록되어 있습니다. (버전: $jscpdVersion)" "INFO"
    } else {
        Write-Log "jscpd가 package.json에 없습니다." "WARN"
    }
} catch {
    Write-Log "package.json 파싱 실패: $_" "ERROR"
}

# ================================================================
# 3. node_modules에서 실제 설치 확인
# ================================================================
$jscpdInstalled = $false
$jscpdModulePath = Join-Path $ProjectRoot "node_modules\jscpd"
if (Test-Path $jscpdModulePath) {
    $jscpdInstalled = $true

    $jscpdPackageJson = Join-Path $jscpdModulePath "package.json"
    if (Test-Path $jscpdPackageJson) {
        try {
            $jscpdPkg = Get-Content $jscpdPackageJson -Raw -Encoding UTF8 | ConvertFrom-Json
            $jscpdVersion = $jscpdPkg.version
            Write-Log "jscpd 설치 확인 (실제 버전: $jscpdVersion)" "INFO"
        } catch {
            Write-Log "jscpd 버전 확인 실패" "WARN"
        }
    }
} else {
    Write-Log "jscpd가 node_modules에 설치되지 않았습니다." "ERROR"
    Write-Log "설치 명령: npm install -D jscpd" "INFO"
}

# ================================================================
# 4. npx jscpd --version 실행 테스트
# ================================================================
$versionSuccess = $false
$jscpdActualVersion = ""
if ($jscpdInstalled) {
    try {
        $jscpdActualVersion = npx jscpd --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $versionSuccess = $true
            Write-Log "jscpd --version 성공: $jscpdActualVersion" "INFO"
        } else {
            Write-Log "jscpd --version 실패: $jscpdActualVersion" "ERROR"
        }
    } catch {
        Write-Log "jscpd --version 실행 오류: $_" "ERROR"
    }
}

# ================================================================
# 5. jscpd help 실행 테스트 (기본 동작 확인)
# ================================================================
$helpSuccess = $false
if ($jscpdInstalled) {
    try {
        $helpOutput = npx jscpd --help 2>&1
        if ($LASTEXITCODE -eq 0) {
            $helpSuccess = $true
            Write-Log "jscpd --help 성공" "INFO"
        } else {
            Write-Log "jscpd --help 실패" "ERROR"
        }
    } catch {
        Write-Log "jscpd --help 실행 오류: $_" "ERROR"
    }
}

# ================================================================
# 6. 결과를 step05_jscpd_test.md에 기록
# ================================================================
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$overallSuccess = $jscpdInstalled -and $versionSuccess -and $helpSuccess

$resultContent = @"
# Step 05 - jscpd 코드 중복 탐지 환경 테스트 결과

## 테스트 정보
- **실행 시간**: $timestamp
- **jscpd 버전**: $jscpdActualVersion
- **전체 결과**: $(if ($overallSuccess) { "Pass" } else { "Fail" })

## 설치 상태
- jscpd 패키지: $(if ($jscpdInstalled) { "설치됨" } else { "미설치" })

## 검증 항목
1. package.json 등록 확인: $(if ($jscpdRegistered) { "등록됨 ($jscpdVersion)" } else { "미등록" })
2. node_modules 설치 확인: $(if ($jscpdInstalled) { "설치됨" } else { "미설치" })
3. jscpd --version 테스트: $(if ($versionSuccess) { "성공 ($jscpdActualVersion)" } else { "실패" })
4. jscpd --help 테스트: $(if ($helpSuccess) { "성공" } else { "실패" })

## 미설치 시 설치 명령
``````
npm install -D jscpd
``````

## 다음 단계
Step 06: 전체 조사
"@

Set-Content -Path $ResultFile -Value $resultContent -Encoding UTF8
Write-Log "결과 파일 생성: $ResultFile" "INFO"

Write-Log "=== jscpd Validator 완료 ===" "INFO"

if (-not $overallSuccess) {
    Write-Log "jscpd 환경이 준비되지 않았습니다." "ERROR"
    exit 1
} else {
    Write-Log "모든 검증 통과" "INFO"
    exit 0
}
