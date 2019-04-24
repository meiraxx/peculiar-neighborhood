export default class House {
	
	static loadResources() {
		PIXI.loader.add("assets/staticElements/house.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, i) {
		let houseTexture = PIXI.loader.resources["assets/staticElements/house.png"].texture;
		
		this.sprite = new PIXI.Sprite(houseTexture);
		this.sprite.scale.x = 0.4;
		this.sprite.scale.y = 0.4;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "house" + i;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("house initialized");
	}

}
