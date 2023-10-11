let keyBox = document.querySelector(".keyBox");
let historyList = document.querySelector(".history-list");
let keyHistory = [];

// Preload voices
let voices = [];

function preloadVoices() {
    voices = speechSynthesis.getVoices();
}

speechSynthesis.onvoiceschanged = preloadVoices;

document.body.addEventListener("keydown", function (e) {
    let key = e.key;
    if (e.shiftKey && e.keyCode !== 16) {
        key = `Shift+${e.key}`;
    }
    if (e.ctrlKey && e.keyCode !== 17) {
        key = `Ctrl+${e.key}`;
    }
    let keyCode = e.keyCode;

    keyBox.innerHTML = `
        <h1 class="key">You Pressed: <span>${key}</span></h1>
        <div class="code">KeyCode For ${key} is ${keyCode}</div>`;

    // Store the key history in the format "t ---> 90"
    keyHistory.push(`${key} ---> ${keyCode}`);
    updateHistory();

    // Use the Web Speech API to pronounce the key with a preloaded voice
    speak(key);
});

function speak(text) {
    const synth = window.speechSynthesis;
    if (voices.length === 0) {
        // Voices are not loaded yet, try again
        setTimeout(() => speak(text), 100);
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[0]; 
    synth.speak(utterance);
}

function updateHistory() {
    // Limit the history to the last 10 keys
    if (keyHistory.length > 10) {
        keyHistory.shift();
    }

    // Update the history list
    historyList.innerHTML = keyHistory
        .map((entry, index) => {
            return `<li>${index + 1}. ${entry}</li>`;
        })
        .join("");
}
