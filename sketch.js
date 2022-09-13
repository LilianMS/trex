//VARIÁVEIS CONSTANTES
var PLAY = 1;
var END = 0;

var gameState = PLAY;

var trex, trex_running, trex_collided;
var groundImage, ground, edges, chaoInvisivel;

var obstaculosGrupo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var nuvemGrupo, nuvemImage;
var gameOver, gameOverImg, restart, restartImg;

var jumpSound , checkPointSound, dieSound;

var placar = 0;




function preload(){
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");

    groundImage = loadImage("ground2.png");
    nuvemImage = loadImage("cloud.png");
    obstaculo1 = loadImage("obstacle1.png");
    obstaculo2 = loadImage("obstacle2.png");
    obstaculo3 = loadImage("obstacle3.png");
    obstaculo4 = loadImage("obstacle4.png");
    obstaculo5 = loadImage("obstacle5.png");
    obstaculo6 = loadImage("obstacle6.png");
    
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");

    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("die.mp3")
    checkPointSound = loadSound("checkPoint.mp3")
}

function setup(){
    createCanvas(windowWidth,windowHeight);
    
    //criar sprite trex
    trex = createSprite(50,height-70,20,50);
    trex.addAnimation("running",trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.scale = 0.5;
    trex.x = 50;
    
    
    //criar sprite chão
    ground = createSprite(width/2,height,width,2);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
   
    edges = createEdgeSprites();
    chaoInvisivel = createSprite(width/2,height-10,width,125);
    chaoInvisivel.visible = false;

    nuvemGrupo = new Group();
    obstaculosGrupo = new Group();

    trex.setCollider("circle",0,0,40);
    //trex.debug = true;

    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    gameOver.visible = false;

    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    restart.scale = 0.5;
    restart.visible = false;
}


function draw(){
    background("white");

    text("Pontuação: " +placar,500,50);
    

    text("T-Rex",trex.x,trex.y-30); 

    //chão infinito
     if(ground.x < 0){
       ground.x = ground.width/2;  
     }

    

    trex.collide(chaoInvisivel);

    if(gameState === PLAY){
        ground.velocityX = -4;
        //alterar frameRate
        placar = placar + Math.round(frameRate()/60);
        if(placar>0 && placar%100 === 0){
            checkPointSound.play();
        }
        //fazer o trex pular quando a tecla espaço for precionada
        if(keyDown("space")&&trex.y > 160){
            trex.velocityY = -10;
            jumpSound.play();
        }
        //gravidade
        trex.velocityY += 0.5;
        gerarNuvens();
        gerarObstaculos();
        if(obstaculosGrupo.isTouching(trex)){
           gameState = END;
           dieSound.play();
        }
    }else if(gameState === END){
        ground.velocityX = 0;
        trex.velocityY = 0;
        obstaculosGrupo.setVelocityXEach(0);
        nuvemGrupo.setVelocityXEach(0);

        trex.changeAnimation("collided", trex_collided);

        obstaculosGrupo.setLifetimeEach(-1);
        nuvemGrupo.setLifetimeEach(-1);
        gameOver.visible = true;
        restart.visible =true;
        gameOver.depth = trex.depth + 1;
        restart.depth = trex.depth + 1;
    }
    //clique no restart chama função reset
    if(mousePressedOver(restart)){
        console.log("reiniciar jogo");
        reset();
    }
    
    drawSprites();
   console.log(frameCount + "+" + frameRate());
}
//função reset volta ao estado inicial do jogo
function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running",trex_running);

    obstaculosGrupo.destroyEach();
    nuvemGrupo.destroyEach();
    placar = 0;
    
}

function gerarNuvens(){
    if(frameCount%60 === 0){
        var nuvem=createSprite(width+20,height-300,40,10);
        nuvem.velocityX = -3;
        nuvem.addImage(nuvemImage);
        nuvem.scale = 0.5;
        nuvem.y = random(20,70)

        //observando profundidade
        console.log(trex.depth);
        console.log(nuvem.depth);
        //mudando a profundidade
        nuvem.depth = trex.depth;
        trex.depth += 1;

        //tempo de vida para limpar memoria
        nuvem.lifetime = 210;

        //adicionando nuvens ao grupo
        nuvemGrupo.add(nuvem);

    }
    
}

function gerarObstaculos(){
    if(frameCount%60 === 0){
        var obstaculo = createSprite(600,height-95,20,30);
        obstaculo.velocityX = -4;
        
        var rand = Math.round(random(1,6));

        switch(rand){
            case 1: obstaculo.addImage(obstaculo1);
                    break;
            case 2: obstaculo.addImage(obstaculo2);
                    break;
            case 3: obstaculo.addImage(obstaculo3);
                    break;
            case 4: obstaculo.addImage(obstaculo4);
                    break;
            case 5: obstaculo.addImage(obstaculo5);
                    break;
            case 6: obstaculo.addImage(obstaculo6);
                    break;
            default : break;
        }
        obstaculo.depth = trex.depth;
        obstaculo.scale = 0.5;
        obstaculo.lifetime = 300;

        obstaculosGrupo.add(obstaculo);
    }
}