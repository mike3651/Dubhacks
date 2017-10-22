//Iages beig captured
let capture;

//Middle for window width and height
let midW;
let midH;

//Video width and height
let videoWidth;
let videoHeight;

function setup() {

  //Create canvas
  createCanvas(windowWidth,windowHeight);
  videoHeight = 240;
  videoWidth = 320;
  background(51);

  //Create webcam
  capture = createCapture(VIDEO);
  capture.size(340,240);
  capture.hide();

}

function draw() {

  capture.hide();
  midW = windowWidth / 2;
  midH = windowHeight / 2;
  image(capture,midW - videoWidth / 2,midH - videoHeight / 2,340,240);

}

function mousePressed() {
  print("saved image");
  let temp = get(midW - videoWidth / 2,midH - videoHeight / 2,340,240);
  image(temp, 50, 50);
  //temp.save("test", "png");
  return getURL(temp); 
}
