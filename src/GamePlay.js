var AMOUNT_DIAMONDS = 10;

//Instancia de nuestro juego
GamePlayManager = {
    //Phaser primero llama a init para inicializar
    init: function(){
        //Auto escalado de la pantalla del juego
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //Alinear el juego horizontal
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        this.flagFirstMouseDown = false;
    },
    //Preload es donde se cargan todos los recursos(assets) de nuestro juego
    preload: function(){
        game.load.image('background', 'assets/images/background.png');
        //Los numeros representan: alto, ancho, el ultimo parametro indica que el png tiene dos imagenes(frames)
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
    },
    //Phaser aca va a crear nuestro juego
    create:function(){
        game.add.sprite(0,0,'background');
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
                  || this.isOverlapingOtherDiamond(rectHourse, rectCurrenDiamond)){
                diamond.x = game.rnd.integerInRange(50,1050);
                diamond.y = game.rnd.integerInRange(50,600);
                var rectCurrenDiamond = this.getBoundsDiamond();
            }
        }
        
    },
    onTap: function(){
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
    //Phaser frame a frame va a llamar al metodo update
    update: function(){
        if(this.flagFirstMouseDown){
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
        }
        
    }
}

var game = new Phaser.Game(1136,640,Phaser.CANVAS);

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');