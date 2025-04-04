<template>
    <v-container class="py-12 px-4" max-width="600">
      <v-card class="rounded-xl shadow-lg">
        <v-card-item class="bg-primary text-center">
          <h1 class="text-2xl font-weight-bold text-white">🎮 数字当てゲーム</h1>
        </v-card-item>
  
        <v-card-text class="pt-6">
          <div v-if="!gameStarted" class="text-center py-4">
            <v-btn 
              size="large" 
              color="primary" 
              rounded="pill" 
              prepend-icon="mdi-play"
              @click="startGame"
              class="px-8 py-3 text-lg"
            >
              スタート
            </v-btn>
            <p class="mt-4 text-gray-600">1から100までの数字を当ててください！</p>
          </div>
  
          <div v-else>
            <div class="text-center mb-6">
              <div class="mb-4">
                <v-chip 
                  size="large" 
                  :color="gameOver ? 'success' : 'primary'" 
                  class="mb-2 font-weight-bold"
                >
                  {{ gameOver ? 'ゲーム終了' : '残り試行: ' + (maxAttempts - attempts) }}
                </v-chip>
                
                <v-chip size="large" color="info" class="ml-2 mb-2">
                  タイム: {{ formatTime(elapsedTime) }}
                </v-chip>
              </div>
              
              <v-alert
                v-if="message"
                :type="getMessageType()"
                class="mb-4 text-center"
                variant="tonal"
                closable
              >
                {{ message }}
              </v-alert>
            </div>
  
            <v-text-field
              v-model="guess"
              label="1から100までの数字を入力"
              type="number"
              class="mx-auto mb-4"
              style="max-width: 300px"
              :disabled="gameOver"
              @keyup.enter="checkGuess"
              :hint="lastGuesses.length > 0 ? '前回の予想: ' + lastGuesses.join(', ') : ''"
              persistent-hint
              :rules="[v => (v && v >= 1 && v <= 100) || '1から100までの数字を入力してください']"
            ></v-text-field>
  
            <div class="text-center">
              <v-btn 
                v-if="!gameOver" 
                color="primary" 
                rounded="pill"
                prepend-icon="mdi-check"
                @click="checkGuess"
                class="px-6"
              >
                確認する
              </v-btn>
              
              <v-btn 
                v-if="gameOver" 
                color="success" 
                rounded="pill"
                prepend-icon="mdi-refresh"
                @click="resetGame"
                class="px-6"
              >
                もう一度プレイ
              </v-btn>
            </div>
  
            <v-progress-linear
              v-if="!gameOver"
              :model-value="attemptsPercentage"
              :color="progressColor"
              height="8"
              class="rounded-lg mt-6"
              striped
            ></v-progress-linear>
          </div>
        </v-card-text>
      </v-card>
  
      <v-card class="mt-8 rounded-xl shadow-lg">
        <v-card-item class="bg-secondary text-center">
          <h2 class="text-xl font-weight-bold text-white">🏆 ランキング</h2>
        </v-card-item>
        
        <v-card-text>
          <v-table v-if="leaderboard.length > 0">
            <thead>
              <tr>
                <th class="text-center">順位</th>
                <th>プレイヤー</th>
                <th class="text-center">タイム</th>
                <th class="text-center">試行回数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in leaderboard" :key="index" :class="{ 'bg-green-lighten-5': player.isCurrentPlayer }">
                <td class="text-center font-weight-bold">{{ index + 1 }}</td>
                <td>{{ player.name }}</td>
                <td class="text-center">{{ formatTime(player.time) }}</td>
                <td class="text-center">{{ player.attempts }}</td>
              </tr>
            </tbody>
          </v-table>
          <p v-else class="text-center py-4 text-medium-emphasis">まだランキングがありません。最初のプレイヤーになりましょう！</p>
        </v-card-text>
      </v-card>
  
      <v-dialog v-model="nameDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="text-h5">おめでとうございます！</v-card-title>
          <v-card-text>
            <p>クリアタイム: {{ formatTime(elapsedTime) }}、試行回数: {{ attempts }}</p>
            <v-text-field
              v-model="playerName"
              label="あなたの名前を入力してください"
              :rules="[v => !!v || '名前を入力してください']"
              @keyup.enter="submitName"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submitName" :disabled="!playerName">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
  import "../../css/game2.css";
  
  // Game state
  const guess = ref(null)
  const secretNumber = ref(generateRandomNumber())
  const message = ref('')
  const gameOver = ref(false)
  const gameStarted = ref(false)
  const attempts = ref(0)
  const maxAttempts = ref(10)
  const lastGuesses = ref([])
  const hintShown = ref(false)
  
  // Timer
  const elapsedTime = ref(0)
  let timer = null
  
  // Leaderboard
  const leaderboard = ref([])
  const nameDialog = ref(false)
  const playerName = ref('')
  
  // Computed properties
  const attemptsPercentage = computed(() => {
    return (attempts.value / maxAttempts.value) * 100
  })
  
  const progressColor = computed(() => {
    if (attemptsPercentage.value < 40) return 'success'
    if (attemptsPercentage.value < 70) return 'warning'
    return 'error'
  })
  
  // Functions
  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }
  
  function startTimer() {
    elapsedTime.value = 0
    timer = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }
  
  function stopTimer() {
    clearInterval(timer)
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins > 0 ? mins + '分' : ''}${secs}秒`
  }
  
  function startGame() {
    gameStarted.value = true
    attempts.value = 0
    message.value = 'ゲームスタート! 数字を入れてください！'
    startTimer()
    lastGuesses.value = []
    secretNumber.value = generateRandomNumber()
    guess.value = null
    hintShown.value = false
  }
  
  function getMessageType() {
    if (gameOver.value) return 'success'
    if (message.value.includes('足りない') || message.value.includes('多過ぎる')) return 'warning'
    return 'info'
  }
  
  function checkGuess() {
    const num = parseInt(guess.value)
    if (!num || num < 1 || num > 100) {
      message.value = '1から100までの数字を入力してください'
      return
    }
    
    attempts.value++
    lastGuesses.value.unshift(num)
    if (lastGuesses.value.length > 5) lastGuesses.value.pop()
  
    if (num === secretNumber.value) {
      stopTimer()
      message.value = `🎉 おめでとう! 正解は ${secretNumber.value} です!`
      gameOver.value = true
      nameDialog.value = true
    } else if (num < secretNumber.value) {
      message.value = `❌ ${num}は小さすぎます。もっと大きい数字を試してください。`
      if (attempts.value >= maxAttempts.value * 0.7 && !hintShown.value) {
        message.value += ` (ヒント: 答えは${Math.floor(secretNumber.value/10)*10}台です)`
        hintShown.value = true
      }
      guess.value = null
    } else {
      message.value = `❌ ${num}は大きすぎます。もっと小さい数字を試してください。`
      if (attempts.value >= maxAttempts.value * 0.7 && !hintShown.value) {
        message.value += ` (ヒント: 答えは${Math.floor(secretNumber.value/10)*10}台です)`
        hintShown.value = true
      }
      guess.value = null
    }
    
    // Check if maximum attempts reached
    if (attempts.value >= maxAttempts.value && !gameOver.value) {
      stopTimer()
      message.value = `⚠️ 試行回数の上限に達しました。正解は ${secretNumber.value} でした。`
      gameOver.value = true
    }
  }
  
  function resetGame() {
    secretNumber.value = generateRandomNumber()
    message.value = ''
    guess.value = null
    attempts.value = 0
    gameOver.value = false
    gameStarted.value = false
    lastGuesses.value = []
    hintShown.value = false
  }
  
  function submitName() {
    if (playerName.value) {
      const newEntry = { 
        name: playerName.value, 
        time: elapsedTime.value, 
        attempts: attempts.value,
        isCurrentPlayer: true
      }
      
      // Mark previous entries as not current player
      leaderboard.value.forEach(entry => {
        entry.isCurrentPlayer = false
      })
      
      leaderboard.value.push(newEntry)
      leaderboard.value.sort((a, b) => a.time - b.time)
      
      // Save to localStorage
      saveLeaderboard()
      
      nameDialog.value = false
      playerName.value = ''
    }
  }
  
  function saveLeaderboard() {
    try {
      localStorage.setItem('numberGameLeaderboard', JSON.stringify(leaderboard.value))
    } catch (e) {
      console.error('Could not save to localStorage:', e)
    }
  }
  
  function loadLeaderboard() {
    try {
      const saved = localStorage.getItem('numberGameLeaderboard')
      if (saved) {
        leaderboard.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Could not load from localStorage:', e)
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    loadLeaderboard()
  })
  
  onBeforeUnmount(() => {
    stopTimer()
  })
  </script>
  
  <style scoped>
  
  </style>