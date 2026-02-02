const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
	cols:10,
	rows:10,
	scaleMin:1,
	scaleMax:60,
	speed: 24,
	freq: .001,
	amp: .2,
	cap: 'square',
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    const speed = params.speed;

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * .8;
    const gridh = height * .8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * .5;
    const margy = (height - gridh) * .5;


    for(i = 0; i< numCells; i++){
    	const col = i % cols;
    	const row = Math.floor(i / cols);

    	const x = col * cellw;
    	const y = row * cellh;
    	const w = cellw * .8;
    	const h = cellh * .8;

    	//const n = random.noise2D(x + frame*speed, y, params.freq); // random -1 to 1
    	const n = random.noise3D(x, y, frame * speed, params.freq);

    	const angle = n*Math.PI * params.amp;
    	const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

    	//console.log(x + ':' + y);

    	context.save();
    	context.translate(x,y);
    	context.translate(margx, margy) // add margins
    	context.translate(cellw * .5, cellh * .5);
    	context.rotate(angle);

    	context.lineWidth = scale;
    	context.lineCap = params.cap;

    	context.beginPath();
    	context.moveTo(w * -.5, 0);
    	context.lineTo(w * .5, 0);
    	context.stroke();

    	context.restore();

    }

  };
};

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;

	folder = pane.addFolder({title:'Grid'});
	folder.addInput(params, 'cap', {options: {but: 'but', round: 'round', square: 'square'}});
	folder.addInput(params, 'cols',{min:2,max:50});
	folder.addInput(params, 'rows',{min:2,max:50});
	folder.addInput(params, 'scaleMin',{min:1,max:30});
	folder.addInput(params, 'scaleMax',{min:1,max:60});
	folder.addInput(params, 'speed',{min:6, max:48});

	folder = pane.addFolder({title:'Noise'});
	folder.addInput(params, 'freq',{min: -.01, max: .01});
	folder.addInput(params, 'amp',{min: 0, max: 1});

}

createPane();

canvasSketch(sketch, settings);
