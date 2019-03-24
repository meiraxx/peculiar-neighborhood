import $ from 'pixi.js';
import keyboard from './keyboard'


export default class Player {
	constructor(rootElement, app) {
		this.rootElement = rootElement;
		this.app = app;
		PIXI.loader.add("assets/brown-monster.png");
	}
	
	setupOnResourcesLoaded(x_pos, y_pos) {
		let playerTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		this.playerSprite = new PIXI.Sprite(playerTexture);
		this.playerSprite.scale.x = 0.15;
		this.playerSprite.scale.y = 0.15;
		this.playerSprite.x = x_pos - (this.playerSprite.width/2);
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
		this.app.stage.addChild(this.playerSprite);
		console.log("player sprite :D");

		// KEY STROKE EVENTS
		this.leftKey = keyboard("ArrowLeft");
		this.rightKey = keyboard("ArrowRight");
		this.downKey = keyboard("ArrowDown");
		this.upKey = keyboard("ArrowUp");
		
		// comment second conditions and movement resets on key press to obtain diagonal movements, but beware it's going to be
		// a twice-as-fast movement, so there needs to be code to divide the speed by half on certain conditions 
		this.leftKey.press = () => {
			this.playerSprite.vx = -3
			this.playerSprite.vy = 0
		};
		this.leftKey.release = () => {
			if (!this.rightKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.rightKey.press = () => {
			this.playerSprite.vx = 3
			this.playerSprite.vy = 0
		};
		this.rightKey.release = () => {
			if (!this.leftKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.downKey.press = () => {
			this.playerSprite.vx = 0
			this.playerSprite.vy = 3
		};
		this.downKey.release = () => {
			if (!this.upKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		this.upKey.press = () => {
			this.playerSprite.vx = 0
			this.playerSprite.vy = -3
		};
		this.upKey.release = () => {
			if (!this.downKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		// start the player loop 
		this.app.ticker.add(delta => this.playerLoop(delta));
	}

	playerLoop(delta) {
		// use player's velocity to make him move
		//console.log(this.playerSprite.vx)
		//console.log(this.playerSprite.vy)
		this.playerSprite.x += this.playerSprite.vx;
		this.playerSprite.y += this.playerSprite.vy;
	}
}
