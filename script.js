// ===== STATE =====
const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, Draw: 0 },
};

// ===== WIN COMBINATIONS =====
const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// ===== DOM REFS =====
const cells        = document.querySelectorAll('.cell');
const board        = document.getElementById('board');
const turnSymbol   = document.getElementById('turn-symbol');
const turnText     = document.getElementById('turn-text');
const resultText   = document.getElementById('result-text');
const scoreXNum    = document.getElementById('score-x-num');
const scoreONum    = document.getElementById('score-o-num');
const scoreDrawNum = document.getElementById('score-draw-num');
const scoreXCard   = document.getElementById('score-x');
const scoreOCard   = document.getElementById('score-o');
const resetBtn     = document.getElementById('reset-btn');
const clearScoreBtn= document.getElementById('clear-score-btn');

// ===== INIT =====
function init() {
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', resetGame);
  clearScoreBtn.addEventListener('click', clearScores);
  updateTurnUI();
}

// ===== HANDLE CLICK =====
function handleCellClick(e) {
  const idx = parseInt(e.target.dataset.index);
  if (state.board[idx] || state.gameOver) return;

  // Place mark
  state.board[idx] = state.currentPlayer;
  renderCell(e.target, state.currentPlayer);

  // Check result
  const winner = checkWinner();
  if (winner) {
    handleWin(winner.player, winner.combo);
  } else if (state.board.every(Boolean)) {
    handleDraw();
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnUI();
  }
}

// ===== RENDER CELL =====
function renderCell(cell, player) {
  cell.textContent = player;
  cell.classList.add(player === 'X' ? 'x-cell' : 'o-cell', 'taken');
}

// ===== CHECK WINNER =====
function checkWinner() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (
      state.board[a] &&
      state.board[a] === state.board[b] &&
      state.board[a] === state.board[c]
    ) {
      return { player: state.board[a], combo };
    }
  }
  return null;
}

// ===== HANDLE WIN =====
function handleWin(player, combo) {
  state.gameOver = true;
  state.scores[player]++;
  updateScoreUI();

  // Highlight winning cells
  combo.forEach(idx => cells[idx].classList.add('win-cell'));

  // Show result
  showResult(`Player ${player} Wins! 🎉\u{1F389}`);

  // Dim turn banner
  turnText.textContent = '';
  turnSymbol.textContent = '';
}

// ===== HANDLE DRAW =====
function handleDraw() {
  state.gameOver = true;
  state.scores.Draw++;
  updateScoreUI();
  showResult("It's a Draw!");
  turnText.textContent = '';
  turnSymbol.textContent = '';
}

// ===== SHOW RESULT =====
function showResult(msg) {
  resultText.textContent = msg;
  resultText.classList.add('visible');
}

// ===== UPDATE TURN UI =====
function updateTurnUI() {
  const p = state.currentPlayer;
  turnSymbol.textContent = p;
  turnSymbol.className = `turn-sym ${p === 'X' ? 'x-color' : 'o-color'}`;
  turnText.textContent = `Player ${p}'s Turn`;

  scoreXCard.classList.remove('active-x', 'active-o');
  scoreOCard.classList.remove('active-x', 'active-o');

  if (p === 'X') scoreXCard.classList.add('active-x');
  else scoreOCard.classList.add('active-o');
}

// ===== UPDATE SCORE UI =====
function updateScoreUI() {
  scoreXNum.textContent    = state.scores.X;
  scoreONum.textContent    = state.scores.O;
  scoreDrawNum.textContent = state.scores.Draw;
}

// ===== RESET GAME =====
function resetGame() {
  state.board.fill(null);
  state.currentPlayer = 'X';
  state.gameOver = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  resultText.textContent = '';
  resultText.classList.remove('visible');
  scoreXCard.classList.remove('active-x', 'active-o');
  scoreOCard.classList.remove('active-x', 'active-o');

  updateTurnUI();
}

// ===== CLEAR SCORES =====
function clearScores() {
  state.scores = { X: 0, O: 0, Draw: 0 };
  updateScoreUI();
  resetGame();
}

// ===== START =====
init();