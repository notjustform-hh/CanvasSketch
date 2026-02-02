const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = Date.now();

const settings = {
  dimensions: [2160, 2160],
  name: 'CS_008-' + seed,
  animate:true
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);
  let x, y, w, h, lW, fill, stroke, blend, speed;
  let angle, rx, ry;

  const num = random.range(10, 50);
  let degrees = 45;

  const rects = [];

  const bgColor = random.pick(risoColors).hex;

  const useMask = true;

  const mask = {
    radius: width * 0.4,
    sides: 6,
    x: width * 0.5,
    y: height * 0.5,
  };

  const rectColors = [];
  const numColors = 8;

  for (let i = 0; i < numColors; i++) {
    rectColors.push(random.pick(risoColors).hex);
  }

  // have randomization once at reload
  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(width * 0.1, width * 1);
    h = random.range(height * 0.05, height * 0.2);

    lW = random.range(h * 0.5) + 2;

    fill = random.pick(rectColors);
    //stroke = `rgba(0, ${random.range(0,255)}, 255, 1)`;
    stroke = random.pick(rectColors);

    //blend = random.value() > 0.5 ? 'overlay' : 'source-over';

    speed = random.range(-0.2, 0.2);

    rects.push({ x, y, w, h, lW, stroke, fill, blend, speed });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    if (useMask) {
      // draw rects
      /*
      rects.forEach((rect) => {
        const { x, y, w, h, lW, stroke, fill } = rect;
        const shadowColor = Color.offsetHSL(fill, 0, 0, -30);
        context.save();

        context.translate(x, y);

        drawSkewedRect({
          context,
          w,
          h,
          degrees: 0,
          lW,
          stroke,
          fill,
          shadowColor,
          blend,
        });

        context.restore();
      });*/

      // Clipping Mask

      context.save();
      context.translate(mask.x, mask.y);

      drawPolygon({
        context,
        x: 0,
        y: 0,
        radius: mask.radius,
        sides: mask.sides,
      });

      context.lineWidth = 20;
      context.strokeStyle = 'black';
      //context.stroke();
      context.fill();

      context.restore();

      context.clip();
    }

    // draw rects

    rects.forEach((rect) => {
      const { x, y, w, h, lW, stroke, fill, speed } = rect;
      const shadowColor = Color.offsetHSL(fill, 0, 0, -30);
      context.save();

      context.translate(x, y);

      drawSkewedRect({
        context,
        w,
        h,
        degrees: ((Math.PI * 2) / 3) * 20,
        lW,
        stroke,
        fill,
        shadowColor,
        blend,
        speed
      });

      context.restore();
    });

    
    context.save();
    context.translate(mask.x, mask.y);
    context.lineWidth = 0;

    drawPolygon({
      context,
      x: 0,
      y: 0,
      radius: mask.radius - context.lineWidth,
      sides: mask.sides,
    });

    context.strokeStyle = rectColors[0];

    context.globalCompositeOperation = 'color-burn';

    context.stroke();

    context.restore();
    
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
  speed = '.1'
}) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.lineWidth = lW;
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  context.globalCompositeOperation = blend;

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

  context.lineWidth = 2;
  context.strokeStyle = 'black';
  context.stroke();

  context.restore();
};

const drawPolygon = ({ context, x = 0, y = 0, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;
  console.log('drawPolygons: ' + sides);
  context.moveTo(0 + x, -radius + y);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius + x, Math.sin(theta) * radius + y);
    console.log('drawPolygon ' + i);
  }

  context.closePath();
};

canvasSketch(sketch, settings);
