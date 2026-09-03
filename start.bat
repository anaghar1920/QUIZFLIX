@echo off
title QUIZFLIX - Netflix-Style Quiz Streaming Platform
color 0C
echo ================================================================
echo    QUIZFLIX - Interactive Netflix-Style Quiz Platform
echo ================================================================
echo.
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not found! Please install Python 3.8+ and add to PATH.
    pause
    exit /b 1
)

echo Installing dependencies (Flask, Flask-Cors)...
pip install -r backend\requirements.txt >nul 2>&1

echo.
echo Launching QUIZFLIX Web Server and GUI...
python run.py
pause
