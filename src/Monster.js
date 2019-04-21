import UserInterface from './UserInterface';

export default class Monster {
	
	static prepareResources() {
		PIXI.loader.add("assets/brown-monster.png");
	}
	
	constructor(app) {
		this.app = app;
	}
	
	prepareObject(x_pos, y_pos) {
		// SETUP monster
		let frontTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let backTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let rightTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		let leftTexture = PIXI.loader.resources["assets/brown-monster.png"].texture;
		
		this.monsterSprite = new PIXI.Sprite(frontTexture);
		this.monsterSprite.scale.x = 0.1;
		this.monsterSprite.scale.y = 0.1;
		this.monsterSprite.x = x_pos;
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
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
		// use monster's velocity to make him move
	}
}
