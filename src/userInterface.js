import textStyle from "./textStyle";

export default class UserInterface {
	constructor(app) {
		this.app = app;
	}

	prepareHealthbar(x_pos, y_pos, width, height, colorCode, maxHealth) {
		// create the health bar
		this.healthBar = new PIXI.Container();

		// healthbar global position
		this.healthBar.x = Math.round(x_pos - (this.healthBar.width/2));
		this.healthBar.y = y_pos;

		// create the max-health rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.beginFill(0x000000);
		innerBar.drawRoundedRect(-width/2, 0, width, height, 5);
		innerBar.endFill();
		this.healthBar.addChild(innerBar);

		// create the current-health rectangle with an outline effect
		let outerBar = new PIXI.Graphics();
		let diffValue = width/32;

		outerBar.beginFill(colorCode);
		outerBar.drawRoundedRect(-width/2 + diffValue/2, diffValue/2, width-diffValue, height-diffValue, 5);
		outerBar.endFill();
		this.healthBar.addChild(outerBar);
		this.healthBar.outer = outerBar;

		let style = textStyle("healthText");
		this.healthbarText = new PIXI.Text(maxHealth, style);
		this.healthbarText.x = -10;
		this.healthbarText.y = -5;
		this.healthBar.addChild(this.healthbarText);

	}

	initHealthbar() {
		this.app.stage.addChild(this.healthBar);
		console.log("healthBar initialized");
	}
}
