#!/usr/bin/env python3
"""
=============================================================================
  QUIZFLIX - Interactive Cross-Platform Terminal Interface
  Windows / Linux / macOS compatible terminal client powered by SQLite.
=============================================================================
"""

import os
import sys
import time
import json
import uuid
import getpass
from pathlib import Path

# Add backend directory to sys.path to access database
BACKEND_DIR = Path(__file__).parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

try:
    import database
    from seed_data import seed_database
except ImportError:
    print("Error importing database modules. Ensure backend/database.py exists.")
    sys.exit(1)

# Ensure DB is initialized
database.init_db()
if not database.get_all_quizzes():
    seed_database()

# Terminal ANSI Color Codes
class Colors:
    RED = '\033[91m'
    BOLD_RED = '\033[1;91m'
    WHITE = '\033[97m'
    BOLD_WHITE = '\033[1;97m'
    YELLOW = '\033[93m'
    GREEN = '\033[92m'
    CYAN = '\033[96m'
    GRAY = '\033[90m'
    DARK_BG = '\033[40m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

# Enable Windows VT100 ANSI processing
if os.name == 'nt':
    os.system('color')

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_banner():
    banner = f"""
{Colors.BOLD_RED}  ██████╗ ██╗   ██╗██╗███████╗███████╗██╗     ██╗██╗  ██╗
 ██╔═══██╗██║   ██║██║╚══███╔╝██╔════╝██║     ██║╚██╗██╔╝
 ██║   ██║██║   ██║██║  ███╔╝ █████╗  ██║     ██║ ╚███╔╝ 
 ██║▄▄ ██║██║   ██║██║ ███╔╝  ██╔══╝  ██║     ██║ ██╔██╗ 
 ╚██████╔╝╚██████╔╝██║███████╗██║     ███████╗██║██╔╝ ██╗
  ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝{Colors.RESET}
  {Colors.BOLD_WHITE}STREAM, LEARN & MASTER ACADEMIC AND GENERAL KNOWLEDGE{Colors.RESET}
  {Colors.GRAY}─────────────────────────────────────────────────────────────{Colors.RESET}
"""
    print(banner)

# ----------------- PROFILES AUTHENTICATION -----------------
def select_profile_gateway():
    while True:
        clear_screen()
        print_banner()
        print(f"  {Colors.BOLD_WHITE}👤 WHO'S LEARNING? (Select Your Profile):{Colors.RESET}\n")

        profiles = database.get_all_profiles()
        for idx, p in enumerate(profiles, 1):
            pin_badge = f"{Colors.YELLOW}[PIN 🔒]{Colors.RESET}" if p.get('pin') else ""
            kids_badge = f"{Colors.GREEN}[KIDS]{Colors.RESET}" if p.get('is_kids') else ""
            print(f"    {Colors.BOLD_RED}[{idx}]{Colors.RESET} {Colors.BOLD_WHITE}{p['name']}{Colors.RESET} {pin_badge} {kids_badge}")

        if len(profiles) < 5:
            print(f"    {Colors.CYAN}[A]{Colors.RESET} Add New Profile")
        print(f"    {Colors.GRAY}[Q] Exit QUIZFLIX{Colors.RESET}\n")

        choice = input(f"  {Colors.BOLD_RED}QUIZFLIX > {Colors.RESET}").strip().upper()

        if choice == 'Q':
            print(f"\n  {Colors.BOLD_RED}Thank you for learning with QUIZFLIX. Goodbye!{Colors.RESET}\n")
            sys.exit(0)

        if choice == 'A' and len(profiles) < 5:
            create_new_profile_cli()
            continue

        try:
            p_idx = int(choice) - 1
            if 0 <= p_idx < len(profiles):
                selected = profiles[p_idx]
                if selected.get('pin'):
                    if verify_pin_cli(selected):
                        return selected
                else:
                    return selected
        except ValueError:
            pass

def verify_pin_cli(profile):
    attempts = 3
    while attempts > 0:
        entered = getpass.getpass(f"\n  {Colors.YELLOW}🔐 Enter 4-digit PIN for {profile['name']}: {Colors.RESET}").strip()
        if entered == str(profile['pin']).strip():
            print(f"  {Colors.GREEN}✓ Profile unlocked!{Colors.RESET}")
            time.sleep(0.6)
            return True
        else:
            attempts -= 1
            print(f"  {Colors.BOLD_RED}✗ Incorrect PIN ({attempts} attempts remaining){Colors.RESET}")
    time.sleep(1)
    return False

def create_new_profile_cli():
    print(f"\n  {Colors.BOLD_WHITE}➕ Create New Profile:{Colors.RESET}")
    name = input(f"  Enter Profile Name: ").strip()
    if not name:
        return
    pin = input(f"  Enter 4-Digit PIN (or press Enter for none): ").strip()
    is_kids = input(f"  Is this a Kids profile? (y/N): ").strip().lower() == 'y'

    new_profile = {
        "id": f"prof-{uuid.uuid4().hex[:8]}",
        "name": name,
        "avatar": "avatar-red",
        "pin": pin if len(pin) == 4 else None,
        "is_kids": 1 if is_kids else 0,
        "color_theme": "#E50914"
    }
    database.save_profile(new_profile)
    print(f"  {Colors.GREEN}✓ Profile created successfully!{Colors.RESET}")
    time.sleep(1)

# ----------------- MAIN MENU -----------------
def main_menu(profile):
    while True:
        clear_screen()
        print_banner()
        print(f"  {Colors.GRAY}Active Profile:{Colors.RESET} {Colors.BOLD_RED}● {profile['name']}{Colors.RESET}\n")

        # Get billboard info
        billboard = database.get_billboard_quiz()
        top_score_text = f" (Record: {billboard.get('top_score', 570)} Pts by {billboard.get('top_scorer_name', 'Alex')})" if billboard else ""

        # Get continue watching count
        in_progress = database.get_continue_watching(profile['id'])
        continue_badge = f" {Colors.BOLD_RED}({len(in_progress)} in progress){Colors.RESET}" if in_progress else ""

        # Get bookmark count
        bookmarks = database.get_bookmarks(profile['id'])
        bookmark_badge = f" {Colors.CYAN}({len(bookmarks)}){Colors.RESET}" if bookmarks else ""

        print(f"  {Colors.BOLD_RED}[1]{Colors.RESET} ▶ Play Billboard Spotlight: {Colors.BOLD_WHITE}{billboard['title'] if billboard else 'Featured'}{Colors.RESET}{top_score_text}")
        print(f"  {Colors.BOLD_RED}[2]{Colors.RESET} ⏸️ Continue In-Progress Quiz{continue_badge}")
        print(f"  {Colors.BOLD_RED}[3]{Colors.RESET} 📚 Browse All Categories & Quizzes")
        print(f"  {Colors.BOLD_RED}[4]{Colors.RESET} 🔖 My Quiz Bookmarks{bookmark_badge}")
        print(f"  {Colors.BOLD_RED}[5]{Colors.RESET} 🏆 Global Hall of Fame & Leaderboard")
        print(f"  {Colors.BOLD_RED}[6]{Colors.RESET} 📊 My Quiz History & Accuracy Stats")
        print(f"  {Colors.BOLD_RED}[7]{Colors.RESET} 👥 Switch Profile")
        print(f"  {Colors.BOLD_RED}[8]{Colors.RESET} 🌐 Launch Web GUI Server (http://localhost:5000)")
        print(f"  {Colors.GRAY}[Q] Exit QUIZFLIX{Colors.RESET}\n")

        choice = input(f"  {Colors.BOLD_RED}Select option > {Colors.RESET}").strip().upper()

        if choice == '1' and billboard:
            run_quiz_cli(profile, billboard['id'])
        elif choice == '2':
            show_continue_cli(profile)
        elif choice == '3':
            show_categories_cli(profile)
        elif choice == '4':
            show_bookmarks_cli(profile)
        elif choice == '5':
            show_leaderboard_cli()
        elif choice == '6':
            show_history_cli(profile)
        elif choice == '7':
            profile = select_profile_gateway()
        elif choice == '8':
            launch_web_gui()
        elif choice == 'Q':
            print(f"\n  {Colors.BOLD_RED}Thank you for streaming QUIZFLIX!{Colors.RESET}\n")
            sys.exit(0)

# ----------------- QUIZ RUNNER ENGINE -----------------
def run_quiz_cli(profile, quiz_id, resume_state=None):
    quiz = database.get_quiz_by_id(quiz_id)
    if not quiz or not quiz.get('questions'):
        print(f"\n  {Colors.BOLD_RED}Error: Quiz not found.{Colors.RESET}")
        time.sleep(1.5)
        return

    questions = quiz['questions']
    current_idx = resume_state['current_question_index'] if resume_state else 0
    selected_answers = resume_state.get('selected_answers', {}) if resume_state else {}
    time_elapsed = resume_state.get('time_elapsed', 0) if resume_state else 0
    time_remaining = resume_state.get('time_remaining', quiz.get('duration_seconds', 300)) if resume_state else quiz.get('duration_seconds', 300)

    total_score = 0
    correct_count = 0
    max_score = sum(q.get('points', 100) for q in questions)
    start_time = time.time()

    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}🎬 NOW PLAYING:{Colors.RESET} {Colors.BOLD_WHITE}{quiz['title']}{Colors.RESET}")
    print(f"  {Colors.GRAY}Category:{Colors.RESET} {quiz['category']} • {Colors.GRAY}Difficulty:{Colors.RESET} {quiz['difficulty']} • {Colors.GRAY}Questions:{Colors.RESET} {len(questions)}")
    print(f"  {Colors.GRAY}{quiz['description']}{Colors.RESET}\n")
    input(f"  {Colors.BOLD_RED}Press [Enter] to begin challenge...{Colors.RESET}")

    while current_idx < len(questions):
        q = questions[current_idx]
        clear_screen()
        print_banner()
        progress_bar = f"[{'█' * (current_idx + 1)}{'░' * (len(questions) - current_idx - 1)}]"
        print(f"  {Colors.BOLD_RED}QUESTION {current_idx + 1} OF {len(questions)}{Colors.RESET} {Colors.CYAN}{progress_bar}{Colors.RESET} • {Colors.YELLOW}{q.get('points', 100)} PTS{Colors.RESET}")
        print(f"  {Colors.GRAY}─────────────────────────────────────────────────────────────{Colors.RESET}")
        print(f"\n  {Colors.BOLD_WHITE}{q['question_text']}{Colors.RESET}\n")

        options = q['options']
        letters = ['A', 'B', 'C', 'D', 'E']
        for i, opt in enumerate(options):
            print(f"    {Colors.BOLD_RED}[{letters[i]}]{Colors.RESET} {opt}")

        print(f"\n  {Colors.GRAY}[P] Pause & Save Progress | [Q] Exit to Menu{Colors.RESET}")

        ans = input(f"\n  {Colors.BOLD_RED}Your Answer > {Colors.RESET}").strip().upper()

        if ans == 'P':
            # Save progress
            database.save_quiz_progress({
                "profile_id": profile['id'],
                "quiz_id": quiz['id'],
                "current_question_index": current_idx,
                "selected_answers_json": json.dumps(selected_answers),
                "time_elapsed": int(time_elapsed + (time.time() - start_time)),
                "time_remaining": max(0, int(time_remaining - (time.time() - start_time))),
                "total_questions": len(questions),
                "status": "in_progress"
            })
            print(f"\n  {Colors.GREEN}✓ Quiz progress saved! You can resume anytime.{Colors.RESET}")
            time.sleep(1.5)
            return

        if ans == 'Q':
            return

        # Map answer letter
        selected_option = None
        for i, let in enumerate(letters[:len(options)]):
            if ans == let:
                selected_option = options[i]
                break

        if not selected_option:
            continue

        selected_answers[q['id']] = selected_option
        is_correct = selected_option.strip().lower() == q['correct_answer'].strip().lower()

        if is_correct:
            total_score += q.get('points', 100)
            correct_count += 1
            print(f"\n  {Colors.GREEN}✓ CORRECT ANSWER! (+{q.get('points', 100)} PTS){Colors.RESET}")
        else:
            print(f"\n  {Colors.BOLD_RED}✗ INCORRECT.{Colors.RESET} {Colors.WHITE}Correct was: {q['correct_answer']}{Colors.RESET}")

        print(f"  {Colors.CYAN}💡 Explanation:{Colors.RESET} {q.get('explanation', '')}\n")
        current_idx += 1
        input(f"  {Colors.GRAY}Press [Enter] for next question...{Colors.RESET}")

    # Complete Quiz
    total_time_spent = int(time_elapsed + (time.time() - start_time))
    percentage = round((total_score / max_score) * 100, 1) if max_score > 0 else 0

    # Save to SQLite DB
    database.record_quiz_history({
        "id": f"hist-{uuid.uuid4().hex[:10]}",
        "profile_id": profile['id'],
        "quiz_id": quiz['id'],
        "score": total_score,
        "max_score": max_score,
        "percentage": percentage,
        "correct_count": correct_count,
        "total_questions": len(questions),
        "time_spent_seconds": total_time_spent,
        "answers_json": json.dumps(selected_answers)
    })

    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}🏆 QUIZ COMPLETED - RESULTS BREAKDOWN{Colors.RESET}")
    print(f"  {Colors.GRAY}─────────────────────────────────────────────────────────────{Colors.RESET}")
    print(f"  {Colors.BOLD_WHITE}Quiz:{Colors.RESET}            {quiz['title']}")
    print(f"  {Colors.BOLD_WHITE}Learner:{Colors.RESET}         {profile['name']}")
    print(f"  {Colors.BOLD_WHITE}Score:{Colors.RESET}           {Colors.YELLOW}{total_score} / {max_score} PTS{Colors.RESET}")
    print(f"  {Colors.BOLD_WHITE}Accuracy:{Colors.RESET}        {Colors.GREEN}{percentage}% ({correct_count}/{len(questions)} correct){Colors.RESET}")
    print(f"  {Colors.BOLD_WHITE}Time Spent:{Colors.RESET}      {total_time_spent // 60}m {total_time_spent % 60}s\n")

    input(f"  {Colors.BOLD_RED}Press [Enter] to return to Main Menu...{Colors.RESET}")

# ----------------- CONTINUE WATCHING / BOOKMARKS / LEADERBOARD -----------------
def show_continue_cli(profile):
    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}⏸️ CONTINUE WATCHING / IN-PROGRESS QUIZZES{Colors.RESET}\n")

    items = database.get_continue_watching(profile['id'])
    if not items:
        print(f"  {Colors.GRAY}No in-progress quizzes found for {profile['name']}.{Colors.RESET}\n")
        input(f"  Press [Enter] to return...")
        return

    for idx, item in enumerate(items, 1):
        pct = int((item['current_question_index'] / item['total_questions']) * 100)
        print(f"  {Colors.BOLD_RED}[{idx}]{Colors.RESET} {Colors.BOLD_WHITE}{item['title']}{Colors.RESET} • Question {item['current_question_index'] + 1}/{item['total_questions']} ({pct}%)")

    print(f"\n  {Colors.GRAY}[B] Back to Menu{Colors.RESET}\n")
    choice = input(f"  {Colors.BOLD_RED}Select to resume > {Colors.RESET}").strip().upper()

    if choice == 'B':
        return

    try:
        idx = int(choice) - 1
        if 0 <= idx < len(items):
            run_quiz_cli(profile, items[idx]['quiz_id'], resume_state=items[idx])
    except ValueError:
        pass

def show_categories_cli(profile):
    quizzes = database.get_all_quizzes()
    categories = sorted(list(set(q['category'] for q in quizzes)))

    while True:
        clear_screen()
        print_banner()
        print(f"  {Colors.BOLD_RED}📚 BROWSE BY CATEGORY:{Colors.RESET}\n")

        for idx, cat in enumerate(categories, 1):
            count = len([q for q in quizzes if q['category'] == cat])
            print(f"  {Colors.BOLD_RED}[{idx}]{Colors.RESET} {Colors.BOLD_WHITE}{cat}{Colors.RESET} {Colors.GRAY}({count} quizzes){Colors.RESET}")

        print(f"\n  {Colors.GRAY}[B] Back to Menu{Colors.RESET}\n")
        choice = input(f"  {Colors.BOLD_RED}Select Category > {Colors.RESET}").strip().upper()

        if choice == 'B':
            return

        try:
            c_idx = int(choice) - 1
            if 0 <= c_idx < len(categories):
                selected_cat = categories[c_idx]
                show_quizzes_in_cat(profile, selected_cat)
        except ValueError:
            pass

def show_quizzes_in_cat(profile, category):
    quizzes = [q for q in database.get_all_quizzes() if q['category'] == category]

    while True:
        clear_screen()
        print_banner()
        print(f"  {Colors.BOLD_RED}📚 {category.upper()}:{Colors.RESET}\n")

        for idx, q in enumerate(quizzes, 1):
            diff_color = Colors.GREEN if q['difficulty'] == 'EASY' else (Colors.YELLOW if q['difficulty'] == 'MEDIUM' else Colors.BOLD_RED)
            print(f"  {Colors.BOLD_RED}[{idx}]{Colors.RESET} {Colors.BOLD_WHITE}{q['title']}{Colors.RESET} {diff_color}[{q['difficulty']}]{Colors.RESET} • {q['questions_count']} Qs")
            print(f"      {Colors.GRAY}{q['description'][:70]}...{Colors.RESET}")

        print(f"\n  {Colors.GRAY}[B] Back{Colors.RESET}\n")
        choice = input(f"  {Colors.BOLD_RED}Select Quiz to Start > {Colors.RESET}").strip().upper()

        if choice == 'B':
            return

        try:
            q_idx = int(choice) - 1
            if 0 <= q_idx < len(quizzes):
                run_quiz_cli(profile, quizzes[q_idx]['id'])
                return
        except ValueError:
            pass

def show_bookmarks_cli(profile):
    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}🔖 MY QUIZ BOOKMARKS ({profile['name']}){Colors.RESET}\n")

    bookmarks = database.get_bookmarks(profile['id'])
    if not bookmarks:
        print(f"  {Colors.GRAY}No bookmarks yet. Add quizzes from the main menu or Web GUI.{Colors.RESET}\n")
        input(f"  Press [Enter] to return...")
        return

    for idx, q in enumerate(bookmarks, 1):
        print(f"  {Colors.BOLD_RED}[{idx}]{Colors.RESET} {Colors.BOLD_WHITE}{q['title']}{Colors.RESET} • {q['category']}")

    print(f"\n  {Colors.GRAY}[B] Back to Menu{Colors.RESET}\n")
    choice = input(f"  {Colors.BOLD_RED}Select Quiz to Play > {Colors.RESET}").strip().upper()

    if choice == 'B':
        return

    try:
        idx = int(choice) - 1
        if 0 <= idx < len(bookmarks):
            run_quiz_cli(profile, bookmarks[idx]['id'])
    except ValueError:
        pass

def show_leaderboard_cli():
    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}🏆 QUIZFLIX GLOBAL HALL OF FAME & LEADERBOARD{Colors.RESET}\n")

    leaderboard = database.get_leaderboard(limit=10)
    print(f"  {Colors.GRAY}{'RANK':<6} {'LEARNER':<18} {'QUIZ':<32} {'SCORE':<10} {'ACCURACY'}{Colors.RESET}")
    print(f"  {Colors.GRAY}─────────────────────────────────────────────────────────────────────────────{Colors.RESET}")

    for idx, item in enumerate(leaderboard, 1):
        medal = "🥇" if idx == 1 else ("🥈" if idx == 2 else ("🥉" if idx == 3 else f"#{idx}"))
        print(f"  {Colors.BOLD_WHITE}{medal:<6}{Colors.RESET} {item['profile_name']:<18} {item['quiz_title'][:30]:<32} {Colors.YELLOW}{item['score']:<10}{Colors.RESET} {Colors.GREEN}{item['percentage']}%{Colors.RESET}")

    print("\n")
    input(f"  {Colors.GRAY}Press [Enter] to return to Main Menu...{Colors.RESET}")

def show_history_cli(profile):
    clear_screen()
    print_banner()
    print(f"  {Colors.BOLD_RED}📊 QUIZ HISTORY & ANALYTICS ({profile['name']}){Colors.RESET}\n")

    history = database.get_profile_history(profile['id'])
    if not history:
        print(f"  {Colors.GRAY}No completed quizzes found.{Colors.RESET}\n")
        input(f"  Press [Enter] to return...")
        return

    total_score = sum(h['score'] for h in history)
    avg_acc = sum(h['percentage'] for h in history) / len(history)

    print(f"  {Colors.BOLD_WHITE}Total Quizzes Completed:{Colors.RESET} {len(history)}")
    print(f"  {Colors.BOLD_WHITE}Total Points Earned:{Colors.RESET}     {Colors.YELLOW}{total_score} PTS{Colors.RESET}")
    print(f"  {Colors.BOLD_WHITE}Average Accuracy:{Colors.RESET}        {Colors.GREEN}{round(avg_acc, 1)}%{Colors.RESET}\n")

    for h in history:
        mins = h['time_spent_seconds'] // 60
        secs = h['time_spent_seconds'] % 60
        print(f"  • {Colors.BOLD_WHITE}{h['title']}{Colors.RESET}")
        print(f"    Score: {Colors.YELLOW}{h['score']} Pts{Colors.RESET} | Accuracy: {Colors.GREEN}{h['percentage']}%{Colors.RESET} | Time: {mins}m {secs}s | Date: {h['completed_at']}")

    print("\n")
    input(f"  {Colors.GRAY}Press [Enter] to return to Main Menu...{Colors.RESET}")

def launch_web_gui():
    print(f"\n  {Colors.BOLD_RED}🚀 Starting QUIZFLIX Web GUI Server...{Colors.RESET}")
    print(f"  {Colors.BOLD_WHITE}Open your browser at: http://localhost:5000{Colors.RESET}\n")
    import app
    app.app.run(host="0.0.0.0", port=5000, debug=False)

# ----------------- ENTRYPOINT -----------------
if __name__ == "__main__":
    try:
        active_prof = select_profile_gateway()
        main_menu(active_prof)
    except KeyboardInterrupt:
        print(f"\n\n  {Colors.BOLD_RED}QUIZFLIX session ended. Goodbye!{Colors.RESET}\n")
        sys.exit(0)
