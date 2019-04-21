export default class Bush {
	static loadResources() {
		// nothing
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos, width, height) {
		this.container = new PIXI.Container();
		this.container.x = x_pos;
        this.container.y = y_pos;

		let outerRectangle = new PIXI.Graphics();
        outerRectangle.beginFill(0x414554);
        outerRectangle.drawRoundedRect(-width/2, -height/2, width, height, 5);
        outerRectangle.endFill();
        this.outerRectangle = outerRectangle;
        this.container.addChild(outerRectangle);

        let innerRectangle = new PIXI.Graphics();
        let diffValue = width/16;
        innerRectangle.beginFill(0xd8c3d0);
        innerRectangle.drawRoundedRect(-width/2 + diffValue/2, -height/2 + diffValue/2,
        	width- diffValue, height - diffValue, 5);
        innerRectangle.endFill();
        this.innerRectangle = innerRectangle;
        this.container.addChild(innerRectangle);

	}

	initObject() {
		this.container.visible = false;
		this.app.stage.addChild(this.container);
		console.log("pause screen");
	}

	toggle() {
		// TODO: darken all sprites
		// TODO: pause screen with command information
		if (this.container.visible) {
			this.container.visible = false;
			console.log("Game unpaused");
		}
		else {
			this.container.visible = true;
			console.log("Game paused");
		}
	}

}