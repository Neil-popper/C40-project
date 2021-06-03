var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var edges;

var score=0;
var minspeed = 0;
var maxspeed=0;

var bg;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("flybot1.gif","flybot2.gif","flybot1.gif", "flybot2.gif");
  trex_collided = loadAnimation("flybot1.gif");
  
  
  obstacle1 = loadImage("spaceship1.gif");
  obstacle2 = loadImage("spaceship2.gif");
  obstacle3 = loadImage("spaceship3.gif");
  obstacle4 = loadImage("spaceship4.gif");
  obstacle5 = loadImage("spaceship5.gif");
  obstacle6 = loadImage("spaceship6.gif");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  bg = loadImage("spaceBG.jpg")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  gameOver = createSprite(width/2,height/2 - 30);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();
  
  edges = createEdgeSprites()

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bg);
  text("Score: "+ score, width/2 - 10,height/2 - 50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space")) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    spawnObstacles();
    

    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    


    //set velcity of each game object to 0
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.length > 0) {
      reset();
      touches = []
    }
  }
  
  minspeed = 0-(8+(score/50));
  maxspeed = 0-(10+(score/45));

  trex.collide(edges)
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 30 === 0) {
    var obstacle = createSprite(width,random(height,100,200,300,400,500,600,0),10,40);
    //obstacle.debug = true;
    obstacle.velocityX = 0-(10+(score/50))

    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.45;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}