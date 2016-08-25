var game = new Phaser.Game(576, 352, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bg', 'assets/bg.png');
	game.load.image('R', 'assets/dummy_R.png');
	game.load.image('G', 'assets/dummy_G.png');
    game.load.image('B', 'assets/dummy_B.png');

}

var playerR;
var playerG;
var playerB;
var players = new Array();
var speed = 1024;

var cursors;
var swipe;
var swiping = false;

var firstPointX;
var firstPointY;
var lastPointX;
var lastPointY;

var checkSwipeX;
var checkSwipeY;

var canMove = false;
var canMoveCount = 3;
var direction;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.image(0, 0, 'bg');
	
	playerR = game.add.sprite(0, 32, 'R');
	playerG = game.add.sprite(32, 32, 'G');
	playerB = game.add.sprite(32,64, 'B');
	
	players[0] = playerR;
	players[1] = playerG;
	players[2] = playerB;
	
	for (var i=0; i < players.length; i++){
		game.physics.enable(players[i], Phaser.Physics.ARCADE);
		players[i].body.collideWorldBounds = true;
		players[i].body.allowRotation = false;
		players[i].body.checkCollision.up = true;
		players[i].body.checkCollision.right = true;
		players[i].body.checkCollision.down = true;
		players[i].body.checkCollision.left = true;
	}

    cursors = game.input.keyboard.createCursorKeys();
	swipe = game.input.mousePointer;
}

function update() {
	
	game.physics.arcade.collide(players[0], players[1], null, null, this);
	game.physics.arcade.collide(players[0], players[2], null, null, this);
	
	game.physics.arcade.collide(players[1], players[2], null, null, this);
	
	game.physics.arcade.collide(players[2], players[0], null, null, this);

	if (canMove) {
		canMove = false;
		
		for (var i=0; i < players.length; i++) {
			if (direction == 0) {
				//up
				players[i].body.velocity.y = -speed;
				players[i].body.velocity.x = 0;
				
			} else if (direction == 1) {
				//right
				players[i].body.velocity.x = speed;
				players[i].body.velocity.y = 0;
				
			} else if (direction == 2) {
				//down
				players[i].body.velocity.y = speed;
				players[i].body.velocity.x = 0;
				
			} else if (direction == 3) {
				//left
				players[i].body.velocity.x = -speed;
				players[i].body.velocity.y = 0;
			}
		}
	}
	
	/*
	for (var i=0; i < players.length; i++) {
		if(players[i].body.right >= 576 || players[i].body.right <= 0) { players[i].body.velocity.x = 0; }
		else if(players[i].body.up >= 352 || players[i].body.down <= 0) { players[i].body.velocity.y = 0; }
	}

	*/
	for (var i=0; i < players.length; i++) {
	
		if(canMove) {
			canMove = false;
			if (cursors.left.isDown){ players[i].body.velocity.x = -speed; }
			if (cursors.right.isDown){ players[i].body.velocity.x = speed; }
			if (cursors.up.isDown){ players[i].body.velocity.y = -speed;; }
			if (cursors.down.isDown){ players[i].body.velocity.y = speed; }
		
		}
	}
	
	
	onSwipe();
	if (swiping){
		swiping = false;
		if(firstPointX > lastPointX){
		
			checkSwipeX = firstPointX - lastPointX;
			
			if ( checkSwipeX >= 150 ) {
				canMove = true;
				direction = 3;
			}
			
		} else if(firstPointX < lastPointX){
		
			checkSwipeX = lastPointX - firstPointX;
			
			if ( checkSwipeX >= 150 ) {
				canMove = true;
				direction = 1;
			}
		}
		
		if(firstPointY > lastPointY){
		
			checkSwipeY = firstPointY - lastPointY;
			
			if ( checkSwipeY >= 150 ) {
				canMove = true;
				direction = 0;
			}
			
		} else if(firstPointY < lastPointY){
		
			checkSwipeY = lastPointY - firstPointY;
			
			if ( checkSwipeY >= 150 ) {
				canMove = true;
				direction = 2;
			}
		}
	}
	
	// object1, object2, collideCallback, processCallback, callbackContext
}

// 1st parameter determines the distance of the active pointer. My swipe distance trashhold is 150, you can play around with this value
// in order to get a better feeling.
// So basicly what you do is look for a certain distance (150) in a given time frame (min 100ms till 250ms).


function onSwipe() {
	if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 && game.input.activePointer.duration > 100 && game.input.activePointer.duration < 250)
	{
		firstPointX = game.input.activePointer.positionDown.x;
		firstPointY = game.input.activePointer.positionDown.y;
		
		lastPointX = game.input.activePointer.position.x;
		lastPointY = game.input.activePointer.position.y;
		
		swiping = true;
	}
}

function collisionHandler (obj1, obj2) {

    //  The two sprites are colliding
	obj1.body.velocity.x = obj1.body.velocity.y = 0;
	obj2.body.velocity.x = obj2.body.velocity.y = 0;

}