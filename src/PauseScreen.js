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

        let outerRectangle = getRoundedRectangle(-width/2, -height/2, width, height, 5, 0x414554);
        this.container.addChild(outerRectangle);

        let diffValue = width/16;
        let innerRectangle = getRoundedRectangle(-width/2 + diffValue/2, -height/2 + diffValue/2,
        	width - diffValue, height - diffValue, 5, 0xd8c3d0);
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
			/*
			var colorMatrix = [
			    1,0,0,0.5,
			    0,1,0,0.5,
			    0,0,1,0.5,
			    0,0,0,1
			];
			var filter = new PIXI.ColorMatrixFilter();
			filter.matrix = colorMatrix;
			this.app.stage.filters = [filter];
			*/
			this.container.visible = false;
			console.log("Game unpaused");
		}
		else {
			/*
			var colorMatrix =  [
			    1,0,0,-0.5,
			    0,1,0,-0.5,
			    0,0,1,-0.5,
			    0,0,0,1
			];
			var filter = new PIXI.ColorMatrixFilter();
			filter.matrix = colorMatrix;
			this.app.stage.filters = [filter];
			*/
			this.container.visible = true;
			console.log("Game paused");
		}
	}

}