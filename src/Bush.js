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
		this.sprite = new PIXI.Sprite(bushTexture);
		this.sprite.scale.x = 0.2;
		this.sprite.scale.y = 0.2;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "bush" + i;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;

	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("bush initialized");
	}

}