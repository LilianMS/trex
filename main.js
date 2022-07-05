var bola;


function setup(){
    createCanvas(600,400);
    bola = createSprite(300,200,20,20);
    bola.shapeColor = "yellow";
    // bola.velocityX = 3;
    // bola.velocityY = -3;
    bola.rotationSpeed = 3;
}


function draw(){
    background(100)

    if(keyDown("up")){
       bola.y = bola.y + 5; 

    }
    drawSprites();
}