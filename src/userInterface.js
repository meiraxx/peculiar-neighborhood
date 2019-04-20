import HealthBar from "./HealthBar";

export default class UserInterface {
	static loadResources() {
		PIXI.loader.add("assets/cards/cardBat.png"); //1
		PIXI.loader.add("assets/cards/cardPistol.png"); //2
		PIXI.loader.add("assets/cards/cardNetgun.png"); //3
	}
	
	constructor(app) {
		this.app = app;
	}

	prepareHealthbar(x_pos, y_pos, width, height, colorCode, maxHealth) {
		// create the health bar
		this.healthBar = new HealthBar(this.app);
		this.healthBar.prepareObject(x_pos, y_pos, width, height, colorCode, maxHealth);
	}

	initHealthbar() {
		this.healthBar.initObject();
	}

	prepareCards(x_pos, y_pos) {
		this.cardsContainer = new PIXI.Container();

		// cards-container global position
		this.cardsContainer.x = x_pos;
		this.cardsContainer.y = y_pos;

		// load cards textures
		let cardBatTexture = PIXI.loader.resources["assets/cards/cardBat.png"].texture;
		let cardPistolTexture = PIXI.loader.resources["assets/cards/cardPistol.png"].texture;
		let cardNetgunTexture = PIXI.loader.resources["assets/cards/cardNetgun.png"].texture;

		// build sprites and scale them to 100x100
		let cardBatSprite = new PIXI.Sprite(cardBatTexture);
		cardBatSprite.scale.x = 0.10;
		cardBatSprite.scale.y = 0.10;
		cardBatSprite.y = -10;
		cardBatSprite.name = "cardBat";

		let cardPistolSprite = new PIXI.Sprite(cardPistolTexture);
		cardPistolSprite.scale.x = 0.10;
		cardPistolSprite.scale.y = 0.10;
		cardPistolSprite.x = cardBatSprite.x + 30;
		cardPistolSprite.name = "cardPistol";

		let cardNetgunSprite = new PIXI.Sprite(cardNetgunTexture);
		cardNetgunSprite.scale.x = 0.10;
		cardNetgunSprite.scale.y = 0.10;
		cardNetgunSprite.x = cardPistolSprite.x + 30;
		cardNetgunSprite.name = "cardNetgun";

		// add card sprites to cards container and sort them by zIndex
		this.cardsContainer.addChild(cardBatSprite);
		this.cardsContainer.addChild(cardPistolSprite);
		this.cardsContainer.addChild(cardNetgunSprite);

		this.resortCards(3, 2, 1);

		// add the sprites to class for later use
		this.cardsContainer.cardBatSprite = cardBatSprite;
		this.cardsContainer.cardPistolSprite = cardPistolSprite;
		this.cardsContainer.cardNetgunSprite = cardNetgunSprite;

	}

	initCards() {
		this.app.stage.addChild(this.cardsContainer);
		console.log("cards initialized");
	}

	resortCards(batZ, pistolZ, netgunZ) {
		this.cardsContainer.getChildByName("cardBat").zIndex = batZ;
		this.cardsContainer.getChildByName("cardPistol").zIndex = pistolZ;
		this.cardsContainer.getChildByName("cardNetgun").zIndex = netgunZ;
		this.cardsContainer.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
	}

	highlightCard(card) {
		if (card === "cardBat") {
			this.resortCards(3, 2, 1);
			if (this.cardsContainer.cardBatSprite.y === 0) {
				this.cardsContainer.cardBatSprite.y -= 10;
				this.cardsContainer.cardPistolSprite.y = 0;
				this.cardsContainer.cardNetgunSprite.y = 0;
			}
		}
		else if (card === "cardPistol") {
			this.resortCards(1, 3, 2);
			if (this.cardsContainer.cardPistolSprite.y === 0) {
				this.cardsContainer.cardPistolSprite.y -= 10;
				this.cardsContainer.cardBatSprite.y = 0;
				this.cardsContainer.cardNetgunSprite.y = 0;
			}
		}
		else if (card === "cardNetgun") {
			this.resortCards(1, 2, 3);
			if (this.cardsContainer.cardNetgunSprite.y === 0) {
				this.cardsContainer.cardNetgunSprite.y -= 10;
				this.cardsContainer.cardBatSprite.y = 0;
				this.cardsContainer.cardPistolSprite.y = 0;
			}
		}
	}
}
