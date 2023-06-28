const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ width, height }) => {
  const cols = 99;
  const rows = 99;
  const numCells = rows * cols;

  const gw = width * 0.8;
  const gh = height * 0.8;

  const cw = gw / cols;
  const ch = gh / rows;

  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.002;
  let amplitude = 90;

  const colors = colormap({
    colormap: 'velocity-blue',
    nshades: amplitude,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);

    // x += n;
    // y += n;

    lineWidth = math.mapRange(n, -amplitude, amplitude, 2, 20);
    color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx + cw * 0.5, my + ch * 0.5);

    context.strokeStyle = 'aqua';
    context.lineWidth = 1;

    points.forEach(point => {
      n = random.noise2D(point.ix + frame * 3, point.iy, frequency, amplitude);

      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    let lastx, lasty;

    for (let r = 0; r < rows; r++) {

      for (let c = 0; c < cols - 1; c++) {
        const curr = points[r * cols + c];
        const next = points[r * cols + c + 1];

        const mx = curr.x + (next.x - curr.x) * 0.05 + 22;
        const my = curr.y + (next.y - curr.y) * 0.05 + 22; 
        
        if (!c) [lastx, lasty] = [curr.x, curr.y];

        context.beginPath();
        context.lineWidth = curr.lineWidth * 0.1;
        context.strokeStyle = curr.color;

        context.moveTo(lastx, lasty);

        // else if (c == cols - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        
        context.stroke();

        [lastx, lasty] = [mx, my];
      }

    }

    points.forEach(point => {
      // point.draw(context);
    });

    context.restore();

  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;
  }

  draw(context) {
    context.save();

    context.translate(this.x, this.y);
    context.fillStyle = 'aqua';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
