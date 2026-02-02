const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = Date.now();

const settings = {
  dimensions: [2160, 2160],
  name: 'CS_007.1-' + seed,
  //animate:true
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, lW, fill, stroke, blend;
  let angle, rx, ry;

  const num = 50;
  const degrees = 135;

  const rects = [];

  const bgColor = random.pick(risoColors).hex;

  const rectColors = [];
  const numColors = 12;

  for (let i = 0; i < numColors; i++) {
    rectColors.push(random.pick(risoColors).hex);
  }

  // have randomization once at reload
  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(width * 0.01, width * 0.2);
    h = random.range(height * 0.005, height * 0.05);

    lW = random.range(h * 0.5) + 2;

    fill = random.pick(rectColors);
    //stroke = `rgba(0, ${random.range(0,255)}, 255, 1)`;
    stroke = random.pick(rectColors);

    //blend = random.value() > 0.5 ? 'overlay' : 'source-over';

    rects.push({ x, y, w, h, lW, stroke, fill, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, lW, stroke, fill } = rect;
      const shadowColor = Color.offsetHSL(fill, 0, 0, -30);
      context.save();

      context.translate(x, y);

      drawSkewedRect({
        context,
        w,
        h,
        degrees,
        lW,
        stroke,
        fill,
        shadowColor,
        blend,
      });

      context.restore();
    });
  };
};

const drawSkewedRect = ({
  context,
  w = 600,
  h = 200,
  degrees = -45,
  lW = 5,
  stroke = 'black',
  fill = 'white',
  shadowColor = 'black',
  blend = 'source-overlay',
}) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.lineWidth = lW;
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  //context.globalCompositeOperation = blend;

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  context.shadowColor = Color.style(shadowColor.rgba);
  context.shadowOffsetX = -10;
  context.shadowOffsetY = -10;

  context.fill();
  context.shadowColor = null;

  context.stroke();

  context.lineWidth = random.range(.1,10);
  context.strokeStyle = Color.style(shadowColor.rgba);
  context.stroke();

  context.restore();
};

canvasSketch(sketch, settings);
