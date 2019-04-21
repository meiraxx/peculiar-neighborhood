import UserInterface from './UserInterface';

export default class Monster {
	
	static prepareResources() {
		PIXI.loader.add("assets/brown-monster.png");
	}
	
	constructor(app) {
		this.app = app;
		this.newDirTimeStep = 100.0;
		this.timeSinceNewDir = 0.0;
		
	}
	
	prepareObject(x_pos, y_pos, MATTER, physicsEngine) {
		this.matter = MATTER;
		this.physicsEngine = physicsEngine;
		this.velocity = this.matter.Vector.create(0 ,0);
 		
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
		this.monsterSprite.scale.x * this.monsterSprite.width,this.monsterSprite.scale.y * this.monsterSprite.height);
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
			this.velocity = Math.random() > 0.5 ?  this.matter.Vector.create(Math.random() * 2 - 0.5 ,0) :   this.matter.Vector.create(0,Math.random() * 2 - 0.5 );
		}
		this.matter.Body.setVelocity(this.monsterCollider ,this.velocity);
		this.monsterSprite.x = this.monsterCollider.position.x;
		this.monsterSprite.y = this.monsterCollider.position.y;
	}
}
