@echo off
echo Starting Cyber Recon Tool Development Server...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Start dev server using full path (avoiding PATH issues)
echo Running: npm run dev
echo.
C:\Progra~1\nodejs\npm.cmd run dev

pause
