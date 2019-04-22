import { getRoundedRectangle } from "./lib/PixiUtilMethods";

export default class PauseScreen {
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
        this.container.name = "pauseScreen";

        let outerRectangle = getRoundedRectangle(-width/2, -height/2, width, height, 5, 0x414554);
        this.container.addChild(outerRectangle);

        let diffValue = width/16;
        let innerRectangle = getRoundedRectangle(-width/2 + diffValue/2, -height/2 + diffValue/2,
        	width - diffValue, height - diffValue, 5, 0xd8c3d0);
        this.container.addChild(innerRectangle);

        let gamePausedRectangle = getRoundedRectangle(-width/2, -height/2, width, height, 5, 0x414554);  
	}

	initObject() {
		this.container.visible = false;
		this.app.stage.addChild(this.container);
		console.log("pause screen initialized");
	}

	toggle() {
		// TODO2: pause screen with command information
		// recalculate what other elements are on the map
		let otherElements = this.app.stage.children.filter(child => child.name !== "pauseScreen");
		console.log(this.app.stage.children);
		console.log(otherElements);
		// toggle needs WebGL because of "filters"
		if (this.container.visible) {
			let colorMatrix = new PIXI.filters.ColorMatrixFilter();
			otherElements.forEach(function(element) {
				// must clear color matrix instead of resetting it because
				// performance is greatly affected if this is on
				element.filters = undefined;
			});

			this.container.visible = false;
		}
		else {
			let colorMatrix = new PIXI.filters.ColorMatrixFilter();
			otherElements.forEach(function(element) {
				element.filters = [colorMatrix];
			});
			//colorMatrix.night(0.2, true);
			//colorMatrix.predator(1, true);
			colorMatrix.brightness(0.3, false);

			this.container.visible = true;
		}
	}

}