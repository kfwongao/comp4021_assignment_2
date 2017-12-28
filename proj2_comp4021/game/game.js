//Source code downloaded from GitHub-Alex Poon who distributed the open scource code
//link of the open source website: https://github.com/chpoon92/platform-game-svg
//Modified by WONG Kin Fat
//To let you know where I modified the code, see readme.txt or README.md

// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
//Check the intersections of the area embeded by the four edge of the rectangles by compare with the
//coordinates of the four vertex
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
//@attributes: name, node, position, motion, verticalSpeed, currentFace
function Player() {
	this.name = name;
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
    this.currentFace = motionType.RIGHT;
}

//Debugging helper getter setter functions
Player.prototype.setName = function(name) {
    this.name = name;
}
Player.prototype.getName = function() {
    return name;
}

//add a new function in the class Player
Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        //check wheather player is on the platform
        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

//add another function to the class Player
Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
var BULLET_MAX_NUMBER = 8;                  // The maximum number of bullets

var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var GOOD_THING_SIZE = new Size(30, 30);
var EXIT_SIZE = new Size(70, 90);
var PORTAL_SIZE = new Size(40, 80);

var INITIAL_TIME = 60;
var TIMER_BAR_WIDTH = 140;

//Map
        var GAME_MAP = new Array(
        "                              ",
        "                              ",
        "###                           ",
        "  #                           ",
        "  #######       #####         ",
        "                              ",
        "                             #",
        "                            ##",
        "#                          ###",
        "#                             ",
        "####                          ",
        "            #                 ",
        "           ###                ",
        "          #####               ",
        "      #####   ##              ",
        "##            ###  #          ",
        "###             #  ###        ",
        "######          #  ######     ",
        "#####      #                 #",
        "         ####               ##",
        "        ######             ###",
        "       #####          #  ###  ",
        "##                 ###        ",
        "###          #                ",
        "####   #    ###          #    ",
        "                              ",
        "                              ",
        "##############################"
        );
//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2, UP:3, DOWN:4}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // defult zoom
var score = 0;
var level = 0;
var isCheatMode = false;
var isZoomMode = false;
var isInPortal = false;
var name = "Anonymous";
var nameTag = null;
var timeRemaining = 0;
var timeRemainingTimer = null;
var maxStageTime = 0;
var disappearingPlatform1 = null;
var disappearingPlatform2 = null;
var disappearingPlatform3 = null;
var movingVerticalPlatform = null;
var isVerticalPlatformMovingUp = true;
var monsterBullet = 0;

var bgSound = new Audio("background.wav");
bgSound.loop = true;
var monsterSound = new Audio("monster.wav");
var shootSound = new Audio("shoot.wav");
var passSound = new Audio("pass.wav");
var gameOverSound = new Audio("lose.mp3");


//
// The load function for the SVG document
//
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;
    movingVerticalPlatform = svgdoc.getElementById("movingVerticalPlatform");

    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);
    
    bgSound.play();
}

//
//This function restarts the game
//

function restart(isZoom) {

	// Remove objects
    cleanUpGroup("player_name", false);
    cleanUpGroup("monsters", false);
    cleanUpGroup("bullets", false);
    cleanUpGroup("highscoretext", false);
    
	svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
	initializeGame(isZoom);
}

//
// This function initializes the game
//
function initializeGame(isZoom) {
	// Setup the player name
	name = prompt("What is your name?", name);
	if(name == null) {
		name = "Anonymous";
	}
	
	// Hide the main page
	svgdoc.getElementById("mainPage").style.setProperty("visibility", "hidden", null);
	
    // Setup the game
    isCheatMode = false;
    isZoomMode = isZoom;
    if(isZoomMode)
    	zoom = 2.0;
    level = 0;
    score = 0;
    timeRemaining = 0;
    
    // Create the exit door
    createExitDoor();
    
    // Initialize a stage
    initializeStage();
}

//
// This function initializes a stage
//

function initializeStage() {
    //create platform
    //createPlatforms();

    // Remove timers
    clearInterval(gameInterval);
    clearInterval(timeRemainingTimer);
    
    // Remove previous monsters or bullets
    cleanUpGroup("player_name", false);
    cleanUpGroup("monsters", false);
    cleanUpGroup("bullets", false);
	
	// Create the player
    player = new Player();
    
    // Display the player name
    svgdoc.getElementById("name_value").firstChild.data = name;
    nameTag = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    nameTag.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#name");
    svgdoc.getElementById("player_name").appendChild(nameTag);
    nameTag.setAttribute("x", player.position.x);
    nameTag.setAttribute("y", player.position.y - 5);
    
    // Setup the game
	level++;
	isInPortal = false;
	timeRemaining += INITIAL_TIME;
	maxStageTime = timeRemaining;
    player.bullet = BULLET_MAX_NUMBER;
    svgdoc.getElementById("score").firstChild.data = score;
    svgdoc.getElementById("level").firstChild.data = level;
    svgdoc.getElementById("bulletNum").firstChild.data = player.bullet;
    monsterBullet = 1;

    // Create the monsters
    createMonster();

    // Create the good things
    createGoodThing();
    


    // Create disappearing platforms
    createDisappearingPlatforms();
    
    // Initialize moving vertical platform
    movingVerticalPlatform.setAttribute("y", 300);
    isVerticalPlatformMovingUp = true;
    
    // Start the timer
    timeRemainingTimer = setInterval("timing()", 1000);
    
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}

//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}

//
// This function displays time remaining
//

function timing() {
	timeRemaining--;
	svgdoc.getElementById("time_remaining").firstChild.data = timeRemaining + "s";
	svgdoc.getElementById("time_remaining_bar").setAttribute("width", Math.floor(timeRemaining / maxStageTime * TIMER_BAR_WIDTH))
	if(timeRemaining <= 0)
		gameOver();
}

//
// This function sets up the screen for game over
//

function gameOver() {
	gameOverSound.load();
	gameOverSound.play();
	zoom = 1.0;
	clearInterval(gameInterval);
	clearInterval(timeRemainingTimer);
    // prevent zoom in mode when displaying the high score table 
    //which is a bug in Alex Poon version if ommit this line of code
    updateScreen();
    
	table = getHighScoreTable();

	name = player.name;
	var record = new ScoreRecord(player.name, score);

	var pos = table.length;
	for (var i = 0; i < table.length; i++) {
		if (record.score > table[i].score) {
			pos = i;
			break;
		}
	}
	table.splice(pos, 0, record);

	setHighScoreTable(table);
	showHighScoreTable(table);
}
//This function creates the platforms
/*function createPlatforms() {
    var platforms = svgdoc.getElementById("platforms");

    for(y = 0; y < GAME_MAP.length; y++) {
        var start = null, end = null;

        for(x = 0; x < GAME_MAP[y].length; x++) {
            if (start == null && GAME_MAP[y].charAt(x) == '#')
                start = x;
            if(start != null && GAME_MAP[y].charAt(x) == ' ')
                end = x - 1;
            if(start != null && x == (GAME_MAP[y].length - 1))
                end = x;

            if(start != null && end != null) {
                var platform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");

                platform.setAttribute("x", start*20);
                platform.setAttribute("y", y*20);
                platform.setAttribute("width", (end - start + 1)*20);
                platform.setAttribute("heigth", 20);
                platform.setAttribute("style", "fill: black");

                platforms.appendChild(platform);
                start = end = null;
            }

        }
    }
}*/


//
// This function creates the monsters in the game
//
function createMonster() {
	var i = 0;
	var platforms = svgdoc.getElementById("platforms");
	var hasCollision = false;
	while(i < 2 + level * 4){
		// player is initialized at the bottom left conner,
        // set the range to make the monster at least 100px to the right of the player
        var a = Math.floor(Math.random() * 480)+100; // [100,580)
		var b = Math.floor(Math.random() * 300);     // [0,300)
		var hasCollision = false;
	    for (var j = 0; j < platforms.childNodes.length; j++) {
	        var node = platforms.childNodes.item(j);
	        if (node.nodeName != "rect") continue;

	        var x = parseInt(node.getAttribute("x"));
	        var y = parseInt(node.getAttribute("y"));
	        var w = parseInt(node.getAttribute("width"));
	        var h = parseInt(node.getAttribute("height"));
	        var pos = new Point(x, y);
	        var size = new Size(w, h);
	        if (intersect(new Point(a,b), MONSTER_SIZE, pos, size)) {
	        	hasCollision = true;
	        }
	    }
	    if(a + MONSTER_SIZE.w > SCREEN_SIZE.w)
	    	hasCollision = true;
	    if(!hasCollision) {
	    	var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
			monster.setAttribute("x", a);
			monster.setAttribute("y", b);
	        var random_type = Math.floor(Math.random() * 100) % 2;
	        if(random_type == 0){
	            monster.setAttribute("type", "left");
	        }
	        else{
	            monster.setAttribute("type", "right");
	        }
		
			if(i == 2 + level * 4 - 1) {
				monster.setAttribute("boss", 0);
				monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#special_monster");
			}
			else {
				monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
			}
			svgdoc.getElementById("monsters").appendChild(monster);
			i++;
	    }
	}
}

//
//This function creates the good things in the game
//

function createGoodThing() {
	var i = 0;
	var platforms = svgdoc.getElementById("platforms");
	var hasCollision = false;
	while(i < 8){
		var a = Math.floor(Math.random() * 520)+40; // change to [20,580)
		var b = Math.floor(Math.random() * 460)+40; // change to [20,520)  avoid collide with the floor
		var hasCollision = false;
	    for (var j = 0; j < platforms.childNodes.length; j++) {
	        var node = platforms.childNodes.item(j);
	        if (node.nodeName != "rect") continue;

	        var x = parseInt(node.getAttribute("x"));
	        var y = parseInt(node.getAttribute("y"));
	        var w = parseInt(node.getAttribute("width"));
	        var h = parseInt(node.getAttribute("height"));
	        var pos = new Point(x, y);
	        var size = new Size(w, h);
	        if (intersect(new Point(a,b), GOOD_THING_SIZE, pos, size)) {
	        	hasCollision = true;
	        }
	    }
	    if(!hasCollision) {
	    	var goodThing = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	    	goodThing.setAttribute("x", a);
	    	goodThing.setAttribute("y", b);
	    	goodThing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#good_thing");
	    	svgdoc.getElementById("good_things").appendChild(goodThing);
	    	i++;
	    }
	}
}

//
// This function creates the exit door in the game
//

function createExitDoor() {
	var exit = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	exit.setAttribute("x", 20);
	exit.setAttribute("y", 15);
	exit.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#exit");
	svgdoc.getElementById("exit_door").appendChild(exit);
}

//
// This function creates the disappearing platforms in the game
//

function createDisappearingPlatforms() {
	disappearingPlatform1 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
	disappearingPlatform1.setAttribute("x", 180);
	disappearingPlatform1.setAttribute("y", 100);
	disappearingPlatform1.setAttribute("width", 80);
	disappearingPlatform1.setAttribute("height", 20);
    disappearingPlatform1.setAttribute("type", "disappearing");
	disappearingPlatform1.setAttribute("style", "fill:grey; fill-opacity:1");
    svgdoc.getElementById("platforms").appendChild(disappearingPlatform1);
	
	disappearingPlatform2 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
	disappearingPlatform2.setAttribute("x", 80);
	disappearingPlatform2.setAttribute("y", 220);
	disappearingPlatform2.setAttribute("width", 80);
	disappearingPlatform2.setAttribute("height", 20);
    disappearingPlatform2.setAttribute("type", "disappearing");
	disappearingPlatform2.setAttribute("style", "fill:grey; fill-opacity:1");
    svgdoc.getElementById("platforms").appendChild(disappearingPlatform2);
	
	disappearingPlatform3 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
	disappearingPlatform3.setAttribute("x", 280);
	disappearingPlatform3.setAttribute("y", 420);
	disappearingPlatform3.setAttribute("width", 80);
	disappearingPlatform3.setAttribute("height", 20);
    disappearingPlatform3.setAttribute("type", "disappearing");
	disappearingPlatform3.setAttribute("style", "fill:grey; fill-opacity:1");
    svgdoc.getElementById("platforms").appendChild(disappearingPlatform3);
}

//
// This function shoots a bullet from the player
//
function shootBullet() {
	if(!isCheatMode) {
		if(player.bullet <= 0)
			return;
		player.bullet--;
		svgdoc.getElementById("bulletNum").firstChild.data = player.bullet;
		// Setup shoot sound TODO:
	}
	
	shootSound.load();
	shootSound.play();
	
    // Disable shooting for a short period of time
    canShoot = false;
   setTimeout("canShoot = true", SHOOT_INTERVAL);

    // Create the bullet using the use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    if(player.currentFace == motionType.RIGHT)
    	bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    else
    	bullet.setAttribute("x", player.position.x - PLAYER_SIZE.w / 2 + BULLET_SIZE.w / 2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
    bullet.setAttribute("direction", player.currentFace);
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    svgdoc.getElementById("bullets").appendChild(bullet);
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            player.motion = motionType.LEFT;
            player.currentFace = motionType.LEFT;
            break;

        case "D".charCodeAt(0):
            player.motion = motionType.RIGHT;
            player.currentFace = motionType.RIGHT;
            break;

        case "W".charCodeAt(0):
        if(!isCheatMode){
            if (player.isOnPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            }
        }else{
            // if player is on cheat mode, it can jump regardless of the platform
            player.verticalSpeed = JUMP_SPEED;
        }
            break;

        case 32:
            if (canShoot) shootBullet();
            break;

        case "C".charCodeAt(0):
            //cheat mode on
        	isCheatMode = true;
            //set player opacity = 0.5
            svgdoc.getElementById("player").style.setProperty("opacity", 0.5, null);
            break;

        case "V".charCodeAt(0):
            //cheat mode off
        	isCheatMode = false;
            //set player opacity = 1
            svgdoc.getElementById("player").style.setProperty("opacity", 1, null);
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    var monsters = svgdoc.getElementById("monsters");
    if(!isCheatMode) {
    	for (var i = 0; i < monsters.childNodes.length; i++) {
    		var monster = monsters.childNodes.item(i);
    		var x = parseInt(monster.getAttribute("x"));
    		var y = parseInt(monster.getAttribute("y"));

    		if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
    			gameOver();
    			return;
    		}
    	}
    }

    // Check whether the player collects a good thing
    var goodThings = svgdoc.getElementById("good_things");
    for (var i = 0; i < goodThings.childNodes.length; i++) {
    	var goodThing = goodThings.childNodes.item(i);
    	var x = parseInt(goodThing.getAttribute("x"));
    	var y = parseInt(goodThing.getAttribute("y"));

    	if (intersect(new Point(x, y), GOOD_THING_SIZE, player.position, PLAYER_SIZE)) {
    		goodThings.removeChild(goodThing);
    		i--;
    		if(isZoomMode) {
            	score += 20;
        	}
            else
            	score += 10;
            svgdoc.getElementById("score").firstChild.data = score;
    	}
    }
    
    // Check whether the player is in portal
    var portal1 = svgdoc.getElementById("portal1");
    var portal2 = svgdoc.getElementById("portal2");
    var x1 = parseInt(portal1.getAttribute("x"));
    var y1 = parseInt(portal1.getAttribute("y"));
    var x2 = parseInt(portal2.getAttribute("x"));
    var y2 = parseInt(portal2.getAttribute("y"));

    	if (intersect(new Point(x1, y1), PORTAL_SIZE, player.position, PLAYER_SIZE) && !isInPortal) {
    		player.position.x = 300;
    		player.position.y = 60;
    		isInPortal = true;
    		setTimeout(function(){isInPortal = false;}, 2000);
    	}
    	if (intersect(new Point(x2, y2), PORTAL_SIZE, player.position, PLAYER_SIZE) && !isInPortal) {
    		player.position.x = 40
    		player.position.y = 180;
    		isInPortal = true;
    		setTimeout(function(){isInPortal = false;}, 2000);
    	}
    
    // Check whether the player can go to next stage
    var exits = svgdoc.getElementById("exit_door");
    for(var i = 0; i < exits.childNodes.length; ++i){
        var exit = exits.childNodes.item(i);
        var x = parseInt(exit.getAttribute("x"));
        var y = parseInt(exit.getAttribute("y"));
        if(intersect(new Point(x, y), EXIT_SIZE, player.position, PLAYER_SIZE) && goodThings.childNodes.length == 0) {
        	passSound.load();
        	passSound.play();
        	if(isZoomMode)
        		score = score + level * 100 + timeRemaining * 2;
        	else
        		score = score + level * 100 + timeRemaining;
            svgdoc.getElementById("score").firstChild.data = score;
            initializeStage();
            return;   
        }
    }
    
    // Check whether the player is on the disappearing platforms
    if(disappearingPlatform1 != null && (player.position.x + PLAYER_SIZE.w > 180 && player.position.x + PLAYER_SIZE.w < 260) && (player.position.y + PLAYER_SIZE.h == 100)) {
    	disappearPlatform(disappearingPlatform1);
    	disappearingPlatform1 = null;
    }
    if(disappearingPlatform2 != null && (player.position.x + PLAYER_SIZE.w > 80 && player.position.x + PLAYER_SIZE.w < 160) && (player.position.y + PLAYER_SIZE.h == 220)) {
    	disappearPlatform(disappearingPlatform2);
    	disappearingPlatform2 = null;
    }
    if(disappearingPlatform3 != null && (player.position.x + PLAYER_SIZE.w > 280 && player.position.x + PLAYER_SIZE.w < 360) && (player.position.y + PLAYER_SIZE.h == 420)) {
    	disappearPlatform(disappearingPlatform3);
    	disappearingPlatform3 = null;
    }
    
    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
            	monsterSound.load();
                monsterSound.play();
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;

                if(isZoomMode) {
                	score += 30;
            	}
                else
                	score += 10;
                svgdoc.getElementById("score").firstChild.data = score;
            }
        }
    }
}

function disappearPlatform(disappearingPlatform) {
	var animate = svgdoc.createElementNS("http://www.w3.org/2000/svg", "animateColor");
	animate.setAttribute("attributeName", "opacity");
	animate.setAttribute("attributeType", "CSS");
	animate.setAttribute("from", "1");
	animate.setAttribute("to", "0");
	animate.setAttribute("begin", "0s");
	animate.setAttribute("dur", "0.5s");
	animate.setAttribute("fill", "freeze");
    disappearingPlatform.appendChild(animate);
	setTimeout(function(){disappearingPlatform.style.setAttribute("fill-opacity", disappearingPlatform.style.getAttribute("fill-opacity") - 0.1);}, 50);
	setTimeout(function(){disappearingPlatform.parentNode.removeChild(disappearingPlatform);}, 500);
}

//
//This function updates the position of the monsters
// Note: as the level increase, the no. of monsters increase and it make the game having some delay and LAG
//
function moveMonsters() {
	var monsters = svgdoc.getElementById("monsters");
    for(var i = 0; i < monsters.childNodes.length; ++i){
        var monster = monsters.childNodes.item(i);
        
        var oldPosition = new Point(parseFloat(monster.getAttribute("x")), parseFloat(monster.getAttribute("y")));
        var newPosition = new Point(parseFloat(monster.getAttribute("x")), parseFloat(monster.getAttribute("y")));
        
        if(monster.getAttribute("boss") == 0) {
        	if(player.position.y > parseFloat(monster.getAttribute("y")) && player.position.y < parseFloat(monster.getAttribute("y")) + MONSTER_SIZE.h){
        		monsterShoot(monster);
        	}
        }
        
        if(monsterIsOnPlatform(monster)){
            if(monster.getAttribute("type") == "left"){
                newPosition.x -= 1;
            }
            if(monster.getAttribute("type") == "right"){
                newPosition.x += 1;
            }
            monsterCollidePlatform(monster, newPosition);
            if(newPosition.x == oldPosition.x){
                if(monster.getAttribute("type") == "left"){
                    monster.setAttribute("type", "leftup");
                }
                if(monster.getAttribute("type") == "right"){
                    monster.setAttribute("type", "rightup");
                }
                
                newPosition.y -= 1;
                monsterCollidePlatform(monster, newPosition);
                if(newPosition.y == oldPosition.y){
                    if(monster.getAttribute("type") == "left"){
                        monster.setAttribute("type", "right");
                     }
                    if(monster.getAttribute("type") == "right"){
                        monster.setAttribute("type", "left");
                    }
                }
                else monster.setAttribute("y", newPosition.y);
            }
            else if(newPosition.x < 0){
                monster.setAttribute("type", "right");
            }
            else if(newPosition.x + MONSTER_SIZE.w > SCREEN_SIZE.w){
                monster.setAttribute("type", "left");
            }
            else monster.setAttribute("x", newPosition.x);
        }
        else{
            if(monster.getAttribute("type") == "leftup"){
                newPosition.x -= 1;
                monsterCollidePlatform(monster, newPosition);
                if(newPosition.x == oldPosition.x){
                    newPosition.y -= 1;
                    monsterCollidePlatform(monster, newPosition);
                    if(newPosition.y == oldPosition.y){
                        monster.setAttribute("type", "right");
                    }
                    else monster.setAttribute("y", newPosition.y);
                }
                else{
                    monster.setAttribute("x", newPosition.x);
                    monster.setAttribute("type", "left");
                }
            }
            else if(monster.getAttribute("type") == "rightup"){
                newPosition.x += 1;
                monsterCollidePlatform(monster, newPosition);
                if(newPosition.x == oldPosition.x){
                    newPosition.y -= 1;
                    monsterCollidePlatform(monster, newPosition);
                    if(newPosition.y == oldPosition.y){
                        monster.setAttribute("type", "left");
                    }
                    else monster.setAttribute("y", newPosition.y);
                }
                else{
                    monster.setAttribute("x", newPosition.x);
                    monster.setAttribute("type", "right");
                }
            }
            else{
                newPosition.y += 1;
                monster.setAttribute("y", newPosition.y);
            }
        }
    }
}

function monsterShoot(monsterNode) {
	if(monsterBullet <= 0)
		return;
	else {
		monsterBullet--;
		 // Create the bullet using the use node
	    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	    if(player.position.x > monsterNode.getAttribute("x")) {
	    	bullet.setAttribute("x", monsterNode.getAttribute("x") + MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
	    	bullet.setAttribute("direction", motionType.RIGHT);
	    }
	    else {
	    	bullet.setAttribute("x", monsterNode.getAttribute("x") - MONSTER_SIZE.w / 2 + BULLET_SIZE.w / 2);
	    	bullet.setAttribute("direction", motionType.LEFT);
	    }
	    bullet.setAttribute("y", monsterNode.getAttribute("y") + MONSTER_SIZE.h / 2 - BULLET_SIZE.h / 2);
	    bullet.setAttribute("boss", 0);
	    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
	    svgdoc.getElementById("bullets").appendChild(bullet);
	}
}

function monsterIsOnPlatform(monster){
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        
        var position = new Point(parseFloat(monster.getAttribute("x")), parseFloat(monster.getAttribute("y")));
        var type = monster.getAttribute("type");
        
        if (((position.x + MONSTER_SIZE.w > x && position.x < x + w) ||
             ((position.x + MONSTER_SIZE.w) == x && type == "right") ||
             (position.x == (x + w) && type == "left")) &&
            position.y + MONSTER_SIZE.h == y) return true;
    }
    if (position.y + MONSTER_SIZE.h == SCREEN_SIZE.h) return true;
    
    return false;
}

function monsterCollidePlatform(monster,newPosition){
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);
        
        var oldPosition = new Point(parseFloat(monster.getAttribute("x")), parseFloat(monster.getAttribute("y")));
        
        if (intersect(newPosition, MONSTER_SIZE, pos, size)) {
            newPosition.x = oldPosition.x;
            if (intersect(newPosition, MONSTER_SIZE, pos, size)) {
                if (oldPosition.y >= y + h)
                    newPosition.y = y + h;
                else
                    newPosition.y = y - MONSTER_SIZE.h;
            }
        }
    }
}

function collideScreen (position, monsterNode) {
    if (position.x < 0) position.x = 0;
    if (position.x + MONSTER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - MONSTER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        monsterNode.setAttribute("verticalSpeed", 0);
    }
    if (position.y + MONSTER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - MONSTER_SIZE.h;
        monsterNode.setAttribute("verticalSpeed", 0);
    }
}

//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        if(node.getAttribute("direction") == motionType.RIGHT)
            node.setAttribute("x", x + BULLET_SPEED);
        else
        	node.setAttribute("x", x - BULLET_SPEED);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
}

//
// This function moves the vertical platform
//
function moveVerticalPlatform() {
	var y = parseInt(movingVerticalPlatform.getAttribute("y"));
	if(isVerticalPlatformMovingUp) {
		if(y > 100)
			movingVerticalPlatform.setAttribute("y", y - 1);
		else
			isVerticalPlatformMovingUp = false;
	}
	else {
		if(y < 300)
			movingVerticalPlatform.setAttribute("y", y + 1);
		else
			isVerticalPlatformMovingUp = true;
	}
}

//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions
    collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();

    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;
    
    /*var platforms = svgdoc.getElementById("platforms");

    for (var i = 0; i < platforms.childNodes.length; i++) {
         var platform = platforms.childNodes.item(i);
         if (platform.getAttribute("type") == "disappearing") {
            var platformOpacity = parseFloat(platform.style.getPropertyValue("opacity"));
        if(platformOpacity < 0.1)
        {
            platforms.removeChild(platform);
        }else{
            if(Math.sqrt((player.position.x-platform.getAttribute("x"))*(player.position.x-platform.getAttribute("x"))+(player.position.y-platform.getAttribute("y"))*(player.position.y-platform.getAttribute("y")))== 0){
                platformOpacity -= 0.1;
                platform.style.setProperty("opacity", platformOpacity, null);
            }
        }
        
}*/

    // Move the monsters
    moveMonsters();
    
    // Move the bullets
    moveBullets();

    // Move the vertical platform
    moveVerticalPlatform();
    
    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player
	if(player.currentFace == motionType.LEFT){
        player.node.setAttribute("transform", "translate(" + (PLAYER_SIZE.w + player.position.x) + "," +player.position.y+") scale(-1, 1)");
    }
    else{
        var x = player.position.x;
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    }

	// Display player's name
	nameTag.setAttribute("x", player.position.x + 15);
    nameTag.setAttribute("y", player.position.y - 5);
    
    // Calculate the scaling and translation factors	
    var scale = "scale(" + zoom + ", " + zoom + ")";  //scale(2.0, 2.0)

    var tx = (-player.position.x - PLAYER_SIZE.w/2.0)*zoom + SCREEN_SIZE.w/2.0;
    if (tx > 0) 
        tx = 0;
    if (tx < -SCREEN_SIZE.w*zoom + SCREEN_SIZE.w)
        tx = -SCREEN_SIZE.w*zoom + SCREEN_SIZE.w;

    var ty = (-player.position.y - PLAYER_SIZE.h/2.0)*zoom + SCREEN_SIZE.h/2.0;
    if (ty > 0)
        ty = 0;
    if (ty < -SCREEN_SIZE.h*zoom + SCREEN_SIZE.h)
        ty = -SCREEN_SIZE.h*zoom + SCREEN_SIZE.h;

    var translate = "translate(" + tx + ", " + ty +")";

    svgdoc.getElementById("gamearea").setAttribute("transform", translate + scale);
}
