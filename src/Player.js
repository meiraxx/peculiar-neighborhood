import { keyboard } from "./lib/UtilMethods";
import { setTextureOnlyIfNeeded, containSpriteInsideContainer } from "./lib/PixiUtilMethods";
import UserInterface from './UserInterface';

export default class Player {
	static loadResources() {
		PIXI.loader.add("assets/character/none/characterFront.png");
		PIXI.loader.add("assets/character/none/characterBack.png");
		PIXI.loader.add("assets/character/none/characterRight.png");
		PIXI.loader.add("assets/character/none/characterLeft.png");
		PIXI.loader.add("assets/character/bat/characterFront.png");
		PIXI.loader.add("assets/character/bat/characterBack.png");
		PIXI.loader.add("assets/character/bat/characterRight.png");
		PIXI.loader.add("assets/character/bat/characterLeft.png");
		PIXI.loader.add("assets/character/pistol/characterFront.png");
		PIXI.loader.add("assets/character/pistol/characterBack.png");
		PIXI.loader.add("assets/character/pistol/characterRight.png");
		PIXI.loader.add("assets/character/pistol/characterLeft.png");
		PIXI.loader.add("assets/character/netgun/characterFront.png");
		PIXI.loader.add("assets/character/netgun/characterBack.png");
		PIXI.loader.add("assets/character/netgun/characterRight.png");
		PIXI.loader.add("assets/character/netgun/characterLeft.png");
		UserInterface.loadResources();
	}

	constructor(app, viewport) {
		this.app = app;
		this.viewport = viewport;
		this.ui = new UserInterface(app);
	}
	
	prepareObject(x_pos, y_pos) {
		// SETUP player
		let playerFrontTexture = PIXI.loader.resources["assets/character/none/characterFront.png"].texture;
		let playerBackTexture = PIXI.loader.resources["assets/character/none/characterBack.png"].texture;
		let playerRightTexture = PIXI.loader.resources["assets/character/none/characterRight.png"].texture;
		let playerLeftTexture = PIXI.loader.resources["assets/character/none/characterLeft.png"].texture;
		this.command = "down";
		
		this.playerSprite = new PIXI.Sprite(playerFrontTexture);
		this.playerSprite.scale.x = 0.20;
		this.playerSprite.scale.y = 0.20;
		this.playerSprite.x = Math.round(x_pos - (this.playerSprite.width/2));
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
 		this.playerSprite.name = "player";

		// SETUP player UI
		this.ui.prepareObject(x_pos, y_pos);

		// KEY STROKE EVENTS
		this.leftKey = keyboard("ArrowLeft");
		this.rightKey = keyboard("ArrowRight");
		this.downKey = keyboard("ArrowDown");
		this.upKey = keyboard("ArrowUp");

		this.zeroKey = keyboard("0");
		this.oneKey = keyboard("1");
		this.twoKey = keyboard("2");
		this.threeKey = keyboard("3");
		this.fourKey = keyboard("4");
		this.fiveKey = keyboard("5");
		this.sixKey = keyboard("6");

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
				this.playerSprite.vx = -3;
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
				this.playerSprite.vx = 3;
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
				this.playerSprite.vy = 3;
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
				this.playerSprite.vy = -3;
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

		this.fourKey.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardBatInfo");
			}
		};
		this.fourKey.release = () => {
		};

		this.fiveKey.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardPistolInfo");
			}
		};
		this.fiveKey.release = () => {
		};

		this.sixKey.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardNetgunInfo");
			}
		};
		this.sixKey.release = () => {
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
			if (!this.ui.isPaused() && this.ui.shootableItem()) {
				let angle = Math.acos( this.ui.shootDirection.y );
				angle *= this.ui.shootDirection.x > 0.0 ? -1 : 1;
				this.ui.bullets[this.ui.currentBullet].go(
					this.playerSprite.x + this.playerSprite.width/2,
					this.playerSprite.y + this.playerSprite.height/2,
					10.0 * this.ui.shootDirection.x,
					10.0 * this.ui.shootDirection.y,
					angle);
				this.ui.currentBullet = (this.ui.currentBullet + 1) % 10;
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

	/*
	resetPreviousVelX() {
		if (this.commandArray[0]) {
			this.command = "left";
			this.playerSprite.vx = -3;
		}
		else if (this.commandArray[1]) {
			this.command = "right";
			this.playerSprite.vx = 3;
		}
		this.updatePlayerSprite();
	}

	resetPreviousVelY() {
		if (this.commandArray[2]) {
			this.command = "down";
			this.playerSprite.vy = 3;
		}
		else if (this.commandArray[3]) {
			this.command = "up";
			this.playerSprite.vy = -3;
		}
		this.updatePlayerSprite();
	}
	*/

	updatePlayerSprite() {
		switch(this.command) {
			case "left":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = PIXI.loader.resources["assets/character/none/characterLeft.png"].texture;
						break;
					case "bat":
						this.playerTexture = PIXI.loader.resources["assets/character/bat/characterLeft.png"].texture;
						break;
					case "pistol":
						this.playerTexture = PIXI.loader.resources["assets/character/pistol/characterLeft.png"].texture;
						break;
					case "netgun":
						this.playerTexture = PIXI.loader.resources["assets/character/netgun/characterLeft.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "right":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = PIXI.loader.resources["assets/character/none/characterRight.png"].texture;
						break;
					case "bat":
						this.playerTexture = PIXI.loader.resources["assets/character/bat/characterRight.png"].texture;
						break;
					case "pistol":
						this.playerTexture = PIXI.loader.resources["assets/character/pistol/characterRight.png"].texture;
						break;
					case "netgun":
						this.playerTexture = PIXI.loader.resources["assets/character/netgun/characterRight.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "down":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = PIXI.loader.resources["assets/character/none/characterFront.png"].texture;
						break;
					case "bat":
						this.playerTexture = PIXI.loader.resources["assets/character/bat/characterFront.png"].texture;
						break;
					case "pistol":
						this.playerTexture = PIXI.loader.resources["assets/character/pistol/characterFront.png"].texture;
						break;
					case "netgun":
						this.playerTexture = PIXI.loader.resources["assets/character/netgun/characterFront.png"].texture;
						break;
					default:
						// do nothing
				}
				break;
			case "up":
				switch(this.ui.currentItem) {
					case "none":
						this.playerTexture = PIXI.loader.resources["assets/character/none/characterBack.png"].texture;
						break;
					case "bat":
						this.playerTexture = PIXI.loader.resources["assets/character/bat/characterBack.png"].texture;
						break;
					case "pistol":
						this.playerTexture = PIXI.loader.resources["assets/character/pistol/characterBack.png"].texture;
						break;
					case "netgun":
						this.playerTexture = PIXI.loader.resources["assets/character/netgun/characterBack.png"].texture;
						break;
					default:
						// do nothing
				}
			default:
				// do nothing
		}
		setTextureOnlyIfNeeded(this.playerSprite, this.playerTexture);
	}

	playerLoop(delta) {
		if (!this.ui.isPaused()) {
			// use player's velocity to make him move
			let playerHitsWall = containSpriteInsideContainer(this.playerSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});

			if (playerHitsWall !== "none") {
				// character hit wall: do nothing, already contained
			}
			else if (this.playerSprite.vx !== 0) {
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
			}
			else {
				// character isn't walking: do nothing
			}
		}
		//update crosshair
		this.ui.crosshair.sprite.x = this.playerSprite.x + this.playerSprite.width / 2 + 100.0 *  this.ui.shootDirection.x;
		this.ui.crosshair.sprite.y = this.playerSprite.y + this.playerSprite.height / 2 + 100.0 * this.ui.shootDirection.y;
		//update bullets
		for (var i = this.ui.bullets.length - 1; i >= 0; i--) {
			this.ui.bullets[i].update(delta);
		}
		
	}
}
