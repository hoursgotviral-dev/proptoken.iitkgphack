@echo off
echo.
echo ========================================
echo    BACKEND CLEANUP SCRIPT
echo ========================================
echo.

echo Removing temporary test files...
if exist builder_asset.json (del /F builder_asset.json && echo - Deleted builder_asset.json)
if exist builder_reg.json (del /F builder_reg.json && echo - Deleted builder_reg.json)
if exist client_asset_attempt.json (del /F client_asset_attempt.json && echo - Deleted client_asset_attempt.json)
if exist client_reg.json (del /F client_reg.json && echo - Deleted client_reg.json)

echo.
echo Removing development utilities...
if exist test_db.js (del /F test_db.js && echo - Deleted test_db.js)
if exist check_tables.js (del /F check_tables.js && echo - Deleted check_tables.js)
if exist fix_wallets.js (del /F fix_wallets.js && echo - Deleted fix_wallets.js)
if exist inspect_schema.js (del /F inspect_schema.js && echo - Deleted inspect_schema.js)
if exist run_migration.js (del /F run_migration.js && echo - Deleted run_migration.js)

echo.
echo Removing old/redundant scripts...
if exist replit_verify.js (del /F replit_verify.js && echo - Deleted replit_verify.js)
if exist quick_test.js (del /F quick_test.js && echo - Deleted quick_test.js)
if exist setup.sh (del /F setup.sh && echo - Deleted setup.sh)
if exist test_integration.ps1 (del /F test_integration.ps1 && echo - Deleted test_integration.ps1)

echo.
echo ========================================
echo    CLEANUP COMPLETE
echo ========================================
echo.
echo Files removed: 13
echo Backend folder is now cleaner!
echo.
echo Note: 'more' folder (328 items) should be moved manually
echo       to parent directory as it contains frontend files.
echo.
pause
