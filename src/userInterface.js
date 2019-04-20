import textStyle from "./aux-lib/textStyle";

export default class UserInterface {
	constructor(app) {
		this.app = app;
		PIXI.loader.add("assets/cards/cardBat.png"); //1
		PIXI.loader.add("assets/cards/cardPistol.png"); //2
		PIXI.loader.add("assets/cards/cardNetgun.png"); //3
	}

	prepareHealthbar(x_pos, y_pos, width, height, colorCode, maxHealth) {
		// create the health bar
		this.healthBar = new PIXI.Container();

		// health properties
		this.healthBar.maxHealth = maxHealth;
		this.healthBar.currHealth = maxHealth;

		// healthbar global position
		this.healthBar.x = x_pos;
		this.healthBar.y = y_pos;

		// create the max-health rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.beginFill(0x000000);
		innerBar.drawRoundedRect(-width/2, 0, width, height, 5);
		innerBar.endFill();
		this.healthBar.addChild(innerBar);
		// save innerbar reference
		this.healthBar.innerBar = innerBar;

		// create the current-health rectangle with an outline effect
		let outerBar = new PIXI.Graphics();
		let diffValue = width/32;

		outerBar.beginFill(colorCode);
		outerBar.drawRoundedRect(-width/2 + diffValue/2, diffValue/2, width-diffValue, height-diffValue, 5);
		outerBar.endFill();
		this.healthBar.addChild(outerBar);
		// save outerbar reference
		this.healthBar.outerBar = outerBar;

		let style = textStyle("healthText");
		let valueText = new PIXI.Text(maxHealth, style);
		valueText.x = -10;
		valueText.y = -15;
		valueText.resolution = 2;
		this.healthBar.addChild(valueText);
		// save health value reference
		this.healthBar.valueText = valueText;
	}

	initHealthbar() {
		this.app.stage.addChild(this.healthBar);
		console.log("healthBar initialized");
	}

	subtractHealth(value) {
		let maxWidth = this.healthBar.innerBar.width;
		let maxHealth = this.healthBar.maxHealth;
		let ratio = maxWidth/maxHealth;
		console.log("Healthbar maxWidth/maxHealth ratio: " + ratio);
		this.healthBar.currHealth -= value;
		this.healthBar.outerBar.width -= value*ratio;
		this.healthBar.valueText.setText(this.healthBar.currHealth);
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
}
