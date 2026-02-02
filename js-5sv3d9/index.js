const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = Date.now();

const bgColor = random.pick(risoColors).hex;

const rectColors = [];
const numColors = 3;

let cx = 0;
let cy = 0;

for (let i = 0; i < numColors; i++) {
  rectColors.push(random.pick(risoColors).hex);
}

const settings = {
  dimensions: [1080, 1080],
  name: 'CS_017-' + seed,
  animate: true,
};

const particles = [];

const cursor = { x: 9999, y: 9999 };

let elCanvas;

const sketch = ({ width, height, canvas }) => {
  random.setSeed(seed);
  console.log(seed);
  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  let x, y, particle;
  let pos = [];

  for (let i = 0; i < 100; i++) {
    x = width * 0.5;
    y = height * 0.5;

    random.insideCircle(400, pos);
    x += pos[0];
    y += pos[1];

    particle = new Particle({ x, y });

    particles.push(particle);
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'rgba(255,255,255,0)';
    context.fillRect(0, 0, width, height);

    let t = frame/5;
    let radius = Math.sin(t * .05) * 400;
    
    cx = width * .5 + Math.sin(t) * radius;
    cy = height * .5 + Math.cos(t) * radius;

    cursor.x = cx;
    cursor.y = cy;
    context.save();
    context.translate(cx, cy);

    context.fillStyle = "red"; //rectColors[0];

    context.beginPath();
    context.arc(0, 0, 2, 0, Math.PI * 2);
    context.fill();

    context.restore();



    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
};

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, radius = 2 }) {
    // position
    this.x = x;
    this.y = y;
    // acceleration
    this.ax = 0;
    this.ay = 0;
    // velocity
    this.vx = 0;
    this.vy = 0;
    // initial position
    this.ix = x;
    this.iy = y;

    this.radius = radius;
    this.minDist = 200;

    this.pushFactor = 0.01;
    this.pullFactor = 0.005;
    this.dampFactor = 0.95;

    this.fillColor = rectColors[Math.floor(random.range(0, 3))];
  }

  update() {
    let dx, dy, dd, distDelta;
    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // push force
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    //this.ax += 0.001;

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.fillStyle = this.fillColor;

    context.beginPath();
    context.arc(0, 0, this.radius + Math.abs(this.vx * 5), 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
