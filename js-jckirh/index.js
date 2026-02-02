// Import stylesheets
import './style.css';

// Write Javascript code!
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
ctx.lineWidth = .2;
//ctx.globalCompositeOperation = 'destination-over';

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.maxSize = Math.random() * 3 + 3;
    this.size = Math.random() * 1 + .5;
    this.vs = Math.random() * .4 + .01;
    this.angleX = Math.random() * 6.2;
    this.vaX = Math.random() * .6 - .3;
    this.angleY = Math.random() * 6.2;
    this.vaY = Math.random() * .6 - .3;
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
    if(this.lightness < this.maxLightness) this.lightness += .2;
    if (this.size < this.maxSize){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(70, 40%,' + this.lightness + '%)';
      ctx.fill();
      ctx.stroke();
      requestAnimationFrame(this.update.bind(this));
    }else{
      if(this.willFlower){
        const flower = new Flower(this.x, this.y, this.size);
        flower.grow();
      }
    }
  }
}

class Flower {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.vs = Math.random() * .3 + .2;
    this.maxSize = this.size + Math.random() * 50;
    this.image = new Image();
    this.image.src='https://www.frankslaboratory.co.uk/downloads/flowers.png';
    this.imageScale = 1;
    this.frameSize = 100; // sprite size
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
    this.angle = 0;
    this.va = Math.random() * .05 - .025;
  }
  grow(){
    if (this.size < this.maxSize){
      this.size += this.vs;
      this.angle += this.va;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(this.image,this.frameSize* this.frameX, this.frameSize* this.frameY, this.frameSize, this.frameSize, -this.size*.5, -this.size*.5, this.size*this.imageScale, this.size*this.imageScale);
      ctx.restore();

      requestAnimationFrame(this.grow.bind(this));
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