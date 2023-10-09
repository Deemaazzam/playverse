window.addEventListener('load',()=>{
    const playerImage=new Image();
    playerImage.src='spaceship.png'
    const enemyImage= new Image();
    enemyImage.src='invader.png';
    const live=new Image();
    live.src='lives.png'
    const myCanvas=document.getElementById("myCanvas");
    const ctx=myCanvas.getContext("2d");
    myCanvas.width=innerWidth;
    myCanvas.height=innerHeight;
    const Audios=[ new Audio('shoot.wav'),new Audio('backgroundMusic-1.mp3'),new Audio('enemyShoot.wav'),
            new Audio('gameOver.mp3'), new Audio('start.mp3'),new Audio('explode.wav')];
    class InputHandler{
        //deals with user interactions eventhandelers etc...
        constructor(game){
            this.game=game;
            window.addEventListener('keydown',(e)=>{
                
                if((e.key=="ArrowRight" || e.key=="ArrowLeft") &&this.game.keys.indexOf(e.key)==-1) {
                    this.game.keys.push(e.key)
                }     
                if(e.key==' '){
                        
                        this.game.player.shoot();
                }
            });
            window.addEventListener('keyup',(e)=>{
                if(this.game.keys.indexOf(e.key)>-1)
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1);
            });
        }
        
    }
    class UI{
        //display text for game over/lives/score ...for the user
        constructor(game){
            this.game=game;  
        }
        draw(context){
            context.font=" 30px 'Bebas Neue'";
            context.textAlign="center";
            context.fillStyle="green";
            context.fillText("Level "+this.game.level,150,40);
            context.font=" 20px 'Press Start 2P'";
            context.textAlign="center";
            context.fillStyle="white";
            context.fillText("Score: "+this.game.score,150,80);
            context.fillText("Lives: ",1230,40);
            for(let i=0;i<this.game.player.lives;i++){
                context.drawImage(live,1150+i*50,40,40,30)
            }
        }
        displayGameOver(){
            if(this.game.gameOver){
                ctx.textAlign='center';
                let message1='Defeat today paves the way for victory tomorrow. Keep aiming for the stars!';
                ctx.font="40px 'Bebas Neue'";
                ctx.fillText(message1,this.game.width*0.5,this.game.height*0.5-20);
             }
        }
    }
    class Background{
        //background
        constructor(game){
            this.game=game;
            this.particles=[];
            for(let i=0;i<100;i++){
                this.particles.push(new Particle(this.game,Math.random()*myCanvas.clientWidth,Math.random()*(myCanvas.clientHeight-50),(Math.random())*3,'white',0,(Math.random()),false));
            }
        }
        update(){
            this.particles.forEach(particle=>{
                particle.update();
                if(particle.y+30>myCanvas.clientHeight){

                    particle.y=Math.random()*(myCanvas.clientHeight-50);
                    
                }
              
            });  
        
        }
        draw(context){
            this.particles.forEach(particle=>particle.draw(context));
        }
    }
    class Player{
        constructor(game){
            this.game=game;
            this.width=445*0.3;
            this.height=225*0.3;
            this.speedX=0 ;
            this.maxSpeed=4;
            this.projectiles=[];
            this.lives=3;
            this.image=playerImage;
            playerImage.onload=()=>{
                this.width=playerImage.width*0.3;
                this.height=playerImage.height*0.3;
            }
            this.x= myCanvas.clientWidth*0.5-this.width*0.5;
            this.y=myCanvas.clientHeight-this.height*1.5;
            this.rotation=0;
        }
        update(){
            this.maxSpeed+=0.0002;
            if(this.game.keys.includes('ArrowLeft') && this.x>myCanvas.clientLeft){this.speedX=-this.maxSpeed;
                this.rotation=-.15;
            } 
            else if(this.game.keys.includes('ArrowRight') && this.x<myCanvas.clientWidth-this.width) {this.speedX=this.maxSpeed;
                this.rotation=.15;
            } else
            {
                this.speedX=0;
                this.rotation=0;
            } 
            this.x+=this.speedX;
            this.projectiles.forEach(projectile=>projectile.update());
            this.projectiles=this.projectiles.filter(projectile=>
                !projectile.markedfordeletion
            );
        }
        draw(context){
            context.fillStyle='white';
            this.projectiles.forEach(projectile=>{projectile.draw(context);});
            context.save();
            context.translate(this.x+this.width*.5,this.y+this.height*0.5);
            context.rotate(this.rotation);
            context.translate(-this.x-this.width*.5,-this.y-this.height*0.5);
            if(this.image)
                     context.drawImage(this.image,this.x,this.y,this.width,this.height);
            context.restore();
        }
        shoot(){
                this.projectiles.push(new Projectile(this.game,this.x+this.width*0.5,this.y-this.height*0.5));
               Audios[0].play();
        }
    }
    class Enemy{
       constructor(game,x,y){
        this.game=game;
        this.x=x;
        this.y=y;
        this.speedY=0;
        this.speedXmax=2;
        this.speedX=this.speedXmax;
        this.projectile;
        this.width=31*1.7;
        this.height=39*1.7;
        this.color;
        this.markedForDeletion=false;
        this.projectiles=[];
       }
       update(speedX,speedY){
                this.speedX=speedX;
                this.speedY=speedY;
                this.x+=this.speedX;
                this.y+=this.speedY;
                if(this.lives<=0)
                    this.markedForDeletion=true;
       }
       draw(context){
        if(!this.markedForDeletion){
            context.fillStyle=this.color;
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
        }
       }
       shoot(){
            this.projectiles.push(new InvaderProjectile(this.game,this.x+this.width*0.5,this.y+this.height));
            Audios[2].play();
        }
    }
    class Enemy1 extends Enemy{
        constructor(game,x,y,image){
            super(game,x,y);
            this.color='yellow';
            this.score=5;
            this.lives=1;
            this.image=image;
        }
    }
    class Enemy2 extends Enemy{
        constructor(game,x,y,image){
            super(game,x,y);
            this.color='green';
            this.score=15;
            this.lives=2;
            this.image=image;
        }
    }
    class Grid{
        constructor(game){
            this.game=game;
            this.x=0;
            this.y=0;
            this.speedY=0;
            this.maxSpeed=2;
            this.speedX=this.maxSpeed
            this.enemies=[];
            this.markedForDeletion=false;
            
            for(let i=0;i<15;i++){
                for(let j=0;j<5;j++)
                         this.enemies.push( new Enemy1(this.game,i*31*2,j*39,enemyImage));
            }
            }
            update(){
                let i;
                if(this.x+15*enemyImage.width*2>myCanvas.clientWidth-10 || this.x<0){
                    this.speedY=15;
                    this.speedX=-this.speedX;
                }
                 else{
                    this.speedY=0;
                 }   
                this.x+=this.speedX;
                for(i=0;i<15*5;i++){
                    if(!this.enemies[i].markedForDeletion)
                        break;
                }
                if(i>=15*5)
                    this.markedForDeletion=true;
            }
    }
    class Projectile{
        constructor(game,x,y){
            this.game=game;
            this.x=x;
            this.y=y;
            this.radius=3;
            this.width=3;
            this.height=3;
            this.markedfordeletion=false;
            this.speedY=5;
        }
        update(){
            this.y-=this.speedY;
            if(this.y-25<myCanvas.clientTop) {
                this.markedfordeletion=true;
            }
        }
        draw(context){
            context.beginPath();
            context.fillStyle='red';
            context.arc(this.x,this.y,this.radius,0,2*Math.PI);
            context.fill();
            context.closePath();
        }
    }
    class InvaderProjectile{
        constructor(game,x,y){
            this.game=game;
            this.x=x;
            this.y=y;
            this.width=4;
            this.height=15;
            this.markedfordeletion=false;
            this.speedY=0.1;
        }
        update(){
            this.y+=this.speedY;
            if(this.y+25>myCanvas.clientTop+myCanvas.clientWidth) {
                this.markedfordeletion=true;
            }
        }
        draw(context){
            if(!this.markedfordeletion){
                context.fillStyle='yellow';
            context.fillRect(this.x,this.y,this.width,this.height);
            }       
        }
    }
    class Particle{
        constructor(game,x,y,radius,color,speedX,speedY,fades){
            this.game=game;
            this.x=x;
            this.y=y;
            this.markedfordeletion=false;
            this.speedX=speedX;
            this.speedY=speedY;
            this.radius=radius;
            this.color=color;
            this.width=radius;
            this.height=radius;
            this.opacity=1;
            this.fades=false;
            this.fades=fades;
        }
        update(){
            this.x+=this.speedX
            this.y+=this.speedY;
            if(this.y+25>myCanvas.clientTop+myCanvas.clientHeight || 
                this.x+25>myCanvas.clientLeft+myCanvas.clientWidth ||
                this.x-25<myCanvas.clientLeft ||
                this.y-25<myCanvas.clientTop
                ) {
                this.markedfordeletion=true;
            }
            if(this.fades)
                    this.opacity-=0.005;
            if(this.opacity<=0)
                this.markedfordeletion=true;
        }
        draw(context){
            if(!this.markedfordeletion){
                context.save();
                context.globalAlpha=this.opacity;
                context.beginPath();
                context.fillStyle=this.color;
                context.arc(this.x,this.y,this.radius,0,2*Math.PI);
                context.fill();
                context.closePath();
                context.restore();
            }       
        }
    }
    class Game{
        constructor(width,height){
            this.background=new Background(this);
            this.UI=new UI(this);
            this.level=1;
            this.player=new Player(this);
            this.width=width;
            this.height=height;
            this.score=0;
            this.keys=[];
            this.inputHandeler=new InputHandler(this);
            this.grids=[new Grid(this)];
            this.gameOver=false;
            this.particles=[];
        }
        update(deltaTime){
            this.background.update();
            this.player.update();
            this.grids.forEach(grid=>grid.enemies.forEach(enemy=>{ this.player.projectiles.forEach(projectile=>{
                if(this.checkCollision(projectile,enemy) && !enemy.markedForDeletion){
                    projectile.markedForDeletion=true;
                    this.player.projectiles=this.player.projectiles.filter(projectile=>!projectile.markedForDeletion);
                    enemy.lives--;
                    this.score+=20;
                    if(enemy.lives<=0 && Math.random()<0.9){
                        for(let i=0;i<6;i++)
                             this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5,(Math.random())*3,'#BAA0DE',(Math.random()-0.5)*3,(Math.random()-0.5)*3,true));
                        
                        enemy.markedForDeletion=true;
                    } 
                }
            });
            this.grids.forEach(grid=>grid.enemies.forEach(enemy=>enemy.projectiles.forEach(projectile=>{
                if(this.checkCollision(projectile,this.player)){
                    projectile.markedForDeletion=true;
                    Audios[5].play();
                    enemy.projectiles=enemy.projectiles.filter(projectile=>!projectile.markedForDeletion)
                    this.player.lives--;
                    for(let i=0;i<15;i++)
                             this.particles.push(new Particle(this,this.player.x+this.player.width*0.5,this.player.y+this.player.height*0.5,(Math.random())*3,'white',(Math.random()-0.5)*7,(Math.random()-0.5)*7,true));
                        
                    if(this.player.lives==0){
                        this.gameOver=true;
                        this.UI.displayGameOver();
                    }
                        
                }
                projectile.update();
            })));
    enemy.update(grid.speedX,grid.speedY)}
            )
            );
            this.particles.forEach(particle=>particle.update());
            this.particles=this.particles.filter(particle=>!particle.markedForDeletion);
            this.grids.forEach(grid=>grid.update());

            this.grids=this.grids.filter(grid=>!grid.markedForDeletion);
            if(this.grids.length==0){
                this.level++;
                this.grids.push(new Grid(this));
                this.player.lives=3;
                if(intervalTime-200>0)
                    intervalTime-=200;
                this.player.projectiles=[];
                this.particles=[];
            }
        }
        draw(context){
            this.background.draw(context);
            this.UI.draw(context);
            this.player.draw(context);
            this.particles.forEach(particle=>particle.draw(context))
            this.grids.forEach(grid=>grid.enemies.forEach(enemy=>{enemy.draw(context)
           }
            ));
            this.grids.forEach(grid=>grid.enemies.forEach(enemy=>enemy.projectiles.forEach(projectile=>projectile.draw(context))));
        }   
        checkCollision(rect1,rect2){
            return(
                rect1.x<rect2.x+rect2.width &&
                rect1.x+rect1.width> rect2.x &&
                rect1.y< rect2.y + rect2.height &&
                rect1.y+rect1.height > rect2.y
            )
        }
    }
    let game=new Game(myCanvas.width,myCanvas.height);
    let lastTime=0;
    let intervalTime=3000;
    function shootEnemy(){
        let random;
        game.grids.forEach(grid=>{
            random=Math.floor(Math.random()*15*5);
            while(grid.enemies[random].markedForDeletion)
            {
                random=Math.floor(Math.random()*15*5);
            }
            grid.enemies[random].shoot()});
    }
    function animate(timestramp){
        let deltaTime=timestramp-lastTime;
        lastTime=timestramp;
        ctx.fillStyle='black';
        ctx.fillRect(0,0,myCanvas.width,myCanvas.height); 
        game.update(deltaTime);
        game.draw(ctx);
        const animation=requestAnimationFrame(animate) ;
        if(game.gameOver){
            Audios[1].pause();
            Audios[3].play();
          
            window.cancelAnimationFrame(animation)
            ctx.drawImage(startBg,0,0,myCanvas.clientWidth,myCanvas.clientHeight);
            ctx.drawImage(invader,myCanvas.clientWidth*0.5-invader.width*0.130,300,200,165);
            // setTimeout(iniate,3000);
            ctx.font=" 30px 'Press Start 2P'";
                ctx.textAlign="center";
                ctx.fillStyle="rgb(17, 67, 17)";
            ctx.fillText("GAME OVER",myCanvas.clientWidth*0.5,80);
            ctx.fillStyle="white";
            ctx.fillText("Don't be a",myCanvas.clientWidth*0.5,150);
            ctx.fillText("Be a good Human",myCanvas.clientWidth*0.5,500);
            document.getElementById('startBtn').style.display='block';
            document.getElementById('spaceInvader').style.display='block';
            document.querySelector('.back').style.display='block';
            clearInterval(interval);
        }
    }
    const startBg=new Image();
    startBg.src='startScreenBackGround.png';
    const invader=new Image();
    invader.src='invaderpic.png';
    iniate();
    function iniate(){
        game=new Game(myCanvas.width,myCanvas.height);
        ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
        startBg.onload=()=>{
                ctx.drawImage(startBg,0,0,myCanvas.clientWidth,myCanvas.clientHeight);
                ctx.font=" 30px 'Press Start 2P'";
                ctx.textAlign="center";
                ctx.fillStyle="white";
                ctx.fillText("Don't be a",myCanvas.clientWidth*0.5,150);
                ctx.fillText("Be a good Human",myCanvas.clientWidth*0.5,500);
            }
            //the initial canvas 

             invader.onload=()=>{
                ctx.drawImage(invader,myCanvas.clientWidth*0.5-invader.width*0.130,300,200,165);
             }
    }
    let interval;
    document.getElementById('startBtn').addEventListener('click',()=>{
         interval=setInterval(shootEnemy,intervalTime);
         Audios[4].play();
         Audios[1].play();
         game=new Game(myCanvas.width,myCanvas.height);;
        animate(0);
        document.getElementById('startBtn').style.display='none';
        document.getElementById('spaceInvader').style.display='none';
        document.querySelector('.back').style.display='none';
    })
   
});
