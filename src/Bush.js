export default class Bush {
	static loadResources() {
		PIXI.loader.add("assets/bush.png");
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos, i) {
		let bushTexture = PIXI.loader.resources["assets/bush.png"].texture;
		this.bushSprite = new PIXI.Sprite(bushTexture);
		this.bushSprite.scale.x = 0.2;
		this.bushSprite.scale.y = 0.2;
		this.bushSprite.x = x_pos;
		this.bushSprite.y = y_pos;
		this.bushSprite.name = "bush" + i;
	}

	initObject() {
		this.app.stage.addChild(this.bushSprite);
		console.log("bush initialized");
	}

}