
export default class Bullet {
	
	static loadResources() {
		PIXI.loader.add("assets/bullet/bullet.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, speedX, speedY, rotation) {
		let tex = PIXI.loader.resources["assets/bullet/bullet.png"].texture;
		this.sprite = new PIXI.Sprite(tex);
		this.sprite.scale.x = 0.01;
		this.sprite.scale.y = 0.01;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.rotation = rotation;
		this.speedX = speedX;
		this.speedY = speedY;
		this.sprite.name = "bullet";
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("bullet  initialized");
	}

	update(delta) {
		this.sprite.x += delta * this.speedX;
		this.sprite.y += delta * this.speedY;
	}

}
