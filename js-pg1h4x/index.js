// Import stylesheets
import './style.css';

// Write Javascript code!
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
ctx.lineWidth = .7;
ctx.fillStyle = '#FFF5DD';
ctx.strokeStyle = '#1c1136';
//ctx.globalCompositeOperation = 'destination-over';

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.maxSize = Math.random() * 10 + 10;
    this.size = Math.random() * 1 + .5;
    this.vs = Math.random() * .4 + .5;
    this.angleX = Math.random() * 6.2;
    this.vaX = Math.random() * .6 - .3;
    this.angleY = Math.random() * 6.2;
    this.vaY = Math.random() * .6 - .3;
    this.angle = 0;
    this.va = Math.random() * 0.02 + 0.05;
    this.lightness = 40;
    this.maxLightness = 90;
    this.maxSize > 5 ? this.willFlower = true : this.willFlower = false;
  }
  update(){
    this.x += this.speedX + Math.sin(this.angleX);
    this.y += this.speedY + Math.sin(this.angleY * 1);
    this.size += this.vs;
    this.angleX += this.vaX;
    this.angleY += this.vaY;
    this.angle += this.va;
    if(this.lightness < this.maxLightness) this.lightness += .2;
    if (this.size < this.maxSize){
      //DRAW CONTEXT HERE
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      ctx.fillRect(0, 0, this.size, this.size);
      
      ctx.strokeRect(0, 0, this.size, this.size);
      ctx.restore();

      requestAnimationFrame(this.update.bind(this));
    }
  }
}


window.addEventListener('mousemove', function(e){
  if(drawing){
    for(let i = 0; i < 3; i++){
      const root = new Root(e.x, e.y);
      root.update();
    }
  }
});

window.addEventListener('mousedown', function(e){
  drawing = true;
  for(let i = 0; i < 333; i++){
    const root = new Root(e.x, e.y);
    root.update();
  }
})

window.addEventListener('mouseup', function(){
  drawing = false;
})