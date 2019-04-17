import $ from 'pixi.js';
import keyboard from './keyboard'

export default class Player {
	constructor(rootElement, app) {
		this.rootElement = rootElement;
		this.app = app;
		PIXI.loader.add("assets/character/characterFront.png");
		PIXI.loader.add("assets/character/characterBack.png");
		PIXI.loader.add("assets/character/characterRight.png");
		PIXI.loader.add("assets/character/characterLeft.png");
	}
	
	setupOnResourcesLoaded(x_pos, y_pos) {
		let playerFrontTexture = PIXI.loader.resources["assets/character/characterFront.png"].texture;
		let playerBackTexture = PIXI.loader.resources["assets/character/characterBack.png"].texture;
		let playerRightTexture = PIXI.loader.resources["assets/character/characterRight.png"].texture;
		let playerLeftTexture = PIXI.loader.resources["assets/character/characterLeft.png"].texture;

		this.playerSprite = new PIXI.Sprite(playerFrontTexture);
		this.playerSprite.scale.x = 0.15;
		this.playerSprite.scale.y = 0.15;
		this.playerSprite.x = x_pos - (this.playerSprite.width/2);
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
		this.app.stage.addChild(this.playerSprite);
		console.log("player character initialized");

		// KEY STROKE EVENTS
		this.leftKey = keyboard("ArrowLeft");
		this.rightKey = keyboard("ArrowRight");
		this.downKey = keyboard("ArrowDown");
		this.upKey = keyboard("ArrowUp");
		
		// comment second conditions and movement resets on key press to obtain diagonal movements, but beware it's going to be
		// a twice-as-fast movement, so there needs to be code to divide the speed by half on certain conditions 
		this.leftKey.press = () => {
			this.playerSprite.setTexture(playerLeftTexture)﻿;
			this.playerSprite.vx = -1;
			this.playerSprite.vy = 0;
		};
		this.leftKey.release = () => {
			if (!this.rightKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.rightKey.press = () => {
			this.playerSprite.setTexture(playerRightTexture)﻿;
			this.playerSprite.vx = 1;
			this.playerSprite.vy = 0;
		};
		this.rightKey.release = () => {
			if (!this.leftKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.downKey.press = () => {
			this.playerSprite.setTexture(playerFrontTexture)﻿;
			this.playerSprite.vx = 0;
			this.playerSprite.vy = 1;
		};
		this.downKey.release = () => {
			if (!this.upKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		this.upKey.press = () => {
			this.playerSprite.setTexture(playerBackTexture)﻿;
			this.playerSprite.vx = 0;
			this.playerSprite.vy = -1;
		};
		this.upKey.release = () => {
			if (!this.downKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};
		// start the player loop 
		this.app.ticker.add(delta => this.playerLoop(delta));
		console.log("player loop initialized");
	}

	contain(sprite, container) {
		let collision = undefined;
		//Left
		if (sprite.x < container.x) {
			//sprite.x = container.x;
			collision = "left";
		}

		//Top
		if (sprite.y < container.y) {
			//sprite.y = container.y;
			collision = "top";
		}

		//Right
		if (sprite.x + sprite.width > container.width) {
			//sprite.x = container.width - sprite.width;
			collision = "right";
		}

		//Bottom
		if (sprite.y + sprite.height > container.height) {
			//sprite.y = container.height - sprite.height;
			collision = "bottom";
		}

		//Return the `collision` value
		return collision;
	}

	playerLoop(delta) {
		// use player's velocity to make him move
		//console.log(this.playerSprite.vx)
		//console.log(this.playerSprite.vy)
		let playerHitsWall = this.contain(this.playerSprite, this.app.stage);
		
		if (playerHitsWall !== "top" && playerHitsWall !== "bottom") {
			this.playerSprite.y += this.playerSprite.vy;
			this.app.stage.y -= this.playerSprite.vy;
		}
		if (playerHitsWall !== "right" && playerHitsWall !== "left") {
			this.playerSprite.x += this.playerSprite.vx;
			this.app.stage.x -= this.playerSprite.vx;
		}
	}
}
