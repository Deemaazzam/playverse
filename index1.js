const gameBox=document.querySelector("#gameBox");
const ctx=gameBox.getContext("2d");
const scoreText=document.querySelector("#score");
const startBtn=document.querySelector("#startBtn");
const  boxwidth=gameBox.width;
const boxheight=gameBox.height;
const snakeColor="black";
const boardBackground="#7A9D54";
const snakeBorder="black";
const foodColor="#95f5af";
const unitSize=25;
let score=0;
let running=false;
let xVelocity=unitSize;
let yVelocity=0;
let foodX;
let foodY;
let snake=[
    {x:unitSize*3,y:0},
    {x:unitSize*2,y:0},
    {x:unitSize, y:0},
    {x:0,y:0}
];
const foodImage=new Image();
foodImage.src='rsz_apple.png'
// controls.forEach(control=>{control.addEventListener("click",changedirection)})
window.addEventListener("keydown",changeDirection);
startBtn.addEventListener('click',()=>{gameStart();
startBtn.style.display='none'});
function gameStart(){
    ResetGame();
    running=true;
    generateFood();
    drawScore();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawScore();
            drawFood();
            move();
            drawSnake();
            checkGameOver();
            nextTick();
        },75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle=boardBackground;
    ctx.fillRect(0,0,boxwidth,boxheight);
};
function generateFood(){
    function randomFood(min,max){
        const randNum=Math.round((Math.random()*(max-min)+min)/unitSize)*unitSize;
        return randNum;
    }
    foodX=randomFood(0,boxwidth-unitSize);
    foodY=randomFood(0,boxheight-unitSize);
};

function drawFood(){
    // ctx.fillStyle=foodColor;
    // ctx.fillRect(foodX,foodY,unitSize,unitSize);
    ctx.drawImage(foodImage,foodX,foodY);
};
function move(){
    const head={x:snake[0].x+xVelocity,y:snake[0].y+yVelocity};
    snake.unshift(head);
    if(snake[0].x==foodX && snake[0].y==foodY){
            score+=1;
            generateFood();
    }
    else{
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle=snakeColor;

    snake.forEach(box=>{
        ctx.fillRect(box.x,box.y,unitSize,unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT=37;
    const RIGHT=39;
    const UP=38;
    const DOWN=40;
    const goingUp=(yVelocity==-unitSize);
    const goingDown=(yVelocity==unitSize);
    const goingLeft=(xVelocity==-unitSize);
    const goingRight=(xVelocity==unitSize);
    switch(true){
        case (keyPressed==LEFT && !goingRight):
            xVelocity=-unitSize;
            yVelocity=0;
            break;
        case (keyPressed==UP && !goingDown):
            xVelocity=0;
            yVelocity=-unitSize;
            break;
        case (keyPressed==RIGHT && !goingLeft):
            xVelocity=unitSize;
            yVelocity=0;
            break;
        case (keyPressed==DOWN && !goingUp):
            xVelocity=0;
            yVelocity=unitSize;
            break;
    }
};
function checkGameOver(){
    switch(true){
        case(snake[0].x<0):
            running=false;
            break;
        case(snake[0].x>=boxwidth):
            running=false;
            break;
        case(snake[0].y<0):
             running=false;
            break;
        case(snake[0].y>=boxheight):
                running=false;
                break;
    }
    for(let i=1;i<snake.length;i++)
    {
        if(snake[i].x==snake[0].x && snake[i].y==snake[0].y)
            running=false;
    }
};
function displayGameOver(){
    ctx.font=" 30px 'DotGothic16'";
    ctx.fillStyle="black";
   
    ctx.textAlign="center";
    ctx.fillText("GAME OVER",boxwidth/2,boxheight/2-40);
    running=false;
    startBtn.style.display='block';
};
function ResetGame(){

    clearBoard();
    score=0;
    xVelocity=unitSize;
    yVelocity=0;
    snake=[
        {x:unitSize*4,y:0},
        {x:unitSize*3,y:0},
        {x:unitSize*2,y:0},
        {x:unitSize, y:0},
        {x:0,y:0}
    ];
    
    
};
function changedirection(){
    const index=this.getAttribute("index");
    const goingUp=(yVelocity==-unitSize);
    const goingDown=(yVelocity==unitSize);
    const goingLeft=(xVelocity==-unitSize);
    const goingRight=(xVelocity==unitSize);
    switch(true){
        case (index==0 && !goingDown):
            xVelocity=0;
            yVelocity=-unitSize;
            break;
        case (index==1 && !goingRight):
            xVelocity=-unitSize;
            yVelocity=0;
            break;
        case (index==2 && !goingUp):
             xVelocity=0;
             yVelocity=unitSize;
             break;
        case (index==3 && !goingLeft):
              xVelocity=unitSize;
              yVelocity=0;
              break;
    }
};
function drawScore(){
    ctx.font=" 30px 'Press Start 2P'";
    ctx.textAlign="center";
    ctx.fillStyle="black";
    ctx.fillText(score,50,50);
}