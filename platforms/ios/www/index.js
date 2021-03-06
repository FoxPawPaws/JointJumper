<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no">
    <title >chrome easter egg: t-rex runner</title>
    <link rel="stylesheet" href="index.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <style>
        canvas{
            border:1px solid #000000;
            background-color: #bad9fa;
        }
    </style> 
</head>

<body onload="startGame();" class="offline">
    <script type="text/javascript">
        minGap=400;
        maxGap=700;
        gap=randGap();
        bonusFlag= 0;
        jumpTemp=1;
        var myObstacles=[];
        var colours=["red","blue", "grey" ,"green","chocolate","yellow","orange"];
        function startGame(){
            gamearea.start();
        }
        function everyinterval(n){
            if(gamearea.frame%n==0) return true;
            return false;
        }
        function jump(){
            if(jumpTemp==1){
               player.sourceX=240;
               player.speedY-=8;
               jumpTemp=0;
            }
        }
        function randGap(){
            return Math.floor(minGap+Math.random()*(maxGap=minGap+1));
        }
        var scoreText={
            x:900,
            y:50,
            update:function(text){
                gamearea.context.fillStyle="gray";
                gamearea.context.font="30px Consolas";

                if(bonusFlag){

                 gamearea.context.fillText("BONUS: + 100", this.x,this.y);
                 gamearea.score+=1;
                 bonusFlag=0;
                }else{
                gamearea.context.fillText(text,this.x,this.y);}
            }
        }
        var player={
            sourceX:0,
            x:30,
            y:420,
            speedY:0,
            update:function(){
                gamearea.context.fillStyle="black";
                playerSprite = new Image();
                playerSprite.src='assets/playerSprite.png';
                gamearea.context.drawImage(playerSprite,this.sourceX,0,60,80,this.x,this.y,60,80);
            },
            newPos:function(){
                if(jumpTemp==0){
                    this.speedY+=0.06;
                    this.y += this.speedY;
                    this.speedY *=0.97;
                }
                
                if(this.y<100){
                    this.speedY=0;
                }
                this.y=this.y+this.speedY;
                if(this.y>=420){
                    this.speedY=0;
                    this.y=420;
                    if(jumpTemp==0){
                       player.sourceX=0; 
                    }
                    jumpTemp=1;
                }
            },
            newSprite:function(){

                if(((gamearea.frame+1) % 25 === 1) && jumpTemp==1){
                    if(this.sourceX==180){
                        this.sourceX=0;
                    }else{
                        this.sourceX+=60;
                    }
                }
            },
            crashWith:function(obs){
                if(this.x+60>obs.x &&this.x<obs.x+obs.width && this.y+80>obs.y){
                    if(obs.index == 3){
                        bonusFlag =1;
                        return false;
                    }return true;
                }
                return false;
            }
        }
        function obstacle(){
            this.height=60;
            this.width=40;
            this.x=1200;
            this.y=gamearea.canvas.height-this.height;
            this.index=Math.floor(Math.random()*colours.length);
            this.color=colours[this.index];
            this.draw=function(){
                gamearea.context.fillStyle=this.color;
                gamearea.context.fillRect(this.x,this.y,this.width,this.height);
            }
        }

        var gamearea={
            canvas:document.createElement("canvas"),
            start:function(){
               this.canvas.height=500;
               this.canvas.width=1200;
               document.body.insertBefore(this.canvas,document.body.childNodes[0]);
               this.context=this.canvas.getContext("2d");
               this.frame=0;
               this.score=0;
               this.jointScore=0; // joint score
               this.interval=setInterval(this.updateGameArea,5);
               window.addEventListener("keydown",jump);
            },
            updateGameArea:function(){
                for(i=0;i<myObstacles.length; i++){
                    if(player.crashWith(myObstacles[i])){
                        gamearea.stop();
                        return
                    }
                }
                gamearea.clear();
                if(everyinterval(gap)){
                    myObstacles.push(new obstacle());
                    gap=randGap();
                    gamearea.frame=0;
                }
                for(i=0;i<myObstacles.length;i++){
                    myObstacles[i].x-=1;
                    myObstacles[i].draw();
                }
                player.newPos();
                player.newSprite();
                player.update();
                gamearea.frame+=1;
                gamearea.score+=0.01;
                scoreText.update("Score: "+Math.floor(gamearea.score));
            },
            clear:function(){
                gamearea.context.clearRect(0,0,this.canvas.width,this.canvas.width);
            },
            stop:function(){
                clearInterval(this.interval);
                alert("game over sucka");
            }
        }
    </script>
</body>

</html>
