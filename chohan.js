const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const dieWidth = 50;
const dieHeight = 50;
const color0 = "#ff3333";
const color1 = "#bb3333";
const die0X = (canvas.width / 2) + 50;
const die1X = die0X + 75;
const dieY = canvas.height - 100;
const pipRadius = 3;

const pipMaps = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [3, 1], [1, 3], [3, 3]],
  5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]],
  6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]]
};

let fac0 = 0;
let fac1 = 0;
let isRoll = false;
let isShow = false;
let roller = 0;
let rollDelay = 0;
let rollSpeed = 30;
let rollResult = 0;

function drawDiceFrames() {
  const diePositions = [die0X, die1X];

  diePositions.forEach((x) => {
    ctx.beginPath();
    ctx.roundRect(x, dieY, dieWidth, dieHeight, 5);
    ctx.strokeStyle = color0;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  });
}

function drawDie0Pips() {
  if (fac0 != 0) {
    pipMaps[fac0].forEach(([col, row]) => {
      const x = die0X + (col * dieWidth / 4);
      const y = dieY + (row * dieHeight / 4);
      ctx.beginPath();
      ctx.arc(x, y, pipRadius, 0, Math.PI * 2);
      ctx.fillStyle = color1;
      ctx.fill();
      ctx.closePath();
    });
  } else {
    ctx.font = "32px arial";
    ctx.fillStyle = color1;
    ctx.fillText("?", die0X + (dieWidth / 2) - 8, dieY + (dieHeight / 2) + 10)
  }
}

function drawDie1Pips() {
  if (fac1 != 0) {
    pipMaps[fac1].forEach(([col, row]) => {
      const x = die1X + (col * dieWidth / 4);
      const y = dieY + (row * dieHeight / 4);
      ctx.beginPath();
      ctx.arc(x, y, pipRadius, 0, Math.PI * 2);
      ctx.fillStyle = color1;
      ctx.fill();
      ctx.closePath();
    });
  } else {
    ctx.font = "32px arial";
    ctx.fillStyle = color1;
    ctx.fillText("?", die1X + (dieWidth / 2) - 8, dieY + (dieHeight / 2) + 10)
  }
}

function drawTitle() {
  ctx.font = "32px Monospace";
  ctx.fillStyle = color0;
  ctx.fillText("Chō-Han", 30, 40);
  ctx.font = "16px Monospace";
  ctx.fillStyle = color1;
  ctx.fillText("The Amazing Dice Game", 30, 60);
}

function animateRoll() {
  if (isRoll) {
    rollDelay++;
    if (rollDelay >= rollSpeed) {
      rollDelay = 0;
      roller++;
    }
    if (roller > 6) {

      isRoll = false;
      isShow = true;
    }
    fac0 = roller;
    fac1 = roller;
  }
  if (isShow) {
    isShow = false;
    fac0 = Math.floor(Math.random() * 6) + 1;
    fac1 = Math.floor(Math.random() * 6) + 1;
  }
  
}

function drawResult() {
  rollResult = fac0 + fac1;

  if (rollResult >= 10) {
    if (rollResult === 12) { rollResult = "C" }
    else if (rollResult === 11) { rollResult = "B" }
    else if (rollResult === 10) { rollResult = "A" }
  }
  if (!isRoll && rollResult != 0) {
    ctx.font = "72px Monospace";
    ctx.fillStyle = color0;
    ctx.fillText(`#0${rollResult}`, 80, canvas.height / 2);

    if (rollResult % 2 === 0 || rollResult === "A" || rollResult === "C") {
      ctx.font = "72px Monospace";
      ctx.fillStyle = color0;
      ctx.fillText("CHŌ", 80, (canvas.height / 2) + 110);
    } else {
      ctx.font = "72px Monospace";
      ctx.fillStyle = color0;
      ctx.fillText("HAN", 80, (canvas.height / 2) + 110);
    }
  }
}

/*
function resizeCanvas() {
  // if (website.width <= 600px) {
  canvas.width = 320;
  canvas.height = 240;
  // }
}
*/

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //resizeCanvas();

  drawDiceFrames();

  drawTitle();

  animateRoll();

  drawDie0Pips();
  drawDie1Pips();

  drawResult();

  requestAnimationFrame(draw);
}

// Device Input
// (it is now a button)
//----------------------
const rollButton = document.getElementById('rollButton');
rollButton.addEventListener('click', function() {
  isRoll = true;
  rollDelay = 0;
  roller = 1;
  isShow = false;
});

draw();