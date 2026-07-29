@echo off
echo ================================================
echo   Hashtag Suraksha Local Dev Server
echo ================================================
echo.
echo Starting server at http://localhost:8080
echo Press Ctrl+C to stop.
echo.
echo Opening browser in 2 seconds...
timeout /t 2 /nobreak >nul
start "" "http://localhost:8080/index.html"
python -m http.server 8080
