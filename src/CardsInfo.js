export default class CardsInfo {
	static loadResources() {
		PIXI.loader.add("assets/cardsInfo/cardBatInfo.jpg");
		PIXI.loader.add("assets/cardsInfo/cardPistolInfo.jpg");
		PIXI.loader.add("assets/cardsInfo/cardNetgunInfo.jpg");
		PIXI.loader.add("assets/cardsInfo/cardShotgunInfo.jpg");
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos) {
		this.container = new PIXI.Container();
		this.container.x = x_pos - 50;
        this.container.y = y_pos - 50;
        this.container.scale.x = 0.30;
        this.container.scale.y = 0.30;

        this.container.name = "cardsInfo";

		let cardBatInfo = PIXI.loader.resources["assets/cardsInfo/cardBatInfo.jpg"].texture;
		let cardPistolInfo = PIXI.loader.resources["assets/cardsInfo/cardPistolInfo.jpg"].texture;
		let cardNetgunInfo = PIXI.loader.resources["assets/cardsInfo/cardNetgunInfo.jpg"].texture;

		let cardBatInfoSprite = new PIXI.Sprite(cardBatInfo);
		cardBatInfoSprite.name = "cardBatInfo";
		cardBatInfoSprite.visible = false;

		let cardPistolInfoSprite = new PIXI.Sprite(cardPistolInfo);
		cardPistolInfoSprite.name = "cardPistolInfo";
		cardPistolInfoSprite.visible = false;

		let cardNetgunInfoSprite = new PIXI.Sprite(cardNetgunInfo);
		cardNetgunInfoSprite.name = "cardNetgunInfo";
		cardNetgunInfoSprite.visible = false;

		this.container.addChild(cardBatInfoSprite);
		this.container.addChild(cardPistolInfoSprite);
		this.container.addChild(cardNetgunInfoSprite);
		this.displayed = false;
	}

	initObject() {
		this.app.stage.addChild(this.container);
		console.log("cards info initialized");
	}

	toggle(cardInfoName) {
		// recalculate what other elements are on the map
		let otherElements = this.app.stage.children.filter(child => child.name !== "pauseScreen" 
			&& child.name !== "cardsInfo");
		let otherCardsInfo = this.container.children.filter(child => child.name != cardInfoName);
		let cardInfo = this.container.getChildByName(cardInfoName);

		// toggle needs WebGL because of "filters"
		if (this.displayed === true) {
			let colorMatrix = new PIXI.filters.ColorMatrixFilter();
			// must clear color matrix instead of resetting it because
			// performance is greatly affected if this is on
			otherElements.forEach(function(element) {
				element.filters = undefined;
			});
			// put our card visible and others invisible
			otherCardsInfo.forEach(function(ci) {		
				ci.visible = false;
			});
			cardInfo.visible = false;
			this.displayed = false;
		}
		else {
			let colorMatrix = new PIXI.filters.ColorMatrixFilter();
			otherElements.forEach(function(element) {
				element.filters = [colorMatrix];
			});
			//colorMatrix.night(0.2, true);
			//colorMatrix.predator(1, true);
			colorMatrix.brightness(0.3, false);
			cardInfo.visible = true;
			this.displayed = true;
		}
	}
}