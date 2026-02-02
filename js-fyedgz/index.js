// Import stylesheets
import './style.css';

// Write Javascript code!
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.maxSize = Math.random() * 5 + 5;
    this.size = Math.random() * 1 + 2;
    this.vs = Math.random() * .2 + .05;
    this.angleX = Math.random() * 6.2;
    this.vaX = Math.random() * .6 - .3;
    this.angleY = Math.random() * 6.2;
    this.vaY = Math.random() * .6 - .3;
  }
  update(){
    this.x += this.speedX + Math.sin(this.angleX);
    this.y += this.speedY + Math.sin(this.angleY * 1);
    this.size += this.vs;
    this.angleX += this.vaX;
    this.angleY += this.vaY;

    if (this.size < this.maxSize){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(40, 100%, 50%)';
      ctx.fill();
      ctx.stroke();
      requestAnimationFrame(this.update.bind(this));
    }
  }
}

window.addEventListener('mousemove', function(e){
  const root = new Root(e.x, e.y);
  root.update();
});