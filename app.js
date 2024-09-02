import { Analytics } from '@vercel/analytics/react';
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

class Game {

    //Constructor like C++
  constructor() {
    this.gameOver = false; 
    this.snekMoveCounter=0;
    this.snekMovePeriod = 5; 
    this.deltaLoc = { x: 1, y: 0 }; // Initially let's set the direction in right side
    this.snek = new Snake(); //Create snek object
    this.goal = new Goal(); // egg
    this.brd = document.getElementById('gameCanvas').getContext('2d');
    this.init(); //Initialize the game and control
  }

  init() {
    document.addEventListener('keydown', (event) => this.handleKeydown(event));//Any key pressed
    this.update(); //run the logic
  }

  //This is for the Control using Up-Down and Right-Left Key
  handleKeydown(event) {
    switch (event.code) {
      case 'ArrowUp':
        if (this.deltaLoc.y === 0) this.deltaLoc = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.deltaLoc.y === 0) this.deltaLoc = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.deltaLoc.x === 0) this.deltaLoc = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.deltaLoc.x === 0) this.deltaLoc = { x: 1, y: 0 };
        break;

        case 'Space':
            new Game();
            break;
    }
  }

  update() {
    if (!this.gameOver) {
        this.snekMoveCounter++;
      if (this.snekMoveCounter >= this.snekMovePeriod) {
        this.snekMoveCounter = 0;
        const next = this.snek.getNextHeadLocation(this.deltaLoc);

        if (this.brd.isWall(next) || this.snek.isInTileNotEnd(next)) {
          this.gameOver = true;
        } else {
          const eating = next.x === this.goal.getLocation().x && next.y === this.goal.getLocation().y;
          if (eating) {
            this.snek.grow();
            this.goal.respond(this.snek);
          }
         this.snek.moveBy(this.deltaLoc);
        }
      }
      document.getElementById('snakeLength').innerText = `Snake Length: ${this.snek.getLength()}`;

    }
    
    this.composeFrame();
    requestAnimationFrame(() => this.update()); // Keep updating the game, smooth animation
  }

  composeFrame() {
    this.brd.clearRect(0, 0, 400, 400); // Clear the canvas
    this.snek.draw(this.brd);
    this.goal.draw(this.brd);
    
    if (this.gameOver) {
      this.drawGameOver(150, 200); // Draw game over on canvas
    }
    
  }

  drawGameOver(x, y) {
    this.brd.font = '30px Arial';
    this.brd.fillStyle = 'White';
    this.brd.textAlign = 'center';
    this.brd.fillText('Game Over', 200, 200);
  }
}


//New Class Snake

class Snake {
  constructor() {
    this.body = [{ x: 0, y: 0 }]; // Initial position of the Snake sqr
  }

  getNextHeadLocation(deltaLoc) {
    const head = this.body[0];
    return { x: head.x + deltaLoc.x, y: head.y + deltaLoc.y };
  }

  isInTileNotEnd(next) {
    return this.body.some(segment => segment.x === next.x && segment.y === next.y);
  }

  moveBy(deltaLoc) {
    const head = this.body[0];
    this.body.unshift({ x: head.x + deltaLoc.x, y: head.y + deltaLoc.y });
    this.body.pop();
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }
  getLength() {
    return this.body.length;
  }


  draw(ctx) {
    ctx.fillStyle = 'green';
    this.body.forEach(segment => {
      ctx.fillRect(segment.x * 20, segment.y * 20, 19, 19);
    });
  }
}

class Goal {
  constructor() {
    this.location = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  }
  
  getLocation() {
    return this.location;
  }

  respond(snek) {
    this.location = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  }

  draw(ctx) {
    ctx.fillStyle = 'darkred';
    ctx.fillRect(this.location.x * 20, this.location.y * 20, 20, 20);
    
}
}

CanvasRenderingContext2D.prototype.isWall = function (next) {
  return next.x < 0 || next.x >= 20 || next.y < 0 || next.y >= 20;
};



new Game();
