import { keyboard, setTextureOnlyIfNeeded } from "./lib/UtilMethods";
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
	
	prepareObject(x_pos, y_pos,MATTER,physicsEngine) {
		// SETUP player
		let playerFrontTexture = PIXI.loader.resources["assets/character/none/characterFront.png"].texture;
		let playerBackTexture = PIXI.loader.resources["assets/character/none/characterBack.png"].texture;
		let playerRightTexture = PIXI.loader.resources["assets/character/none/characterRight.png"].texture;
		let playerLeftTexture = PIXI.loader.resources["assets/character/none/characterLeft.png"].texture;
		this.ui.currentItem = "none";
		this.command = "down";
		
		this.playerSprite = new PIXI.Sprite(playerFrontTexture);
		this.playerSprite.scale.x = 0.20;
		this.playerSprite.scale.y = 0.20;
		this.playerSprite.x = Math.round(x_pos - (this.playerSprite.width/2));
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
		
		this.matter = MATTER;
		this.physicsEngine = physicsEngine;
 		//player collider
 		//this.collider = MATTER.Bodies.rectangle(this.playerSprite.x,this.playerSprite.y,
		//this.playerSprite.scale.x * this.playerSprite.width,this.playerSprite.scale.y * this.playerSprite.height);
 		//MATTER.World.add(physicsEngine.world,this.collider);
 		
 
		// SETUP player UI
		this.ui.prepareHealthbar(x_pos, y_pos - 4);
		this.ui.prepareCards(x_pos - 530, 690);
		this.ui.preparePauseScreen(x_pos, y_pos);

		// KEY STROKE EVENTS
		this.leftKey = keyboard("ArrowLeft");
		this.rightKey = keyboard("ArrowRight");
		this.downKey = keyboard("ArrowDown");
		this.upKey = keyboard("ArrowUp");

		this.zeroKey = keyboard("0");
		this.oneKey = keyboard("1");
		this.twoKey = keyboard("2");
		this.threeKey = keyboard("3");

		this.pKey = keyboard("p");
		this.escKey = keyboard("Escape");

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
				this.updatePlayerSprite();
			}
		};
		this.zeroKey.release = () => {
		};

		this.oneKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("bat");
				this.updatePlayerSprite();
			}
		};
		this.oneKey.release = () => {
		};

		this.twoKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("pistol");
				this.updatePlayerSprite();
			}
		};
		this.twoKey.release = () => {
		};

		this.threeKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("netgun");
				this.updatePlayerSprite();
			}
		};
		this.threeKey.release = () => {
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

	contain(sprite, container, command) {
		// this function accounts for new calculated position to define bounds
		// WORKAROUND:
		// 'command' argument is used for simple checks such as the
		// ones done in the "bottom" and "right" conditions...

		let collision = "none";
		let unitvx = sprite.vx/Math.abs(sprite.vx);
		let unitvy = sprite.vy/Math.abs(sprite.vy);

		// top hit
		if (sprite.y + unitvy <= container.y) {
			console.log("Top hit: " + sprite.y);
			sprite.y = container.y;
			collision = "top";
		}

		// bottom hit
		if (sprite.y + sprite.height - unitvy >= container.height && command === "down") {
			console.log("Bottom hit: " + sprite.y);
			sprite.y = container.height - sprite.height + unitvy;
			collision = "bottom";
		}

		// left hit
		if (sprite.x + unitvx <= container.x) {
			console.log("Left hit: " + sprite.x);
			sprite.x = container.x;
			collision = "left";
		}

		// right hit
		if (sprite.x + sprite.width - unitvx >= container.width && command === "right") {
			console.log("Right hit: " + sprite.x);
			sprite.x = container.width - sprite.width + unitvx;
			collision = "right";
		}

		return collision;
	}

	playerLoop(delta) {
		if (!this.ui.isPaused()) {
			// use player's velocity to make him move
			let playerHitsWall = this.contain(this.playerSprite, 
				{x: 0, y: 0, width: 1024, height: 1024}, this.command);
			
			//get possible collisions
			var collisions = this.matter.Query.point(this.physicsEngine.world.bodies, 
			this.matter.Vector.create( this.playerSprite.x + this.playerSprite.vx, this.playerSprite.y + this.playerSprite.vy));
			
			if (playerHitsWall !== "none") {
				// character hit wall: do nothing, already contained
			}
			else if (collisions == undefined || collisions.length == 0) {
				if (this.playerSprite.vx !== 0) {
					// walking horizontally
					this.playerSprite.x += this.playerSprite.vx;
					// camera effect
					this.viewport.move(this.playerSprite.vx, 0);
					// move healthbar
					this.ui.healthBar.container.x += this.playerSprite.vx;
					// move cards container
					this.ui.cards.container.x += this.playerSprite.vx;
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
					// move invisible pause screen
					this.ui.pauseScreen.container.y += this.playerSprite.vy;
				}
			}
			else {
				// character isn't walking: do nothing
			}
		}
	}
}
