import { keyboard } from "./lib/UtilMethods";
import UserInterface from './UserInterface';

export default class Player {
	static loadResources() {
		PIXI.loader.add("assets/character/characterFront.png");
		PIXI.loader.add("assets/character/characterBack.png");
		PIXI.loader.add("assets/character/characterRight.png");
		PIXI.loader.add("assets/character/characterLeft.png");
		UserInterface.loadResources();
	}

	constructor(app, viewport) {
		this.app = app;
		this.viewport = viewport;
		this.ui = new UserInterface(app);
	}
	
	prepareObject(x_pos, y_pos,MATTER,physicsEngine) {
		// SETUP player
		let playerFrontTexture = PIXI.loader.resources["assets/character/characterFront.png"].texture;
		let playerBackTexture = PIXI.loader.resources["assets/character/characterBack.png"].texture;
		let playerRightTexture = PIXI.loader.resources["assets/character/characterRight.png"].texture;
		let playerLeftTexture = PIXI.loader.resources["assets/character/characterLeft.png"].texture;
		
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
		//green: 0x4CBB17; red: 0xFF3300
		this.ui.prepareHealthbar(x_pos, y_pos - 4, 64, 8, 0x4CBB17, 20);
		this.ui.prepareCards(this.playerSprite.x - 480, 690);

		// KEY STROKE EVENTS
		this.leftKey = keyboard("ArrowLeft");
		this.rightKey = keyboard("ArrowRight");
		this.downKey = keyboard("ArrowDown");
		this.upKey = keyboard("ArrowUp");
		this.oneKey = keyboard("1");
		this.twoKey = keyboard("2");
		this.threeKey = keyboard("3");

		// MOVEMENT KEYS
		// note: comment second conditions and movement resets on key press to obtain diagonal movements,
		// but beware it's going to be a twice-as-fast movement, so there needs to be code to divide
		// the speed by half on certain conditions
		this.leftKey.press = () => {
			this.setPlayerTextureOnlyIfNeeded(this.playerSprite, 
				this.playerSprite.texture, playerLeftTexture);
			this.command = "left";
			this.playerSprite.vx = -3;
			this.playerSprite.vy = 0;
		};
		this.leftKey.release = () => {
			if (!this.rightKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.rightKey.press = () => {
			this.setPlayerTextureOnlyIfNeeded(this.playerSprite, 
				this.playerSprite.texture, playerRightTexture);
			this.command = "right";
			this.playerSprite.vx = 3;
			this.playerSprite.vy = 0;
		};
		this.rightKey.release = () => {
			if (!this.leftKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.downKey.press = () => {
			this.setPlayerTextureOnlyIfNeeded(this.playerSprite, 
				this.playerSprite.texture, playerFrontTexture);
			this.command = "down";
			this.playerSprite.vx = 0;
			this.playerSprite.vy = 3;
		};
		this.downKey.release = () => {
			if (!this.upKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		this.upKey.press = () => {
			this.setPlayerTextureOnlyIfNeeded(this.playerSprite, 
				this.playerSprite.texture, playerBackTexture);
			this.command = "up";
			this.playerSprite.vx = 0;
			this.playerSprite.vy = -3;
		};
		this.upKey.release = () => {
			if (!this.downKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		// UI KEYS
		// zIndex: https://github.com/pixijs/pixi.js/issues/300
		this.oneKey.press = () => {
			this.ui.highlightCard("cardBat");
		};
		this.oneKey.release = () => {
		};

		this.twoKey.press = () => {
			this.ui.highlightCard("cardPistol");
		};
		this.twoKey.release = () => {
		};

		this.threeKey.press = () => {
			this.ui.highlightCard("cardNetgun");
		};
		this.threeKey.release = () => {
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

	setPlayerTextureOnlyIfNeeded(sprite, currentTexture, newTexture) {
		if (currentTexture !== newTexture) {
			sprite.setTexture(newTexture);
		}
	}

	contain(sprite, container, command) {
		// this function accounts for new calculated position to define bounds
		// NOTE (workaround):
		// command argument is used for simple checks such as the
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
			}
		}
		else {
			// character isn't walking: do nothing
		}
	}
}
