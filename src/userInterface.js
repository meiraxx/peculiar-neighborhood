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
		let cardBatContainer = new PIXI.DisplayObjectContainer();
		let cardBatSprite = new PIXI.Sprite(cardBatTexture);
		cardBatSprite.scale.x = 0.10;
		cardBatSprite.scale.y = 0.10;
		cardBatContainer.addChild(cardBatSprite);

		let cardPistolContainer = new PIXI.DisplayObjectContainer();
		let cardPistolSprite = new PIXI.Sprite(cardPistolTexture);
		cardPistolSprite.scale.x = 0.10;
		cardPistolSprite.scale.y = 0.10;
		cardPistolContainer.x = cardBatContainer.x + 30;
		cardPistolContainer.addChild(cardPistolSprite);

		let cardNetgunContainer = new PIXI.DisplayObjectContainer();
		let cardNetgunSprite = new PIXI.Sprite(cardNetgunTexture);
		cardNetgunSprite.scale.x = 0.10;
		cardNetgunSprite.scale.y = 0.10;
		cardNetgunContainer.x = cardPistolContainer.x + 30;
		cardNetgunContainer.addChild(cardNetgunSprite);

		// setup initial zIndexes
		cardBatContainer.zIndex = 1;
		cardPistolContainer.zIndex = 2;
		cardNetgunContainer.zIndex = 3;

		// add card sprites to cards container
		this.cardsContainer.addChild(cardBatContainer);
		this.cardsContainer.addChild(cardPistolContainer);
		this.cardsContainer.addChild(cardNetgunContainer);

		// add the sprites to class for later use
		this.cardsContainer.cardBatContainer = cardBatContainer;
		this.cardsContainer.cardPistolContainer = cardPistolContainer;
		this.cardsContainer.cardNetgunContainer = cardNetgunContainer;
	}

	initCards() {
		this.app.stage.addChild(this.cardsContainer);
		console.log("cards initialized");
	}
}
