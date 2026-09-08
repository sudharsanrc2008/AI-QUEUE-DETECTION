@echo off
title Push SmartQueue AI to GitHub
echo ===================================================
echo       PUSH SMARTQUEUE AI TO GITHUB REPOSITORY       
echo ===================================================
echo Remote: https://github.com/sudharsanrc2008/AI-QUEUE-DETECTION.git
echo Branch: main
echo.
set "PATH=C:\Users\user\.local\git\cmd;%PATH%"

cd /d "%~dp0"
git add .
git commit -m "Update: SmartQueue AI complete full-stack web application"
echo.
echo Pushing commits to GitHub...
echo (If prompted for password, enter your GitHub Personal Access Token)
git push -u origin main

echo.
pause
