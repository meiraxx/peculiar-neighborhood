import * as PIXI from 'pixi.js';

export default class House {
	
	static loadResources(app) {
		app.loader.add("assets/staticElements/houses/whiteHouse.png");
		app.loader.add("assets/staticElements/houses/yellowHouse.png");
		app.loader.add("assets/staticElements/houses/redHouse.png");
		app.loader.add("assets/staticElements/houses/purpleHouse.png");
		app.loader.add("assets/staticElements/houses/greenHouse.png");
		app.loader.add("assets/staticElements/houses/blueHouse.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, color) {
		let housePath = "assets/staticElements/houses/" + color + "House.png";
		let houseTexture = this.app.loader.resources[housePath].texture;
		
		this.sprite = new PIXI.Sprite(houseTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-house" + color;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;
		this.sprite.contextClass = this;
		this.walkableHeight = 56;
		this.walkableWidth = 6;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
	}

	getCorrectedBounds(playerSprite) {
		return {x: this.sprite.x + this.walkableWidth, y: this.sprite.y + this.walkableHeight, 
			width: this.sprite.width, height: this.sprite.height - this.walkableHeight};
	}
}
