import * as PIXI from 'pixi.js';
import { getRectangle } from "./lib/PixiUtilMethods";

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
		this.color = color;

		this.sprite = new PIXI.Sprite(houseTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-house-" + color;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;
		this.sprite.contextClass = this;
		this.walkableHeight = 56;
		this.walkableWidth = 6;

		// RED RECT - 1: (40,40), 2: (40, 607), 3: (617, 607), 4: (617, 40)
		// Width: 578, Height: 568
		// BLUE RECT - 1: (0, 800), 2: (0, 1383), 3: (617, 1383), 4: (617, 40)
		// Width: 617, Height: 583
		// GREEN RECT - 1: (657, 965), 2: (657, 1495), 3: (1276, 1495), 4: (1276, 965)
		// Width: 619, Height: 530
		// YELLOW RECT - 1: (1469, 0), 2: (1469, 571), 3: (2047, 571), 4: (2047, 0)
		// Width: 578, Height: 571
		// PURPLE RECT - 1: (1469, 764), 2: (1469, 1343), 3: (2047, 1343), 4: (2047, 764)
		// Width: 578, Height: 579
		// WHITE RECT - 1: (809, 194), 2: (809, 773), 3: (1429, 773), 4: (1429, 194)
		// Width: 620, Height: 579
		if (this.color === "red") {
			this.gardenRectangle = getRectangle(35, 35, 582, 572, 0xffb5b3);
			this.gardenRectangle.name = "red-garden";
			this.gardenRectangle.gardenBounds = {x: 35, y: 35, width: 582, height: 572}
		} else if (this.color === "blue") {
			this.gardenRectangle = getRectangle(0, 800, 617, 583, 0xb3dffd);
			this.gardenRectangle.name = "blue-garden";
			this.gardenRectangle.gardenBounds = {x: 0, y: 800, width: 617, height: 583}
		} else if (this.color === "green") {
			this.gardenRectangle = getRectangle(657, 965, 623, 530, 0xd0ffde);
			this.gardenRectangle.name = "green-garden";
			this.gardenRectangle.gardenBounds = {x: 657, y: 965, width: 623, height: 530}
		} else if (this.color === "yellow") {
			this.gardenRectangle = getRectangle(1469, 0, 578, 571, 0xfffdd5);
			this.gardenRectangle.name = "yellow-garden";
			this.gardenRectangle.gardenBounds = {x: 1469, y: 0, width: 578, height: 571}
		} else if (this.color === "purple") {
			this.gardenRectangle = getRectangle(1469, 764, 578, 579, 0xe5c2ff);
			this.gardenRectangle.name = "purple-garden";
			this.gardenRectangle.gardenBounds = {x: 1469, y: 764, width: 578, height: 579}
		} else if (this.color === "white") {
			this.gardenRectangle = getRectangle(804, 196, 625, 577, 0xeff0f4);
			this.gardenRectangle.name = "white-garden";
			this.gardenRectangle.gardenBounds = {x: 804, y: 196, width: 625, height: 577}
		}
		this.gardenRectangle.visible = true;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		this.app.stage.addChild(this.gardenRectangle);
	}

	getCorrectedBounds() {
		return {x: this.sprite.x + this.walkableWidth, y: this.sprite.y + this.walkableHeight, 
			width: this.sprite.width, height: this.sprite.height - this.walkableHeight};
	}
}
