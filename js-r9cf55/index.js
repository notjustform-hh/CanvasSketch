const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = Date.now();
let bgColor = 'white';
let points = [];
const drawPoints = true;

const numCols = 66;
const numRows = 66;
const noiseAmp = 82;
const noiseFreq = .002;

const rectColors = [];
const numColors = 16;

let rects = [];

const settings = {
  dimensions: [1080, 1080],
  name: 'CS_020.1-' + seed,
  //animate:true
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  for (let i = 0; i < numColors; i++) {
    rectColors[i] = random.pick(risoColors).hex;
  }

  bgColor = random.pick(rectColors);

  const cols = numCols + 1;
  const rows = numRows + 1;
  const numCells = cols * rows;
  // grid
  const gw = width * 0.8;
  const gh = height * 0.8;
  // cell
  const cw = gw / cols;
  const ch = gh / rows;
  // margin
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  points = [];
  let x, y, n;
  let frequency = noiseFreq;
  let amplitude = noiseAmp;

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;

    points.push(new Point({ x, y }));
  }

  let iD;

  for (let r = 0; r < rows - 1; r++) {
    // draw single cell
    let tmpC = random.pick(rectColors);

    for (let c = 0; c < cols - 1; c++) {
      let curr, next, mx, my;
      let rect = [];

      iD = c + r * numCols;
      //console.log(iD);
      curr = points[0 + r * cols + c];
      rect.push(curr);
      next = points[1 + r * cols + c];

      curr = next;
      rect.push(curr);
      next = points[cols + 1 + r * cols + c];

      curr = next;
      rect.push(curr);
      next = points[cols + r * cols + c];

      curr = next;
      rect.push(curr);
      next = points[0 + r * cols + c];

      rect.push(tmpC);

      rects[iD] = rect;
    }

    console.log(rects.length);
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);
    //context.strokeStyle = 'black';
    //context.fillStyle = 'red';
    context.lineWidth = 8;

    for (let i = 0; i < rects.length; i++) {
      

      let curRect = rects[i];
      context.fillStyle = random.pick(rectColors);
      context.strokeStyle = bgColor;
      context.beginPath();

      context.moveTo(curRect[0].x, curRect[0].y);
      context.lineTo(curRect[1].x, curRect[1].y);
      context.lineTo(curRect[2].x, curRect[2].y);
      context.lineTo(curRect[3].x, curRect[3].y);
      context.lineTo(curRect[0].x, curRect[0].y);

      /*
      if (random.chance((probability = 0.9))) context.stroke();
      if (random.chance((probability = 0.3))) context.fill();
      */

      if (random.chance((probability = 0.6))){
        context.fill();
      } else if (random.chance((probability = 0.6))){
        context.fillStyle = curRect[4];
        context.fill();
        context.stroke();
      }
      //context.stroke();

      


    }

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'blue';

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
