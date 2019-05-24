import * as PIXI from 'pixi.js'
export default class Crosshair {
	static loadResources(app) {
		app.loader.add("assets/crosshairs/crosshair.png");
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        let crosshairTexture = this.app.loader.resources["assets/crosshairs/crosshair.png"].texture;
		this.sprite = new PIXI.Sprite(crosshairTexture);
		this.sprite.scale.x = 0.1;
		this.sprite.scale.y = 0.1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
        this.sprite.name = "crosshair";
		this.sprite.visible = false;
        this.sprite._zIndex = Number.MAX_SAFE_INTEGER;

    }

    initObject() {
        this.app.stage.addChild(this.sprite);
    }
}