import UserInterface from './UserInterface';
import { getRandomArbitraryFloat } from "./lib/UtilMethods";

export default class Monster {
	
	static prepareResources() {
		PIXI.loader.add("assets/brown-monster.png");
	}
	
	constructor(app) {
		this.app = app;
		this.newDirTimeStep = 100.0;
		this.timeSinceNewDir = 0.0;
		this.speedFactor = 0.01;
	}
	
	prepareObject(x_pos, y_pos, MATTER, physicsEngine) {
		this.matter = MATTER;
		this.physicsEngine = physicsEngine;
		this.velocity = this.matter.Vector.create(0, 0);
 		
		// SETUP monster
		let frontTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let backTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let rightTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let leftTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		
		this.monsterSprite = new PIXI.Sprite(frontTexture);
		this.monsterSprite.scale.x = 0.05;
		this.monsterSprite.scale.y = 0.05;
		this.monsterSprite.x = x_pos;
		this.monsterSprite.y = y_pos;
		
		this.monsterCollider = MATTER.Bodies.rectangle(this.monsterSprite.x,this.monsterSprite.y,
		this.monsterSprite.width, this.monsterSprite.height, {mass: 80.0});
 		MATTER.World.add(physicsEngine.world,this.monsterCollider);
	}

	initObject() {
		this.app.stage.addChild(this.monsterSprite);
		console.log("monster character initialized");
	}

	initLoop() {
		// start the monster loop
		this.app.ticker.add(delta => this.monsterLoop(delta));
		console.log("monster loop initialized");
	}

	monsterLoop(delta) {
		this.timeSinceNewDir += delta;
		if(this.timeSinceNewDir > this.newDirTimeStep) {
			this.timeSinceNewDir = 0.0;
			
			let randomNumber = Math.random();
			if (randomNumber >= 0 && randomNumber < 0.25) {
				this.velocity = this.matter.Vector.create(1, 0);
			}
			else if (randomNumber >= 0.25 && randomNumber < 0.50) {
				this.velocity = this.matter.Vector.create(0, 1);
			}
			else if (randomNumber >= 0.50 && randomNumber < 0.75) {
				this.velocity = this.matter.Vector.create(-1, 0);
			}
			else if (randomNumber >= 0.75 && randomNumber < 1) {
				this.velocity = this.matter.Vector.create(0, -1);
			}

			//this.matter.Body.applyForce(this.monsterCollider ,this.monsterCollider.position, this.force);
		}
		this.matter.Body.setVelocity(this.monsterCollider ,this.velocity);
		this.monsterSprite.x = this.monsterCollider.position.x;
		this.monsterSprite.y = this.monsterCollider.position.y;
	}
}
