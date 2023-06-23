const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.font = '1200px serif';
    context.textBaseline = 'top';
    // context.textAlign = 'center';

    const text = 'A';
    const metrics = context.measureText(text);
    console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    context.save();

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();
    // context.translate(width * 0.5, height * 0.5);
    context.fillText('A', 0, 0);
    context.restore();``
  };
};

canvasSketch(sketch, settings);
