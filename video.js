const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let width, height, ctx, helper;

navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            width = video.videoWidth;
            height = video.videoHeight;
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            const helperCanvas = document.createElement('canvas');
            helperCanvas.setAttribute('width', width);
            helperCanvas.setAttribute('height', height); 
            helper = helperCanvas.getContext('2d')
            ctx = canvas.getContext('2d');

           loop();
        }
    });

function loop() {
    updateFrame();
    requestAnimationFrame(loop);
}
function updateFrame() {
    helper.drawImage(video, 0, 0, width, height);
    const imageData = helper.getImageData(0, 0, width, height);
    grayScale(imageData);
    dither(imageData);
    ctx.putImageData(imageData, 0, 0);
}

function grayScale(memory) {
    for (let i = 0; i < memory.data.length; i+=4) {
        const [r, g, b] = memory.data.slice(i, i + 3);
        const v = (0.30 * r + 0.59 * g + 0.11 *b) | 0;
        memory.data.set([v, v, v], i);
    }
}

const M = [
    [64, 128],
    [192, 0]
];

const BLACK_COLOR = [0, 0, 0, 255];
const WHITE_COLOR = [255, 255, 255, 255];

function dither(memory) {
    // console.log({width: memory.width})
    for (let i = 0; i < memory.data.length / 4; i++) {
        const x = i % 2;
        const y = ((i / memory.width) | 0) % 2;
        // console.log({i, x, y});
        const grayValue = memory.data[i * 4]
        if (grayValue > M[y][x]) {
            memory.data.set(WHITE_COLOR, i * 4);
        } else {
            memory.data.set(BLACK_COLOR, i * 4);
        }
    }
}
