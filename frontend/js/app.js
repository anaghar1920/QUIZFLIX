/**
 * QUIZFLIX Main Application Controller
 * Handles routing, billboard hero, horizontal carousels, search, modals, and bookmarks.
 */

const App = (function () {
    let allQuizzes = [];
    let currentBillboardQuiz = null;
    let currentDetailQuiz = null;
    let activeTab = "home";

    // DOM References
    const navbarEl = document.getElementById("navbar");
    const mainContentView = document.getElementById("main-content-view");
    const searchResultsView = document.getElementById("search-results-view");
    const leaderboardView = document.getElementById("leaderboard-view");
    const historyView = document.getElementById("history-view");
    const myquizView = document.getElementById("myquiz-view");
    const categoriesView = document.getElementById("categories-view");
    const detailModalEl = document.getElementById("detail-modal");
    const settingsModalEl = document.getElementById("settings-modal");

    async function init() {
        // Sticky Navbar scroll listener
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbarEl.classList.add("scrolled");
            } else {
                navbarEl.classList.remove("scrolled");
            }
        });

        // Load Quizzes
        allQuizzes = await Data.getQuizzes();
        await loadBillboard();
        await renderAllRows();
    }

    async function onProfileChanged(profile) {
        await refreshDynamicSections();
        updateNavBookmarkBadge();
    }

    async function refreshDynamicSections() {
        allQuizzes = await Data.getQuizzes();
        await loadBillboard();
        await renderContinueWatchingRow();
        await renderTop10Row();
        await renderMyQuizRow();
        await renderCategoryRows();
        updateNavBookmarkBadge();

        if (activeTab === "leaderboard") Leaderboard.renderLeaderboard();
        if (activeTab === "history") Leaderboard.renderProfileHistory();
        if (activeTab === "myquiz") renderMyQuizPage();
    }

    // ----------------- NAVIGATION -----------------
    function navigate(tabName) {
        SoundFX.playHover();
        activeTab = tabName;

        // Update nav link active states
        const links = document.querySelectorAll(".nav-link");
        links.forEach(l => l.classList.toggle("active", l.getAttribute("data-tab") === tabName));

        // Hide all views first
        mainContentView.classList.add("hidden");
        searchResultsView.classList.add("hidden");
        leaderboardView.classList.add("hidden");
        historyView.classList.add("hidden");
        myquizView.classList.add("hidden");
        categoriesView.classList.add("hidden");

        // Close dropdown
        document.getElementById("profile-dropdown-menu").classList.add("hidden");

        window.scrollTo({ top: 0, behavior: "smooth" });

        switch (tabName) {
            case "home":
                mainContentView.classList.remove("hidden");
                break;
            case "categories":
                categoriesView.classList.remove("hidden");
                filterCategory("all");
                break;
            case "continue":
                mainContentView.classList.remove("hidden");
                const contSection = document.getElementById("continue-watching-section");
                if (contSection) contSection.scrollIntoView({ behavior: "smooth" });
                break;
            case "myquiz":
                myquizView.classList.remove("hidden");
                renderMyQuizPage();
                break;
            case "leaderboard":
                leaderboardView.classList.remove("hidden");
                Leaderboard.renderLeaderboard();
                break;
            case "history":
                historyView.classList.remove("hidden");
                Leaderboard.renderProfileHistory();
                break;
        }
    }

    // ----------------- BILLBOARD -----------------
    async function loadBillboard() {
        currentBillboardQuiz = await Data.getBillboard();
        if (!currentBillboardQuiz) return;

        const q = currentBillboardQuiz;
        document.getElementById("billboard-bg").style.backgroundImage = `url('${q.backdrop_url}')`;
        document.getElementById("billboard-title").textContent = q.title;
        document.getElementById("billboard-desc").textContent = q.description;
        document.getElementById("billboard-match").textContent = `${q.match_percentage || 98}% Match`;
        document.getElementById("billboard-category").textContent = q.category;
        document.getElementById("billboard-questions").textContent = `${q.questions_count || 5} Questions`;
        document.getElementById("billboard-time").innerHTML = `<i class="fa-regular fa-clock"></i> ${Math.round((q.duration_seconds || 300) / 60)} Mins`;

        const diffEl = document.getElementById("billboard-difficulty");
        diffEl.textContent = q.difficulty;
        diffEl.className = `meta-badge badge-${q.difficulty.toLowerCase()}`;

        if (q.top_score) {
            document.getElementById("billboard-top-score").textContent = `${q.top_score} Pts`;
            document.getElementById("billboard-top-player").textContent = q.top_scorer_name || "Alex";
        }

        updateBillboardBookmarkButton();
    }

    async function updateBillboardBookmarkButton() {
        const profile = Profiles.getActiveProfile();
        if (!profile || !currentBillboardQuiz) return;

        const bookmarks = await Data.getBookmarks(profile.id);
        const isBookmarked = bookmarks.some(b => b.id === currentBillboardQuiz.id);
        const btnText = document.getElementById("billboard-bookmark-text");
        const btnIcon = document.querySelector("#billboard-bookmark-btn i");

        if (btnText && btnIcon) {
            btnText.textContent = isBookmarked ? "In My Quiz" : "My Quiz";
            btnIcon.className = isBookmarked ? "fa-solid fa-check" : "fa-solid fa-plus";
        }
    }

    async function toggleBillboardBookmark() {
        SoundFX.playHover();
        const profile = Profiles.getActiveProfile();
        if (!profile || !currentBillboardQuiz) return;

        await Data.toggleBookmark(profile.id, currentBillboardQuiz.id);
        await updateBillboardBookmarkButton();
        await renderMyQuizRow();
        updateNavBookmarkBadge();
    }

    async function playBillboardQuiz() {
        if (!currentBillboardQuiz) return;
        playQuizById(currentBillboardQuiz.id);
    }

    function showBillboardInfo() {
        if (!currentBillboardQuiz) return;
        openDetailModal(currentBillboardQuiz.id);
    }

    // ----------------- ROWS RENDERING -----------------
    async function renderAllRows() {
        await renderContinueWatchingRow();
        await renderTop10Row();
        await renderMyQuizRow();
        await renderCategoryRows();
    }

    async function renderContinueWatchingRow() {
        const profile = Profiles.getActiveProfile();
        const sliderEl = document.getElementById("continue-slider");
        const sectionEl = document.getElementById("continue-watching-section");
        if (!profile || !sliderEl) return;

        const inProgress = await Data.getContinueWatching(profile.id);
        sliderEl.innerHTML = "";

        if (inProgress.length === 0) {
            sectionEl.classList.add("hidden");
            return;
        }

        sectionEl.classList.remove("hidden");
        inProgress.forEach(item => {
            const card = document.createElement("div");
            card.className = "quiz-card continue-card";

            const progressPct = Math.round((item.current_question_index / item.total_questions) * 100);

            card.innerHTML = `
                <div class="card-media" onclick="App.resumeQuiz('${item.quiz_id}')">
                    <img src="${item.backdrop_url || item.poster_url}" alt="${item.title}" class="card-img">
                    <div class="card-title-overlay">
                        <h4 class="card-simple-title">${item.title}</h4>
                    </div>
                </div>
                <div class="continue-progress-track">
                    <div class="continue-progress-bar" style="width: ${progressPct}%;"></div>
                </div>
                <div class="continue-meta-footer">
                    <span class="continue-q-status">Question ${item.current_question_index + 1} of ${item.total_questions}</span>
                    <span>${progressPct}%</span>
                </div>
            `;
            sliderEl.appendChild(card);
        });
    }

    async function renderTop10Row() {
        const sliderEl = document.getElementById("top10-slider");
        if (!sliderEl) return;

        const top10Quizzes = allQuizzes.filter(q => q.is_top10).slice(0, 10);
        sliderEl.innerHTML = "";

        top10Quizzes.forEach((q, idx) => {
            const card = document.createElement("div");
            card.className = "quiz-card";

            card.innerHTML = `
                <div class="top10-item-wrapper" onclick="App.openDetailModal('${q.id}')">
                    <span class="top10-number">${idx + 1}</span>
                    <div class="card-media">
                        <img src="${q.poster_url || q.backdrop_url}" alt="${q.title}" class="card-img">
                        <div class="card-title-overlay">
                            <h4 class="card-simple-title">${q.title}</h4>
                        </div>
                    </div>
                </div>
                ${generateHoverPreviewHTML(q)}
            `;
            sliderEl.appendChild(card);
        });
    }

    async function renderMyQuizRow() {
        const profile = Profiles.getActiveProfile();
        const sliderEl = document.getElementById("myquiz-slider");
        const sectionEl = document.getElementById("myquiz-section");
        if (!profile || !sliderEl) return;

        const bookmarks = await Data.getBookmarks(profile.id);
        sliderEl.innerHTML = "";

        if (bookmarks.length === 0) {
            sectionEl.classList.add("hidden");
            return;
        }

        sectionEl.classList.remove("hidden");
        bookmarks.forEach(q => {
            const card = createQuizCard(q);
            sliderEl.appendChild(card);
        });
    }

    async function renderCategoryRows() {
        const stemSlider = document.getElementById("stem-slider");
        const generalSlider = document.getElementById("general-slider");
        const blitzSlider = document.getElementById("blitz-slider");

        if (stemSlider) {
            stemSlider.innerHTML = "";
            allQuizzes.filter(q => q.category === "Academic & STEM").forEach(q => {
                stemSlider.appendChild(createQuizCard(q));
            });
        }

        if (generalSlider) {
            generalSlider.innerHTML = "";
            allQuizzes.filter(q => q.category === "General Knowledge & History").forEach(q => {
                generalSlider.appendChild(createQuizCard(q));
            });
        }

        if (blitzSlider) {
            blitzSlider.innerHTML = "";
            allQuizzes.filter(q => q.category === "Quick Blitz (5-Min)").forEach(q => {
                blitzSlider.appendChild(createQuizCard(q));
            });
        }
    }

    function createQuizCard(quiz) {
        const card = document.createElement("div");
        card.className = "quiz-card";

        card.innerHTML = `
            <div class="card-media" onclick="App.openDetailModal('${quiz.id}')">
                <img src="${quiz.backdrop_url || quiz.poster_url}" alt="${quiz.title}" class="card-img">
                <div class="card-title-overlay">
                    <h4 class="card-simple-title">${quiz.title}</h4>
                </div>
            </div>
            ${generateHoverPreviewHTML(quiz)}
        `;
        return card;
    }

    function generateHoverPreviewHTML(quiz) {
        const tagsHTML = (quiz.tags || []).slice(0, 3).map((t, i) => `${i > 0 ? '<span class="hover-tag-dot">•</span>' : ''}<span>${t}</span>`).join('');

        return `
            <div class="card-hover-preview">
                <div class="hover-preview-media">
                    <img src="${quiz.backdrop_url}" alt="${quiz.title}" class="hover-preview-img">
                </div>
                <div class="hover-preview-body">
                    <div class="hover-actions-row">
                        <div class="hover-actions-left">
                            <button class="btn-circle-play" onclick="App.playQuizById('${quiz.id}')" title="Play Quiz">
                                <i class="fa-solid fa-play"></i>
                            </button>
                            <button class="btn-circle-icon" onclick="App.toggleCardBookmark('${quiz.id}', this)" title="Bookmark">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <button class="btn-circle-icon" onclick="SoundFX.playHover()" title="Sound Preview">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <button class="btn-circle-icon" onclick="App.openDetailModal('${quiz.id}')" title="More Info">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="hover-meta-row">
                        <span class="meta-match">${quiz.match_percentage || 95}% Match</span>
                        <span class="meta-badge badge-${quiz.difficulty.toLowerCase()}">${quiz.difficulty}</span>
                        <span class="meta-info">${quiz.questions_count || 5} Qs</span>
                    </div>
                    <h4 class="hover-title">${quiz.title}</h4>
                    <div class="hover-tags-row">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    function slideRow(sliderId, direction) {
        SoundFX.playHover();
        const slider = document.getElementById(sliderId);
        if (slider) {
            const scrollAmount = 600 * direction;
            slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }

    // ----------------- DETAIL MODAL -----------------
    async function openDetailModal(quizId) {
        SoundFX.playHover();
        currentDetailQuiz = await Data.getQuizById(quizId);
        if (!currentDetailQuiz) return;

        const q = currentDetailQuiz;
        document.getElementById("modal-banner-bg").style.backgroundImage = `url('${q.backdrop_url}')`;
        document.getElementById("modal-title").textContent = q.title;
        document.getElementById("modal-match").textContent = `${q.match_percentage || 98}% Match`;
        document.getElementById("modal-questions-count").textContent = `${q.questions ? q.questions.length : (q.questions_count || 5)} Questions`;
        document.getElementById("modal-duration").innerHTML = `<i class="fa-regular fa-clock"></i> ${Math.round((q.duration_seconds || 300) / 60)} Mins`;
        document.getElementById("modal-description").textContent = q.description;
        document.getElementById("modal-author").textContent = q.author || "QUIZFLIX Originals";
        document.getElementById("modal-category").textContent = q.category;
        document.getElementById("modal-subcategory").textContent = q.subcategory || "General";

        const diffEl = document.getElementById("modal-difficulty");
        diffEl.textContent = q.difficulty;
        diffEl.className = `meta-badge badge-${q.difficulty.toLowerCase()}`;

        // Play button handler
        document.getElementById("modal-play-btn").onclick = () => {
            closeDetailModal();
            Player.startQuiz(q, null);
        };

        // Bookmark button handler
        const bookmarkBtn = document.getElementById("modal-bookmark-btn");
        bookmarkBtn.onclick = () => toggleModalBookmark(q.id);

        // Tags
        const tagsContainer = document.getElementById("modal-tags-container");
        tagsContainer.innerHTML = "";
        (q.tags || []).forEach(t => {
            const pill = document.createElement("span");
            pill.className = "modal-tag-pill";
            pill.textContent = t;
            tagsContainer.appendChild(pill);
        });

        // Questions preview list
        const questionsList = document.getElementById("modal-questions-list");
        questionsList.innerHTML = "";
        (q.questions || []).forEach((ques, i) => {
            const row = document.createElement("div");
            row.className = "preview-question-row";
            row.innerHTML = `
                <span class="preview-q-num">${i + 1}</span>
                <span class="preview-q-text">${ques.question_text}</span>
                <span class="preview-q-pts">${ques.points || 100} PTS</span>
            `;
            questionsList.appendChild(row);
        });

        detailModalEl.classList.remove("hidden");
    }

    function closeDetailModal() {
        detailModalEl.classList.add("hidden");
    }

    async function toggleModalBookmark(quizId) {
        SoundFX.playHover();
        const profile = Profiles.getActiveProfile();
        if (!profile) return;

        await Data.toggleBookmark(profile.id, quizId);
        await renderMyQuizRow();
        updateNavBookmarkBadge();
    }

    async function toggleCardBookmark(quizId, btnElement) {
        SoundFX.playHover();
        const profile = Profiles.getActiveProfile();
        if (!profile) return;

        const isBookmarked = await Data.toggleBookmark(profile.id, quizId);
        if (btnElement) {
            btnElement.classList.toggle("active", isBookmarked);
            const icon = btnElement.querySelector("i");
            if (icon) icon.className = isBookmarked ? "fa-solid fa-check" : "fa-solid fa-plus";
        }
        await renderMyQuizRow();
        updateNavBookmarkBadge();
    }

    async function updateNavBookmarkBadge() {
        const profile = Profiles.getActiveProfile();
        const countEl = document.getElementById("nav-bookmark-count");
        if (!profile || !countEl) return;

        const bookmarks = await Data.getBookmarks(profile.id);
        countEl.textContent = bookmarks.length;
    }

    // ----------------- QUIZ EXECUTION / RESUME -----------------
    async function playQuizById(quizId) {
        const quiz = await Data.getQuizById(quizId);
        if (!quiz) return;
        Player.startQuiz(quiz, null);
    }

    async function resumeQuiz(quizId) {
        const profile = Profiles.getActiveProfile();
        if (!profile) return;

        const inProgressList = await Data.getContinueWatching(profile.id);
        const saved = inProgressList.find(i => i.quiz_id === quizId);
        const quiz = await Data.getQuizById(quizId);

        if (quiz) {
            Player.startQuiz(quiz, saved);
        }
    }

    // ----------------- SEARCH -----------------
    let searchTimeout = null;

    function toggleSearch() {
        SoundFX.playHover();
        const container = document.getElementById("search-container");
        const input = document.getElementById("search-input");
        container.classList.toggle("open");
        if (container.classList.contains("open")) {
            input.focus();
        } else {
            clearSearch();
        }
    }

    function handleSearch(query) {
        clearTimeout(searchTimeout);
        const clearBtn = document.getElementById("btn-search-clear");
        clearBtn.classList.toggle("hidden", !query);

        searchTimeout = setTimeout(() => {
            executeSearch(query.trim());
        }, 250);
    }

    function clearSearch() {
        document.getElementById("search-input").value = "";
        document.getElementById("btn-search-clear").classList.add("hidden");
        searchResultsView.classList.add("hidden");
        if (activeTab === "home") {
            mainContentView.classList.remove("hidden");
        }
    }

    function executeSearch(query) {
        if (!query) {
            clearSearch();
            return;
        }

        const lower = query.toLowerCase();
        const results = allQuizzes.filter(q => {
            return q.title.toLowerCase().includes(lower) ||
                   q.category.toLowerCase().includes(lower) ||
                   q.description.toLowerCase().includes(lower) ||
                   (q.tags || []).some(t => t.toLowerCase().includes(lower));
        });

        document.getElementById("search-query-display").textContent = `"${query}"`;
        document.getElementById("search-results-count").textContent = `${results.length} quizzes found`;

        const grid = document.getElementById("search-grid");
        grid.innerHTML = "";

        results.forEach(q => {
            grid.appendChild(createQuizCard(q));
        });

        mainContentView.classList.add("hidden");
        leaderboardView.classList.add("hidden");
        historyView.classList.add("hidden");
        myquizView.classList.add("hidden");
        categoriesView.classList.add("hidden");
        searchResultsView.classList.remove("hidden");
    }

    // ----------------- SUBPAGE RENDERING -----------------
    async function renderMyQuizPage() {
        const profile = Profiles.getActiveProfile();
        const grid = document.getElementById("myquiz-grid");
        if (!profile || !grid) return;

        const bookmarks = await Data.getBookmarks(profile.id);
        grid.innerHTML = "";

        if (bookmarks.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1rem; color:#777;">
                    <i class="fa-solid fa-bookmark" style="font-size:3rem; margin-bottom:1rem;"></i>
                    <h3>Your Watchlist is empty</h3>
                    <p>Add quizzes to your list to easily take them anytime.</p>
                </div>
            `;
            return;
        }

        bookmarks.forEach(q => {
            grid.appendChild(createQuizCard(q));
        });
    }

    async function filterCategory(categoryName, pillBtn = null) {
        SoundFX.playHover();
        if (pillBtn) {
            const pills = document.querySelectorAll(".category-filter-pills .pill");
            pills.forEach(p => p.classList.remove("active"));
            pillBtn.classList.add("active");
        }

        const grid = document.getElementById("categories-grid");
        if (!grid) return;

        const filtered = categoryName === "all" 
            ? allQuizzes 
            : allQuizzes.filter(q => q.category.toLowerCase() === categoryName.toLowerCase());

        grid.innerHTML = "";
        filtered.forEach(q => {
            grid.appendChild(createQuizCard(q));
        });
    }

    // ----------------- PROFILE DROPDOWN & SETTINGS -----------------
    function toggleProfileDropdown() {
        SoundFX.playHover();
        const menu = document.getElementById("profile-dropdown-menu");
        const isHidden = menu.classList.contains("hidden");

        if (isHidden) {
            renderDropdownProfilesList();
            menu.classList.remove("hidden");
        } else {
            menu.classList.add("hidden");
        }
    }

    function renderDropdownProfilesList() {
        const listEl = document.getElementById("dropdown-profiles-list");
        const profiles = Profiles.getProfilesList();
        const active = Profiles.getActiveProfile();
        if (!listEl) return;

        listEl.innerHTML = "";
        profiles.forEach(p => {
            if (active && p.id === active.id) return; // Skip active

            const item = document.createElement("div");
            item.className = "dropdown-profile-item";
            item.onclick = () => {
                document.getElementById("profile-dropdown-menu").classList.add("hidden");
                Profiles.handleProfileClick(p);
            };

            item.innerHTML = `
                <img src="assets/${p.avatar || 'avatar-red'}.svg" class="nav-avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${p.name}'">
                <span>${p.name}</span>
                ${p.has_pin ? '<i class="fa-solid fa-lock" style="font-size:0.7rem; color:#888; margin-left:auto;"></i>' : ''}
            `;
            listEl.appendChild(item);
        });
    }

    function openSettingsModal() {
        SoundFX.playHover();
        document.getElementById("profile-dropdown-menu").classList.add("hidden");
        settingsModalEl.classList.remove("hidden");
    }

    function closeSettingsModal() {
        settingsModalEl.classList.add("hidden");
    }

    function openTerminalGuide() {
        openSettingsModal();
    }

    return {
        init,
        navigate,
        onProfileChanged,
        refreshDynamicSections,
        playBillboardQuiz,
        showBillboardInfo,
        toggleBillboardBookmark,
        openDetailModal,
        closeDetailModal,
        toggleModalBookmark,
        toggleCardBookmark,
        slideRow,
        playQuizById,
        resumeQuiz,
        toggleSearch,
        handleSearch,
        clearSearch,
        filterCategory,
        toggleProfileDropdown,
        openSettingsModal,
        closeSettingsModal,
        openTerminalGuide
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
