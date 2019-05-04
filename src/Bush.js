import * as PIXI from 'pixi.js'
export default class Bush {
	static loadResources(app) {
		app.loader.add("assets/staticElements/bush.png");
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos, i) {
		let bushTexture = this.app.loader.resources["assets/staticElements/bush.png"].texture;
		this.bushSprite = new PIXI.Sprite(bushTexture);
		this.bushSprite.scale.x = 0.2;
		this.bushSprite.scale.y = 0.2;
		this.bushSprite.x = x_pos;
		this.bushSprite.y = y_pos;
		this.bushSprite.name = "bush" + i;
		this.bushSprite.yForZOrdering = this.bushSprite.y + this.bushSprite.height;

	}

	initObject() {
		this.app.stage.addChild(this.bushSprite);
		console.log("bush initialized");
	}

}