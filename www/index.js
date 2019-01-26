 minGap=160;
        maxGap=400;
        gap=randGap();
        bonusFlag= 0;
        jumpTemp=1;
        var myObstacles=[];
        var colours=["pigSprite", "pigSprite", "pigSprite", "pigSprite","badgerSprite","badgerSprite", "greenSprite"];
        
        function startGame(){
            document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
            gamearea.start();
        }    
        function gameOver(){
            var modal= document.getElementById('myModal');
            var button= document.getElementById('startOver');
            var span= document.getElementsByClassName("close")[0];
            modal.style.display= "block";
            
            button.onclick= function(){
                modal.style.display= "none";
                document.location.reload(true);
            }         
        }
        //retrieve high score(get it.. HIGH score..)
        function retrieveScore(){
            var firebaseRef= firebase.database().ref().child("1");
            firebaseRef.on("value", snap => {
                var score= snap.val().score1;
                var name= snap.val().name1;
                document.getElementById("name1").innerHTML= name;
                document.getElementById("score1").innerHTML= score;
                upLoadScore(Math.floor(gamearea.score),newName,score);
            }); 
        }
        //upload score to Firebase if > top score
        function upLoadScore(newScore,newName, oldScore){
            var button= document.getElementById('submit');
            if(newScore > oldScore){
                //when submit button is clicked
                button.onclick= function(){
                var newName= document.getElementById('newName').value;
                  firebase.database().ref('1/').set({
                    name1: newName,
                    score1: newScore
                  });
                }
            }else{
                document.getElementById('newHighScore').style.visibility = 'hidden';
            }
        }
        function everyinterval(n){
            if(gamearea.frame%n==0) return true;
            return false;
        }
        function jump(){
            if(jumpTemp==1){
               player.sourceX=240;
               player.speedY-=6;
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
                 gamearea.score+=3.12;
                 bonusFlag=0;
                }else{
                gamearea.context.fillText(text,this.x,this.y);}
            }
        }
        var player={
            sourceX:0,
            x:80,
            y:380,
            speedY:0,
            update:function(){
                gamearea.context.fillStyle="black";
                playerSprite = new Image();
                playerSprite.src='assets/playerSprite.png';
                gamearea.context.drawImage(playerSprite,this.sourceX,0,60,80,this.x,this.y,55,80);
            },
            newPos:function(){
                if(jumpTemp==0){ 
                    this.speedY+=0.09;
                    this.y += this.speedY;
                    this.speedY *=0.96;
                }
                if(this.y<100){
                    this.speedY=0;
                }
                this.y=this.y+this.speedY;
                if(this.y>=380){
                    this.speedY=0;
                    this.y=380;
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
                if(this.x+45>obs.x &&this.x<obs.x+20 && this.y+60>obs.y){
                    if(obs.index == 6){
                        bonusFlag =1;
                        return false;
                    }return true;
                }
                return false;
            }
        }
        function obstacle(){
            this.sourceX=0;
            this.height=78;
            this.width=55;
            this.x=1200;
            this.y=380;
            this.index=Math.floor(Math.random()*colours.length);
            this.color=colours[this.index];
            this.draw=function(){
               if(((gamearea.frame+1) % 40 === 1) && this.index != 6){
                    if(this.sourceX==60){
                        this.sourceX=0;
                    }else{
                        this.sourceX+=60;
                    }
                }else if(((gamearea.frame+1) % 40 === 1) && this.index == 6 && bonusFlag == 0){
                    if(this.sourceX==180){
                        this.sourceX=0;
                    }else{
                        this.sourceX+=60;
                    }
                    if(this.sourceX==360){
                        this.sourceX+=0;
                        this.y=2000;
                    }
                }else if(((gamearea.frame+1) % 40 === 1) && this.index == 6 && bonusFlag == 1){
                    this.sourceX=240;
                    this.sourceX+=60;
                }
                obsSprite = new Image();
                obsSprite.src='assets/'+colours[this.index]+'.png';
                gamearea.context.drawImage(obsSprite,this.sourceX,0,60,80,this.x,this.y,this.width,this.height);
            }
        }

        var gamearea={
            canvas:document.createElement("canvas"),
            start:function(){
               this.canvas.id="canvasID";
               this.screenvanvas = true;
               this.canvas.height=window.innerHeight * window.devicePixelRatio;
               this.canvas.width=window.innerWidth * window.devicePixelRatio;
               document.body.insertBefore(this.canvas,document.body.childNodes[0]);
               this.context=this.canvas.getContext("2d");
               this.frame=0;
               this.score=0;
               this.jointScore=0; // joint score
               this.interval=setInterval(this.updateGameArea,5);
               window.addEventListener("mousedown",jump);
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
                    myObstacles[i].x-=2;
                    myObstacles[i].draw();
                }
                player.newPos();
                player.newSprite();
                player.update();
                gamearea.frame+=1;
                gamearea.score+=0.02;
                scoreText.update("Score: "+Math.floor(gamearea.score));
            },
            clear:function(){
                gamearea.context.clearRect(0,0,this.canvas.width,this.canvas.width);
            },
            stop:function(){
                retrieveScore();
                gameOver();
                clearInterval(this.interval);
            }
        }