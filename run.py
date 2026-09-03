#!/usr/bin/env python3
"""
=============================================================================
  QUIZFLIX - Universal One-Click Launcher
  Initializes SQLite DB, starts Flask web server, and opens the GUI in browser.
=============================================================================
"""

import os
import sys
import webbrowser
import threading
import time
from pathlib import Path

# Add backend directory
BACKEND_DIR = Path(__file__).parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

import app
import database
from seed_data import seed_database

def open_browser():
    time.sleep(1.2)
    print("\n🌐 Opening QUIZFLIX in your default web browser...")
    webbrowser.open("http://localhost:5000")

def main():
    print("=" * 65)
    print("  🍿 QUIZFLIX - NETFLIX-STYLE QUIZ PLATFORM")
    print("  🔴 Theme: Red (#E50914) & Cinematic Black (#141414)")
    print("  💾 Database: SQLite (quizflix.db)")
    print("=" * 65)

    # Initialize and seed database if necessary
    database.init_db()
    if not database.get_all_quizzes():
        print("🌱 Seeding database with academic & trivia quizzes...")
        seed_database()

    # Launch browser in separate thread
    threading.Thread(target=open_browser, daemon=True).start()

    # Run Flask server
    print("\n🚀 Server is live at: http://localhost:5000")
    print("⌨️  Press Ctrl+C to stop the server\n")
    app.app.run(host="0.0.0.0", port=5000, debug=False)

if __name__ == "__main__":
    main()
