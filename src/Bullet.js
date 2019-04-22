
export default class Bullet {
	
	static loadResources() {
		PIXI.loader.add("assets/bullet/bullet.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject() {
		let tex = PIXI.loader.resources["assets/bullet/bullet.png"].texture;
		this.sprite = new PIXI.Sprite(tex);
		this.sprite.scale.x = 0.01;
		this.sprite.scale.y = 0.01;
		this.sprite.name = "bullet";
		this.reset();		
	}

	go(x_pos, y_pos, speedX, speedY, rotation) {
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.rotation = rotation;
		this.speedX = speedX;
		this.speedY = speedY;
		this.sprite.visible = true;
	}

	reset() {
		this.currentRange = 0.0;
		this.speedX = 0;
		this.speedY = 0;
		this.sprite.visible = false;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("bullet  initialized");
	}


	update(delta) {
		this.sprite.x += delta * this.speedX;
		this.sprite.y += delta * this.speedY;
		this.currentRange += Math.sqrt(delta * this.speedX * delta * this.speedX + delta * this.speedY * delta * this.speedY);
		if(this.currentRange > 300) {
			this.reset();
		}
	}

}
