/**
 * QUIZFLIX Synthesized Web Audio Engine
 * Provides authentic Netflix "Ta-dum", button clicks, timer ticks,
 * correct chimes, wrong buzzers, and victory fanfares without external audio files.
 */

const SoundFX = (function () {
    let audioCtx = null;
    let isMuted = localStorage.getItem("quizflix_muted") === "true";

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function isAudioAvailable() {
        return !isMuted && typeof window !== 'undefined';
    }

    /**
     * Iconic Netflix "Ta-Dum" Sound Synthesizer
     * Two-phase sound: Deep punchy low frequency sub-drop followed by a cinematic cello-like chord swell
     */
    function playTadum() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // 1. Heavy Cinematic Sub Drop (The "Ta")
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(95, now);
        subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

        subGain.gain.setValueAtTime(0.8, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.6);

        // 2. Rising Metallic Chord Swell (The "Dummm")
        const notes = [130.81, 164.81, 196.00, 261.63]; // C minor / cinematic power chord
        notes.forEach((freq, i) => {
            const chordOsc = ctx.createOscillator();
            const chordGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            chordOsc.type = 'sawtooth';
            chordOsc.frequency.setValueAtTime(freq * 0.98, now + 0.12);
            chordOsc.frequency.exponentialRampToValueAtTime(freq, now + 0.4);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(250, now + 0.12);
            filter.frequency.exponentialRampToValueAtTime(1800, now + 0.8);

            chordGain.gain.setValueAtTime(0.001, now + 0.12);
            chordGain.gain.linearRampToValueAtTime(0.25 - (i * 0.04), now + 0.35);
            chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

            chordOsc.connect(filter);
            filter.connect(chordGain);
            chordGain.connect(ctx.destination);

            chordOsc.start(now + 0.12);
            chordOsc.stop(now + 2.3);
        });
    }

    /**
     * Tactile UI Hover Blip
     */
    function playHover() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.05);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    /**
     * Correct Answer Harmonious Chime (Major triad)
     */
    function playCorrect() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
        freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + (idx * 0.08));

            gain.gain.setValueAtTime(0.18, now + (idx * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.08) + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + (idx * 0.08));
            osc.stop(now + (idx * 0.08) + 0.65);
        });
    }

    /**
     * Wrong Answer Buzzer (Dissonant minor second chord)
     */
    function playWrong() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const freqs = [155.56, 164.81]; // Low clash Eb3 - E3
        freqs.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.5);
        });
    }

    /**
     * Countdown Timer Tick
     */
    function playTick() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
    }

    /**
     * Victory Triumph Fanfare
     */
    function playVictory() {
        if (!isAudioAvailable()) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.12, t: 0 },
            { f: 659.25, d: 0.12, t: 0.12 },
            { f: 783.99, d: 0.12, t: 0.24 },
            { f: 1046.50, d: 0.4, t: 0.36 }
        ];

        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + note.t);

            gain.gain.setValueAtTime(0.22, now + note.t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + note.t);
            osc.stop(now + note.t + note.d + 0.05);
        });
    }

    function toggleMute() {
        isMuted = !isMuted;
        localStorage.setItem("quizflix_muted", isMuted ? "true" : "false");
        updateMuteUI();
        if (!isMuted) {
            playHover();
        }
        return isMuted;
    }

    function updateMuteUI() {
        const soundIcon = document.getElementById("sound-icon");
        const billboardIcon = document.getElementById("billboard-sound-icon");
        const iconClass = isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
        
        if (soundIcon) soundIcon.className = iconClass;
        if (billboardIcon) billboardIcon.className = iconClass;
    }

    // Init UI on load
    document.addEventListener("DOMContentLoaded", () => {
        updateMuteUI();
    });

    return {
        playTadum,
        playHover,
        playCorrect,
        playWrong,
        playTick,
        playVictory,
        toggleMute,
        isMuted: () => isMuted
    };
})();
