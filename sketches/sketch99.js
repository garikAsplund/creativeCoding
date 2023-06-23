const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const rows = 99;
    const radius = 1;

    for (let i = 0; i < rows; i++) {
      const columns = i + 1;
      const y = ((height - radius) / (rows + 1)) * (i + 1);
      const gap = width / (rows + 1);

      const y2 = (Math.sqrt(3) / 2) * gap * i + gap;

      for (let j = 0; j < columns; j++) {
        const x = gap * j + (width / 2) - (gap * i / 2);

        context.save();

        context.fillStyle = `rgb(
          ${Math.floor(255 - 4 * j)},
          ${Math.floor(255 - 7 * i)},
            122, ${0.9 * (i + 1)}
        )`;

        context.beginPath();
        context.arc(x, y2, radius + (radius / rows ) * i , 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
