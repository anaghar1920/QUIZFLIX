#!/usr/bin/env bash
# ================================================================
#  QUIZFLIX - Interactive Netflix-Style Quiz Platform Launcher
# ================================================================

echo "================================================================"
echo "   QUIZFLIX - Interactive Netflix-Style Quiz Platform"
echo "================================================================"
echo ""

# Check python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] python3 could not be found. Please install Python 3.8+."
    exit 1
fi

echo "Installing required dependencies..."
python3 -m pip install -r backend/requirements.txt --quiet

echo "Launching QUIZFLIX Web Server..."
python3 run.py
