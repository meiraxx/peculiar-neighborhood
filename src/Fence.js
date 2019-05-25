import * as PIXI from 'pixi.js';

export default class Fence {
	static loadResources(app) {
		let fenceColors = ["blue", "green", "purple", "red", "yellow"];
		for (var i = 0; i < fenceColors.length; i++) {
			app.loader.add("assets/staticElements/fences/" + fenceColors[i] + "-horizontal.png");
			app.loader.add("assets/staticElements/fences/" + fenceColors[i] + "-vertical.png");
		}
	}
	
	constructor(app) {
		this.app = app;
	}

	// H3 Fences width: 128; H3 Fences height: 54; V1 width: 11; H1 width: 50
	// V3 Fences width: 11; V3 Fences height: 144; V1 height: 84; H1 height: 54
	prepareObject(x_pos, y_pos, i, color, direction) {
		let fenceTexture = this.app.loader.resources["assets/staticElements/fences/" + color 
			+ "-" + direction + ".png"].texture;
		this.sprite = new PIXI.Sprite(fenceTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-fence-" + i;
		this.sprite.contextClass = this;
		this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;
		this.walkableHeight = 50;
		this.walkableWidth = 0;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
	}

	getCorrectedBounds(playerSprite) {
		return {x: this.sprite.x + this.walkableWidth, y: this.sprite.y + this.walkableHeight, 
			width: this.sprite.width, height: this.sprite.height - this.walkableHeight};
	}

}