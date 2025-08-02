const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const dieWidth = 50;
const dieHeight = 50;
let color0 = "#ff3333";
let color1 = "#bb3333";
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
let rollSpeed = 60;
let rollResult = 0;

let betCho = false;
let betHan = false;

let showCho = false;
let showHan = false;

let payUp = false;
let bankRoll = 95;

let errorMessage = false;
let gameOver = false;

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
    ctx.fillStyle = "color1";
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
  rX = 80;
  rY = (canvas.height / 2);
  if (rollResult >= 10) {
    if (rollResult === 12) { rollResult = "C" }
    else if (rollResult === 11) { rollResult = "B" }
    else if (rollResult === 10) { rollResult = "A" }
  }
  if (!isRoll && rollResult != 0) {
    ctx.font = "54px Monospace";
    ctx.fillStyle = color0;
    ctx.fillText(`0x0${rollResult}`, rX, rY + 32);

    if (rollResult % 2 === 0 || rollResult === "A" || rollResult === "C") {
      ctx.font = "72px Monospace";
      ctx.fillStyle = color0;
      ctx.fillText("CHŌ", rX, rY + 110);
      showCho = true;
      showHan = false;
    } else {
      ctx.font = "72px Monospace";
      ctx.fillStyle = color0;
      ctx.fillText("HAN", rX, rY + 110);
      showHan = true;
      showCho = false;
    }
  }
}

function resolveBet() {
  if (payUp) {
    if ((showCho && betCho) || (showHan && betHan)) {
      payUp = false;
      bankRoll += 53;
      console.log('win');
    } else if ((showCho && betHan) || (showHan && betCho)) {
      payUp = false;
      console.log('loss');
    }
  }
}

function drawBankRoll() {
  let bankHex = bankRoll.toString(16);
  ctx.font = "46px Monospace";
  ctx.fillStyle = color0;
  ctx.fillText(`¥${bankHex.padStart(4, '0').toUpperCase()}`, die0X, 120);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawDiceFrames();

  drawTitle();

  animateRoll();

  drawDie0Pips();
  drawDie1Pips();

  drawResult();

  resolveBet();

  drawBankRoll();

  if (errorMessage) {
    ctx.font = "18px Monospace";
    ctx.fillStyle = color1;
    ctx.fillText("Please make a bet:", 20, canvas.height - 20);
  }
  if (gameOver) {
    color0 = "#a55e5eff";
    color1 = "#a55e5eff";
    ctx.font = "42px Monospace";
    ctx.fillStyle = "#ff3333";
    ctx.fillText("GAME OVER", (canvas.width / 2) - 110, canvas.height / 2 + 22);
  }

  requestAnimationFrame(draw);
}

// Device Input
// (now buttons)
//----------------------
const choButton = document.getElementById('choButton');
const hanButton = document.getElementById('hanButton');
const rollButton = document.getElementById('rollButton');

choButton.addEventListener('click', function() {
  if (!betCho) {
    choButton.classList.add('betSelected');
    hanButton.classList.remove('betSelected');
    errorMessage = false;
    betHan = false;
    betCho = true;
    //payUp = true;
  }
});

hanButton.addEventListener('click', function() {
  if (!betHan) {
    hanButton.classList.add('betSelected');
    choButton.classList.remove('betSelected');
    errorMessage = false;
    betCho = false;
    betHan = true;
    //payUp = true;
  }
});

rollButton.addEventListener('click', function() {
  if (!isRoll) {
    if ((bankRoll > 0)) {
      if (betCho != betHan) {
        bankRoll -= 27;
        isRoll = true;
        rollDelay = 0;
        roller = 1;
        isShow = false;

        showCho = false;
        showHan = false;
        payUp = true;
      } else {
        errorMessage = true;
      }
    } else {
      gameOver = true;
    }
  }
});

draw();
