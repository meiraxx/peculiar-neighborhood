import * as PIXI from 'pixi.js'

export default class Missile {
	static loadResources(app) {
		app.loader.add("assets/missiles/bullet.png");
		app.loader.add("assets/missiles/net.png");
	}
	
	constructor(app, typeName) {
		this.app = app;
		this.typeName = typeName;
	}
	
	prepareObject(x_pos, y_pos, i) {
		let tex;
		if(this.typeName === "net") {
			tex = this.app.loader.resources["assets/missiles/net.png"].texture;	
		} else if(this.typeName === "bullet") {
			tex = this.app.loader.resources["assets/missiles/bullet.png"].texture;
		} else if (this.typeName === "bat") {
			//tex = PIXI.Texture.EMPTY;
			tex = this.app.loader.resources["assets/missiles/bullet.png"].texture;
		}
		
		this.sprite = new PIXI.Sprite(tex);
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;

		if (this.typeName === "net") {
			this.sprite.scale.x = 0.2;
			this.sprite.scale.y = 0.2;
		} else if (this.typeName === "bullet") {
			this.sprite.scale.x = 0.4;
			this.sprite.scale.y = 0.4;
		} else if (this.typeName === "bat") {
			this.sprite.scale.x = 0.4;
			this.sprite.scale.y = 0.4;
		}

		this.sprite.name = this.typeName + i;
		this.reset();		
	}

	go(x_pos, y_pos, x_vel, y_vel, rotation) {
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.rotation = rotation;
		this.sprite.vx = x_vel;
		this.sprite.vy = y_vel;
		this.sprite.visible = true;
	}

	reset() {
		this.currentRange = 0.0;
		this.sprite.x = 0;
		this.sprite.y = 0;
		this.sprite.vx = 0;
		this.sprite.vy = 0;
		this.sprite.visible = false;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		//console.log(this.sprite.name + " initialized");
	}


	update(delta) {
		this.sprite.x += delta * this.sprite.vx;
		this.sprite.y += delta * this.sprite.vy;
		this.currentRange += Math.sqrt(delta * this.sprite.vx * delta * this.sprite.vx + delta * this.sprite.vy * delta * this.sprite.vy);
		if(this.currentRange > 200) {
			this.reset();
		}
	}

}
