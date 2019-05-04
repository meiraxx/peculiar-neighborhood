import { keyboard } from "./lib/UtilMethods";
import { setTextureOnlyIfNeeded, containSpriteInsideContainer, detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision } from "./lib/PixiUtilMethods";
import UserInterface from './UserInterface';
import * as PIXI from 'pixi.js'

export default class Player {
	static loadResources(app) {
		app.loader.add("assets/character/none/characterFront.png");
		app.loader.add("assets/character/none/characterBack.png");
		app.loader.add("assets/character/none/characterRight.png");
		app.loader.add("assets/character/none/characterLeft.png");
		app.loader.add("assets/character/bat/characterFront.png");
		app.loader.add("assets/character/bat/characterBack.png");
		app.loader.add("assets/character/bat/characterRight.png");
		app.loader.add("assets/character/bat/characterLeft.png");
		app.loader.add("assets/character/pistol/characterFront.png");
		app.loader.add("assets/character/pistol/characterBack.png");
		app.loader.add("assets/character/pistol/characterRight.png");
		app.loader.add("assets/character/pistol/characterLeft.png");
		app.loader.add("assets/character/netgun/characterFront.png");
		app.loader.add("assets/character/netgun/characterBack.png");
		app.loader.add("assets/character/netgun/characterRight.png");
		app.loader.add("assets/character/netgun/characterLeft.png");
		UserInterface.loadResources(app);
	}

	constructor(app, viewport) {
		this.app = app;
		this.viewport = viewport;
		this.ui = new UserInterface(app);
		this.activeMissile = undefined;
	}
	
	prepareObject(x_pos, y_pos) {
		// SETUP player
		let playerFrontTexture = this.app.loader.resources["assets/character/none/characterFront.png"].texture;
		let playerBackTexture = this.app.loader.resources["assets/character/none/characterBack.png"].texture;
		let playerRightTexture = this.app.loader.resources["assets/character/none/characterRight.png"].texture;
		let playerLeftTexture = this.app.loader.resources["assets/character/none/characterLeft.png"].texture;
		this.command = "down";
		
		this.playerSprite = new PIXI.Sprite(playerFrontTexture);
		this.playerSprite.scale.x = 0.20;
		this.playerSprite.scale.y = 0.20;
		this.playerSprite.x = Math.round(x_pos - (this.playerSprite.width/2));
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
		this.playerSprite.yForZOrdering = this.playerSprite.y + this.playerSprite.height ;
 		this.playerSprite.name = "player";
 		this.playerSprite.velocity = 3;
 		this.isGrabbing = false;
 		this.grabbedMonster = undefined;
 		this.grabbedMonstersList = [];

		// SETUP player UI
		this.ui.prepareObject(x_pos, y_pos);

		// KEY STROKE EVENTS
		//this.leftKey = keyboard("ArrowLeft");
		//this.rightKey = keyboard("ArrowRight");
		//this.downKey = keyboard("ArrowDown");
		//this.upKey = keyboard("ArrowUp");
		this.leftKey = keyboard("a");
		this.rightKey = keyboard("d");
		this.downKey = keyboard("s");
		this.upKey = keyboard("w");

		this.zeroKey = keyboard("0");
		this.oneKey = keyboard("1");
		this.twoKey = keyboard("2");
		this.threeKey = keyboard("3");
		this.f1Key = keyboard("F1");
		this.f2Key = keyboard("F2");
		this.f3Key = keyboard("F3");

		this.fKey = keyboard("f");

		this.pKey = keyboard("p");
		this.escKey = keyboard("Escape");

		// left, right, down, up
		//this.commandArray = [false, false, false, false];

		// MOVEMENT KEYS
		// note: comment second conditions and movement resets on key press to obtain diagonal movements,
		// but beware it's going to be a twice-as-fast movement, so there needs to be code to divide
		// the speed by half on certain conditions
		this.leftKey.press = () => {
			if (!this.ui.isPaused()) {
				this.command = "left";
				this.playerSprite.vx = -this.playerSprite.velocity;
				this.playerSprite.vy = 0;
				this.updatePlayerSprite();
			}
		};
		this.leftKey.release = () => {
			if (!this.rightKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.rightKey.press = () => {
			if (!this.ui.isPaused()) {
				this.command = "right";
				this.playerSprite.vx = this.playerSprite.velocity;
				this.playerSprite.vy = 0;
				this.updatePlayerSprite();
			}
		};
		this.rightKey.release = () => {
			if (!this.leftKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.downKey.press = () => {
			if (!this.ui.isPaused()) {
				this.command = "down";
				this.playerSprite.vx = 0;
				this.playerSprite.vy = this.playerSprite.velocity;
				this.updatePlayerSprite();
			}
		};
		this.downKey.release = () => {
			if (!this.upKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		this.upKey.press = () => {
			if (!this.ui.isPaused()) {
				this.command = "up";
				this.playerSprite.vx = 0;
				this.playerSprite.vy = -this.playerSprite.velocity;
				this.updatePlayerSprite();
			}
		};
		this.upKey.release = () => {
			if (!this.downKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		// UI KEYS
		// zIndex: https://github.com/pixijs/pixi.js/issues/300
		this.zeroKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("none");
				this.ui.crosshair.sprite.visible = false;
				this.updatePlayerSprite();
			}
		};
		this.zeroKey.release = () => {
		};

		this.oneKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("bat");
				this.ui.crosshair.sprite.visible = false;
				this.updatePlayerSprite();
			}
		};
		this.oneKey.release = () => {
		};

		this.twoKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("pistol");
				this.ui.crosshair.sprite.visible = true;
				this.updatePlayerSprite();
			}
		};
		this.twoKey.release = () => {
		};

		this.threeKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("netgun");
				this.ui.crosshair.sprite.visible = true;
				this.updatePlayerSprite();
			}
		};
		this.threeKey.release = () => {
		};

		this.f1Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardBatInfo");
			}
		};
		this.f1Key.release = () => {
		};

		this.f2Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardPistolInfo");
			}
		};
		this.f2Key.release = () => {
		};

		this.f3Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardNetgunInfo");
			}
		};
		this.f3Key.release = () => {
		};

		this.fKey.press = () => {
			if (!this.ui.isPaused()) {
				this.grabNearestMonster();
			}
		};
		this.fKey.release = () => {
		};

		// PAUSE: "P" or "Esc"
		this.pKey.press = () => {
			this.ui.togglePause();
		};
		this.pKey.release = () => {
		};

		this.escKey.press = () => {
			this.ui.togglePause();
		};
		this.escKey.release = () => {
		};

		//mouse input
		window.addEventListener("mousemove", event => {
			if (!this.ui.isPaused()) {
				this.ui.crosshair.sprite.visible = this.ui.shootableItem();
				//top left based
				let mousePosOnSphereAroundPlayer = new PIXI.Point(event.screenX, event.screenY);
				mousePosOnSphereAroundPlayer.x /= window.screen.availWidth;
				mousePosOnSphereAroundPlayer.x -= 0.5;
				mousePosOnSphereAroundPlayer.y /= window.screen.availHeight;
				mousePosOnSphereAroundPlayer.y -= 0.5;
				this.ui.shootDirection.x =   mousePosOnSphereAroundPlayer.x;
				this.ui.shootDirection.y = mousePosOnSphereAroundPlayer.y;
				let length = Math.sqrt(this.ui.shootDirection.x * this.ui.shootDirection.x + this.ui.shootDirection.y * this.ui.shootDirection.y);
				if(length != 0) {
					this.ui.shootDirection.x /= length;
					this.ui.shootDirection.y /= length;
				}
			}
		});

		window.addEventListener("click", event => {
			// mouse events:
			// - right-handed: 0 for mouse1, 1 for wheel-click, 2 for mouse2
			// - left-handed: 2 for mouse1, 1 for wheel-click, 0 for mouse2
			if (!this.ui.isPaused() && event.button===0 && this.ui.shootableItem()) {
				let angle = Math.acos( this.ui.shootDirection.y );
				angle *= this.ui.shootDirection.x > 0.0 ? -1 : 1;
				if( this.ui.currentItem === "netgun") {
					this.ui.nets[this.ui.currentNet].go(
						this.playerSprite.x + this.playerSprite.width/2 - this.ui.shootDirection.y * this.ui.nets[0].sprite.width / 2,
						this.playerSprite.y + this.playerSprite.height/2 + this.ui.shootDirection.x * this.ui.nets[0].sprite.height / 2,
						10.0 * this.ui.shootDirection.x,
						10.0 * this.ui.shootDirection.y,
						angle);
					this.ui.currentNet = (this.ui.currentNet + 1) % 10;
				} else {
					this.ui.bullets[this.ui.currentBullet].go(
						this.playerSprite.x + this.playerSprite.width/2 - this.ui.shootDirection.y * this.ui.bullets[0].sprite.width / 2,
						this.playerSprite.y + this.playerSprite.height/2 + this.ui.shootDirection.x * this.ui.bullets[0].sprite.height / 2,
						10.0 * this.ui.shootDirection.x,
						10.0 * this.ui.shootDirection.y,
						angle);
					this.ui.currentBullet = (this.ui.currentBullet + 1) % 10;
				}
				
			}
		});
	}

	initObject() {
		this.app.stage.addChild(this.playerSprite);
		console.log("player character initialized");
	}

	initLoop() {
		// start the player loop
		this.app.ticker.add(delta => this.playerLoop(delta));
		console.log("player loop initialized");
	}

	initUI() {
		this.ui.initObject();
	}

	grabNearestMonster() {
		let monsters = this.app.stage.children.filter(child => child.name.indexOf("monster") !== -1);

		if (monsters !== undefined && monsters.length !== 0 && !this.isGrabbing) {
			for (var i = 0; i < monsters.length; i++) {
			    //if (monsters[i].captured && detainSpriteOutsideDetainer(this.playerSprite, monsters[i]) !== "none") {
			    if (monsters[i].captured && checkDynamicIntoDynamicCollision(this.playerSprite, monsters[i])) {
			    	for (var j = 0; j < this.grabbedMonstersList.length; j++) {
						if (this.grabbedMonstersList[j]===monsters[i]) {
							return;
						}
					}
			    	this.isGrabbing = true;
					monsters[i].x = this.playerSprite.x;
					monsters[i].y = this.playerSprite.y;
					// hide healthbar
					monsters[i].healthBar.container.visible = false;
					this.grabbedMonster = monsters[i];
				}
			}
		}
		else {
			// get drop-monster points (max: 4 monsters)
			for (var i = 0; i < this.grabbedMonstersList.length; i++) {
				if (this.grabbedMonstersList[i]===this.grabbedMonster) {
					return;
				}
			}
			console.log("valid drop");
			this.isGrabbing = false;
			this.ui.score.addScore(this.grabbedMonster.isAngry?2:1);
			this.grabbedMonstersList.push(this.grabbedMonster);
			this.grabbedMonster = undefined;
		}
	}

	updatePlayerSprite() {
		switch(this.command) {
			case "left":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = this.app.loader.resources["assets/character/none/characterLeft.png"].texture;
						break;
					case "bat":
						this.playerTexture = this.app.loader.resources["assets/character/bat/characterLeft.png"].texture;
						break;
					case "pistol":
						this.playerTexture = this.app.loader.resources["assets/character/pistol/characterLeft.png"].texture;
						break;
					case "netgun":
						this.playerTexture = this.app.loader.resources["assets/character/netgun/characterLeft.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "right":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = this.app.loader.resources["assets/character/none/characterRight.png"].texture;
						break;
					case "bat":
						this.playerTexture = this.app.loader.resources["assets/character/bat/characterRight.png"].texture;
						break;
					case "pistol":
						this.playerTexture = this.app.loader.resources["assets/character/pistol/characterRight.png"].texture;
						break;
					case "netgun":
						this.playerTexture = this.app.loader.resources["assets/character/netgun/characterRight.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "down":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = this.app.loader.resources["assets/character/none/characterFront.png"].texture;
						break;
					case "bat":
						this.playerTexture = this.app.loader.resources["assets/character/bat/characterFront.png"].texture;
						break;
					case "pistol":
						this.playerTexture = this.app.loader.resources["assets/character/pistol/characterFront.png"].texture;
						break;
					case "netgun":
						this.playerTexture = this.app.loader.resources["assets/character/netgun/characterFront.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "up":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = this.app.loader.resources["assets/character/none/characterBack.png"].texture;
						break;
					case "bat":
						this.playerTexture = this.app.loader.resources["assets/character/bat/characterBack.png"].texture;
						break;
					case "pistol":
						this.playerTexture = this.app.loader.resources["assets/character/pistol/characterBack.png"].texture;
						break;
					case "netgun":
						this.playerTexture = this.app.loader.resources["assets/character/netgun/characterBack.png"].texture;
						break;
					default:
						// do nothing
				}
			default:
				// do nothing
		}
		setTextureOnlyIfNeeded(this.playerSprite, this.playerTexture);
	}

	movePlayer() {
		if (this.playerSprite.vx !== 0) {
			// walking horizontally
			this.playerSprite.x += this.playerSprite.vx;
			// camera effect
			this.viewport.move(this.playerSprite.vx, 0);
			// move healthbar
			this.ui.healthBar.container.x += this.playerSprite.vx;
			// move cards container
			this.ui.cards.container.x += this.playerSprite.vx;
			// move invisible cards info container
			this.ui.cardsInfo.container.x += this.playerSprite.vx;
			// move invisible pause screen
			this.ui.pauseScreen.container.x += this.playerSprite.vx;
			// move score text
			this.ui.score.container.x += this.playerSprite.vx;
			// move grabbed monster
			if (this.isGrabbing) {
				this.grabbedMonster.x += this.playerSprite.vx;
			}
		}
		else if (this.playerSprite.vy !== 0) {
			// walking vertically
			this.playerSprite.y += this.playerSprite.vy;
			// camera effect
			this.viewport.move(0, this.playerSprite.vy);
			// move healthbar
			this.ui.healthBar.container.y += this.playerSprite.vy;
			// move cards container
			this.ui.cards.container.y += this.playerSprite.vy;
			// move invisible cards info container
			this.ui.cardsInfo.container.y += this.playerSprite.vy;
			// move invisible pause screen
			this.ui.pauseScreen.container.y += this.playerSprite.vy;
			// move score text
			this.ui.score.container.y += this.playerSprite.vy;
			// move grabbed monster
			if (this.isGrabbing) {
				this.grabbedMonster.y += this.playerSprite.vy;
			}
		}
		else {
			// character isn't walking: do nothing
		}
	}

	playerIsMoving() {
		return (this.playerSprite.vx !== 0 || this.playerSprite.vy !== 0);
	}

	playerLoop(delta) {
		if (!this.ui.isPaused() && this.playerIsMoving()) {
			let collided = this.handleGenericStaticCollisions();
			if (!collided) {
				this.handleContainerCollisionsAndMove();
			}
		}
		//update crosshair
		this.ui.crosshair.sprite.x = this.playerSprite.x - this.ui.crosshair.sprite.width / 2  + this.playerSprite.width / 2 + 100.0 *  this.ui.shootDirection.x;
		this.ui.crosshair.sprite.y = this.playerSprite.y - this.ui.crosshair.sprite.height / 2 + this.playerSprite.height / 2 + 100.0 * this.ui.shootDirection.y;
		//update bullets
		for (var i = this.ui.bullets.length - 1; i >= 0; i--) {
			this.ui.bullets[i].update(delta);
			this.ui.nets[i].update(delta);
		}
		//update zordering pos
		this.playerSprite.yForZOrdering = this.playerSprite.y + this.playerSprite.height;
	}

	handleGenericStaticCollisions() {
		let staticBlockers = this.app.stage.children.filter(child => 
			child.name.indexOf("blocker") !== -1);

		let playerHitsHouse = undefined;
		if (staticBlockers !== undefined && staticBlockers.length !== 0) {
			for (var i = 0; i < staticBlockers.length; i++) {
			    playerHitsHouse = detainSpriteOutsideDetainer(this.playerSprite, staticBlockers[i]);
			    if (playerHitsHouse !== "none"){
			    	break;
			    }	
			}
		}

		if (playerHitsHouse===undefined) {
			return false;
		}
		else if (playerHitsHouse !== "none") {
			// character hit house: reset his velocity
			this.playerSprite.vx = 0;
			this.playerSprite.vy = 0;
			return true;
		}
		return false;
	}

	handleContainerCollisionsAndMove() {
		let playerHitsMapBound = containSpriteInsideContainer(this.playerSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});

		if (playerHitsMapBound !== "none") {
			// character hit map bounds: character stays in-place
		}
		else {
			this.movePlayer();
		}
	}
}
