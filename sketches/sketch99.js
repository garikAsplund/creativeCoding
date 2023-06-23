const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  rows: 10,
  radius: 5,
  r: 0.02,
  g: 0.02,
  b: 0.02,
  a: 0.5,
  rate: 2.0,
}

function track(e) {
  console.log("X - ", e.pageX, " Y - ", e.pageY);
}
addEventListener("mousemove", track, false);

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const rows = params.rows;
    const radius = params.radius;
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const margx = (width - gridw) / 2;
    const margy = (height - gridh) / 2;

    for (let i = 0; i < rows; i++) {
      const columns = i + 1;
      const y = ((gridh - radius) / (rows + 1)) * (i + 1);
      const gap = gridw / (rows + 1);

      const y2 = (Math.sqrt(3) / 2) * gap * i + gap;

      for (let j = 0; j < columns; j++) {
        const x = gap * j + (gridw / 2) - (gap * i / 2);

        context.save();
        // const n = random.noise3D(x, y, f * 10, params.freq);


        context.fillStyle = `rgb(
          ${Math.abs(255 - params.r * j / params.rate  - frame * 2) % 256},
          ${Math.abs(255 - params.g * i / params.rate - frame * 3) % 256},
          ${Math.abs(255 - params.b * -j / params.rate - frame * 3) % 256}, 
          ${(params.a * 0.25 * (i + 1)) % frame }
        )`;

        context.translate(margx, margy);
        context.beginPath();
        context.arc(x, y2, radius + (radius / rows ) * i , 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Triangle' });
  folder.addInput(params, 'rows', {min: 1, max: 222, step: 1});
  folder.addInput(params, 'radius', {min: 1, max: 60, step: 1});
  folder.addInput(params, 'r', {min: 0, max: 256, step: 1});
  folder.addInput(params, 'g', {min: 0, max: 256, step: 1});
  folder.addInput(params, 'b', {min: 0, max: 256, step: 1});
  folder.addInput(params, 'a', {min: 0, max: 1, step: 0.01});
  folder.addInput(params, 'rate', {min: 0.1, max: 4, step: 0.1});
}

createPane();
canvasSketch(sketch, settings);
