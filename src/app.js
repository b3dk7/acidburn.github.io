

var game = new Phaser.Game(800, 450, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });




function preload() {
  //game.load.image('sky', 'asset/sky.png');
  game.load.spritesheet('dude', 'asset/njama.png', 32, 32);
  game.load.image('ground', 'asset/platform.png');
  game.load.image('drop', 'asset/drop.png');
  game.load.image('coat', 'asset/coat.png');
  game.load.image('pool', 'asset/acidpool.png');
  game.load.image('dash', 'asset/dash.png');
  game.load.audio('bounce', 'asset/bounce.ogg');
  game.load.audio('burn', 'asset/burn.ogg');
  game.load.audio('dashsound', 'asset/dashsound.ogg');
  
}
var player;
var platforms;
var clicks = -1;
var pointstext;

//var conditiontext;
var drops;
var dash;
var pool;
var controls;

var bounce;
var dashsound;
var burn;
var menuGroup;
var gameOverGroup;
var wallet=0;

var highScore=0;
var previousScore=0;




function create(){
    
  game.paused=true;


  //home screen
  menuGroup = game.add.group();
  
  //game over screen
  gameOverGroup = game.add.group();
  
  createMenu();

  


  //scaling options  SHOW_ALL or EXACT_FIT
  game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  //have the game centered horizontally 
  game.scale.pageAlignHorizontally = true; 
  game.scale.pageAlignVertically = true;
  //screen size will be set automatically 
  game.scale.setScreenSize(true);
  
  // physice
  game.physics.startSystem(Phaser.Physics.ARCADE);

  
  game.stage.backgroundColor = '#87d3ec';
  
  //set up dash group
  dash = game.add.group();
  dash.enableBody = true;
  
  
  
  //set up drops group
  drops = game.add.group();
  drops.enableBody = true;
  
  //setting up pool
  pool = game.add.sprite(-800, 440, 'pool');
  game.physics.arcade.enable(pool);
  
  // the platforms group
  platforms = game.add.group();
  // give objects physics
  platforms.enableBody = true;

  //platforms
  //var ledge = platforms.create(400, 400, 'ground');
  var ledge = platforms.create(344, 430, 'ground');
  ledge.body.immovable = true;
  
  



  

  //mouse controls
  game.input.onDown.add(gameControl);
  

  pointstext = game.add.text(16, 16, '', { fill: '#ffffff' });

  
  bounce = game.add.audio('bounce');
  dashsound = game.add.audio('dashsound');
  burn = game.add.audio('burn');
  //game.sound.setDecodedCallback([ bounce, burn ], start, this);
  
  
}
function update() {


  //collisions  
  game.physics.arcade.collide(player, platforms, platformImpact);


  game.physics.arcade.overlap(player, drops, acidCollision);
  game.physics.arcade.overlap(player, pool, acidCollision);
  game.physics.arcade.overlap(player, dash, dashCollection, null, this);
  //game.physics.arcade.overlap(player, pool, acidCollision);
  

  pointstext.text = 'Dash: '+wallet;
  
}



function platformImpact(){
  

    bounce.play();

}


function acidCollision(){
  //write score
  //addToFile('hs');

  previousScore = wallet;
  
  
  
  burn.play();
  //conditiontext.text = "oh my God, acidburn!!";
  //game.input.onDown.removeAll();
  player.animations.play('burned');



  gameOver();
}

function dashCollection(player,dashi){
  dashi.kill();
  dashsound.play();
  wallet++;
}

function gameControl() {  

  if(clicks==-1){
    
    wallet=0;
    
    //resetting acid drops
    drops.destroy();
    drops = game.add.group();
    drops.enableBody = true;  
    
    
    //resetting dash
    dash.destroy();
    dash = game.add.group();
    dash.enableBody = true;  
    
    //resetting player
    player = game.add.sprite((game.world.width*0.5)-16, 80, 'dude');
    
    //player physics
    game.physics.arcade.enable(player);
    player.body.bounce.y = 1.007;
    player.body.gravity.y = 350;

    //player animations

    player.animations.add('left', [1]);
    player.animations.add('right', [2]);
    player.animations.add('burned', [3]);
    player.animations.add('moosch', [4]);
    player.animations.add('normal', [0]);
	
    game.paused=false;
    clicks++;
    menuGroup.destroy();
    menuGroup = game.add.group();
    gameOverGroup.destroy();
    gameOverGroup = game.add.group();

    //creating the first drop
    var drop = drops.create(390, -32, 'drop');
    drop.body.gravity.y = 100;
      
    return;
  }
  
  
  if(player.body.velocity.x>0){
    player.body.velocity.x = -300;
    player.animations.play('left');
  }
  else{
    player.body.velocity.x = 300;
    player.animations.play('right');
  }
  
  clicks++;
  
  
  for (i = 0; i < clicks/20; i++) {
    aciddop();
    
  }

  var dashi = dash.create(Math.random()*800, -32-(Math.random()*50), 'dash');
  dashi.body.gravity.y = 100;

  
  
}
  
function aciddop(){
  
  var drop = drops.create(Math.random()*800, -32-(Math.random()*50), 'drop');
  
  
  //game.physics.arcade.enable(drop);
  drop.body.gravity.y = 100;
  
}

function createMenu(){
  
  var menueWelcome = game.add.text(10, 50, 'Welcome to Acid Burn!', { fill: '#086300'}, menuGroup);
  var menu1Player = game.add.text(10, 100, 'Click anywhere to start the game', { fill: '#ffffff' },menuGroup);
  //var menuHighScore = game.add.text(200, 200, 'High Score', { fill: '#ffffff' },menuGroup);
  
  instructions();

  
}

function gameOver(){
  
  
  
  game.input.onDown.removeAll();

  //pointstext.destroy();
  var ab = game.add.text(200, 50, 'Oh my God, acidburn!!', { fill: '#c80000' }, gameOverGroup);
  var sc = game.add.text(200, 100, 'You scored: ' +wallet+' Dash', { fill: '#1c75bc' }, gameOverGroup);

  
  game.time.events.add(Phaser.Timer.SECOND * 1, delayGame, this);
  
  
  instructions();
  clicks=-1;

}


function delayGame(){
  
  var ins = game.add.text(200, 150, 'Click anywhere to restart the game', { fill: '#ffffff' }, gameOverGroup);
  
  game.input.onDown.add(gameControl);
  
  
  


}




function instructions(){
  var menuTip = game.add.text(10, 200, 'To move the alien around, simply tap the screen', { fill: '#ffffff' },menuGroup);
  var menuTip = game.add.text(10, 250, 'Collect the blue dash coins and avoid the green acid drops', { fill: '#ffffff' },menuGroup);
  var menuTip = game.add.text(10, 300, 'Bounce off the trampoleen and avoid the acid below', { fill: '#ffffff' },menuGroup);
  var source = game.add.text(10, 350, 'To check out the source code or and find out more visit', { fill: '#ffffff' },menuGroup);
  var source = game.add.text(10, 400, 'https://github.com/b3dk7/BouncyCastle', { fill: '#a23ca3' },menuGroup);

}


function setHighScore(){
  if(wallet>highScore)
    highScore = wallet;
    
}