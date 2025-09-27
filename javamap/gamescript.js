// Snake Game Implementation
class SnakeGame {
   constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.scoreElement = document.getElementById('score');
      this.highScoreElement = document.getElementById('highScore');
      this.statusElement = document.getElementById('gameStatus');

      this.gridSize = 20;
      this.tileCount = this.canvas.width / this.gridSize;

      this.snake = [{ x: 10, y: 10 }];
      this.food = {};
      this.dx = 0;
      this.dy = 0;
      this.score = 0;
      this.highScore = localStorage.getItem('snakeHighScore') || 0;
      this.gameRunning = false;
      this.gameLoop = null;

      this.highScoreElement.textContent = this.highScore;
      this.generateFood();
      this.draw();
      this.setupControls();
   }

   generateFood() {
      this.food = {
         x: Math.floor(Math.random() * this.tileCount),
         y: Math.floor(Math.random() * this.tileCount)
      };

      // Make sure food doesn't spawn on snake
      for (let segment of this.snake) {
         if (segment.x === this.food.x && segment.y === this.food.y) {
            this.generateFood();
            break;
         }
      }
   }

   draw() {
      // Clear canvas
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw grid
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;
      for (let i = 0; i <= this.tileCount; i++) {
         this.ctx.beginPath();
         this.ctx.moveTo(i * this.gridSize, 0);
         this.ctx.lineTo(i * this.gridSize, this.canvas.height);
         this.ctx.stroke();

         this.ctx.beginPath();
         this.ctx.moveTo(0, i * this.gridSize);
         this.ctx.lineTo(this.canvas.width, i * this.gridSize);
         this.ctx.stroke();
      }

      // Draw snake
      this.ctx.fillStyle = '#ff6b6b';
      for (let segment of this.snake) {
         this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2,
            this.gridSize - 4, this.gridSize - 4);
      }

      // Draw snake head differently
      if (this.snake.length > 0) {
         this.ctx.fillStyle = '#ee5a24';
         const head = this.snake[0];
         this.ctx.fillRect(head.x * this.gridSize + 1, head.y * this.gridSize + 1,
            this.gridSize - 2, this.gridSize - 2);
      }

      // Draw food
      this.ctx.fillStyle = '#2ed573';
      this.ctx.beginPath();
      this.ctx.arc(
         this.food.x * this.gridSize + this.gridSize / 2,
         this.food.y * this.gridSize + this.gridSize / 2,
         this.gridSize / 2 - 2,
         0,
         2 * Math.PI
      );
      this.ctx.fill();
   }

   update() {
      if (!this.gameRunning) return;

      const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

      // Check wall collision
      if (head.x < 0 || head.x >= this.tileCount ||
         head.y < 0 || head.y >= this.tileCount) {
         this.gameOver();
         return;
      }

      // Check self collision
      for (let segment of this.snake) {
         if (head.x === segment.x && head.y === segment.y) {
            this.gameOver();
            return;
         }
      }

      this.snake.unshift(head);

      // Check food collision
      if (head.x === this.food.x && head.y === this.food.y) {
         this.score += 10;
         this.scoreElement.textContent = this.score;
         this.generateFood();

         if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
         }
      } else {
         this.snake.pop();
      }

      this.draw();
   }

   gameOver() {
      this.gameRunning = false;
      clearInterval(this.gameLoop);
      this.statusElement.textContent = `Game Over! Final Score: ${this.score}`;
      this.statusElement.style.color = '#ff6b6b';
   }

   start() {
      if (this.gameRunning) return;

      this.gameRunning = true;
      this.statusElement.textContent = 'Game Running - Use arrow keys!';
      this.statusElement.style.color = '#2ed573';

      this.gameLoop = setInterval(() => {
         this.update();
      }, 150);
   }

   pause() {
      if (this.gameRunning) {
         this.gameRunning = false;
         clearInterval(this.gameLoop);
         this.statusElement.textContent = 'Game Paused - Press Start to continue';
         this.statusElement.style.color = '#f39c12';
      }
   }

   reset() {
      this.gameRunning = false;
      clearInterval(this.gameLoop);
      this.snake = [{ x: 10, y: 10 }];
      this.dx = 0;
      this.dy = 0;
      this.score = 0;
      this.scoreElement.textContent = this.score;
      this.generateFood();
      this.draw();
      this.statusElement.textContent = 'Press START to play!';
      this.statusElement.style.color = '#ffffff';
   }

   changeDirection(newDx, newDy) {
      // Prevent reverse direction
      if (this.dx === -newDx && this.dy === -newDy) return;

      this.dx = newDx;
      this.dy = newDy;
   }

   setupControls() {
      // Keyboard controls
      document.addEventListener('keydown', (e) => {
         if (!this.gameRunning) return;

         switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
               this.changeDirection(0, -1);
               break;
            case 'ArrowDown':
            case 's':
            case 'S':
               this.changeDirection(0, 1);
               break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
               this.changeDirection(-1, 0);
               break;
            case 'ArrowRight':
            case 'd':
            case 'D':
               this.changeDirection(1, 0);
               break;
         }
      });

      // Button controls
      document.getElementById('startBtn').addEventListener('click', () => this.start());
      document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
      document.getElementById('resetBtn').addEventListener('click', () => this.reset());
   }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function () {
   new SnakeGame();
});
