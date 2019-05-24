import * as PIXI from 'pixi.js';

export default class Bush {
	static loadResources(app) {
		app.loader.add("assets/staticElements/bush/bush-night.png");
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos, i) {
		let bushTexture = this.app.loader.resources["assets/staticElements/bush/bush-night.png"].texture;
		this.sprite = new PIXI.Sprite(bushTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "bush" + i;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;

	}

	initObject() {
		this.app.stage.addChild(this.sprite);
	}

}