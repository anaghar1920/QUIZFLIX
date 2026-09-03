"""
QUIZFLIX REST API & Web Application Server
Flask server providing RESTful endpoints and serving the Netflix-style QUIZFLIX Single Page Application.
"""

import os
import json
import uuid
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS

import database
from seed_data import seed_database

# Paths
BASE_DIR = Path(__file__).parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")
CORS(app)

# Ensure database is initialized on startup
database.init_db()
# Automatically seed if empty
if not database.get_all_quizzes():
    seed_database()

# ----------------- STATIC ASSETS & SPA ROUTING -----------------
@app.route("/")
def index():
    return send_file(FRONTEND_DIR / "index.html")

@app.route("/<path:path>")
def serve_static(path):
    file_path = FRONTEND_DIR / path
    if file_path.exists() and file_path.is_file():
        return send_from_directory(str(FRONTEND_DIR), path)
    return send_file(FRONTEND_DIR / "index.html")

# ----------------- PROFILES API -----------------
@app.route("/api/profiles", methods=["GET"])
def get_profiles():
    profiles = database.get_all_profiles()
    # Mask PIN for security in list response
    sanitized = []
    for p in profiles:
        item = dict(p)
        item["has_pin"] = bool(item.get("pin"))
        del item["pin"]
        sanitized.append(item)
    return jsonify({"success": True, "profiles": sanitized})

@app.route("/api/profiles", methods=["POST"])
def create_or_update_profile():
    data = request.json or {}
    profiles = database.get_all_profiles()
    
    profile_id = data.get("id")
    if not profile_id:
        if len(profiles) >= 5:
            return jsonify({"success": False, "error": "Maximum 5 profiles reached"}), 400
        profile_id = f"prof-{uuid.uuid4().hex[:8]}"

    profile_data = {
        "id": profile_id,
        "name": data.get("name", "New Scholar").strip(),
        "avatar": data.get("avatar", "avatar-red"),
        "pin": data.get("pin") if data.get("pin") else None,
        "is_kids": 1 if data.get("is_kids") else 0,
        "color_theme": data.get("color_theme", "#E50914")
    }

    database.save_profile(profile_data)
    return jsonify({"success": True, "profile": {**profile_data, "has_pin": bool(profile_data["pin"]), "pin": None}})

@app.route("/api/profiles/verify-pin", methods=["POST"])
def verify_profile_pin():
    data = request.json or {}
    profile_id = data.get("profile_id")
    entered_pin = str(data.get("pin", "")).strip()

    profile = database.get_profile_by_id(profile_id)
    if not profile:
        return jsonify({"success": False, "error": "Profile not found"}), 404

    stored_pin = profile.get("pin")
    if not stored_pin or stored_pin == entered_pin:
        return jsonify({"success": True, "verified": True})
    
    return jsonify({"success": False, "verified": False, "error": "Incorrect PIN"}), 401

@app.route("/api/profiles/<profile_id>", methods=["DELETE"])
def delete_profile(profile_id):
    profiles = database.get_all_profiles()
    if len(profiles) <= 1:
        return jsonify({"success": False, "error": "Cannot delete the last remaining profile"}), 400
    
    database.delete_profile(profile_id)
    return jsonify({"success": True})

# ----------------- QUIZZES & BILLBOARD API -----------------
@app.route("/api/quizzes", methods=["GET"])
def get_quizzes():
    category = request.args.get("category")
    quizzes = database.get_all_quizzes()
    if category and category != "all":
        quizzes = [q for q in quizzes if q["category"].lower() == category.lower()]
    return jsonify({"success": True, "quizzes": quizzes})

@app.route("/api/quizzes/<quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    quiz = database.get_quiz_by_id(quiz_id)
    if not quiz:
        return jsonify({"success": False, "error": "Quiz not found"}), 404
    return jsonify({"success": True, "quiz": quiz})

@app.route("/api/billboard", methods=["GET"])
def get_billboard():
    billboard = database.get_billboard_quiz()
    return jsonify({"success": True, "billboard": billboard})

# ----------------- CONTINUE WATCHING / PROGRESS API -----------------
@app.route("/api/progress/<profile_id>", methods=["GET"])
def get_progress(profile_id):
    items = database.get_continue_watching(profile_id)
    return jsonify({"success": True, "items": items})

@app.route("/api/progress", methods=["POST"])
def save_progress():
    data = request.json or {}
    required = ["profile_id", "quiz_id", "current_question_index", "total_questions"]
    if not all(k in data for k in required):
        return jsonify({"success": False, "error": "Missing required progress fields"}), 400

    progress_data = {
        "profile_id": data["profile_id"],
        "quiz_id": data["quiz_id"],
        "current_question_index": int(data.get("current_question_index", 0)),
        "selected_answers_json": json.dumps(data.get("selected_answers", {})),
        "time_elapsed": int(data.get("time_elapsed", 0)),
        "time_remaining": int(data.get("time_remaining", 0)),
        "total_questions": int(data["total_questions"]),
        "status": data.get("status", "in_progress")
    }

    database.save_quiz_progress(progress_data)
    return jsonify({"success": True})

@app.route("/api/progress/<profile_id>/<quiz_id>", methods=["DELETE"])
def delete_progress(profile_id, quiz_id):
    database.delete_quiz_progress(profile_id, quiz_id)
    return jsonify({"success": True})

# ----------------- BOOKMARKS (MY QUIZ) API -----------------
@app.route("/api/bookmarks/<profile_id>", methods=["GET"])
def get_bookmarks(profile_id):
    bookmarks = database.get_bookmarks(profile_id)
    return jsonify({"success": True, "bookmarks": bookmarks})

@app.route("/api/bookmarks/toggle", methods=["POST"])
def toggle_bookmark():
    data = request.json or {}
    profile_id = data.get("profile_id")
    quiz_id = data.get("quiz_id")

    if not profile_id or not quiz_id:
        return jsonify({"success": False, "error": "Missing profile_id or quiz_id"}), 400

    is_bookmarked = database.toggle_bookmark(profile_id, quiz_id)
    return jsonify({"success": True, "is_bookmarked": is_bookmarked})

# ----------------- HISTORY & LEADERBOARD API -----------------
@app.route("/api/history", methods=["POST"])
def record_history():
    data = request.json or {}
    required = ["profile_id", "quiz_id", "score", "max_score", "correct_count", "total_questions", "time_spent_seconds"]
    if not all(k in data for k in required):
        return jsonify({"success": False, "error": "Missing required history fields"}), 400

    history_data = {
        "id": f"hist-{uuid.uuid4().hex[:10]}",
        "profile_id": data["profile_id"],
        "quiz_id": data["quiz_id"],
        "score": int(data["score"]),
        "max_score": int(data["max_score"]),
        "percentage": round((float(data["score"]) / float(data["max_score"])) * 100, 1) if data["max_score"] > 0 else 0,
        "correct_count": int(data["correct_count"]),
        "total_questions": int(data["total_questions"]),
        "time_spent_seconds": int(data["time_spent_seconds"]),
        "answers_json": json.dumps(data.get("answers", {}))
    }

    database.record_quiz_history(history_data)
    return jsonify({"success": True, "history_id": history_data["id"]})

@app.route("/api/history/<profile_id>", methods=["GET"])
def get_profile_history(profile_id):
    history = database.get_profile_history(profile_id)
    return jsonify({"success": True, "history": history})

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    quiz_id = request.args.get("quiz_id")
    limit = int(request.args.get("limit", 25))
    leaderboard = database.get_leaderboard(quiz_id=quiz_id, limit=limit)
    return jsonify({"success": True, "leaderboard": leaderboard})

# ----------------- ENTRYPOINT -----------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"==================================================")
    print(f"  🎬 QUIZFLIX Server Running at http://localhost:{port}")
    print(f"  🍿 Netflix-Style Academic & Trivia Quiz Platform")
    print(f"==================================================")
    app.run(host="0.0.0.0", port=port, debug=True)
