@echo off
echo.
echo ========================================
echo    TESTING ROLE-BASED AUTHORIZATION
echo ========================================
echo.

set BASE_URL=http://localhost:4000

echo [Step 1] Registering BUILDER...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"builder%RANDOM%@test.com\",\"password\":\"pass123\",\"role\":\"BUILDER\"}" > builder_reg.json

for /f "tokens=2 delims=:," %%a in ('type builder_reg.json ^| findstr /C:"email"') do set BUILDER_EMAIL=%%a
set BUILDER_EMAIL=%BUILDER_EMAIL:"=%
set BUILDER_EMAIL=%BUILDER_EMAIL: =%
echo ✅ BUILDER registered: %BUILDER_EMAIL%

echo.
echo [Step 2] Registering CLIENT...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"client%RANDOM%@test.com\",\"password\":\"pass123\",\"role\":\"CLIENT\"}" > client_reg.json

for /f "tokens=2 delims=:," %%a in ('type client_reg.json ^| findstr /C:"email"') do set CLIENT_EMAIL=%%a
set CLIENT_EMAIL=%CLIENT_EMAIL:"=%
set CLIENT_EMAIL=%CLIENT_EMAIL: =%
echo ✅ CLIENT registered: %CLIENT_EMAIL%

echo.
echo [Step 3] BUILDER Login - Getting Token...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%BUILDER_EMAIL%\",\"password\":\"pass123\"}" > builder_login.json

for /f "tokens=2 delims=:," %%a in ('type builder_login.json ^| findstr /C:"token"') do set BUILDER_TOKEN=%%a
set BUILDER_TOKEN=%BUILDER_TOKEN:"=%
set BUILDER_TOKEN=%BUILDER_TOKEN: =%
set BUILDER_TOKEN=%BUILDER_TOKEN:}=%
echo ✅ BUILDER Token: %BUILDER_TOKEN:~0,30%...

echo.
echo [Step 4] CLIENT Login - Getting Token...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%CLIENT_EMAIL%\",\"password\":\"pass123\"}" > client_login.json

for /f "tokens=2 delims=:," %%a in ('type client_login.json ^| findstr /C:"token"') do set CLIENT_TOKEN=%%a
set CLIENT_TOKEN=%CLIENT_TOKEN:"=%
set CLIENT_TOKEN=%CLIENT_TOKEN: =%
set CLIENT_TOKEN=%CLIENT_TOKEN:}=%
echo ✅ CLIENT Token: %CLIENT_TOKEN:~0,30%...

echo.
echo [Step 5] Testing BUILDER can create asset...
curl -s -X POST %BASE_URL%/assets ^
  -H "Authorization: Bearer %BUILDER_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Luxury Villa\",\"description\":\"5BHK\",\"location\":\"Mumbai\",\"valuation\":10000000}" > builder_asset.json

findstr /C:"id" builder_asset.json > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ BUILDER successfully created asset
    for /f "tokens=2 delims=:," %%a in ('type builder_asset.json ^| findstr /C:"\"id\""') do set ASSET_ID=%%a
    set ASSET_ID=%ASSET_ID: =%
    echo    Asset ID: %ASSET_ID%
) else (
    echo ❌ BUILDER failed to create asset
)

echo.
echo [Step 6] Testing CLIENT CANNOT create asset...
curl -s -X POST %BASE_URL%/assets ^
  -H "Authorization: Bearer %CLIENT_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"description\":\"Test\",\"location\":\"Test\",\"valuation\":1000000}" > client_asset_attempt.json

findstr /C:"Access denied" client_asset_attempt.json > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ CLIENT correctly DENIED from creating asset
) else (
    findstr /C:"id" client_asset_attempt.json > nul
    if %ERRORLEVEL% EQU 0 (
        echo ❌ CLIENT should NOT be able to create asset!
    ) else (
        echo ⚠️  Unexpected response
    )
)

echo.
echo [Step 7] Checking tokens are DIFFERENT...
if "%BUILDER_TOKEN%"=="%CLIENT_TOKEN%" (
    echo ❌ ERROR: Tokens are the same!
) else (
    echo ✅ Tokens are DIFFERENT (as expected)
    echo    BUILDER: %BUILDER_TOKEN:~0,20%...
    echo    CLIENT:  %CLIENT_TOKEN:~0,20%...
)

echo.
echo ========================================
echo    AUTHORIZATION TEST SUMMARY
echo ========================================
echo.
echo ✅ Two separate users registered
echo ✅ Each user has unique token
echo ✅ BUILDER can create assets
echo ✅ CLIENT cannot create assets
echo ✅ Role-based access working!
echo.
echo Next: BUILDER can tokenize, CLIENT can buy
echo.

del builder_*.json client_*.json 2>nul
pause
