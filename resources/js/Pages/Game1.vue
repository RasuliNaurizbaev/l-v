<template>
    <v-container fluid class="game-container">
      <v-card class="mx-auto main-card" :class="{ 'dark-theme': isDark }">
        <v-card-title class="text-center text-h4 font-weight-bold">
          2048
        </v-card-title>
        <v-card-subtitle class="text-center pb-0">
          Join the tiles, get to 2048!
        </v-card-subtitle>
  
        <v-card-text>
          <div class="d-flex justify-space-between align-center mb-4">
            <v-card class="score-card pa-2" width="100" elevation="2">
              <div class="text-center text-caption">Score</div>
              <div class="text-center text-h6 font-weight-bold">{{ score }}</div>
            </v-card>
            
            <v-btn color="primary" @click="newGame">
              New Game
            </v-btn>
            
            <v-card class="score-card pa-2" width="100" elevation="2">
              <div class="text-center text-caption">Best</div>
              <div class="text-center text-h6 font-weight-bold">{{ bestScore }}</div>
            </v-card>
          </div>
  
          <div ref="board" class="game-board" tabindex="0" @keydown="handleKeyDown">
            <div class="game-grid">
              <template v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`">
                <template v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`">
                  <div class="grid-cell"></div>
                </template>
              </template>
            </div>
            
            <transition-group name="tile" tag="div" class="tile-container">
              <div 
                v-for="tile in tiles" 
                :key="`tile-${tile.id}`"
                class="tile"
                :class="[
                  `tile-value-${tile.value}`, 
                  { 'tile-merged': tile.merged }, 
                  { 'tile-new': tile.isNew }
                ]"
                :style="getTileStyle(tile)"
              >
                {{ tile.value }}
              </div>
            </transition-group>
          </div>
          
          <div v-if="gameOver" class="game-over">
            <div class="game-over-message">
              <div class="text-h5 font-weight-bold mb-2">Game Over!</div>
              <v-btn color="primary" @click="newGame">Try Again</v-btn>
            </div>
          </div>
          
          <div v-if="gameWon && !gameOver" class="game-won">
            <div class="game-won-message">
              <div class="text-h5 font-weight-bold mb-2">You Win!</div>
              <v-btn color="success" @click="continueGame">Continue</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted, inject, nextTick } from 'vue';
  
  // Theme
  const { isDark } = inject('theme');
  
  // Game state
  const GRID_SIZE = 6;
  const TILE_SIZE = 60;
  const GAP_SIZE = 10;
  const WIN_VALUE = 2048;
  
  const grid = reactive(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)));
  const tiles = ref([]);
  const score = ref(0);
  const bestScore = ref(0);
  const gameOver = ref(false);
  const gameWon = ref(false);
  const tileIdCounter = ref(0);
  const board = ref(null);
  
  // Initialize game
  onMounted(() => {
    loadBestScore();
    setupKeyboardListeners();
    nextTick(() => {
      board.value.focus();
      newGame();
    });
  });
  
  // Setup keyboard event listeners
  const setupKeyboardListeners = () => {
    window.addEventListener('keydown', handleKeyDown);
  };
  
  // Load best score from local storage
  const loadBestScore = () => {
    const savedBestScore = localStorage.getItem('2048-best-score');
    if (savedBestScore) {
      bestScore.value = parseInt(savedBestScore);
    }
  };
  
  // Save best score to local storage
  const saveBestScore = () => {
    localStorage.setItem('2048-best-score', bestScore.value.toString());
  };
  
  // Create a new game
  const newGame = () => {
    // Clear the grid
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        grid[i][j] = 0;
      }
    }
  
    // Reset game state
    tiles.value = [];
    score.value = 0;
    gameOver.value = false;
    gameWon.value = false;
    tileIdCounter.value = 0;
  
    // Add initial tiles
    addRandomTile();
    addRandomTile();
  
    // Focus the board
    nextTick(() => {
      board.value?.focus();
    });
  };
  
  // Continue game after winning
  const continueGame = () => {
    gameWon.value = false;
  };
  
  // Handle keyboard inputs
  const handleKeyDown = (event) => {
    if (gameOver.value) return;
    
    let moved = false;
    
    switch (event.key) {
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
      default:
        return;
    }
  
    if (moved) {
      // Prevent default to avoid scrolling
      event.preventDefault();
      
      // Update best score if needed
      if (score.value > bestScore.value) {
        bestScore.value = score.value;
        saveBestScore();
      }
      
      // Add a new tile
      addRandomTile();
      
      // Check for game over
      if (isGameOver()) {
        gameOver.value = true;
      }
    }
  };
  
  // Generate a new tile
  const addRandomTile = () => {
    const emptyCells = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      
      grid[randomCell.row][randomCell.col] = value;
      
      // Add new tile to the tiles array
      tiles.value.push({
        id: tileIdCounter.value++,
        row: randomCell.row,
        col: randomCell.col,
        value: value,
        merged: false,
        isNew: true
      });
      
      // Reset isNew flag after animation
      setTimeout(() => {
        tiles.value = tiles.value.map(tile => {
          if (tile.row === randomCell.row && tile.col === randomCell.col && tile.isNew) {
            return { ...tile, isNew: false };
          }
          return tile;
        });
      }, 300);
    }
  };
  
  // Fixed move functions - left movement
  const moveLeft = () => {
    let moved = false;
    let newTiles = [];
    
    // Process each row
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowTiles = [];
      const mergedPositions = new Set();
      
      // First, collect all non-zero tiles in the row
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] !== 0) {
          rowTiles.push({
            value: grid[row][col],
            originalCol: col
          });
        }
      }
      
      // Then process them from left to right
      let newCol = 0;
      
      for (let i = 0; i < rowTiles.length; i++) {
        const current = rowTiles[i];
        let merged = false;
        
        // Try to merge with previous tile
        if (i > 0 && rowTiles[i-1].value === current.value && !mergedPositions.has(newCol-1)) {
          // Merge with the previous tile
          const mergedValue = current.value * 2;
          grid[row][newCol-1] = mergedValue;
          score.value += mergedValue;
          
          // Mark as merged
          mergedPositions.add(newCol-1);
          merged = true;
          
          // Add to new tiles array
          const tileToUpdate = newTiles.find(t => t.row === row && t.col === newCol-1);
          if (tileToUpdate) {
            tileToUpdate.value = mergedValue;
            tileToUpdate.merged = true;
            
            if (mergedValue === WIN_VALUE) {
              gameWon.value = true;
            }
          }
          
          // Clear the original position
          grid[row][current.originalCol] = 0;
          moved = true;
          
        } else {
          // Move tile to new position
          if (newCol !== current.originalCol) {
            moved = true;
          }
          
          grid[row][newCol] = current.value;
          
          // Clear the original position if it has moved
          if (newCol !== current.originalCol) {
            grid[row][current.originalCol] = 0;
          }
          
          // Add to new tiles array
          newTiles.push({
            id: tileIdCounter.value++,
            row: row,
            col: newCol,
            value: current.value,
            merged: false,
            previousPosition: { row, col: current.originalCol }
          });
          
          newCol++;
        }
      }
      
      // Fill remaining positions with zeros
      for (let col = newCol; col < GRID_SIZE; col++) {
        grid[row][col] = 0;
      }
    }
    
    if (moved) {
      tiles.value = newTiles;
      
      // Reset merged flag after animation
      setTimeout(() => {
        tiles.value = tiles.value.map(tile => ({ ...tile, merged: false }));
      }, 300);
    }
    
    return moved;
  };
  
  // Fixed move functions - right movement
  const moveRight = () => {
    let moved = false;
    let newTiles = [];
    
    // Process each row
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowTiles = [];
      const mergedPositions = new Set();
      
      // First, collect all non-zero tiles in the row
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] !== 0) {
          rowTiles.push({
            value: grid[row][col],
            originalCol: col
          });
        }
      }
      
      // Then process them from right to left
      let newCol = GRID_SIZE - 1;
      
      for (let i = rowTiles.length - 1; i >= 0; i--) {
        const current = rowTiles[i];
        let merged = false;
        
        // Try to merge with previous tile
        if (i < rowTiles.length - 1 && rowTiles[i+1].value === current.value && !mergedPositions.has(newCol+1)) {
          // Merge with the previous tile
          const mergedValue = current.value * 2;
          grid[row][newCol+1] = mergedValue;
          score.value += mergedValue;
          
          // Mark as merged
          mergedPositions.add(newCol+1);
          merged = true;
          
          // Add to new tiles array
          const tileToUpdate = newTiles.find(t => t.row === row && t.col === newCol+1);
          if (tileToUpdate) {
            tileToUpdate.value = mergedValue;
            tileToUpdate.merged = true;
            
            if (mergedValue === WIN_VALUE) {
              gameWon.value = true;
            }
          }
          
          // Clear the original position
          grid[row][current.originalCol] = 0;
          moved = true;
          
        } else {
          // Move tile to new position
          if (newCol !== current.originalCol) {
            moved = true;
          }
          
          grid[row][newCol] = current.value;
          
          // Clear the original position if it has moved
          if (newCol !== current.originalCol) {
            grid[row][current.originalCol] = 0;
          }
          
          // Add to new tiles array
          newTiles.push({
            id: tileIdCounter.value++,
            row: row,
            col: newCol,
            value: current.value,
            merged: false,
            previousPosition: { row, col: current.originalCol }
          });
          
          newCol--;
        }
      }
      
      // Fill remaining positions with zeros
      for (let col = 0; col < newCol + 1; col++) {
        grid[row][col] = 0;
      }
    }
    
    if (moved) {
      tiles.value = newTiles;
      
      // Reset merged flag after animation
      setTimeout(() => {
        tiles.value = tiles.value.map(tile => ({ ...tile, merged: false }));
      }, 300);
    }
    
    return moved;
  };
  
  // Fixed move functions - up movement
  const moveUp = () => {
    let moved = false;
    let newTiles = [];
    
    // Process each column
    for (let col = 0; col < GRID_SIZE; col++) {
      const colTiles = [];
      const mergedPositions = new Set();
      
      // First, collect all non-zero tiles in the column
      for (let row = 0; row < GRID_SIZE; row++) {
        if (grid[row][col] !== 0) {
          colTiles.push({
            value: grid[row][col],
            originalRow: row
          });
        }
      }
      
      // Then process them from top to bottom
      let newRow = 0;
      
      for (let i = 0; i < colTiles.length; i++) {
        const current = colTiles[i];
        let merged = false;
        
        // Try to merge with previous tile
        if (i > 0 && colTiles[i-1].value === current.value && !mergedPositions.has(newRow-1)) {
          // Merge with the previous tile
          const mergedValue = current.value * 2;
          grid[newRow-1][col] = mergedValue;
          score.value += mergedValue;
          
          // Mark as merged
          mergedPositions.add(newRow-1);
          merged = true;
          
          // Add to new tiles array
          const tileToUpdate = newTiles.find(t => t.row === newRow-1 && t.col === col);
          if (tileToUpdate) {
            tileToUpdate.value = mergedValue;
            tileToUpdate.merged = true;
            
            if (mergedValue === WIN_VALUE) {
              gameWon.value = true;
            }
          }
          
          // Clear the original position
          grid[current.originalRow][col] = 0;
          moved = true;
          
        } else {
          // Move tile to new position
          if (newRow !== current.originalRow) {
            moved = true;
          }
          
          grid[newRow][col] = current.value;
          
          // Clear the original position if it has moved
          if (newRow !== current.originalRow) {
            grid[current.originalRow][col] = 0;
          }
          
          // Add to new tiles array
          newTiles.push({
            id: tileIdCounter.value++,
            row: newRow,
            col: col,
            value: current.value,
            merged: false,
            previousPosition: { row: current.originalRow, col }
          });
          
          newRow++;
        }
      }
      
      // Fill remaining positions with zeros
      for (let row = newRow; row < GRID_SIZE; row++) {
        grid[row][col] = 0;
      }
    }
    
    if (moved) {
      tiles.value = newTiles;
      
      // Reset merged flag after animation
      setTimeout(() => {
        tiles.value = tiles.value.map(tile => ({ ...tile, merged: false }));
      }, 300);
    }
    
    return moved;
  };
  
  // Fixed move functions - down movement
  const moveDown = () => {
    let moved = false;
    let newTiles = [];
    
    // Process each column
    for (let col = 0; col < GRID_SIZE; col++) {
      const colTiles = [];
      const mergedPositions = new Set();
      
      // First, collect all non-zero tiles in the column
      for (let row = 0; row < GRID_SIZE; row++) {
        if (grid[row][col] !== 0) {
          colTiles.push({
            value: grid[row][col],
            originalRow: row
          });
        }
      }
      
      // Then process them from bottom to top
      let newRow = GRID_SIZE - 1;
      
      for (let i = colTiles.length - 1; i >= 0; i--) {
        const current = colTiles[i];
        let merged = false;
        
        // Try to merge with previous tile
        if (i < colTiles.length - 1 && colTiles[i+1].value === current.value && !mergedPositions.has(newRow+1)) {
          // Merge with the previous tile
          const mergedValue = current.value * 2;
          grid[newRow+1][col] = mergedValue;
          score.value += mergedValue;
          
          // Mark as merged
          mergedPositions.add(newRow+1);
          merged = true;
          
          // Add to new tiles array
          const tileToUpdate = newTiles.find(t => t.row === newRow+1 && t.col === col);
          if (tileToUpdate) {
            tileToUpdate.value = mergedValue;
            tileToUpdate.merged = true;
            
            if (mergedValue === WIN_VALUE) {
              gameWon.value = true;
            }
          }
          
          // Clear the original position
          grid[current.originalRow][col] = 0;
          moved = true;
          
        } else {
          // Move tile to new position
          if (newRow !== current.originalRow) {
            moved = true;
          }
          
          grid[newRow][col] = current.value;
          
          // Clear the original position if it has moved
          if (newRow !== current.originalRow) {
            grid[current.originalRow][col] = 0;
          }
          
          // Add to new tiles array
          newTiles.push({
            id: tileIdCounter.value++,
            row: newRow,
            col: col,
            value: current.value,
            merged: false,
            previousPosition: { row: current.originalRow, col }
          });
          
          newRow--;
        }
      }
      
      // Fill remaining positions with zeros
      for (let row = 0; row < newRow + 1; row++) {
        grid[row][col] = 0;
      }
    }
    
    if (moved) {
      tiles.value = newTiles;
      
      // Reset merged flag after animation
      setTimeout(() => {
        tiles.value = tiles.value.map(tile => ({ ...tile, merged: false }));
      }, 300);
    }
    
    return moved;
  };
  
  // Fixed game over check
  const isGameOver = () => {
    // Check if there are any empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0) {
          return false;
        }
      }
    }
    
    // Check if there are any possible merges horizontally
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (grid[row][col] === grid[row][col + 1]) {
          return false;
        }
      }
    }
    
    // Check if there are any possible merges vertically
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 1; row++) {
        if (grid[row][col] === grid[row + 1][col]) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Calculate tile position for CSS transform
  const getTileStyle = (tile) => {
    const x = tile.col * (TILE_SIZE + GAP_SIZE) + GAP_SIZE;
    const y = tile.row * (TILE_SIZE + GAP_SIZE) + GAP_SIZE;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      width: `${TILE_SIZE}px`,
      height: `${TILE_SIZE}px`,
      lineHeight: `${TILE_SIZE}px`,
      fontSize: tile.value > 512 ? '20px' : tile.value > 64 ? '24px' : '28px'
    };
  };
  </script>
  
  <style scoped>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .main-card {
    max-width: 500px;
    padding: 20px;
    background-color: #faf8ef;
    transition: background-color 0.3s;
  }
  
  .main-card.dark-theme {
    background-color: #1e1e1e;
    color: #f9f6f2;
  }
  
  .score-card {
    background-color: #bbada0;
    color: white;
    border-radius: 4px;
  }
  
  .game-board {
    position: relative;
    width: calc(6 * (60px + 10px) + 10px);
    height: calc(6 * (60px + 10px) + 10px);
    background-color: #bbada0;
    border-radius: 6px;
    margin: 0 auto;
    outline: none;
  }
  
  .game-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .grid-cell {
    background-color: rgba(238, 228, 218, 0.35);
    border-radius: 4px;
  }
  
  .tile-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .tile {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 4px;
    background-color: #eee4da;
    color: #776e65;
    transition: transform 0.15s, opacity 0.15s;
  }
  
  .tile-value-2 {
    background-color: #eee4da;
    color: #776e65;
  }
  
  .tile-value-4 {
    background-color: #ede0c8;
    color: #776e65;
  }
  
  .tile-value-8 {
    background-color: #f2b179;
    color: #f9f6f2;
  }
  
  .tile-value-16 {
    background-color: #f59563;
    color: #f9f6f2;
  }
  
  .tile-value-32 {
    background-color: #f67c5f;
    color: #f9f6f2;
  }
  
  .tile-value-64 {
    background-color: #f65e3b;
    color: #f9f6f2;
  }
  
  .tile-value-128 {
    background-color: #edcf72;
    color: #f9f6f2;
  }
  
  .tile-value-256 {
    background-color: #edcc61;
    color: #f9f6f2;
  }
  
  .tile-value-512 {
    background-color: #edc850;
    color: #f9f6f2;
  }
  
  .tile-value-1024 {
    background-color: #edc53f;
    color: #f9f6f2;
  }
  
  .tile-value-2048 {
    background-color: #edc22e;
    color: #f9f6f2;
  }
  
  .tile-value-4096 {
    background-color: #3e3933;
    color: #f9f6f2;
  }
  
  .tile-merged {
    animation: pop 0.2s;
    z-index: 1;
  }
  
  .tile-new {
    animation: appear 0.2s;
  }
  
  .game-over, .game-won {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(238, 228, 218, 0.73);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    border-radius: 6px;
  }
  
  .dark-theme .game-over, .dark-theme .game-won {
    background-color: rgba(33, 33, 33, 0.73);
  }
  
  .game-over-message, .game-won-message {
    text-align: center;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
  }
  
  .dark-theme .game-over-message, .dark-theme .game-won-message {
    background-color: rgba(33, 33, 33, 0.8);
  }
  
  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* Transition for tile movement */
  .tile-move {
    transition: transform 0.15s;
  }
  </style>