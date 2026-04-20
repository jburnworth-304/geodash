const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
let player = {
  x: 50,
  y: 200,
  size: 30,
  dy: 0,
  gravity: 0.8,
  jump: -12,
  grounded: false
};

// Obstacles
let obstacles = [];
let frame = 0;
let gameOver = false;

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

// Update
function update() {
  if (gameOver) return;

  frame++;

  // Gravity
  player.dy += player.gravity;
  player.y += player.dy;

  // Ground
  if (player.y + player.size >= canvas.height) {
    player.y = canvas.height - player.size;
    player.dy = 0;
    player.grounded = true;
  }

  // Spawn obstacles
  if (frame % 90 === 0) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 30,
      width: 20,
      height: 30
    });
  }

  // Move obstacles
  obstacles.forEach(o => o.x -= 5);

  // Collision
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.width &&
      player.x + player.size > o.x &&
      player.y < o.y + o.height &&
      player.y + player.size > o.y
    ) {
      gameOver = true;
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(o => o.x > -20);
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Obstacles
  ctx.fillStyle = "red";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });

  // Ground line
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  // Game over text
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over - Press Any Key", 200, 150);
  }
}

// Reset
function resetGame() {
  player.y = 200;
  player.dy = 0;
  obstacles = [];
  frame = 0;
  gameOver = false;
}

gameLoop();
