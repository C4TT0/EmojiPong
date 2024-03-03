const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn")

let isGameOver = false;

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Pong {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.emoji = "☠️";
    this.velX = 5;
    this.velY = 5;
  }

  draw() {
    ctx.font = "50px Verdana";
    ctx.fillText(this.emoji, this.x, this.y);
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
  }

  checkCollisionWithWall() {
    if (this.x + 50 > width) this.velX = -Math.abs(this.velX);
    if (this.x < 0) this.velX = Math.abs(this.velX);
    if (this.y > height) isGameOver = true;
    if (this.y - 50 < 0) this.velY = Math.abs(this.velY);
  }
}

class Player {
  constructor(x) {
    this.x = x;
    this.y = height - 40;
    this.width = 120;
    this.height = 30;

    window.addEventListener("mousemove", (e) => {
      this.x = e.clientX;
    });

    window.addEventListener("touchmove", (e) => {
      this.x = e.touches[0].clientX
    })
  }

  draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision() {
    if (
      pong.x > this.x &&
      pong.x + 50 < this.x + this.width &&
      pong.y > height - 50 &&
      pong.y < height - 40
    ) {
      pong.velY = -Math.abs(pong.velY);
      score.score++;
    }
  }
}

class Score {
  constructor(score) {
    this.score = score;
  }

  drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${this.score}`, width - 120, 40);
  }
}

class BackgroundProp {
  constructor(x, y, fontSize) {
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
  }

  draw() {
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.fillText(pong.emoji, this.x, this.y);
  }
}

let player = new Player(random(100, width - 100), height - 40);
let pong = new Pong(random(100, width - 100), random(100, height / 2));
let score = new Score(0);

let backgroundPropArr = [];

for (let i = 0; i < 50; i++) {
  const x = random(0, width);
  const y = random(0, height);
  const fontSize = random(16, 128);

  backgroundPropArr.push(new BackgroundProp(x, y, fontSize));
}

const drawBackground = () => {
  ctx.clearRect(0, 0, width, height);
  for (const bgProp of backgroundPropArr) {
    bgProp.draw();
  }
};

const gameLoop = () => {
  drawBackground();

    if(isGameOver){
        document.querySelector(".gameOver").classList.remove("hide");
        return; 
    }

  score.drawScore();

  pong.draw();
  pong.update();
  pong.checkCollisionWithWall();

  player.draw();
  player.checkCollision();

  requestAnimationFrame(gameLoop);
};

playBtn.addEventListener("click", () => {
  let emoji = document.getElementById("emoji").value;
  if (!emoji) emoji = "☠️";

  document.querySelector(".playScreen").classList.add("hide");

  pong.emoji = emoji;
  gameLoop();
});

restartBtn.addEventListener("click", () => {
    isGameOver = false;
    score.score = 0;
    
    pong.x = random(100, width - 100)
    pong.y = random(100, height/2)
    
    player.x = random(player.width, width-player.width)
    
    gameLoop();

    document.querySelector(".gameOver").classList.add("hide");
})