"""
QUIZFLIX Database Engine (SQLite)
Manages profiles, quizzes, questions, bookmarks, active progress, and history.
"""

import sqlite3
import os
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "quizflix.db"

def get_connection():
    """Returns a SQLite connection with dict-like row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initializes all database tables and indexes."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Profiles Table (Up to 5 profiles per account, optional PIN)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        pin TEXT DEFAULT NULL,
        is_kids INTEGER DEFAULT 0,
        color_theme TEXT DEFAULT '#E50914',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Quizzes Table (Academic & Trivia)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT NOT NULL, -- EASY, MEDIUM, HARD, MASTER
        duration_seconds INTEGER NOT NULL DEFAULT 300,
        questions_count INTEGER NOT NULL DEFAULT 5,
        backdrop_url TEXT NOT NULL,
        poster_url TEXT NOT NULL,
        is_trending INTEGER DEFAULT 0,
        is_top10 INTEGER DEFAULT 0,
        top10_rank INTEGER DEFAULT 0,
        match_percentage INTEGER DEFAULT 95,
        author TEXT DEFAULT 'QUIZFLIX Originals',
        tags TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Questions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        quiz_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        question_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, true_false, code_snippet
        options_json TEXT NOT NULL, -- JSON array of strings
        correct_answer TEXT NOT NULL,
        explanation TEXT NOT NULL,
        points INTEGER DEFAULT 100,
        order_num INTEGER NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    );
    """)

    # 4. Bookmarks Table (My Quiz)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bookmarks (
        profile_id TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (profile_id, quiz_id),
        FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    );
    """)

    # 5. Quiz Progress Table (Continue Watching/Quiz with exact state)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_progress (
        profile_id TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        current_question_index INTEGER NOT NULL DEFAULT 0,
        selected_answers_json TEXT DEFAULT '{}',
        time_elapsed INTEGER DEFAULT 0,
        time_remaining INTEGER DEFAULT 0,
        total_questions INTEGER NOT NULL,
        status TEXT DEFAULT 'in_progress', -- in_progress, completed
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (profile_id, quiz_id),
        FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    );
    """)

    # 6. Quiz History Table (Per-profile attempts and scores)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quiz_history (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        quiz_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        percentage REAL NOT NULL,
        correct_count INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_spent_seconds INTEGER NOT NULL,
        answers_json TEXT DEFAULT '{}',
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    );
    """)

    # Indexes for lightning fast queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes (category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions (quiz_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_progress_profile ON quiz_progress (profile_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_history_profile ON quiz_history (profile_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_history_quiz ON quiz_history (quiz_id);")

    conn.commit()
    conn.close()

# Helper queries
def get_all_profiles():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM profiles ORDER BY created_at ASC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_profile_by_id(profile_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM profiles WHERE id = ?", (profile_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def save_profile(profile_data):
    conn = get_connection()
    conn.execute("""
    INSERT INTO profiles (id, name, avatar, pin, is_kids, color_theme)
    VALUES (:id, :name, :avatar, :pin, :is_kids, :color_theme)
    ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        avatar = excluded.avatar,
        pin = excluded.pin,
        is_kids = excluded.is_kids,
        color_theme = excluded.color_theme
    """, profile_data)
    conn.commit()
    conn.close()

def delete_profile(profile_id):
    conn = get_connection()
    conn.execute("DELETE FROM profiles WHERE id = ?", (profile_id,))
    conn.commit()
    conn.close()

def get_all_quizzes():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM quizzes ORDER BY is_trending DESC, is_top10 DESC, created_at DESC").fetchall()
    quizzes = []
    for r in rows:
        q = dict(r)
        q['tags'] = json.loads(q['tags']) if q['tags'] else []
        quizzes.append(q)
    conn.close()
    return quizzes

def get_quiz_by_id(quiz_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,)).fetchone()
    if not row:
        conn.close()
        return None
    quiz = dict(row)
    quiz['tags'] = json.loads(quiz['tags']) if quiz['tags'] else []
    
    # Fetch questions
    q_rows = conn.execute("SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_num ASC", (quiz_id,)).fetchall()
    questions = []
    for qr in q_rows:
        q_item = dict(qr)
        q_item['options'] = json.loads(q_item['options_json'])
        del q_item['options_json']
        questions.append(q_item)
    quiz['questions'] = questions
    conn.close()
    return quiz

def get_billboard_quiz():
    """Gets the spotlight billboard quiz (highest top score or #1 trending)."""
    conn = get_connection()
    # Check if there is a quiz with top score in history, otherwise top10 rank 1
    row = conn.execute("""
    SELECT q.*, COALESCE(MAX(h.score), 1000) as top_score,
           COALESCE(p.name, 'Alex Quantum') as top_scorer_name,
           COALESCE(p.avatar, 'avatar-1') as top_scorer_avatar
    FROM quizzes q
    LEFT JOIN quiz_history h ON q.id = h.quiz_id
    LEFT JOIN profiles p ON h.profile_id = p.id
    WHERE q.is_top10 = 1 AND q.top10_rank = 1
    GROUP BY q.id
    LIMIT 1
    """).fetchone()
    
    if not row:
        row = conn.execute("SELECT * FROM quizzes LIMIT 1").fetchone()
        
    conn.close()
    if row:
        data = dict(row)
        data['tags'] = json.loads(data['tags']) if data.get('tags') else []
        return data
    return None

def get_continue_watching(profile_id):
    """Gets in-progress quizzes for a specific profile with exact question progress."""
    conn = get_connection()
    rows = conn.execute("""
    SELECT p.*, q.title, q.category, q.difficulty, q.backdrop_url, q.poster_url, q.duration_seconds
    FROM quiz_progress p
    JOIN quizzes q ON p.quiz_id = q.id
    WHERE p.profile_id = ? AND p.status = 'in_progress'
    ORDER BY p.last_updated DESC
    """, (profile_id,)).fetchall()
    
    results = []
    for r in rows:
        item = dict(r)
        item['selected_answers'] = json.loads(item['selected_answers_json']) if item['selected_answers_json'] else {}
        results.append(item)
    conn.close()
    return results

def save_quiz_progress(progress_data):
    """Saves exact in-progress state (current question, answers, timestamps)."""
    conn = get_connection()
    conn.execute("""
    INSERT INTO quiz_progress (profile_id, quiz_id, current_question_index, selected_answers_json, time_elapsed, time_remaining, total_questions, status, last_updated)
    VALUES (:profile_id, :quiz_id, :current_question_index, :selected_answers_json, :time_elapsed, :time_remaining, :total_questions, :status, CURRENT_TIMESTAMP)
    ON CONFLICT(profile_id, quiz_id) DO UPDATE SET
        current_question_index = excluded.current_question_index,
        selected_answers_json = excluded.selected_answers_json,
        time_elapsed = excluded.time_elapsed,
        time_remaining = excluded.time_remaining,
        total_questions = excluded.total_questions,
        status = excluded.status,
        last_updated = CURRENT_TIMESTAMP
    """, progress_data)
    conn.commit()
    conn.close()

def delete_quiz_progress(profile_id, quiz_id):
    conn = get_connection()
    conn.execute("DELETE FROM quiz_progress WHERE profile_id = ? AND quiz_id = ?", (profile_id, quiz_id))
    conn.commit()
    conn.close()

def get_bookmarks(profile_id):
    conn = get_connection()
    rows = conn.execute("""
    SELECT q.*, b.added_at
    FROM bookmarks b
    JOIN quizzes q ON b.quiz_id = q.id
    WHERE b.profile_id = ?
    ORDER BY b.added_at DESC
    """, (profile_id,)).fetchall()
    
    results = []
    for r in rows:
        item = dict(r)
        item['tags'] = json.loads(item['tags']) if item['tags'] else []
        results.append(item)
    conn.close()
    return results

def toggle_bookmark(profile_id, quiz_id):
    conn = get_connection()
    existing = conn.execute("SELECT 1 FROM bookmarks WHERE profile_id = ? AND quiz_id = ?", (profile_id, quiz_id)).fetchone()
    if existing:
        conn.execute("DELETE FROM bookmarks WHERE profile_id = ? AND quiz_id = ?", (profile_id, quiz_id))
        is_bookmarked = False
    else:
        conn.execute("INSERT INTO bookmarks (profile_id, quiz_id) VALUES (?, ?)", (profile_id, quiz_id))
        is_bookmarked = True
    conn.commit()
    conn.close()
    return is_bookmarked

def record_quiz_history(history_data):
    conn = get_connection()
    conn.execute("""
    INSERT INTO quiz_history (id, profile_id, quiz_id, score, max_score, percentage, correct_count, total_questions, time_spent_seconds, answers_json)
    VALUES (:id, :profile_id, :quiz_id, :score, :max_score, :percentage, :correct_count, :total_questions, :time_spent_seconds, :answers_json)
    """, history_data)
    
    # Mark progress as completed or remove from progress
    conn.execute("DELETE FROM quiz_progress WHERE profile_id = :profile_id AND quiz_id = :quiz_id", history_data)
    conn.commit()
    conn.close()

def get_profile_history(profile_id):
    conn = get_connection()
    rows = conn.execute("""
    SELECT h.*, q.title, q.category, q.subcategory, q.difficulty, q.poster_url, q.backdrop_url
    FROM quiz_history h
    JOIN quizzes q ON h.quiz_id = q.id
    WHERE h.profile_id = ?
    ORDER BY h.completed_at DESC
    """, (profile_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_leaderboard(quiz_id=None, limit=20):
    conn = get_connection()
    if quiz_id:
        rows = conn.execute("""
        SELECT h.*, p.name as profile_name, p.avatar as profile_avatar, q.title as quiz_title, q.category
        FROM quiz_history h
        JOIN profiles p ON h.profile_id = p.id
        JOIN quizzes q ON h.quiz_id = q.id
        WHERE h.quiz_id = ?
        ORDER BY h.score DESC, h.percentage DESC, h.time_spent_seconds ASC
        LIMIT ?
        """, (quiz_id, limit)).fetchall()
    else:
        rows = conn.execute("""
        SELECT h.*, p.name as profile_name, p.avatar as profile_avatar, q.title as quiz_title, q.category
        FROM quiz_history h
        JOIN profiles p ON h.profile_id = p.id
        JOIN quizzes q ON h.quiz_id = q.id
        ORDER BY h.score DESC, h.percentage DESC, h.time_spent_seconds ASC
        LIMIT ?
        """, (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
