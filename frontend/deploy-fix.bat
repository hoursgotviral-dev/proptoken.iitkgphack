@echo off
echo Fixing Vercel deployment...

REM Add all the fix files
git add vercel.json .vercelignore tsconfig.node.json package.json vite.config.ts

REM Commit
git commit -m "Fix: Vercel deployment configuration and build setup"

REM Force push (use with caution)
echo.
echo Ready to push. This will force push to override conflicts.
echo Press Ctrl+C to cancel, or
pause

git push origin main --force

echo.
echo Done! Vercel should auto-deploy in a few moments.
echo Check: https://vercel.com/dashboard
pause
