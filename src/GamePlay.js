var AMOUNT_DIAMONDS = 30;
var GAME_SECONDS=20;
var AMOUNT_BOOBLES=30;

//Instancia de nuestro juego
GamePlayManager = {
    //Phaser primero llama a init para configurar el aspecto de la ventana del juego
    init: function(){
        //Auto escalado de la pantalla del juego
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //Alinear el juego horizontal
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        this.flagFirstMouseDown = false;
        this.amountDiamondsCaught = 0;
        this.endGame = false;

        this.countSmile = -1;

    },
    //Preload es donde se cargan todos los recursos(assets) de nuestro juego
    preload: function(){
        game.load.image('background', 'assets/images/background.png');
        //Los numeros representan: alto, ancho, el ultimo parametro indica que el png tiene dos imagenes(frames)
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
        game.load.spritesheet('explosion', 'assets/images/explosion.png');
        game.load.spritesheet('mollusk', 'assets/images/mollusk.png');
        game.load.spritesheet('shark', 'assets/images/shark.png');
        game.load.spritesheet('fishes', 'assets/images/fishes.png');
        game.load.spritesheet('booble1', 'assets/images/booble1.png');
        game.load.spritesheet('booble2', 'assets/images/booble2.png');
    },
    //Phaser aca va a crear nuestro juego
    create:function(){
        game.add.sprite(0,0,'background');

        this.boobleArray = [];
        for(var i=0;i<AMOUNT_BOOBLES;i++){
            var xBooble = game.rnd.integerInRange(1,1140);
            var yBooble = game.rnd.integerInRange(600,950);
        
            var booble = game.add.sprite(xBooble,yBooble,'booble'+game.rnd.integerInRange(1,2));
            booble.vel = 0.2 + game.rnd.frac() * 2;
            booble.alpha = 0.9;
            booble.scale.setTo(0.2+ game.rnd.frac());
            this.boobleArray[i] = booble;
        }

        this.shark = game.add.sprite(500,20,'shark');
        this.fishes = game.add.sprite(100,550,'fishes');
        this.mollusk = game.add.sprite(500,150,'mollusk');

        this.horse = game.add.sprite(0,0,'horse');
        this.horse.x = game.width/2;
        this.horse.y = game.height/2;
        //Le cambiamos al horse el eje central de la imagen, de 0,0 a 5, 5
        this.horse.anchor.setTo(0.5);
        /*this.horse.angle = 0;
        this.horse.scale.setTo(1,2);
        this.horse.alpha = 1;*///valores de 0 a 1
        game.input.onDown.add(this.onTap, this);
        
        this.diamonds = [];
        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            var diamond = game.add.sprite(100,100,'diamonds');
            diamond.frame = game.rnd.integerInRange(0,3);
            diamond.scale.setTo(0.30 + game.rnd.frac());//frac() devuelve un valor entre 0 y 1
            diamond.anchor.setTo(0.5);
            diamond.x = game.rnd.integerInRange(50,1050);
            diamond.y = game.rnd.integerInRange(50,600);

            this.diamonds[i]= diamond;
            var rectCurrenDiamond = this.getBoundsDiamond(diamond);
            var rectHourse = this.getBoundsDiamond(this.horse);

            while(this.isOverlapingOtherDiamond(i, rectCurrenDiamond) 
                  || this.isRectangleOverlapping(rectHourse, rectCurrenDiamond)){
                diamond.x = game.rnd.integerInRange(50,1050);
                diamond.y = game.rnd.integerInRange(50,600);
                var rectCurrenDiamond = this.getBoundsDiamond(diamond);
            }
        }

        this.explosionGroup = game.add.group();
        for (var i = 0; i < 10; i++) {
            this.explosion = this.explosionGroup.create(100,100,'explosion');
            this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
                x: [0.4,0.8,0.4],
                y: [0.4,0.8,0.4]
                }, 600,Phaser.Easing.Exponential.Out, false, 0,0,false);
            this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
                    alpha:[1,0.6,0]
                },600,Phaser.Easing.Exponential.Out, false, 0,0,false);
            this.explosion.anchor.setTo(0.5);
            this.explosion.kill();
        }
        this.currentScore = 0;
        var style = {
            font:'bold 30pt Arial',
            fill: '#FFFFFF',
            align: 'center'
        }

        this.scoreText = game.add.text(game.width/2,40,'0',style);
        this.scoreText.anchor.setTo(0.5);

        this.totalTime = GAME_SECONDS;
        this.timerText = game.add.text(1000,40,this.totalTime,style);
        this.timerText.anchor.setTo(0.5);

        this.timerGameOver = game.time.events.loop(Phaser.Timer.SECOND, function(){
            if(this.flagFirstMouseDown && !this.endGame){
                this.totalTime--;
                this.timerText.text = this.totalTime+'';
                if(this.totalTime<=0){
                    game.time.events.remove(this.timerGameOver);
                    this.endGame = true;
                    this.showFinalMessage('GAME OVER');
                }
            }
        },this)


    },
    increaseScore:function(){
        this.countSmile = 0;
        this.horse.frame = 1;
        this.currentScore+=100;
        this.scoreText.text = this.currentScore;
        this.amountDiamondsCaught++;
        if(this.amountDiamondsCaught>=AMOUNT_DIAMONDS){
            this.endGame = true;
            this.showFinalMessage('CONGRATULATIONS');
        }
    },
    showFinalMessage:function(msg){
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0,game.width, game.height);

        var bg = game.add.sprite(0,0,bgAlpha);
        bg.alpha = 0.5;

        var style = {
            font:'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
        }

        this.textFielFinalMsg = game.add.text(game.width/2,game.height/2,msg,style);
        this.textFielFinalMsg.anchor.setTo(0.5);
    },
    onTap: function(){
        if(!this.flagFirstMouseDown){
            this.tweenMollusk = game.add.tween(this.mollusk.position).to(
                    {y:-0.0001},5800,Phaser.Easing.Cubic.InOut,true,0,1000,true
                ).loop(true);
        }
        this.flagFirstMouseDown = true;
    },
    getBoundsDiamond:function(currentDiamond){
        return new Phaser.Rectangle(currentDiamond.left , currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    isRectangleOverlapping:function(rect1, rect2){
        if(rect1.x>rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
           }
        if(rect1.y>rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },
    isOverlapingOtherDiamond:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectangleOverlapping(rect1,rect2)){
                return true;
            }
        }
        return false;
    },
    getBoundsHorse:function(){
        var x0 = this.horse.x -  Math.abs(this.horse.width)/4;
        var width = Math.abs(this.horse.width)/2;
        var y0 = this.horse.y -  Math.abs(this.horse.height)/2;
        var height = this.horse.height;
        
        return new Phaser.Rectangle(x0,y0,width,height);
    },
    render: function(argument) {
        //game.debug.spriteBounds(this.horse);
        for (var i=0; i< AMOUNT_DIAMONDS; i++) {
            //game.debug.spriteBounds(this.diamonds[i]);
        }
    },
    //Phaser frame a frame va a llamar al metodo update
    update: function(){
        if(this.flagFirstMouseDown && !this.endGame){

            for (var i = 0; i < AMOUNT_BOOBLES; i++) {
                var booble = this.boobleArray[i];
                booble.y-= booble.vel;
                if(booble.y <-50){
                    booble.y = 700;
                    booble.x = game.rnd.integerInRange(1,1140);
                }
            }

            if(this.countSmile >= 0){
                this.countSmile++;
                if(this.countSmile>50){
                    this.countSmile=-1;
                    this.horse.frame=0;
                }
            }

            this.shark.x--;

            if(this.shark.x<-300){
                this.shark.x = 1300;
            }

            this.fishes.x+=0.3;
            if(this.fishes.x > 1300){
                this.fishes.x = -300;
            }

            var pointerX = game.input.x;
            var pointerY = game.input.y;

            var disX = pointerX - this.horse.x;
            var disY = pointerY - this.horse.y;
            if(disX>0){
                this.horse.scale.setTo(1,1);
            }else{
                this.horse.scale.setTo(-1,1);
            }

            this.horse.x += disX * 0.12;
            this.horse.y += disY * 0.12;

            for(var i=0; i<AMOUNT_DIAMONDS; i++){
                var rectHorse = this.getBoundsHorse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                if(this.isRectangleOverlapping(rectHorse,rectDiamond)
                    && this.diamonds[i].visible){
                    this.diamonds[i].visible=false;
                    this.increaseScore();

                    var explosion = this.explosionGroup.getFirstDead();
                    if(explosion!= null){
                        explosion.reset(this.diamonds[i].x,this.diamonds[i].y);
                        explosion.tweenScale.start();
                        explosion.tweenAlpha.start();
                        
                        explosion.tweenAlpha.onComplete.add(function (currentTarget, currentTween){
                            currentTarget.kill();
                        },this);
                    }
                }
            }
        }
        
    }
}

var game = new Phaser.Game(1136,640,Phaser.CANVAS);

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');