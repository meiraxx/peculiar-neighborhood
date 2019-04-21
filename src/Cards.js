export default class Cards {
	static loadResources() {
        PIXI.loader.add("assets/cards/cardBat.png"); //1
        PIXI.loader.add("assets/cards/cardPistol.png"); //2
        PIXI.loader.add("assets/cards/cardNetgun.png"); //3
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        this.container = new PIXI.Container();

        // cards-container global position
        this.container.x = x_pos;
        this.container.y = y_pos;

        // load cards textures
        let cardBatTexture = PIXI.loader.resources["assets/cards/cardBat.png"].texture;
        let cardPistolTexture = PIXI.loader.resources["assets/cards/cardPistol.png"].texture;
        let cardNetgunTexture = PIXI.loader.resources["assets/cards/cardNetgun.png"].texture;

        // build sprites and scale them to 100x100
        let cardBatSprite = new PIXI.Sprite(cardBatTexture);
        cardBatSprite.scale.x = 0.10;
        cardBatSprite.scale.y = 0.10;
        cardBatSprite.name = "bat";

        let cardPistolSprite = new PIXI.Sprite(cardPistolTexture);
        cardPistolSprite.scale.x = 0.10;
        cardPistolSprite.scale.y = 0.10;
        cardPistolSprite.x = cardBatSprite.x + 30;
        cardPistolSprite.name = "pistol";

        let cardNetgunSprite = new PIXI.Sprite(cardNetgunTexture);
        cardNetgunSprite.scale.x = 0.10;
        cardNetgunSprite.scale.y = 0.10;
        cardNetgunSprite.x = cardPistolSprite.x + 30;
        cardNetgunSprite.name = "netgun";

        // add card sprites to cards container and sort them by zIndex
        this.container.addChild(cardBatSprite);
        this.container.addChild(cardPistolSprite);
        this.container.addChild(cardNetgunSprite);

        this.resortCards(3, 2, 1);

        // add the sprites to class for later use
        this.container.cardBatSprite = cardBatSprite;
        this.container.cardPistolSprite = cardPistolSprite;
        this.container.cardNetgunSprite = cardNetgunSprite;
    }

    initObject() {
        this.app.stage.addChild(this.container);
        console.log("cards initialized");
    }

    resortCards(batZ, pistolZ, netgunZ) {
        this.container.getChildByName("bat").zIndex = batZ;
        this.container.getChildByName("pistol").zIndex = pistolZ;
        this.container.getChildByName("netgun").zIndex = netgunZ;
        this.container.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
    }

    highlightCard(card) {
        if (card === "bat") {
            this.resortCards(3, 2, 1);
            if (this.container.cardBatSprite.y === 0) {
                this.container.cardBatSprite.y -= 10;
                this.container.cardPistolSprite.y = 0;
                this.container.cardNetgunSprite.y = 0;
            }
        }
        else if (card === "pistol") {
            this.resortCards(1, 3, 2);
            if (this.container.cardPistolSprite.y === 0) {
                this.container.cardPistolSprite.y -= 10;
                this.container.cardBatSprite.y = 0;
                this.container.cardNetgunSprite.y = 0;
            }
        }
        else if (card === "netgun") {
            this.resortCards(1, 2, 3);
            if (this.container.cardNetgunSprite.y === 0) {
                this.container.cardNetgunSprite.y -= 10;
                this.container.cardBatSprite.y = 0;
                this.container.cardPistolSprite.y = 0;
            }
        }
        else if (card === "none") {
            this.container.cardNetgunSprite.y = 0;
            this.container.cardBatSprite.y = 0;
            this.container.cardPistolSprite.y = 0;
        }
    }
  
}