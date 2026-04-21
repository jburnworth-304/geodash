const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player (dino)
let player = {
  x: 50,
  y: 200,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.8,
  jump: -12,
  grounded: false
};

// Game state
let obstacles = [];
let frame = 0;
let gameOver = false;

// Random spawn timer
let nextSpawn = randomRange(60, 140);

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
  }

  if (gameOver) resetGame();
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update logic
function update() {
  if (gameOver) return;

  frame++;

  // Gravity
  player.dy += player.gravity;
  player.y += player.dy;

  // Ground
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Spawn asteroids at random intervals
  if (frame >= nextSpawn) {
    spawnAsteroid();
    nextSpawn = frame + randomRange(60, 140); // new random delay
  }

  // Move obstacles
  obstacles.forEach(o => o.x -= 5);

  // Collision detection
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.size &&
      player.x + player.width > o.x &&
      player.y < o.y + o.size &&
      player.y + player.height > o.y
    ) {
      gameOver = true;
    }
  });

  // Remove off-screen
  obstacles = obstacles.filter(o => o.x > -50);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars background (simple)
  drawStars();

  // Dino
  drawDino(player.x, player.y);

  // Asteroids
  obstacles.forEach(o => {
    drawAsteroid(o.x, o.y, o.size);
  });

  // Ground
  ctx.strokeStyle = "#666";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  // Game over
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over - Press Any Key", 170, 150);
  }
}

// Dino drawing
function drawDino(x, y) {
  ctx.fillStyle = "#00ffcc";

  ctx.fillRect(x, y + 10, 30, 20); // body
  ctx.fillRect(x + 20, y, 15, 15);  // head

  ctx.fillStyle = "black";
  ctx.fillRect(x + 30, y + 5, 3, 3); // eye

  ctx.fillStyle = "#00ffcc";

  if (frame % 20 < 10) {
    ctx.fillRect(x + 5, y + 30, 5, 10);
    ctx.fillRect(x + 20, y + 30, 5, 10);
  } else {
    ctx.fillRect(x + 8, y + 30, 5, 10);
    ctx.fillRect(x + 18, y + 30, 5, 10);
  }

  ctx.fillRect(x - 10, y + 15, 10, 5); // tail
}

// Asteroid drawing
function drawAsteroid(x, y, size) {
  ctx.fillStyle = "#888";

  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // craters
  ctx.fillStyle = "#666";

  ctx.beginPath();
  ctx.arc(x + size / 3, y + size / 3, size / 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size / 1.5, y + size / 2, size / 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 1.5, size / 8, 0, Math.PI * 2);
  ctx.fill();
}

// Stars background
function drawStars() {
  ctx.fillStyle = "white";
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }
}

// Spawn asteroid
function spawnAsteroid() {
  let size = 20 + Math.random() * 30;

  obstacles.push({
    x: canvas.width,
    y: canvas.height - size,
    size: size
  });
}

// Reset game
function resetGame() {
  player.y = 200;
  player.dy = 0;
  obstacles = [];
  frame = 0;
  gameOver = false;
  nextSpawn = randomRange(60, 140);
}

// Utility
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Start
gameLoop();
