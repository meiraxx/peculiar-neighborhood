import * as PIXI from 'pixi.js';

export default class Car {
	static loadResources(app) {
		app.loader.add("assets/staticElements/cars/car1.png");
		app.loader.add("assets/staticElements/cars/car2.png");
		app.loader.add("assets/staticElements/cars/car3.png");
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos, i, carType) {
		let carTexture = this.app.loader.resources["assets/staticElements/cars/car" + carType + ".png"].texture;
		this.sprite = new PIXI.Sprite(carTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-car" + i;
		this.sprite.contextClass = this;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;
		this.walkableHeight = 46;
		this.walkableWidth = 0;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
	}

	getCorrectedBounds(playerSprite) {
		return {x: this.sprite.x + this.walkableWidth, y: this.sprite.y + this.walkableHeight, 
			width: this.sprite.width, height: this.sprite.height - this.walkableHeight};
	}

}