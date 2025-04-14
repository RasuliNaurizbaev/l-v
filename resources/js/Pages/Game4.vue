<template>
    <div class="typing-game">
        <div class="game-header">
            <div class="target-text">
                <p>{{ targetText }}</p>
            </div>
            <div class="stats">
                <span>Time: {{ timer }}s</span>
                <span>Errors: {{ errorCount }}</span>
            </div>
        </div>

        <div class="input-area">
            <textarea v-model="userInput" placeholder="Type the word here..." @input="handleInput"
                @keydown="handleKeyDown" @keyup="handleKeyUp"></textarea>
        </div>

        <div class="ranking">
            <h3>Ranking</h3>
            <ul>
                <li v-for="user in ranking" :key="user.id">
                    {{ user.name }} - {{ user.score }} WPM
                </li>
            </ul>
        </div>

        <div class="virtual-keyboard">
            <div class="keyboard-row" v-for="(row, rowIndex) in keyboardRows" :key="rowIndex">
                <button v-for="key in row" :key="key" :class="{ active: key === activeKey }">
                    {{ key }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { words } from '../stores/words.js';


const randomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
};


const targetText = ref(randomWord());

const userInput = ref("");


const timer = ref(0);
const errorCount = ref(0);

const activeKey = ref(null);

const ranking = ref([
    { id: 1, name: "Alice", score: 80 },
    { id: 2, name: "Bob", score: 75 },
    { id: 3, name: "Charlie", score: 70 }
]);

const keyboardRows = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
];

let intervalId = null;
const startTimer = () => {
    if (intervalId) return;
    intervalId = setInterval(() => {
        timer.value += 1;
    }, 1000);
};

const stopTimer = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

const handleInput = () => {
    if (userInput.value.length === 1 && timer.value === 0) {
        startTimer();
    }

    errorCount.value = 0;
    for (let i = 0; i < userInput.value.length; i++) {
        if (userInput.value[i] !== targetText.value[i]) {
            errorCount.value++;
        }
    }

    if (userInput.value === targetText.value) {
        userInput.value = '';
        targetText.value = randomWord();
    }
};

const handleKeyDown = (event) => {
    activeKey.value = event.key.toUpperCase();
};

const handleKeyUp = (event) => {
    activeKey.value = null;
};

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
.typing-game {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
}

.game-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
}

.target-text p {
    font-size: 1.2rem;
    margin: 0.5rem;
    text-align: center;
}

.stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
}

.input-area textarea {
    width: 100%;
    height: 100px;
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

.ranking {
    margin: 1rem 0;
}

.ranking ul {
    list-style: none;
    padding: 0;
}

.ranking li {
    padding: 0.2rem 0;
}
.virtual-keyboard {
  margin: 1rem auto;
  padding: 1rem;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  display: inline-block;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.virtual-keyboard button {
  margin: 4px;
  width: 45px;
  height: 45px;
  font-size: 0.9rem;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  background: linear-gradient(145deg, #d1d1d1, #ffffff);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.1s ease;
  outline: none;
  cursor: pointer;
}

.virtual-keyboard button:nth-child(1) {
  width: 55px;
}
.virtual-keyboard button:last-child { 
  width: 55px;
}

.virtual-keyboard button:contains("Space") {
  width: 250px;
}

.virtual-keyboard button.active,
.virtual-keyboard button:active {
  background: linear-gradient(145deg, #b0b0b0, #e0e0e0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
  transform: translateY(2px);
}

.virtual-keyboard button:hover {
  background: linear-gradient(145deg, #c8c8c8, #f0f0f0);
}
</style>