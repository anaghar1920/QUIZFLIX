/**
 * QUIZFLIX Multi-Profile Manager
 * Handles up to 5 profiles, avatar selection, 4-digit PIN protection, and profile switching.
 */

const Profiles = (function () {
    let activeProfile = null;
    let profilesList = [];
    let isManageMode = false;
    let pendingProfileForPin = null;
    let enteredPinDigits = "";

    // DOM Elements
    const gatewayEl = document.getElementById("profile-gateway");
    const appMainEl = document.getElementById("app-main");
    const profilesGridEl = document.getElementById("profiles-grid");
    const manageBtnTextEl = document.getElementById("manage-btn-text");
    const pinModalEl = document.getElementById("pin-modal");
    const profileEditModalEl = document.getElementById("profile-edit-modal");

    async function init() {
        profilesList = await Data.getProfiles();
        
        // Restore last active profile if stored
        const savedProfileId = localStorage.getItem("quizflix_active_profile_id");
        const found = profilesList.find(p => p.id === savedProfileId);
        
        if (found && !found.has_pin) {
            selectProfile(found, false);
        } else {
            showProfileGateway();
        }
    }

    function showProfileGateway() {
        isManageMode = false;
        if (manageBtnTextEl) manageBtnTextEl.textContent = "Manage Profiles";
        renderProfilesGateway();
        gatewayEl.classList.remove("hidden");
        appMainEl.classList.add("hidden");
    }

    function renderProfilesGateway() {
        profilesGridEl.innerHTML = "";

        profilesList.forEach(p => {
            const card = document.createElement("div");
            card.className = "profile-card";
            card.onclick = () => handleProfileClick(p);

            const hasPinIcon = p.has_pin ? `<div class="profile-pin-badge"><i class="fa-solid fa-lock"></i></div>` : '';
            const kidsBadge = p.is_kids ? `<div class="profile-kids-badge">KIDS</div>` : '';

            card.innerHTML = `
                <div class="profile-avatar-wrapper">
                    <img src="assets/${p.avatar || 'avatar-red'}.svg" alt="${p.name}" class="profile-avatar-img" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${p.name}'">
                    ${kidsBadge}
                    ${hasPinIcon}
                    <div class="profile-edit-overlay"><i class="fa-solid fa-pen"></i></div>
                </div>
                <span class="profile-card-name">${p.name}</span>
            `;
            profilesGridEl.appendChild(card);
        });

        // Add Profile Box if less than 5 profiles
        if (profilesList.length < 5) {
            const addCard = document.createElement("div");
            addCard.className = "profile-card";
            addCard.onclick = () => openProfileModal(null);
            addCard.innerHTML = `
                <div class="add-profile-box"><i class="fa-solid fa-plus"></i></div>
                <span class="profile-card-name">Add Profile</span>
            `;
            profilesGridEl.appendChild(addCard);
        }
    }

    function handleProfileClick(profile) {
        SoundFX.playHover();
        if (isManageMode) {
            openProfileModal(profile);
            return;
        }

        if (profile.has_pin) {
            openPinModal(profile);
        } else {
            selectProfile(profile, true);
        }
    }

    function toggleManageMode() {
        isManageMode = !isManageMode;
        gatewayEl.classList.toggle("manage-mode", isManageMode);
        manageBtnTextEl.textContent = isManageMode ? "Done" : "Manage Profiles";
        SoundFX.playHover();
    }

    function selectProfile(profile, triggerIntro = true) {
        activeProfile = profile;
        localStorage.setItem("quizflix_active_profile_id", profile.id);

        if (triggerIntro) {
            SoundFX.playTadum();
        }

        // Update header info
        const headerAvatar = document.getElementById("header-avatar-img");
        const headerName = document.getElementById("header-profile-name");
        const continueName = document.getElementById("continue-profile-name");
        const historyName = document.getElementById("history-profile-title");

        if (headerAvatar) {
            headerAvatar.src = `assets/${profile.avatar || 'avatar-red'}.svg`;
            headerAvatar.onerror = () => headerAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`;
        }
        if (headerName) headerName.textContent = profile.name;
        if (continueName) continueName.textContent = profile.name;
        if (historyName) historyName.textContent = profile.name;

        // Hide gateway, show app
        gatewayEl.classList.add("hidden");
        appMainEl.classList.remove("hidden");

        // Refresh dynamic rows
        if (window.App) {
            App.onProfileChanged(profile);
        }
    }

    // PIN Authentication Modal
    function openPinModal(profile) {
        pendingProfileForPin = profile;
        enteredPinDigits = "";
        document.getElementById("pin-target-name").textContent = profile.name;
        document.getElementById("pin-error-msg").classList.add("hidden");
        updatePinDots();
        pinModalEl.classList.remove("hidden");
    }

    function closePinModal() {
        pinModalEl.classList.add("hidden");
        pendingProfileForPin = null;
        enteredPinDigits = "";
    }

    function enterPinDigit(digit) {
        if (enteredPinDigits.length < 4) {
            enteredPinDigits += digit;
            SoundFX.playHover();
            updatePinDots();

            if (enteredPinDigits.length === 4) {
                setTimeout(verifyPinSubmission, 200);
            }
        }
    }

    function deletePinDigit() {
        if (enteredPinDigits.length > 0) {
            enteredPinDigits = enteredPinDigits.slice(0, -1);
            SoundFX.playHover();
            updatePinDots();
        }
    }

    function clearPin() {
        enteredPinDigits = "";
        SoundFX.playHover();
        updatePinDots();
    }

    function updatePinDots() {
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`pdot-${i}`);
            if (dot) {
                dot.classList.toggle("filled", i <= enteredPinDigits.length);
            }
        }
    }

    async function verifyPinSubmission() {
        const errorEl = document.getElementById("pin-error-msg");
        const isValid = await Data.verifyPin(pendingProfileForPin.id, enteredPinDigits);

        if (isValid) {
            const prof = pendingProfileForPin;
            closePinModal();
            selectProfile(prof, true);
        } else {
            SoundFX.playWrong();
            errorEl.classList.remove("hidden");
            enteredPinDigits = "";
            updatePinDots();
        }
    }

    // Profile Edit / Create Modal
    let selectedAvatarValue = "avatar-red";

    function openProfileModal(profile = null) {
        SoundFX.playHover();
        const modalTitle = document.getElementById("profile-modal-title");
        const idInput = document.getElementById("edit-profile-id");
        const nameInput = document.getElementById("profile-name-input");
        const pinInput = document.getElementById("profile-pin-input");
        const kidsInput = document.getElementById("profile-kids-input");
        const deleteBtn = document.getElementById("btn-delete-profile");

        if (profile) {
            modalTitle.textContent = "Edit Profile";
            idInput.value = profile.id;
            nameInput.value = profile.name;
            pinInput.value = "";
            kidsInput.checked = Boolean(profile.is_kids);
            selectedAvatarValue = profile.avatar || "avatar-red";
            deleteBtn.classList.toggle("hidden", profilesList.length <= 1);
        } else {
            modalTitle.textContent = "Add Profile";
            idInput.value = "";
            nameInput.value = "";
            pinInput.value = "";
            kidsInput.checked = false;
            selectedAvatarValue = "avatar-red";
            deleteBtn.classList.add("hidden");
        }

        highlightSelectedAvatar(selectedAvatarValue);
        profileEditModalEl.classList.remove("hidden");
    }

    function closeProfileModal() {
        profileEditModalEl.classList.add("hidden");
    }

    function selectAvatarOption(avatarName, imgEl) {
        SoundFX.playHover();
        selectedAvatarValue = avatarName;
        highlightSelectedAvatar(avatarName);
    }

    function highlightSelectedAvatar(avatarName) {
        const options = document.querySelectorAll(".avatar-option");
        options.forEach(opt => {
            opt.classList.toggle("selected", opt.getAttribute("data-avatar") === avatarName);
        });
    }

    async function saveProfileForm(e) {
        e.preventDefault();
        const id = document.getElementById("edit-profile-id").value;
        const name = document.getElementById("profile-name-input").value.trim();
        const pin = document.getElementById("profile-pin-input").value.trim();
        const is_kids = document.getElementById("profile-kids-input").checked ? 1 : 0;

        if (!name) return;

        const profileData = {
            id: id || undefined,
            name,
            avatar: selectedAvatarValue,
            pin: pin || null,
            is_kids
        };

        try {
            await Data.saveProfile(profileData);
            profilesList = await Data.getProfiles();
            closeProfileModal();
            renderProfilesGateway();
            SoundFX.playCorrect();

            if (activeProfile && activeProfile.id === id) {
                const updated = profilesList.find(p => p.id === id);
                if (updated) selectProfile(updated, false);
            }
        } catch (err) {
            alert(err.message || "Failed to save profile");
        }
    }

    async function deleteCurrentEditingProfile() {
        const id = document.getElementById("edit-profile-id").value;
        if (!id) return;
        if (!confirm("Are you sure you want to delete this profile and all its quiz records?")) return;

        await Data.deleteProfile(id);
        profilesList = await Data.getProfiles();
        closeProfileModal();
        renderProfilesGateway();

        if (activeProfile && activeProfile.id === id) {
            showProfileGateway();
        }
    }

    return {
        init,
        getActiveProfile: () => activeProfile,
        getProfilesList: () => profilesList,
        showProfileGateway,
        toggleManageMode,
        handleProfileClick,
        openProfileModal,
        closeProfileModal,
        selectAvatarOption,
        saveProfileForm,
        deleteCurrentEditingProfile,
        openPinModal,
        closePinModal,
        enterPinDigit,
        deletePinDigit,
        clearPin
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    Profiles.init();
});
