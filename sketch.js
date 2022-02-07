var PLAY = 1;
var END = 0;
var gameState = PLAY;

var perry, perry_running, perry_collided;
var ground, invisibleGround, groundImage;
var runner_boy

var backgroundImg

var obstaclesGroup, obstacle1

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  perry_running = loadAnimation("1.png","2.png","3.png","4.png","5.png");
  perry_collided = loadAnimation("perry_collided.png");
  
  runner_boy = loadAnimation("runner.png","runner2.png","runner3.png","runner4.png","runner5.png","runner6.png","runner7.png","runner8.png",)

  backgroundImg = loadImage("valley.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  

  obstacle1 = loadImage("rock.jpg")
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  
  
perry = createSprite(550,160,20,50);
perry.addAnimation("running", perry_running);
perry.addAnimation("collided", perry_collided);
  

perry.scale = 0.5;
obstacle1.scale = 0.5
runner_boy.scale = 0.5

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //I need some help with the background image I haven't quite remembered how to 
  // use a background image i'm a bit confused. 
backgroundImg = createSprite(300,100,600,200)

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
perry.setCollider("rectangle",0,0,perry.width,perry.height);
perry.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
   
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&&runner_boy.y >= 161) {
      runner_boy.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
  runner_boy.velocityY =runner_boy.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouchingrunner_boy){
        runner_boy.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change theperry animation
    perry.changeAnimation("collided", perry_collided);
    
     
     
      ground.velocityX = 0;
    perry.velocityY = 0
    runner_boy.velocityY = 0
      if(mousePressedOver(restart)) {
        reset();
      }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop perry from falling down
perry.collide(invisibleGround);
runner_boy.collide(invisibleGround)
  //console.log(getFrameRate(),frameCount)
 


  drawSprites();
}

function reset(){
gameState=PLAY  
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
score=0,perry.changeAnimation("running",perry_running);
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth =perry.depth;
  perry.depth =perry.depth + 1;
  cloud.depth = runner_boy.depth  
  runner_boy.depth = runner_boy.depth + 1;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

