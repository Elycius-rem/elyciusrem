@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"
  py -m http.server 8080 --bind 127.0.0.1
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"
  python -m http.server 8080 --bind 127.0.0.1
  goto :eof
)

echo.
echo Python was not found on this computer.
echo Install Python, or run any local web server in this folder.
echo.
pause
