//Iages beig captured
let capture;

//Middle for window width and height
let midW;
let midH;

//Video width and height
let videoWidth;
let videoHeight;

function setup() {
  createCanvas(windowWidth,windowHeight);
  videoHeight = 240;
  videoWidth = 320;
  capture = createCapture(VIDEO);
  capture.size(340,240);
  capture.hide();
}

function draw() {
  capture.hide();
  midW = windowWidth / 2;
  midH = windowHeight / 2;
  background(51);
  image(capture,midW - videoWidth / 2,midH - videoHeight / 2,340,240);
}
