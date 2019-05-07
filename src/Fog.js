import * as PIXI from 'pixi.js'
export default class Fog {
	
	constructor(app) {
		this.app = app;
	}
	static loadResources(app) {
		app.loader.add("assets/fog/fog.png");
	}
	prepareObject() {
		let fogTexture = this.app.loader.resources["assets/fog/fog.png"].texture;

		this.fogSprite0 = new PIXI.Sprite(fogTexture);
		this.fogSprite0.name = "fog0";
		this.fogSprite0.x = -2048;
		this.fogSprite0.y = -1024;
		this.fogSprite0.scale.x *= 2;
		this.fogSprite0.scale.y *= 2;
		this.fogSprite1 = new PIXI.Sprite(fogTexture);
		this.fogSprite1.name = "fog1";
		this.fogSprite1.x = 0;
		this.fogSprite1.y = -1024;
		this.fogSprite1.scale.x *= 2;
		this.fogSprite1.scale.y *= 2;
		this.fogSprite1._zIndex = Number.MAX_SAFE_INTEGER - 1;
		this.fogSprite0._zIndex = Number.MAX_SAFE_INTEGER - 1;
	}

	initObject() {
		this.app.stage.addChild(this.fogSprite0);
		this.app.stage.addChild(this.fogSprite1);
		console.log("fog initialized");
	}

	initLoop(player) {
		this.app.ticker.add( (delta) => this.fogLoop(delta, player));
		console.log("fog loop initialized");
	}

	// fog movement only works in Linux when we force Canvas mode instead of WebGL
	// both work in Windows
	fogLoop(delta, player) {
		if (!player.ui.isPaused()) {
			this.fogSprite0.x += 0.2;
			this.fogSprite0.x = this.fogSprite0.x >= 2048 ? -2048 : this.fogSprite0.x;

			this.fogSprite1.x += 0.2;
			this.fogSprite1.x = this.fogSprite1.x >= 2048 ? -2048 : this.fogSprite1.x;
		}
	}
}