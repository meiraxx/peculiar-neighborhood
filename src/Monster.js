import UserInterface from './UserInterface';
import { getRandomArbitraryFloat } from "./lib/UtilMethods";
import { containSpriteInsideContainer } from "./lib/PixiUtilMethods";

export default class Monster {
	static loadResources() {
		PIXI.loader.add("assets/angry_monster.png");
		PIXI.loader.add("assets/normal_monster.png");
	}
	
	constructor(app, isAngry) {
		this.app = app;
		this.isAngry = isAngry;
	}
	
	prepareObject(x_pos, y_pos, i) {
		var tex = undefined;
		// SETUP monster
		if(this.isAngry) {
			tex = PIXI.loader.resources["assets/angry_monster.png"].texture;
		} else {
			tex = PIXI.loader.resources["assets/normal_monster.png"].texture;
		}
		this.monsterSprite = new PIXI.Sprite(tex);
		this.monsterSprite.scale.x = 0.05;
		this.monsterSprite.scale.y = 0.05;
		this.monsterSprite.x = x_pos;
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterSprite.name = "monster" + i;
		this.newDirTimeStep = 50.0;
		this.timeSinceNewDir = 0.0;
	}

	initObject() {
		this.app.stage.addChild(this.monsterSprite);
		console.log("monster character initialized");
	}

	initLoop(playerUI) {
		// start the monster loop
		this.app.ticker.add(delta => this.monsterLoop(delta, playerUI));
		console.log("monster loop initialized");
	}

	monsterLoop(delta, playerUI) {
		if (!playerUI.isPaused()) {
			this.timeSinceNewDir += delta;
			if(this.timeSinceNewDir > this.newDirTimeStep) {
				this.timeSinceNewDir = 0.0;

				let randomNumber = Math.random();
				if (randomNumber >= 0 && randomNumber < 0.25) {
					this.monsterSprite.vx = 2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.25 && randomNumber < 0.50) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = 2;
				}
				else if (randomNumber >= 0.50 && randomNumber < 0.75) {
					this.monsterSprite.vx = -2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.75 && randomNumber < 1) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = -2;
				}
				//this.matter.Body.applyForce(this.monsterCollider ,this.monsterCollider.position, this.force);
			}
			let monsterHitsWall = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});

			if (monsterHitsWall !== "none") {
				// character hit wall: do nothing, already contained
			}
			else if (this.monsterSprite.vx !== 0) {
				// walking horizontally
				this.monsterSprite.x += this.monsterSprite.vx;
			}
			else if (this.monsterSprite.vy !== 0) {
				// walking vertically
				this.monsterSprite.y += this.monsterSprite.vy;
			}
			else {
				// character isn't walking: do nothing
			}
		}
	}
}
