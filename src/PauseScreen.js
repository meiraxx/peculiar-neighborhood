import { getRoundedRectangle, textStyle } from "./lib/PixiUtilMethods";

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

        let betweenContainersHeight = height/32;
        let textInsideContainerDrift = width/128;

        let outerRectangle = getRoundedRectangle(-width/2, -height/2, width, height, 3, 0x414554);
        this.container.addChild(outerRectangle);

        let innerRectangle = getRoundedRectangle(-width/2 + width/32, -height/2 + betweenContainersHeight,
        	width - width/16, height - height/16, 3, 0xd8c3d0);
        this.container.addChild(innerRectangle);

        let gamePausedTextRectangle = getRoundedRectangle(-width/2 + width/16, -height/2 + height/16, 
        	width - width/8, height/8, 3, 0x414554);
        this.container.addChild(gamePausedTextRectangle);
        
        let gamePausedText = new PIXI.Text("GAME PAUSED", textStyle("gamePausedText"));
        // magic values "10" and "-2" because of visual correctness
		gamePausedText.x = -width/2 + width/16 + gamePausedTextRectangle.width/4 - 10;
		gamePausedText.y = -height/2 + height/16 + gamePausedTextRectangle.height/4 - 2;
		gamePausedText.resolution = 2;
		this.container.addChild(gamePausedText);

		let gameHelpRectangle = getRoundedRectangle(-width/2 + width/16, 
			-height/2 + gamePausedTextRectangle.height + betweenContainersHeight*3, 
        	width - width/8, height - 5 * betweenContainersHeight - height/8,
        	3, 0x414554);
        this.container.addChild(gameHelpRectangle);

        let gameHelpString = "\"0\": unequip items\n" + 
        					"\"1\": equip bat\n" +
        					"\"2\": equip pistol\n" +
        					"\"3\": equip netgun\n" +
        					"\"4\": equip whistle\n" +
        					"\"F1\": see bat info\n" +
        					"\"F2\": see pistol info\n" +
        					"\"F3\": see netgun info\n" +
        					"\"F4\": see whistle info\n" +
        					"\"ArrowLeft\": walk left\n" +
        					"\"ArrowUp\": walk up\n" +
        					"\"ArrowDown\": walk down\n" +
        					"\"ArrowRight\": walk right\n" +
        					"\"F\": interact with objects on the map\n" +
        					"\"MOUSE-1\": use item\n" + 
        					"\"P\": pause/unpause game";

        let gameHelpText = new PIXI.Text(gameHelpString, textStyle("gameHelpText"));
		gameHelpText.x = -width/2 + width/16 + textInsideContainerDrift;
		gameHelpText.y = -height/2 + betweenContainersHeight*3 
			+ gamePausedTextRectangle.height + textInsideContainerDrift;
		gameHelpText.resolution = 2;
		this.container.addChild(gameHelpText);
	}

	initObject() {
		this.container.visible = false;
		this.app.stage.addChild(this.container);
		console.log("pause screen initialized");
	}

	toggle() {
		// recalculate what other elements are on the map
		let otherElements = this.app.stage.children.filter(child => child.name !== "pauseScreen" 
			&& child.name !== "cardsInfo");

		// toggle needs WebGL because of "filters"
		if (this.container.visible) {
			let colorMatrix = new PIXI.filters.ColorMatrixFilter();
			// must clear color matrix instead of resetting it because
			// performance is greatly affected if this is on
			otherElements.forEach(function(element) {
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