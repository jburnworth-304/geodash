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

  // Collision detection
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      gameOver = true;
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(o => o.x > -20);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw dino
  drawDino(player.x, player.y);

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
    ctx.fillText("Game Over - Press Any Key", 180, 150);
  }
}

// Dino drawing
function drawDino(x, y) {
  ctx.fillStyle = "#00ffcc";

  // Body
  ctx.fillRect(x, y + 10, 30, 20);

  // Head
  ctx.fillRect(x + 20, y, 15, 15);

  // Eye
  ctx.fillStyle = "black";
  ctx.fillRect(x + 30, y + 5, 3, 3);

  ctx.fillStyle = "#00ffcc";

  // Legs (simple animation)
  if (frame % 20 < 10) {
    ctx.fillRect(x + 5, y + 30, 5, 10);
    ctx.fillRect(x + 20, y + 30, 5, 10);
  } else {
    ctx.fillRect(x + 8, y + 30, 5, 10);
    ctx.fillRect(x + 18, y + 30, 5, 10);
  }

  // Tail
  ctx.fillRect(x - 10, y + 15, 10, 5);
}

// Reset game
function resetGame() {
  player.y = 200;
  player.dy = 0;
  obstacles = [];
  frame = 0;
  gameOver = false;
}

// Start game
gameLoop();
