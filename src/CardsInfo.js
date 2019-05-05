import * as PIXI from 'pixi.js'
import { applyFilter } from "./lib/PixiUtilMethods";

export default class CardsInfo {
	static loadResources(app) {
		// already loaded in cards
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareObject(x_pos, y_pos) {
		this.container = new PIXI.Container();
		this.container.x = x_pos - 50; //hardcoded playerWidth/2
        this.container.y = y_pos;
        this.container.x = x_pos - 150; //hardcoded playerWidth/2
        this.container.y = y_pos - 100;
        this.container.scale.x = 0.30;
        this.container.scale.y = 0.30;
        this.container._zIndex = Number.MAX_SAFE_INTEGER;
  	
        this.container.name = "cardsInfo";

		let cardBatInfo = this.app.loader.resources["assets/cards/cardBat.png"].texture;
		let cardPistolInfo = this.app.loader.resources["assets/cards/cardPistol.png"].texture;
		let cardNetgunInfo = this.app.loader.resources["assets/cards/cardNetgun.png"].texture;
		let cardWhistleInfo = this.app.loader.resources["assets/cards/cardWhistle.png"].texture;

		let cardBatInfoSprite = new PIXI.Sprite(cardBatInfo);
		cardBatInfoSprite.name = "cardBatInfo";
		cardBatInfoSprite.visible = false;

		let cardPistolInfoSprite = new PIXI.Sprite(cardPistolInfo);
		cardPistolInfoSprite.name = "cardPistolInfo";
		cardPistolInfoSprite.visible = false;

		let cardNetgunInfoSprite = new PIXI.Sprite(cardNetgunInfo);
		cardNetgunInfoSprite.name = "cardNetgunInfo";
		cardNetgunInfoSprite.visible = false;

		let cardWhistleInfoSprite = new PIXI.Sprite(cardWhistleInfo);
		cardWhistleInfoSprite.name = "cardWhistleInfo";
		cardWhistleInfoSprite.visible = false;

		this.container.addChild(cardBatInfoSprite);
		this.container.addChild(cardPistolInfoSprite);
		this.container.addChild(cardNetgunInfoSprite);
		this.container.addChild(cardWhistleInfoSprite);
		
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

		if (this.displayed === true) {
			otherCardsInfo.forEach(function(ci) {		
				ci.visible = false;
			});
		}
		
		if (this.displayed === true && cardInfo.visible === true) {
			applyFilter(otherElements, "reset");
			// put our card visible and others invisible
			otherCardsInfo.forEach(function(ci) {		
				ci.visible = false;
			});
			cardInfo.visible = false;
			this.displayed = false;
		}
		else {
			applyFilter(otherElements, "darken");
			cardInfo.visible = true;
			this.displayed = true;
		}
	}
}