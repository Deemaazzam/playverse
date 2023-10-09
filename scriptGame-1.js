const gboard = document.querySelector("#board");
const ctx = gboard.getContext("2d");
const resetB = document.querySelector("#reset");
const time = document.querySelector("#Time");
const info = document.querySelector("#info");

const pad1U = document.querySelector("#padd1-up");
const pad1D = document.querySelector("#padd1-down");
const pad2U = document.querySelector("#padd2-up");
const pad2D = document.querySelector("#padd2-down");

const GW = gboard.width;
const GH = gboard.height;
const back = "black";
const paddC = "red";
const paddB = "black";
const ballC = "white";
const ballBC = "black"; //border Color
const ballR = 12.5; //raduis
const paddS = 30;

let intervalID;
let ballS = 1.5;
let ballX = GW / 2;
let ballY = GH / 2;
let ballXD = 0;
let ballYD = 0;
let score1 = 0;
let score2 = 0;
let d1;
let d2;

let start = 0;
let elapsed = 0;
let current = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;
let test = 0;
let test2 = true;
let padd1 = {
  width: 20,
  height: 80,
  x: -10,
  y: 0,
};
let padd2 = {
  width: 20,
  height: 80,
  x: GW - 10,
  y: GH - 80,
};

window.addEventListener("keydown", changeD);
resetB.addEventListener("click", resetG);
info.addEventListener("click", INFO);
pad1U.addEventListener("click" , function() {
  d1=1;
  checkd(d1);
});
pad1D.addEventListener("click" , function() {
  d1=-1;
  checkd(d1);
});
pad2U.addEventListener("click" , function() {
  d2=2;
  checkd(d2);
});
pad2D.addEventListener("click" , function() {
  d2=-2;
  checkd(d2);
});

gamestart();
drawPadd();

function checkd(num){
  switch (num) {
    case 1:
      if (padd1.y > 0) {
        padd1.y -= paddS;
      }
      break;
    case -1:
      if (padd1.y < GH - padd1.height) {
        padd1.y += paddS;
      }
      break;
    case 2:
      if (padd2.y > 0) {
        padd2.y -= paddS;
      }
      break;
    case -2:
      if (padd2.y < GH - padd2.height) {
        padd2.y += paddS;
      }
      break;
  }
}

function gamestart() {
  createBall();
  startTime();
  nextTick();
}
function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPadd();
    moveBall();
    DrawBall(ballX, ballY);
    checkColl();
    nextTick();
  }, 10);
}
function clearBoard() {
  ctx.fillStyle = back;
  ctx.fillRect(0, 0, 500, 500);
}
function drawPadd() {
    ctx.lineWidth = 5.5;    //vertical line
    ctx.strokeStyle = "rgb(218,180,40)";
    ctx.beginPath();
    ctx.moveTo(GW/2,0);
    ctx.lineTo(GW/2,60);
    ctx.moveTo(GW/2,80);
    ctx.lineTo(GW/2,140);
    ctx.moveTo(GW/2,160);
    ctx.lineTo(GW/2,210);

    ctx.moveTo(GW/2,290);
    ctx.lineTo(GW/2,350);
    ctx.moveTo(GW/2,370);
    ctx.lineTo(GW/2,430);
    ctx.moveTo(GW/2,450);
    ctx.lineTo(GW/2,500);
    ctx.stroke();


    ctx.lineWidth = 5.5;     //horizontal line
    ctx.strokeStyle = "rgb(218,180,40)";
    ctx.beginPath();
    ctx.moveTo(0,GH/2);
    ctx.lineTo(60,GH/2);
    ctx.moveTo(80,GH/2);
    ctx.lineTo(140,GH/2);
    ctx.moveTo(160,GH/2);
    ctx.lineTo(210,GH/2);

    ctx.moveTo(290,GH/2);
    ctx.lineTo(350,GH/2);
    ctx.moveTo(370,GH/2);
    ctx.lineTo(430,GH/2);
    ctx.moveTo(450,GH/2);
    ctx.lineTo(500,GH/2);
    ctx.stroke();


  ctx.beginPath();
  ctx.arc(250, ballY, ballR, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ballX, GH/2, ballR, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.arc(GW/2,GH/2 , 40, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(GW/2,GH/2 , 2, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = "paddB";

  ctx.font = "50px MV BOLI";
  ctx.fillStyle = "beige";
  ctx.textAlign = "center";
  ctx.fillText("Player1",122,3*GH/4);

  ctx.font = "50px MV BOLI";
  ctx.fillStyle = "beige";
  ctx.textAlign = "center";
  ctx.fillText("Player2",377,3*GH/4);

  ctx.fillStyle = "rgb(0, 44, 44)";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  
  ctx.fillRect(padd1.x, padd1.y, padd1.width, padd1.height);
  ctx.strokeRect(padd1.x, padd1.y, padd1.width, padd1.height);
  ctx.stroke();

  ctx.fillStyle = "rgb(12, 85, 134)";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.fillRect(padd2.x, padd2.y, padd2.width, padd2.height);
  ctx.strokeRect(padd2.x, padd2.y, padd2.width, padd2.height);
  
  ctx.font = "50px MV BOLI";
  ctx.fillStyle = "beige";
  ctx.textAlign = "center";
  ctx.fillText(score1,200,50);
  
  ctx.font = "50px MV BOLI";
  ctx.fillStyle = "beige";
  ctx.textAlign = "center";
  ctx.fillText(score2,300,50);

  ctx.shadowColor = "rgb(218,180,40)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = "";
}
function createBall() {
  ballS = 1.5;

  if (Math.round(Math.random()) == 1) {
    ballXD = 1;
  } else {
    ballXD = -1;
  }

  if (Math.round(Math.random()) == 1) {
    ballYD = 1;
  } else {
    ballYD = -1;
  }
  ballX = GW / 2;
  ballY = GH / 2;

  DrawBall(ballX, ballY);
}

function moveBall() {
  ballX += ballS * ballXD;
  ballY += ballS * ballYD;
}

function DrawBall(ballX, ballY) {
  ctx.fillStyle = ballC;

  ctx.strokeStyle = ballBC;

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI, true);

  ctx.stroke();

  ctx.fill();
}

function checkColl() {
  if (ballY <= 0 + ballR || ballY >= GH - ballR) {
    ballYD *= -1;
  }
  if (ballX <= 0) {
    score2++;
    createBall();
    return;
  }
  if (ballX >= GW) {
    score1++;
    createBall();
    return;
  }

  if (ballX <= padd1.x + padd1.width + ballR) {
    if (ballY > padd1.y && ballY < padd1.y + padd1.height) {
      ballX = padd1.x + padd1.width + ballR;
      ballXD *= -1;
      ballS += .5;
    }
  }

  if (ballX >= padd2.x - ballR) {
    if (ballY > padd2.y && ballY < padd2.y + padd2.height) {
      ballX = padd2.x - ballR;
      ballXD *= -1;
      ballS += .5;
    }
  }
}

function changeD(event) {
  const keypressed = event.keyCode;
  const padd1Up = 87;
  const padd1Down = 83;
  const padd2Up = 38;
  const padd2Down = 40;
  switch (keypressed) {
    case padd1Up:
      if (padd1.y > 0) {
        padd1.y -= paddS;
      }
      break;
    case padd1Down:
      if (padd1.y < GH - padd1.height) {
        padd1.y += paddS;
      }
      break;
    case padd2Up:
      if (padd2.y > 0) {
        padd2.y -= paddS;
      }
      break;
    case padd2Down:
      if (padd2.y < GH - padd2.height) {
        padd2.y += paddS;
      }
      break;
  }
}

function resetG() {
  test2=true;
  info.textContent = "Info";
  score1 = 0;
  score2 = 0;
  padd1 = {
    width: 20,
    height: 60,
    x: -10,
    y: 0,
    bor : 10
  };
  padd2 = {
    width: 20,
    height: 60,
    x: GW - 10,
    y: GH - 60,
    bor : 10
  };
  ballX = 0;
  ballY = 0;
  ballS = 1.5;
  ballXD = 0;
  ballYD = 0;
  resetT();
  clearInterval(intervalID);
  gamestart();
}

function startTime(){

  if (!test) {
    if (paused) {
      paused = false;
      test++;
      start = Date.now() - elapsed; //Date.now() gives the current time in milli seconds
      intervalId = setInterval(updatet, 1000);
    }
  }
};

function resetT(){
  paused = true;
  clearInterval(intervalId);
  settime = 0;
  elapsed = 0;
  current = 0;
  hrs = 0;
  mins = 0;
  secs = 0;
  test = 0;
  time.textContent = "00:00:00";
};

function updatet() {
  elapsed = Date.now() - start;
  secs = Math.floor((elapsed / 1000) % 60); //Math.floor here gives the integer part
  mins = Math.floor((elapsed / (1000 * 60)) % 60);
  hrs = Math.floor((elapsed / (1000 * 60 * 60)) % 60);

  secs = pad(secs);
  mins = pad(mins);
  hrs = pad(hrs);

  time.textContent = `Time: ${hrs}:${mins}:${secs}`;

  function pad(unit) {
    return ("0" + unit).length > 2 ? unit : "0" + unit;
  }
}

function INFO(){
  if(test2){
    test2 = false;
    clearTimeout(intervalID);
    clearTimeout(intervalId);
    ctx.fillStyle = back;
    ctx.fillRect(0, 0, 500, 500);
  
    ctx.font = "18px MV BOLI";
    ctx.fillStyle = "beige";
    ctx.textAlign = "center";
    ctx.fillText("Ping Pong Game is a game played by 2 players, first",GW/2,20);
    ctx.fillText("player (left side) of gray paddle serves the ball to",GW/2,40);
    ctx.fillText("pass his side to the opposite side,while the",GW/2,60);
    ctx.fillText("second player (right side) of blue paddle serves the",GW/2,80);
    ctx.fillText("ball to pass his side to the opposite side.",GW/2,100);
    ctx.fillText("Ball must touch the side of a player to mark a point",GW/2,120);
    ctx.fillText(" for the second competitor.",GW/2,140);
    ctx.fillText("Buttons up and down below the board at the left let",GW/2,160);
    ctx.fillText("the first player moving up and down or by using ",GW/2,180);
    ctx.fillText("letter w (up) and letter s (down).",GW/2,200);
    ctx.fillText("Buttons up and down below the board at the right let",GW/2,220);
    ctx.fillText("the second player moving up and down or by using ",GW/2,240);
    ctx.fillText("upper arrow (up) and lowwer arrow (down).",GW/2,260);
    ctx.fillText(" The horizantal line at the middle is the ball Y position,",GW/2,280);
    ctx.fillText(" while the vertical line is the ball x position .",GW/2,300);
    ctx.fillText("The time below helps the players to know the  time ",GW/2,320);
    ctx.fillText("of their match.",GW/2,340);
    ctx.fillText("The reset button is for restarting the game.",GW/2,360);
    ctx.fillText("Each number in the game board shows the score of the ",GW/2,380);
    ctx.fillText("player of same side.",GW/2,400);
    ctx.fillText("The match ends when the players want!",GW/2,450);
    info.textContent = "Back";
    time.textContent = "Informations about the game";
  } else{
    info.textContent = "Info";
    resetG();
  }
};