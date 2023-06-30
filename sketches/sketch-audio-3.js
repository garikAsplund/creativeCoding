const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;
const colors = [ '48, 213, 200,',
                 '127, 255, 212,',
                  '255, 255, 255,',
                  '255, 0, 0',
                  '255, 255, 0', 
                  '0, 255, 255', 
                  '255, 0, 255',
                ];

const sketch = ({ context, width, height, frame }) => {
  const numCircles = 5;
  const numSlices = 1;
  const slice = Math.PI * 2 / numSlices;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];
  const eqs = [];

  let lineWidth, bin, mapped, phi;

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64);
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.expoIn(t) * 200 + 10;
    lineWidths.push(lineWidth);
  }

  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.5);
  }

  for (let i = 0; i < 7; i++) {
    let ex = random.range(0, width);
    let ey = random.range(0, height);
    let erad = random.range(0, 100);
    let num = random.range(0, 6);

    eqs.push(new EQ(ex, ey, erad, num));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'aqua';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    for (let i = 0; i < numCircles; i++) {
      rotationOffsets[i] += 0.0037;
    }

    eqs.forEach(eq => {
      context.save();

      let cradius = eq.radius;
      
      for (let i = 0; i < eq.number; i++) {


        eq.x < width ? eq.x += random.range(-1, 1) : eq.x = 1;
        eq.y < height ? eq.y += random.range(-1, 1) : eq.y = 1;
        

        context.save();
        context.translate(eq.x, eq.y);
        context.rotate(rotationOffsets[i]);
        context.strokeStyle = `rgba(${eq.color} ${eq.opacity})`;

        cradius += lineWidths[i] * 0.5 + 0.22;

        for (let j = 0; j < numSlices; j++) {
          // context.rotate(slice);
          context.lineWidth = lineWidths[i];

          bin = bins[i * numSlices + j];

          mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

          phi = slice * mapped;

          context.beginPath();
          context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, phi);
          context.stroke();
        }

        cradius += lineWidths[i] * 0.5;

        context.restore();
      }
    });
    context.restore();
  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    }
    else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = "/audio/WEARETHEGOOD - Run Away.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.69;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

class EQ {
  constructor(x, y, radius, number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.number = number;
    this.opacity = random.range(0.7, 1);
    this.color = random.pick(colors);
  }
}

const getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.legth; i++) {
    sum += data[i];
  }

  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();