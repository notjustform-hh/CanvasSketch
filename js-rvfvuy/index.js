const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 2048, 2048 ]
};

let rectColors = [];
let numColors = 16;

const sketch = () => {

  for (let i = 0; i < numColors; i++) {
    rectColors[i] = random.pick(risoColors).hex;
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const w = width * .01;
    const h = height * .1;
    const cx = width * .5;
    const cy = height * .5;
    let x,y;

    const numRects = random.range(20, 48);
    const radius = width * .3;

    for(let i = 0; i < numRects; i++){

    	const slice = math.degToRad(360 / numRects);
    	const angle = slice * i;

    	x = cx + radius * Math.sin(angle);
    	y = cy + radius * Math.cos(angle);



    	context.save(); // save context before transformation

	    context.translate(x,y);
	    context.rotate(-angle);
	    context.scale(random.range(.1,2),2);
      context.fillStyle = random.pick(rectColors);


	    context.beginPath();
	    context.rect(- w*.5,random.range(0,- h*.5),w,h);
	    context.fill();

	    context.restore(); // restore context as saved

	    context.save();

	    context.translate(cx, cy);
	    context.rotate(-angle);

      context.strokeStyle = random.pick(rectColors);

	    context.lineWidth = random.range(5,80);

	    context.beginPath();
	    context.arc(0,0,radius*random.range(.2, .8),slice * random.range(0,-3),slice * random.range(0,3));
	    context.stroke();

	    context.restore();
    }

    

  };
};

canvasSketch(sketch, settings);
