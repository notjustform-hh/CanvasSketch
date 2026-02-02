const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = Date.now();

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

const settings = {
  dimensions: [1920, 1920],
  name: 'CS_017.2-' + seed,
  animate: true,
};

let particles = [];

const cursor = { x: 9999, y: 9999 };

let elCanvas;
let points;
let pos = [];

const sketch = ({ width, height, canvas }) => {
  //random.setSeed(seed);
  console.log(seed);
  elCanvas = canvas;

  let bgColor = 'rgba(255, 250, 235, 1)';//random.pick(risoColors).hex;

  canvas.addEventListener('mousedown', onMouseDown);
  initValues(width, height, numParticles, maxPaintRad);

  return ({ context, width, height, frame }) => {
    if (count == 0) context.fillStyle = bgColor;
    else context.fillStyle = 'rgba(255,255,255,0)';
    context.fillRect(0, 0, width, height);

    //let blend = random.value() > 0.3 ? 'overlay' : 'source-over';
    //context.globalCompositeOperation = blend;

    let t = count / 5;
    let radius = 20 + Math.sin(t * 0.1) * 400;

    if (radius < maxPaintRad - 20) {
      cx = centerX + Math.sin(t) * radius;
      cy = centerY + Math.cos(t) * radius;

      cursor.x = cx;
      cursor.y = cy;
    } else {
      cursor.x = centerX;
      cursor.y = centerY;

      initValues(width, height);
    }

    if (count == 2) drawCurve(context);

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });

    count++;
  };
};

// INIT

const initValues = (width, height) => {
  count = 0;
  centerX = width / 2 + random.range(-width / 3, width / 3);
  centerY = random.range(height / 1.6, height / 4);

  paintRad = random.range(minPaintRad, maxPaintRad);
  numParticles = random.range(paintRad / 4, paintRad);

  let cpX;
  let btX = width/2 + random.range(-50,50);

  if(centerX > btX) cpX = centerX + random.range(-200,-10);
  else cpX = centerX + random.range(10,200);

  points = [
    new Point({ x: centerX, y: centerY }),
    new Point({
      x: cpX,
      y: centerY + random.range(10, 200),
    }),
    new Point({ x: width/2 + random.range(-100,100), y: height - margin }),
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

  console.log('init ');
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

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  // calculate scaled canvas position
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  let hit = false;

  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y);
    if (!hit && point.isDragging) hit = true;
  });

  if (!hit) points.push(new Point({ x, y }));
};

const onMouseMove = (e) => {
  // calculate scaled canvas position
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  console.log(x, y);

  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
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
