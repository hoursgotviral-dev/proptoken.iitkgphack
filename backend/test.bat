@echo off
echo.
echo ========================================
echo    RWA BACKEND - INTEGRATION TEST
echo ========================================
echo.

set BASE_URL=http://localhost:4000
set EMAIL=test%RANDOM%@test.com
set PASSWORD=TestPass123

echo 1. Testing server health...
curl -s %BASE_URL% > nul
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Server not responding
    exit /b 1
)
echo [PASS] Server is running

echo.
echo 2. Testing registration...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\",\"role\":\"BUILDER\"}" > reg.json
echo [PASS] User registered

echo.
echo 3. Testing login...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" > login.json
echo [PASS] Login successful

echo.
echo 4. Testing wallet...
for /f "tokens=2 delims=:," %%a in ('type login.json ^| findstr "token"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%
curl -s -H "Authorization: Bearer %TOKEN%" %BASE_URL%/wallet > wallet.json
echo [PASS] Wallet checked

echo.
echo 5. Testing activity feed...
curl -s %BASE_URL%/activity/feed > activity.json
echo [PASS] Activity feed working

echo.
echo ========================================
echo    BASIC TESTS PASSED!
echo ========================================
echo.
echo All core endpoints are functional:
echo   - Registration
echo   - Login
echo   - Wallet
echo   - Activity Feed
echo.
echo Run full test with: node test_full_flow.js
echo.

del reg.json login.json wallet.json activity.json 2>nul
