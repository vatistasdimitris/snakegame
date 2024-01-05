// Game variables
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 40;
const gridSize = 40;
let snake = [{ x: 5, y: 5 }];
let food = getRandomFoodPosition();
let direction = "down";
let score = 0;
let gameRunning = true;
let gameInterval;

// Set canvas size
function setCanvasSize() {
  canvas.width = Math.floor((window.innerWidth - 20) / gridSize) * gridSize;
  canvas.height = Math.floor((window.innerHeight - 20) / gridSize) * gridSize;
}

// Draw grid on the canvas
function drawGrid() {
  ctx.beginPath();
  ctx.strokeStyle = "#ddd";

  for (let i = 0; i <= canvas.width; i += gridSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }

  for (let i = 0; i <= canvas.height; i += gridSize) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }

  ctx.stroke();
  ctx.closePath();
}

// Draw rounded rectangle
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  ctx.fillStyle = "#008000";
  snake.forEach(segment => {
    drawRoundedRect(segment.x * gridSize, segment.y * gridSize, boxSize, boxSize, 5);
  });

  ctx.fillStyle = "#FF0000";
  drawRoundedRect(food.x * gridSize, food.y * gridSize, boxSize, boxSize, 5);

  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 50);
}

// Move the snake
function move() {
  if (!gameRunning) return;

  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = getRandomFoodPosition();
    score++;
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= canvas.width / gridSize ||
    head.y < 0 || head.y >= canvas.height / gridSize ||
    collisionWithSelf()
  ) {
    showMenu();
    gameRunning = false;
    clearInterval(gameInterval);
    return;
  }

  draw();
}

// Check collision with self
function collisionWithSelf() {
  return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

// Reset the game
function resetGame() {
  snake = [{ x: 5, y: 5 }];
  food = getRandomFoodPosition();
  direction = "down";
  score = 0;
  gameRunning = true;
  hideMenu();
  clearInterval(gameInterval);
  gameInterval = setInterval(move, 80);
}

// Get random food position within borders
function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

// Show menu
function showMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
}

// Hide menu
function hideMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
}

// Pause the game
function pauseGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  document.getElementById("pauseBtn").innerText = "⏯️";
}

// Resume the game
function resumeGame() {
  gameRunning = true;
  gameInterval = setInterval(move, 80);
  document.getElementById("pauseBtn").innerText = "⏸️";
}

// Event listeners
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    direction = deltaX > 0 ? "right" : "left";
  } else {
    direction = deltaY > 0 ? "down" : "up";
  }

  touchStartX = 0;
  touchStartY = 0;
}

// Set initial canvas size and listen for resize
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// Start the game loop
gameInterval = setInterval(move, 80);
// Function to submit the score and player's name
function submitScore() {
  const playerNameInput = document.getElementById("playerNameInput");
  const playerName = playerNameInput.value.trim();

  if (playerName !== "") {
    const data = {
      playerName: playerName,
      score: score
    };

    fetch('submitScore.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Score submitted successfully!', result);
        // Perform any desired action after successful submission
      })
      .catch(error => console.error('Error:', error));
  }
}

// Event listener for the submit score button
const submitScoreBtn = document.getElementById("submitScoreBtn");
submitScoreBtn.addEventListener("click", submitScore);

// Event listener for the pause button
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  if (gameRunning) {
    pauseGame();
  } else {
    resumeGame();
  }
});
