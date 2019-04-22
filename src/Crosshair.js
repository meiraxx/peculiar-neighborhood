export default class Crosshair {
	static loadResources() {
		PIXI.loader.add("assets/crosshairs/crosshair.png");
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        let crosshairTexture = PIXI.loader.resources["assets/crosshairs/crosshair.png"].texture;
		this.sprite = new PIXI.Sprite(crosshairTexture);
		this.sprite.scale.x = 0.1;
		this.sprite.scale.y = 0.1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.visible = false;
    }

    initObject() {
        this.app.stage.addChild(this.sprite);
		console.log("crosshair  initialized");
    }
}