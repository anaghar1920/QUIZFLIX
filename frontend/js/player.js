/**
 * QUIZFLIX Interactive Theater Quiz Player Engine
 * Fullscreen player with real-time countdown timer, exact state saving,
 * instant explanation feedback, pause/resume, and Netflix autoplay next-quiz countdown.
 */

const Player = (function () {
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let selectedAnswers = {}; // { question_id: option_text }
    let currentSelectedOption = null;
    let totalScore = 0;
    let maxPossibleScore = 0;
    let correctAnswersCount = 0;
    let isPaused = false;
    let timerInterval = null;
    let timeRemaining = 0;
    let timeElapsed = 0;
    let nextQuizTimer = null;
    let nextQuizCountdown = 5;

    // DOM Elements
    const playerModalEl = document.getElementById("quiz-player-modal");
    const quizTitleEl = document.getElementById("player-quiz-title");
    const timerDisplayEl = document.getElementById("player-timer-display");
    const progressBarEl = document.getElementById("player-progress-bar");
    const currentQNumEl = document.getElementById("current-q-num");
    const totalQNumEl = document.getElementById("total-q-num");
    const questionPointsValEl = document.getElementById("question-points-val");
    const questionTextEl = document.getElementById("question-text");
    const optionsContainerEl = document.getElementById("options-container");
    const explanationBoxEl = document.getElementById("explanation-box");
    const explanationStatusTextEl = document.getElementById("explanation-status-text");
    const explanationBodyTextEl = document.getElementById("explanation-body-text");
    const btnSubmitEl = document.getElementById("btn-submit-answer");
    const btnNextEl = document.getElementById("btn-next-question");
    const pauseOverlayEl = document.getElementById("player-pause-overlay");
    const resultsScreenEl = document.getElementById("player-results-screen");

    /**
     * Starts or Resumes a Quiz
     * @param {Object} quiz 
     * @param {Object|null} savedProgress 
     */
    async function startQuiz(quiz, savedProgress = null) {
        currentQuiz = quiz;
        selectedAnswers = savedProgress ? { ...savedProgress.selected_answers } : {};
        currentQuestionIndex = savedProgress ? savedProgress.current_question_index : 0;
        timeElapsed = savedProgress ? (savedProgress.time_elapsed || 0) : 0;
        timeRemaining = savedProgress && savedProgress.time_remaining > 0 
            ? savedProgress.time_remaining 
            : (quiz.duration_seconds || 300);

        totalScore = 0;
        correctAnswersCount = 0;
        maxPossibleScore = (quiz.questions || []).reduce((acc, q) => acc + (q.points || 100), 0);

        // Reset UI States
        isPaused = false;
        resultsScreenEl.classList.add("hidden");
        pauseOverlayEl.classList.add("hidden");
        quizTitleEl.textContent = quiz.title;
        totalQNumEl.textContent = quiz.questions.length;
        
        playerModalEl.classList.remove("hidden");
        SoundFX.playTadum();

        renderCurrentQuestion();
        startTimer();
    }

    function renderCurrentQuestion() {
        if (!currentQuiz || !currentQuiz.questions || currentQuestionIndex >= currentQuiz.questions.length) {
            finishQuiz();
            return;
        }

        const q = currentQuiz.questions[currentQuestionIndex];
        currentSelectedOption = null;

        // Update Header & Progress
        currentQNumEl.textContent = currentQuestionIndex + 1;
        questionPointsValEl.textContent = q.points || 100;
        const progressPct = ((currentQuestionIndex) / currentQuiz.questions.length) * 100;
        progressBarEl.style.width = `${progressPct}%`;

        // Text & Options
        questionTextEl.textContent = q.question_text;
        explanationBoxEl.classList.add("hidden");
        btnNextEl.classList.add("hidden");
        btnSubmitEl.classList.remove("hidden");
        btnSubmitEl.disabled = true;

        optionsContainerEl.innerHTML = "";
        const letters = ["A", "B", "C", "D", "E"];

        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerHTML = `
                <div>
                    <span class="option-letter">${letters[idx] || (idx + 1)}.</span>
                    <span class="option-content">${opt}</span>
                </div>
                <i class="fa-regular fa-circle option-icon"></i>
            `;
            btn.onclick = () => selectOption(opt, btn);
            optionsContainerEl.appendChild(btn);
        });

        // Auto save current position
        saveCurrentProgress();
    }

    function selectOption(optionText, btnElement) {
        SoundFX.playHover();
        currentSelectedOption = optionText;

        const allOptions = optionsContainerEl.querySelectorAll(".option-btn");
        allOptions.forEach(b => {
            b.classList.remove("selected");
            const icon = b.querySelector(".option-icon");
            if (icon) icon.className = "fa-regular fa-circle option-icon";
        });

        btnElement.classList.add("selected");
        const activeIcon = btnElement.querySelector(".option-icon");
        if (activeIcon) activeIcon.className = "fa-solid fa-circle-dot option-icon";

        btnSubmitEl.disabled = false;
    }

    function submitAnswer() {
        if (!currentSelectedOption) return;

        const q = currentQuiz.questions[currentQuestionIndex];
        selectedAnswers[q.id] = currentSelectedOption;
        const isCorrect = currentSelectedOption.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

        // Lock options & display visual validation
        const allButtons = optionsContainerEl.querySelectorAll(".option-btn");
        allButtons.forEach(btn => {
            btn.disabled = true;
            const content = btn.querySelector(".option-content").textContent.trim();
            const icon = btn.querySelector(".option-icon");

            if (content.toLowerCase() === q.correct_answer.trim().toLowerCase()) {
                btn.classList.add("correct");
                if (icon) icon.className = "fa-solid fa-circle-check option-icon";
            } else if (content === currentSelectedOption && !isCorrect) {
                btn.classList.add("wrong");
                if (icon) icon.className = "fa-solid fa-circle-xmark option-icon";
            }
        });

        // Play feedback sounds & score accumulation
        if (isCorrect) {
            SoundFX.playCorrect();
            totalScore += (q.points || 100);
            correctAnswersCount += 1;
            explanationBoxEl.className = "explanation-box";
            explanationStatusTextEl.textContent = "Correct Answer!";
            explanationStatusTextEl.className = "explanation-header correct-header";
        } else {
            SoundFX.playWrong();
            explanationBoxEl.className = "explanation-box wrong-expl";
            explanationStatusTextEl.textContent = "Incorrect";
            explanationStatusTextEl.className = "explanation-header wrong-header";
        }

        explanationBodyTextEl.textContent = q.explanation || "No explanation provided.";
        explanationBoxEl.classList.remove("hidden");

        btnSubmitEl.classList.add("hidden");
        btnNextEl.classList.remove("hidden");

        saveCurrentProgress();
    }

    function nextQuestion() {
        SoundFX.playHover();
        currentQuestionIndex += 1;
        if (currentQuestionIndex < currentQuiz.questions.length) {
            renderCurrentQuestion();
        } else {
            finishQuiz();
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            if (!isPaused) {
                timeRemaining -= 1;
                timeElapsed += 1;
                updateTimerDisplay();

                if (timeRemaining <= 10 && timeRemaining > 0) {
                    SoundFX.playTick();
                }

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    finishQuiz();
                }
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const mins = Math.floor(Math.max(0, timeRemaining) / 60);
        const secs = Math.max(0, timeRemaining) % 60;
        timerDisplayEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function togglePause() {
        SoundFX.playHover();
        isPaused = !isPaused;
        pauseOverlayEl.classList.toggle("hidden", !isPaused);
        const pauseText = document.getElementById("pause-text");
        const pauseIcon = document.getElementById("pause-icon");

        if (pauseText) pauseText.textContent = isPaused ? "Resume" : "Pause";
        if (pauseIcon) pauseIcon.className = isPaused ? "fa-solid fa-play" : "fa-solid fa-pause";

        if (isPaused) {
            saveCurrentProgress();
        }
    }

    async function saveCurrentProgress() {
        const profile = Profiles.getActiveProfile();
        if (!profile || !currentQuiz) return;

        const progressData = {
            profile_id: profile.id,
            quiz_id: currentQuiz.id,
            current_question_index: currentQuestionIndex,
            selected_answers: selectedAnswers,
            time_elapsed: timeElapsed,
            time_remaining: timeRemaining,
            total_questions: currentQuiz.questions.length,
            status: "in_progress"
        };

        await Data.saveProgress(progressData);
    }

    async function finishQuiz() {
        clearInterval(timerInterval);
        progressBarEl.style.width = "100%";

        const profile = Profiles.getActiveProfile();
        const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

        // Record history
        if (profile) {
            await Data.recordHistory({
                profile_id: profile.id,
                quiz_id: currentQuiz.id,
                score: totalScore,
                max_score: maxPossibleScore,
                correct_count: correctAnswersCount,
                total_questions: currentQuiz.questions.length,
                time_spent_seconds: timeElapsed,
                answers: selectedAnswers
            });
        }

        // Show Results
        document.getElementById("results-percentage").textContent = `${percentage}%`;
        document.getElementById("results-score").textContent = `${totalScore} Pts`;
        document.getElementById("results-correct").textContent = `${correctAnswersCount} / ${currentQuiz.questions.length}`;
        
        const m = Math.floor(timeElapsed / 60);
        const s = timeElapsed % 60;
        document.getElementById("results-time").textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        document.getElementById("results-profile").textContent = profile ? profile.name : "Scholar";

        // Sound effect
        if (percentage >= 80) {
            SoundFX.playVictory();
        } else {
            SoundFX.playCorrect();
        }

        resultsScreenEl.classList.remove("hidden");

        // Autoplay Next Recommendation Setup
        setupNextRecommendation();
    }

    async function setupNextRecommendation() {
        const allQuizzes = await Data.getQuizzes();
        const nextQuiz = allQuizzes.find(q => q.id !== currentQuiz.id) || allQuizzes[0];
        
        if (nextQuiz) {
            document.getElementById("next-quiz-title").textContent = nextQuiz.title;
            const nextCard = document.getElementById("next-quiz-recommendation");
            nextCard.classList.remove("hidden");

            // Start 5-second countdown autoplay
            nextQuizCountdown = 5;
            document.getElementById("countdown-num").textContent = nextQuizCountdown;
            
            clearInterval(nextQuizTimer);
            nextQuizTimer = setInterval(() => {
                nextQuizCountdown -= 1;
                const cdEl = document.getElementById("countdown-num");
                if (cdEl) cdEl.textContent = nextQuizCountdown;

                if (nextQuizCountdown <= 0) {
                    clearInterval(nextQuizTimer);
                    playNextRecommended();
                }
            }, 1000);
        }
    }

    async function playNextRecommended() {
        clearInterval(nextQuizTimer);
        const allQuizzes = await Data.getQuizzes();
        const nextQuiz = allQuizzes.find(q => q.id !== currentQuiz.id) || allQuizzes[0];
        if (nextQuiz) {
            const fullNext = await Data.getQuizById(nextQuiz.id);
            startQuiz(fullNext, null);
        }
    }

    function replayCurrentQuiz() {
        clearInterval(nextQuizTimer);
        SoundFX.playHover();
        startQuiz(currentQuiz, null);
    }

    function exitQuiz() {
        clearInterval(timerInterval);
        clearInterval(nextQuizTimer);
        SoundFX.playHover();
        playerModalEl.classList.add("hidden");
        
        // Refresh home rows
        if (window.App) {
            App.refreshDynamicSections();
        }
    }

    return {
        startQuiz,
        selectOption,
        submitAnswer,
        nextQuestion,
        togglePause,
        replayCurrentQuiz,
        playNextRecommended,
        exitQuiz
    };
})();
