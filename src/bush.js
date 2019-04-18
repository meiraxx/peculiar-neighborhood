export default class Bush {
	constructor(app) {
		this.app = app;
		PIXI.loader.add("assets/bush.png");
	}

	setupOnResourcesLoaded() {
	let bushTexture = PIXI.loader.resources["assets/bush.png"].texture;
	this.bushSprite = new PIXI.Sprite(bushTexture);
	this.bushSprite.scale.x = 0.2;
	this.bushSprite.scale.y = 0.2;
	this.bushSprite.x = 10;
	this.bushSprite.y = 400;
	this.app.stage.addChild(this.bushSprite);
	console.log("bush initialized");
	}

}