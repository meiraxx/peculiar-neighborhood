export default class UserInterface {
	constructor(app) {
		this.app = app;
	}

	prepareHealthbar(x_pos, y_pos, width, height) {
		//Create the health bar
		this.healthBar = new PIXI.Container();

		// healthbar global position
		this.healthBar.x = Math.round(x_pos - (this.healthBar.width/2));
		this.healthBar.y = y_pos;


		//Create the black background rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.beginFill(0x000000);
		innerBar.drawRect(-width/2, 0, width, height);
		innerBar.endFill();
		this.healthBar.addChild(innerBar);

		//Create the front red rectangle
		let outerBar = new PIXI.Graphics();
		outerBar.beginFill(0xFF3300);
		outerBar.drawRect(-width/2, 0, width, height);
		outerBar.endFill();
		this.healthBar.addChild(outerBar);

		this.healthBar.outer = outerBar;
	}

	initHealthbar() {
		this.app.stage.addChild(this.healthBar);
		console.log("healthBar initialized");
	}
}
