# 🍿 QUIZFLIX - Interactive Netflix-Style Quiz Streaming Platform

An exact, high-fidelity GUI clone of **Netflix** built for **academic and trivia quizzes** instead of movies. Features a deep cinematic Red & Black theme (`#E50914` & `#141414`), multi-profile support (up to 5 profiles with 4-digit PINs), a dynamic Top Score Hero Billboard, exact-state "Continue Quiz" resumption, dynamic "My Quiz" bookmarking, authentic synthesized Netflix sound effects ("Ta-dum"), an immersive Theater Mode player, a persistent SQLite database, and a cross-platform Terminal CLI.

---

## 🌟 Key Features Included

- 👤 **Multi-Profile Management**: Up to 5 customizable profiles per account (Master Scholar, Code Wizard, History Buff, Kids Mode, Space Explorer) with custom avatar selector.
- 🔐 **4-Digit Profile PIN Security**: Protect individual profiles with interactive PIN security pad.
- 🏠 **Netflix-Style Homepage**: Sticky frosted glass navbar, brand typography, live search with instant expand, sound FX toggle, and responsive category carousels.
- 🎬 **Hero Billboard (#1 Top Score Spotlight)**: Dynamic spotlight showcasing the #1 top-scoring quiz with record holders, backdrop imagery, and direct play/bookmark triggers.
- ▶️ **"Continue Quiz" (Watching) Row**: Displays in-progress quizzes with accurate progress bars, exact question index (e.g. *Question 3 of 5*), and saved elapsed timestamps.
- 🔖 **Dynamic "My Quiz" Watchlist**: One-click bookmarking from billboard, hover cards, or modals that instantly updates across all rows.
- 🏆 **Top 10 Quizzes Today**: Featuring iconic Netflix large-scale bold numbered rankings (1 through 10).
- 🧠 **Theater Mode Fullscreen Quiz Player**:
  - Real-time countdown timer.
  - Pause & Resume with exact state persistence.
  - Interactive multiple choice options.
  - Instant educational explanations and feedback with custom sound effects.
  - Results breakdown screen with accuracy meter, points counter, and celebration fanfare.
  - **Netflix Autoplay "Up Next in 5s"** countdown timer.
- 🏆 **Global Leaderboard & Hall of Fame**: Top 3 Podium (Gold, Silver, Bronze) with rankings table.
- 📊 **Per-Profile History & Analytics**: Total quizzes completed, average accuracy rate, points earned, and full question retake review.
- 💾 **Persistent Relational SQLite Database**: Auto-seeds 16+ academic and trivia quizzes across Quantum Physics, Python Algorithms, Calculus, CRISPR Genetics, Cybersecurity, World History, Astrophysics, Cinema, and Logic Blitz.
- 🖥️ **Cross-Platform Terminal Interface (`quizflix_cli.py`)**: Full ASCII terminal GUI compatible with Windows CMD/PowerShell, macOS Terminal, and Linux Bash.

---

## 📁 Project Directory Structure

```
c:\Users\Hp\Desktop\clone\
│
├── backend/
│   ├── app.py               # Flask REST API server & static file host
│   ├── database.py          # SQLite schema engine & queries (quizflix.db)
│   ├── seed_data.py         # 16+ academic & general knowledge seed quizzes
│   └── requirements.txt     # Python dependencies (Flask, Flask-CORS)
│
├── frontend/
│   ├── index.html           # Main Single Page Application GUI
│   ├── css/
│   │   ├── style.css        # Netflix Design System (Red & Black dark theme)
│   │   └── player.css       # Theater mode player & modal stylesheets
│   ├── js/
│   │   ├── audio.js         # Synthesized Web Audio API ("Ta-dum", chimes, buzzers)
│   │   ├── data.js          # REST API sync layer with instant offline fallback
│   │   ├── profiles.js      # 5 Profiles manager & PIN modal controller
│   │   ├── player.js        # Interactive Quiz Player engine
│   │   ├── leaderboard.js   # Leaderboards & Profile History analytics
│   │   └── app.js           # Main router, billboard, carousel & search controller
│   └── assets/              # Profile avatars (Red, Blue, Yellow, Green, Purple)
│
├── quizflix_cli.py          # Cross-Platform Terminal CLI Interface
├── run.py                   # Universal 1-click Python launcher
├── start.bat                # Windows 1-click batch launcher
├── start.sh                 # macOS / Linux 1-click bash launcher
└── README.md                # Complete documentation and launch guide
```

---

## 🚀 Step-by-Step Instructions: How to Run QUIZFLIX

### 📌 Where to Execute the Code:
Open your preferred terminal / command prompt:
- **Windows**: PowerShell or Command Prompt (`cmd`)
- **macOS / Linux**: Terminal (`bash` or `zsh`)
- **VS Code / IDE**: Built-in Integrated Terminal (`Ctrl + ~`)

Navigate to the project folder:
```bash
cd c:\Users\Hp\Desktop\clone
```

---

### Option 1: Run as a Standalone Web Application (Recommended)

1. **Install required dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Start QUIZFLIX**:
   ```bash
   python run.py
   ```
   *(Or on Windows, simply double-click `start.bat` | On macOS/Linux, run `./start.sh`)*

3. **Open in Browser**:
   The launcher will automatically open your default browser. You can also manually navigate to:
   ```
   http://localhost:5000
   ```

---

### Option 2: Run in Zero-Setup Offline Mode (Direct HTML)

You can run the full frontend directly in any web browser without even starting Python:
1. Open the file `frontend/index.html` in Chrome, Firefox, Edge, or Safari.
2. The built-in client-side data engine will automatically run all 16 seed quizzes, sound effects, 5 profiles, continue watching states, and bookmarking using browser storage!

---

### Option 3: Run the Cross-Platform Terminal Interface (CLI Mode)

To run QUIZFLIX entirely inside your Windows, Linux, or macOS terminal:
```bash
python quizflix_cli.py
```
**Features in Terminal Mode:**
- Colored ASCII Art Netflix-Style Banner.
- Interactive profile selection with 4-digit PIN authentication.
- Billboard #1 Quiz player.
- Resume In-Progress Quizzes.
- Take quizzes with live question progress, score rewards, and explanations.
- View Global Leaderboards and Personal History (synchronized with the exact same `quizflix.db` SQLite database).

---

## 🌐 How to Host QUIZFLIX on the Web as a Separate Public Website

To deploy QUIZFLIX as a live public website for others to access across the internet:

### Method A: Deploy on Render.com (Free & Easy)
1. Push this repository to GitHub.
2. Sign up at [Render.com](https://render.com) and click **New + Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.app:app` or `python backend/app.py`
5. Click **Create Web Service**. Render will provide you with a live HTTPS URL (e.g. `https://quizflix.onrender.com`).

### Method B: Deploy on Railway.app / VPS / PythonAnywhere
1. Upload the files.
2. Set the startup command to `python backend/app.py`.
3. Set environment variable `PORT=80` or `PORT=5000`.

---

## 👤 Default Demo Profiles & PINs

| Profile Name | Avatar | Kids Mode | 4-Digit PIN | Specialty |
| :--- | :--- | :---: | :---: | :--- |
| **Alex Quantum** | Red Face | No | *None* | STEM & Theoretical Physics |
| **Elena Code** | Blue Face | No | `1337` | Python, Algorithms & Cyber Defense |
| **Marcus History** | Yellow Face | No | *None* | World Wars, Geopolitics & Trivia |
| **Sophie Explorer** | Green Face | **Yes (Kids)** | *None* | Speed Blitz & Logic Riddles |
| **Nova Stellar** | Purple Face | No | `2026` | Astrophysics & Cosmology |

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, Modern CSS3 (Custom Netflix Design System, Keyframe Animations, Glassmorphism, CSS Grid & Flexbox), Vanilla Modular JavaScript.
- **Audio Engine**: Web Audio API (Synthesizes Authentic "Ta-dum", Chimes, Buzzers, and Timer Ticks in real-time).
- **Backend**: Python 3, Flask REST API server, Flask-CORS.
- **Database**: SQLite3 (`quizflix.db`) with normalized schemas for Profiles, Quizzes, Questions, Bookmarks, Active Progress, and History.
- **Terminal CLI**: Cross-platform ANSI terminal engine (`quizflix_cli.py`).
