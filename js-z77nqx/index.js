const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

// test seed phrase 'ooWrzJ1X8z8gDdWEzdi23ef9gHZLYVguTwRforLZxKKSZbZfEqZ';
const seed = fxhash; 

const rectColors = [];
const numColors = 8;

const margin = 0;

let cx = 0;
let cy = 0;
let count = 0;

let centerX;
let centerY;

let particle;

let paintRad;
let maxPaintRad = 300;
let minPaintRad = 40;
let numParticles = 100;
let maxParticles = 300;
let minParticles = 40;

let isDrawing = true;

const settings = {
  dimensions: [1920, 1920],
  name: 'CS_017.2-' + seed,
  animate: true,
};

let particles = [];

const origin = { x: 9999, y: 9999 };

let elCanvas;
let points;
let pos = [];

let bunchRange ;
let blossomPos = [];
let numFlowers ;
let blossomCount = -1;

let bgColor;

const sketch = ({ width, height, canvas }) => {
  random.setSeed(seed);
  console.log(seed);
  elCanvas = canvas;

  numFlowers = random.range(10, 50);

  initBunch(width, height);

  initFlower(width, height, numParticles, maxPaintRad);

  return ({ context, width, height, frame }) => {
    if (isDrawing) {
      if (count == 0) context.fillStyle = bgColor;
      else context.fillStyle = 'rgba(255,255,255,0)';
      context.fillRect(0, 0, width, height);

      //let blend = random.value() > 0.3 ? 'overlay' : 'source-over';
      //context.globalCompositeOperation = blend;

      let t = count / random.range(5, 10);
      let radius = 20 + Math.sin(t * 0.1) * 400;

      if (radius < maxPaintRad - 20) {
        cx = centerX + Math.sin(t) * radius;
        cy = centerY + Math.cos(t) * radius;

        origin.x = cx;
        origin.y = cy;
      } else {
        // reset after each flower
        origin.x = centerX;
        origin.y = centerY;

        if (blossomCount < numFlowers - 1) initFlower(width, height);
        else stopDrawing();
      }

      if (count == 2) drawCurve(context);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(context);
      });

      count++;
    }
  };
};


const initBunch = (width, height) => {
  console.log(fxhash);

  bunchRange = width/3;

  bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < numFlowers; i++) {
    let tmpPos = [];
    random.insideCircle(bunchRange, tmpPos);
    blossomPos.push(tmpPos);
  }

  console.log(blossomPos);
};

// new flower

const initFlower = (width, height) => {
  count = 0;
  blossomCount++;

  centerX = width / 2 + blossomPos[blossomCount][0];
  centerY = height / 2 + blossomPos[blossomCount][1];

  paintRad = random.range(minPaintRad, maxPaintRad);
  numParticles = random.range(paintRad / 4, paintRad);

  let cpX;
  let btX = width / 2 + random.range(-100, 100);

  if (centerX > btX) cpX = centerX + random.range(-200, -50);
  else cpX = centerX + random.range(50, 200);

  points = [
    new Point({ x: centerX, y: centerY }),
    new Point({
      x: cpX,
      y: centerY + random.range(10, 200),
    }),
    new Point({ x: btX + count / 100, y: height - margin }),
  ];

  for (let i = 0; i < numColors; i++) {
    rectColors[i] = random.pick(risoColors).hex;
  }

  for (let i = 0; i < numParticles; i++) {
    x = centerX;
    y = centerY;

    random.insideCircle(paintRad, pos);
    x += pos[0];
    y += pos[1];

    particle = new Particle({ x, y });

    particles[i] = particle;
  }
};

const drawCurve = (context) => {
  context.beginPath();

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    const mx = curr.x + (next.x - curr.x) * 0.5;
    const my = curr.y + (next.y - curr.y) * 0.5;

    if (i == 0) context.moveTo(curr.x, curr.y);
    else if (i == points.length - 2)
      context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
    else context.quadraticCurveTo(curr.x, curr.y, mx, my);
  }

  context.lineWidth = 2;
  context.strokeStyle = rectColors[1];
  context.stroke();
};

const stopDrawing = () => {
  isDrawing = false;
  console.log('srawing finished');
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
    this.minDist = 90;

    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.005, 0.01);
    this.dampFactor = random.range(0.91, 0.97);

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
    dx = this.x - origin.x;
    dy = this.y - origin.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

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

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red' : 'black';

    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);

    return dd < 20; // hit area
  }
}
