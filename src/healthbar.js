import $ from 'pixi.js';

export default class Healthbar {
	constructor(rootElement, app) {
		this.rootElement = rootElement;
		this.app = app;
	}

	setupOnResourcesLoaded(x_pos, y_pos) {
		//Create the health bar
		this.healthBar = new PIXI.Container();
		//let value = $('#div').position().top;
		//console.log("Value: " + value);
		this.healthBar.x = x_pos - (this.healthBar.width/2);
		this.healthBar.y = y_pos;
		//Create the black background rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.beginFill(0x000000);
		innerBar.drawRect(0, 0, 128, 8);
		innerBar.endFill();
		this.healthBar.addChild(innerBar);

		//Create the front red rectangle
		let outerBar = new PIXI.Graphics();
		outerBar.beginFill(0xFF3300);
		outerBar.drawRect(0, 0, 128, 8);
		outerBar.endFill();
		this.healthBar.addChild(outerBar);

		this.healthBar.outer = outerBar;

		this.app.stage.addChild(this.healthBar);
	}
}
