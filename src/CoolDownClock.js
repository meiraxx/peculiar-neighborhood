import * as PIXI from 'pixi.js'
export default class CoolDownClock {
	static loadResources(app) {
		app.loader.add("assets/cooldown/cooldown.png");
    }

    constructor(app) {
    	this.app = app;
        this.speed = 0.0;
    }

    prepareObject(x_pos, y_pos) {
        let tex = this.app.loader.resources["assets/cooldown/cooldown.png"].texture;
      
		this.sprite = new PIXI.Sprite(tex);
        this.sprite.scale.y = 1.0;
        this.sprite.scale.x = 1.0;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
        this.sprite.pivot.x = this.sprite.width / 2;
        this.sprite.pivot.y = this.sprite.height / 2;
        this.sprite.name = "cooldown";
		this.sprite.visible = false;
        this.sprite._zIndex = Number.MAX_SAFE_INTEGER;

    }

    initObject() {
        this.app.stage.addChild(this.sprite);
		console.log("cooldown initialized");
    }

    update(delta, playerPos) {
        this.sprite.position.x = playerPos.x;
        this.sprite.position.y = playerPos.y;
        this.sprite.angle += this.speed * delta;
        if(this.sprite.angle > 360)
            this.sprite.visible = false;
    }
    

}