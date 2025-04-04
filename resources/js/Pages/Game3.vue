<template>
    <v-container fluid class="pb-16 pt-6">
      <v-card class="game-container mx-auto" max-width="600">
        <div class="game-header">
          <h1 class="text-3xl font-weight-bold mb-2 text-primary title">
            <v-icon large color="amber-darken-2" class="mr-2">mdi-lightbulb-on</v-icon>
            単語を当てて！
          </h1>
          <div class="progress-wrapper">
            <div class="score-display">
              <span class="score-label">スコア:</span>
              <span class="score-value">{{ score }}</span>
            </div>
          </div>
        </div>
  
        <v-divider class="my-4"></v-divider>
  
        <v-card-text>
          <v-slide-y-transition>
            <div v-if="!gameOver">
              <div class="question-section">
                <v-icon color="primary" size="28" class="mb-2">mdi-help-circle</v-icon>
                <h2 class="text-xl mb-4 question-text">{{ currentQuestion.question }}</h2>
                
                <v-text-field
                  v-model="guess"
                  label="答えを入力"
                  type="text"
                  class="mx-auto input-field"
                  style="max-width: 300px"
                  variant="outlined"
                  @keyup.enter="checkAnswer"
                  :disabled="gameOver"
                  hide-details
                  :error="hasError"
                  :error-messages="errorMessage"
                  autofocus
                ></v-text-field>
                
                <v-btn 
                  color="primary" 
                  class="mt-6 submit-btn" 
                  size="large"
                  block
                  :disabled="gameOver || !guess" 
                  @click="checkAnswer"
                  rounded="pill"
                  :loading="isChecking"
                >
                  確認する
                </v-btn>
              </div>
  
              <v-expand-transition>
                <div class="hint-section mt-6" v-if="showHint">
                  <v-alert
                    type="info"
                    variant="tonal"
                    border="start"
                    density="comfortable"
                    icon="mdi-lightbulb"
                    class="hint-alert"
                  >
                    <div class="hint-content">
                      <strong>ヒント:</strong> {{ currentQuestion.hint }}
                    </div>
                  </v-alert>
                </div>
              </v-expand-transition>
  
              <div class="game-status mt-6">
                <div class="attempts-wrapper">
                  <div class="attempts-label">残りのチャンス:</div>
                  <div class="attempts-icons">
                    <v-icon 
                      v-for="i in maxAttempts" 
                      :key="i" 
                      :color="i <= remainingAttempts ? 'success' : 'grey-lighten-1'"
                      size="24"
                      class="mx-1"
                    >
                      mdi-heart
                    </v-icon>
                  </div>
                </div>
                
                <v-btn 
                  v-if="!showHint && remainingAttempts < maxAttempts" 
                  color="warning" 
                  variant="text"
                  class="mt-3 hint-btn"
                  @click="showHint = true"
                  prepend-icon="mdi-lightbulb"
                  size="small"
                >
                  ヒントを見る
                </v-btn>
              </div>
            </div>
          </v-slide-y-transition>
  
          <v-slide-y-transition>
            <div v-if="gameOver" class="result-section">
              <v-icon 
                :color="isCorrect ? 'success' : 'error'" 
                size="64" 
                class="mb-4"
              >
                {{ isCorrect ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              
              <h2 class="text-2xl font-weight-bold mb-4" :class="isCorrect ? 'text-success' : 'text-error'">
                {{ isCorrect ? '🎉 正解です！' : '😞 残念！' }}
              </h2>
              
              <p class="text-lg mb-6 answer-reveal">
                正解は「<span class="secret-word">{{ secretWord }}</span>」でした！
              </p>
              
              <v-card class="info-card mb-6">
                <v-card-text>
                  <div class="answer-description mb-4">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    <strong>答えの情報:</strong>
                    <p class="mt-2">{{ currentQuestion.info }}</p>
                  </div>
                  
                  <div class="image-container">
                    <v-img 
                      :src="placeholderImage"
                      :alt="currentQuestion.answer"
                      class="result-img rounded-lg"
                      height="220"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular indeterminate></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </div>
                </v-card-text>
              </v-card>
            
              <div class="action-buttons">
                <v-btn 
                  color="primary" 
                  variant="elevated"
                  class="mb-2"
                  block
                  size="large"
                  @click="resetGame"
                  prepend-icon="mdi-refresh"
                >
                  もう一度プレイ
                </v-btn>
                
                <v-btn 
                  color="secondary"
                  variant="outlined"
                  class="mb-2"
                  block
                  @click="nextQuestion"
                  prepend-icon="mdi-arrow-right"
                >
                  次の問題へ
                </v-btn>
              </div>
            </div>
          </v-slide-y-transition>
        </v-card-text>
      </v-card>
      
      <transition name="fade">
        <v-card v-if="showStats" class="stats-container mx-auto mt-6" max-width="600">
          <v-card-title class="d-flex align-center">
            <v-icon color="info" class="mr-2">mdi-chart-line</v-icon>
            プレイ統計
          </v-card-title>
          
          <v-card-text>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ totalQuestionsAnswered }}</div>
                <div class="stat-label">回答した問題</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-value">{{ correctAnswers }}</div>
                <div class="stat-label">正解した問題</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-value">{{ wrongAnswers }}</div>
                <div class="stat-label">不正解の問題</div>
              </div>
              
              <div class="stat-item">
                <div class="stat-value">{{ successRate }}%</div>
                <div class="stat-label">成功率</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </transition>
    </v-container>
  </template>
  
  <script setup>
import { ref, computed, watch, onMounted } from 'vue'
import questions from '../Resource/questionsGame3.json' // Import the questions from the JSON file
import "../../css/game3.css"

// Game state
const currentQuestionIndex = ref(0)
const guess = ref('')
const maxAttempts = ref(5)
const remainingAttempts = ref(maxAttempts.value)
const gameOver = ref(false)
const isCorrect = ref(false)
const showHint = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const isChecking = ref(false)
const score = ref(0)
const showStats = ref(true)
const correctAnswers = ref(0)
const wrongAnswers = ref(0)
const totalQuestionsAnswered = ref(0)

// Computed properties
const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value]
})

const secretWord = computed(() => {
  return currentQuestion.value.answer
})

const successRate = computed(() => {
  if (totalQuestionsAnswered.value === 0) return 0
  return Math.round((correctAnswers.value / totalQuestionsAnswered.value) * 100)
})

// Use API placeholder instead of actual images
const placeholderImage = computed(() => {
  // Generate a placeholder image based on the answer
  const width = 400
  const height = 300
  return `/api/placeholder/${width}/${height}`
})

// Functions
function randomIndex() {
  return Math.floor(Math.random() * questions.length)
}

function checkAnswer() {
  if (!guess.value || gameOver.value) return
  
  isChecking.value = true
  hasError.value = false
  errorMessage.value = ''
  
  // Simulate checking (can be replaced with actual validation)
  setTimeout(() => {
    if (guess.value === secretWord.value) {
      gameOver.value = true
      isCorrect.value = true
      score.value += remainingAttempts.value * 10
      correctAnswers.value++
      totalQuestionsAnswered.value++
    } else {
      remainingAttempts.value -= 1
      hasError.value = true
      errorMessage.value = '違います、もう一度試してください'
      
      if (remainingAttempts.value <= 0) {
        gameOver.value = true
        isCorrect.value = false
        wrongAnswers.value++
        totalQuestionsAnswered.value++
      }
    }
    
    isChecking.value = false
  }, 500)
}

function resetGame() {
  // Choose a completely new question
  let newIndex
  do {
    newIndex = randomIndex()
  } while (newIndex === currentQuestionIndex.value)
  
  currentQuestionIndex.value = newIndex
  guess.value = ''
  remainingAttempts.value = maxAttempts.value
  gameOver.value = false
  isCorrect.value = false
  showHint.value = false
  hasError.value = false
  errorMessage.value = ''
}

function nextQuestion() {
  // Move to the next question in sequence
  currentQuestionIndex.value = (currentQuestionIndex.value + 1) % questions.length
  guess.value = ''
  remainingAttempts.value = maxAttempts.value
  gameOver.value = false
  isCorrect.value = false
  showHint.value = false
  hasError.value = false
  errorMessage.value = ''
}

// Watch for input changes to clear errors
watch(guess, () => {
  if (hasError.value) {
    hasError.value = false
    errorMessage.value = ''
  }
})

// Load saved statistics on mount
onMounted(() => {
  try {
    const savedStats = localStorage.getItem('wordGameStats')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      score.value = stats.score || 0
      correctAnswers.value = stats.correct || 0
      wrongAnswers.value = stats.wrong || 0
      totalQuestionsAnswered.value = stats.total || 0
    }
  } catch (e) {
    console.error('Could not load stats from localStorage:', e)
  }
  
  // Initialize with a random question
  currentQuestionIndex.value = randomIndex()
})

// Save statistics when they change
watch([score, correctAnswers, wrongAnswers, totalQuestionsAnswered], () => {
  try {
    localStorage.setItem('wordGameStats', JSON.stringify({
      score: score.value,
      correct: correctAnswers.value,
      wrong: wrongAnswers.value,
      total: totalQuestionsAnswered.value
    }))
  } catch (e) {
    console.error('Could not save stats to localStorage:', e)
  }
})
</script>

  
  <style scoped>
  
  </style>