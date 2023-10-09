const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const heart = new Image();
heart.src = 'image1.jpg';
const Audios = [
    new Audio('death.wav'),
    new Audio('enemyDestroy.mp3'),
    new Audio('gameOver1.mp3')];
let score=0;
function drawHearts(x)
{
    if (x > 0)
        ctx.drawImage(heart, 760, 5, 40, 40);
    if (x > 1)
        ctx.drawImage(heart, 710, 5, 40, 40);
    if (x > 2)
        ctx.drawImage(heart, 660, 5, 40, 40);
}
canvas.width = 800;
canvas.height = 550;
canvas.style.backgroundColor = "black";
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 55,
    height: 17,
    color: "white",
    speed: 5,
    lives: 3,
};
let enemiesBullets = [];
let myBullets = [];
let enemies = [];
const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "cyan",
];
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
function spawnEnemy() {
    const x = Math.random() * (canvas.width - 50);
    const y = Math.random() * 70 + 60;
    const width = 40;
    const height = 20;
    const color = getRandomColor();
    const speedX = 1;
    const speedY = 0;
    const shootCooldown = Math.random() * 100 + 20;
    enemies.push({ x, y, width, height, color, speedX, speedY, shootCooldown });
}
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    drawHearts(player.lives);
}
function drawEnemiesBullets() {
    for (let i = 0; i < enemiesBullets.length; i++) {
        ctx.fillStyle = enemiesBullets[i].color;
        ctx.fillRect(enemiesBullets[i].x, enemiesBullets[i].y, 5, 15);
    }
}
function drawMyBullets() {
    for (let i = 0; i < myBullets.length; i++) {
        ctx.fillStyle = myBullets[i].color;
        myBullets[i].width = 5;
        myBullets[i].height = 15;
        ctx.fillRect(myBullets[i].x,
            myBullets[i].y,
            myBullets[i].width,
            myBullets[i].height
        );
    }
}
function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillStyle = enemies[i].color;
        ctx.fillRect(
            enemies[i].x,
            enemies[i].y,
            enemies[i].width,
            enemies[i].height
        );
    }
}
function updateMyBullets() {
    for (let i = 0; i < myBullets.length; i++) {
        myBullets[i].y += myBullets[i].speed;
        if (myBullets[i].y < 60 ) {
            myBullets.splice(i, 1);
        }
    }
}
function updateEnemiesBullets() {
    for (let i = 0; i < enemiesBullets.length; i++) {
        enemiesBullets[i].y += enemiesBullets[i].speed;
        if (enemiesBullets[i].y < 0 || enemiesBullets[i].y > canvas.height) {
            enemiesBullets.splice(i, 1);
        }
    }
}
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x += enemies[i].speedX;

        if (enemies[i].x + enemies[i].width > canvas.width)
            enemies[i].speedX *= -1;
        if (enemies[i].x < 0)
            enemies[i].speedX *= -1;
        enemies[i].shootCooldown -= 1;
        if (enemies[i].shootCooldown <= 0) {
            enemiesBullets.push({
                x: enemies[i].x + enemies[i].width / 2 - 5,
                y: enemies[i].y + enemies[i].height,
                width: 10,
                height: 10,
                color: enemies[i].color,
                speed: 3,
            });
            enemies[i].shootCooldown = Math.random() * 100 + 20;
        }
    }
}
function checkCollisions() {
    for (let i = 0; i < myBullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                myBullets.length > 0 && enemies.length>0 &&
                myBullets[i].x < enemies[j].x + enemies[j].width &&
                myBullets[i].x  > enemies[j].x &&
                myBullets[i].y  < enemies[j].y + enemies[j].height &&
                myBullets[i].y  > enemies[j].y
            ) {
                myBullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                Audios[1].play();
            }
        }
    }
}
let playerIsHit = false;
function checkDeath() {
    for (let i = 0; i < enemiesBullets.length; i++) {
        if (
            enemiesBullets[i].x < player.x + player.width &&
            enemiesBullets[i].x > player.x - enemiesBullets[i].width &&
            enemiesBullets[i].y < player.y + player.height &&
            enemiesBullets[i].y > player.y - enemiesBullets[i].height
        ) {
            enemiesBullets.splice(i, 1);
            playerIsHit = true;
        }
    }
    if (playerIsHit) {
        player.x = canvas.width / 2 - 25;
        player.y = canvas.height - 50;
        playerIsHit = false;
        player.lives--;
        Audios[1].pause();
        Audios[0].play();
        if (player.lives == 0) {
            
            myBullets=[];
            Audios[0].pause();
            Audios[2].play();
            setTimeout(()=>{
                window.location.href = "game8.html";    
            },
            3000);   
        }
    }
}
let leftPressed=false;
let rightPressed=false;
let shootPressed = false;
document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowLeft") {
        leftPressed = true;
    }
    if (e.code === "ArrowRight") {
        rightPressed = true;
    }
    if (e.code === "Space") {
        shootPressed = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowLeft") {
        leftPressed = false;
    }
    if (e.code === "ArrowRight") {
        rightPressed = false;
    }
    if (e.code === "Space") {
        shootPressed = false;
    }
});
let timerTillNextBullet = 0;
function move() {
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }

    if (rightPressed && player.x + player.width < 800) {
        player.x += player.speed;
    }
    if (shootPressed && timerTillNextBullet <= 0) {
        myBullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 5,
            height: 15,
            color: player.color,
            speed: -6,
        });
        timerTillNextBullet = 7;
    }
    timerTillNextBullet--;
}
score += timerTillNextBullet - timerTillNextBullet;
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawMyBullets();
    drawEnemiesBullets();    
    drawEnemies();
    checkCollisions();
    checkDeath();
    if (player.lives !== 0)
    {
        updateMyBullets();
        updateEnemiesBullets();
        updateEnemies();
        move();
    }
    if (player.lives === 0)
    {
        ctx.font = "90px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Game Over", 180, 250);
    }
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 30);
    requestAnimationFrame(update);
}
document.addEventListener("keydown", function (event) {
    if (event.code === "Escape") {
        window.location.href = "index.html";
        }
});
setInterval(spawnEnemy, 700);
update();
