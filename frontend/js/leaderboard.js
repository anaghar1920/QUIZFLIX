/**
 * QUIZFLIX Leaderboard & Profile History View Manager
 */

const Leaderboard = (function () {

    async function renderLeaderboard() {
        const podiumEl = document.getElementById("leaderboard-podium");
        const tableBodyEl = document.getElementById("leaderboard-table-body");
        
        const leaderboardData = await Data.getLeaderboard();
        if (!podiumEl || !tableBodyEl) return;

        // Render Podium Top 3
        const top3 = leaderboardData.slice(0, 3);
        podiumEl.innerHTML = "";

        const rankClasses = ["rank-1", "rank-2", "rank-3"];
        const rankLabels = ["1st Champion", "2nd Place", "3rd Place"];

        top3.forEach((item, idx) => {
            const slot = document.createElement("div");
            slot.className = `podium-slot ${rankClasses[idx] || ''}`;
            const crown = idx === 0 ? '<div class="podium-crown"><i class="fa-solid fa-crown"></i></div>' : '';

            slot.innerHTML = `
                <div class="podium-avatar">
                    ${crown}
                    <img src="assets/${item.avatar || 'avatar-red'}.svg" alt="${item.profile_name}" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${item.profile_name}'">
                </div>
                <div class="podium-name">${item.profile_name}</div>
                <div class="podium-score">${item.score} PTS</div>
                <span class="meta-info">${rankLabels[idx]}</span>
            `;
            podiumEl.appendChild(slot);
        });

        // Render Table Body
        tableBodyEl.innerHTML = "";
        leaderboardData.forEach((item, idx) => {
            const tr = document.createElement("tr");
            const rankIcon = idx === 0 
                ? '<i class="fa-solid fa-medal trophy-gold"></i> #1' 
                : (idx === 1 ? '<i class="fa-solid fa-medal trophy-silver"></i> #2' 
                : (idx === 2 ? '<i class="fa-solid fa-medal trophy-bronze"></i> #3' : `#${idx + 1}`));

            const mins = Math.floor((item.time_spent_seconds || 0) / 60);
            const secs = (item.time_spent_seconds || 0) % 60;
            const timeStr = `${mins}m ${secs}s`;

            tr.innerHTML = `
                <td><strong>${rankIcon}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <img src="assets/${item.avatar || 'avatar-red'}.svg" style="width:28px; height:28px; border-radius:4px;" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${item.profile_name}'">
                        <span>${item.profile_name}</span>
                    </div>
                </td>
                <td><strong>${item.quiz_title}</strong></td>
                <td><span class="meta-category">${item.category}</span></td>
                <td><strong class="trophy-gold">${item.score}</strong></td>
                <td><span class="text-green">${item.percentage}%</span></td>
                <td><span class="meta-info">${timeStr}</span></td>
                <td><span class="meta-info">${item.completed_at || 'Recent'}</span></td>
            `;
            tableBodyEl.appendChild(tr);
        });
    }

    async function renderProfileHistory() {
        const profile = Profiles.getActiveProfile();
        if (!profile) return;

        const historyItemsListEl = document.getElementById("history-items-list");
        const historyData = await Data.getProfileHistory(profile.id);

        // Stats calculation
        const totalQuizzes = historyData.length;
        const totalScore = historyData.reduce((acc, h) => acc + (h.score || 0), 0);
        const avgAccuracy = totalQuizzes > 0 
            ? Math.round(historyData.reduce((acc, h) => acc + (h.percentage || 0), 0) / totalQuizzes) 
            : 0;

        document.getElementById("stat-total-quizzes").textContent = totalQuizzes;
        document.getElementById("stat-total-score").textContent = totalScore;
        document.getElementById("stat-avg-accuracy").textContent = `${avgAccuracy}%`;

        if (!historyItemsListEl) return;
        historyItemsListEl.innerHTML = "";

        if (historyData.length === 0) {
            historyItemsListEl.innerHTML = `
                <div style="text-align:center; padding:3rem; color:#777;">
                    <i class="fa-solid fa-clock-rotate-left" style="font-size:3rem; margin-bottom:1rem;"></i>
                    <p>No completed quizzes yet. Start learning to record your score history!</p>
                </div>
            `;
            return;
        }

        historyData.forEach(item => {
            const card = document.createElement("div");
            card.className = "history-item-card";

            const mins = Math.floor((item.time_spent_seconds || 0) / 60);
            const secs = (item.time_spent_seconds || 0) % 60;
            const timeStr = `${mins}m ${secs}s`;

            card.innerHTML = `
                <div class="history-item-left">
                    <img src="${item.poster_url || item.backdrop_url || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=300'}" alt="${item.title}" class="history-thumb">
                    <div>
                        <h4 class="history-title">${item.title}</h4>
                        <div class="history-meta">
                            <span class="meta-category">${item.category}</span>
                            <span><i class="fa-regular fa-clock"></i> ${timeStr}</span>
                            <span><i class="fa-regular fa-calendar"></i> ${item.completed_at || 'Today'}</span>
                        </div>
                    </div>
                </div>
                <div class="history-item-right">
                    <div class="history-score-box">
                        <div class="history-pts">${item.score} PTS</div>
                        <div class="history-pct">${item.percentage}% Accuracy</div>
                    </div>
                    <button class="btn-netflix-secondary" onclick="App.playQuizById('${item.quiz_id}')">
                        <i class="fa-solid fa-rotate-right"></i> Retake
                    </button>
                </div>
            `;
            historyItemsListEl.appendChild(card);
        });
    }

    return {
        renderLeaderboard,
        renderProfileHistory
    };
})();
