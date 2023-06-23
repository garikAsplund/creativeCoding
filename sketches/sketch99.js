const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const rows = 100;
    const radius = 2;

    for (let i = 0; i < rows; i++) {
      const columns = i + 1;
      const y = ((height - radius) / (rows + 1)) * (i + 1);

      for (let j = 0; j < columns; j++) {
        const gap = width / (rows + 1);
        const x = gap * j + (width / 2) - (gap * i / 2);

        context.save();

        context.fillStyle = 'white';

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
