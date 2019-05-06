import * as PIXI from 'pixi.js'
export default class Clock {
	static loadResources(app) {
        app.loader.add("assets/timer/clock.png"); 
        app.loader.add("assets/timer/clockHand.png"); 
    }

    constructor(app) {
    	this.app = app;
        this.currentTime = 0.0;
        this.totalTime = 0.0;
    }

    prepareObject(x_pos, y_pos) {
        this.container = new PIXI.Container();

        // cards-container global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "clock";
        this.container._zIndex = Number.MAX_SAFE_INTEGER;
        // load cards textures
        let clockHandTex = this.app.loader.resources["assets/timer/clockHand.png"].texture;
        let clockTex = this.app.loader.resources["assets/timer/clock.png"].texture;

        this.clockSprite = new PIXI.Sprite(clockTex);
        this.clockSprite.name = "clockSprite";
        this.container.addChild(this.clockSprite);
        let clockHandSprite = new PIXI.Sprite(clockHandTex);
        
        clockHandSprite.name = "clockHandSprite";
        this.clockHandSpriteContainer = new PIXI.Container();
        this.clockHandSpriteContainer.x = this.clockSprite.width / 2;
        this.clockHandSpriteContainer.y = this.clockSprite.height / 2;
        this.clockHandSpriteContainer.addChild(clockHandSprite);
        clockHandSprite.x = - clockHandSprite.width / 2;
        clockHandSprite.y = - clockHandSprite.height;
        this.container.addChild(this.clockHandSpriteContainer);
        

        

       

    }

    initObject() {
        this.app.stage.addChild(this.container);
        console.log("clock initialized");
    }

  
    update(delta) {
        this.currentTime += delta;
        this.clockHandSpriteContainer.rotation = 2.0 * Math.PI * (this.currentTime / this.totalTime);
    }

    resetClock() {
        this.clockHandSpriteContainer.rotation = 0.0;
    }

  
}