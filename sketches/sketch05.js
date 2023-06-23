const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let text = 'G';
let fontSize = 1200;
let fontFamily = 'arial black';
let manager;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    // context.font = fontSize + 'px ' + fontFamily;
    context.font = `${fontSize}px  ${fontFamily}`;
    context.textBaseline = 'top';
    // context.textAlign = 'center';

    const metrics = context.measureText(text);
    console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    const x = (width - mw) * 0.5 - mx;
    const y = (height -mh) * 0.5 - my

    context.save();
    context.translate(x, y);

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();
    // context.translate(width * 0.5, height * 0.5);
    context.fillText(text, 0, 0);
    context.restore();``
  };
};

const onKeyUp = (e) => {
  console.log(e);
  text = e.key.toUpperCase();
  manager.render();
}

document.addEventListener('keyup', onKeyUp)

const start = async () => {
  manager = await canvasSketch(sketch, settings);
}

start();
// canvasSketch(sketch, settings);

// const url = 'https://picsum.photos/id/237/200/300';

// const loadMeSomeImage = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = () => reject();
//     img.src = url;
//   });
// }

// // const start = () => {
// //   loadMeSomeImage(url).then(img => {
// //     console.log('image width: ', img.width);
// //   });
// //   console.log('this line');
// // }

// const start = async () => {
//   const img = await loadMeSomeImage(url).then(img => {
//     console.log('image width: ', img.width);
//   });
//   console.log('this line');
// }

// start();
