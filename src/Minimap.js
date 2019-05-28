import * as PIXI from 'pixi.js'
import { textStyle, getRoundedRectangle, getIntLength } from "./lib/PixiUtilMethods";

export default class Minimap {
	static loadResources(app) {
        app.loader.add("assets/minimap/minimap.png");
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        this.container = new PIXI.Container();

        // cards-container global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "minimap";
        this.container._zIndex = Number.MAX_SAFE_INTEGER;
        // load cards textures
        let minimapTex = this.app.loader.resources["assets/minimap/minimap.png"].texture;

        // build sprites and scale them to 100x100
        let minimapSprite = new PIXI.Sprite(minimapTex);
        minimapSprite.scale.x = 0.4;
        minimapSprite.scale.y = 0.4;
        minimapSprite.name = "cardBat";

        // add card sprites to cards container and sort them by zIndex
        this.container.addChild(minimapSprite);

        // add the sprites to class for later use
        this.container.minimapSprite = minimapSprite;
    }

    initObject() {
        this.app.stage.addChild(this.container);
    }
}