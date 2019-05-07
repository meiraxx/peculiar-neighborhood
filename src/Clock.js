import * as PIXI from 'pixi.js';
import { getRoundedRectangle, textStyle } from "./lib/PixiUtilMethods";

export default class Clock {
	static loadResources(app) {
        app.loader.add("assets/timer/clock.png"); 
        app.loader.add("assets/timer/clockHand.png"); 
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos, time) {
        this.currentTime = 0.0;
        this.totalTime = time;
        this.frameCounter = 0;
        this.container = new PIXI.Container();

        // cards-container global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "clock";
        this.container._zIndex = Number.MAX_SAFE_INTEGER;

        // CLOCK
        // load cards textures
        let clockHandTex = this.app.loader.resources["assets/timer/clockHand.png"].texture;
        let clockTex = this.app.loader.resources["assets/timer/clock.png"].texture;
        let clockScale = 0.3;

        this.clockSprite = new PIXI.Sprite(clockTex);
        this.clockSprite.x = 2;
        this.clockSprite.scale.x = clockScale;
        this.clockSprite.scale.y = clockScale;

        // CLOCK-HANDER
        this.clockHandSprite = new PIXI.Sprite(clockHandTex);
        this.clockHandSpriteContainer = new PIXI.Container();
        this.clockHandSpriteContainer.scale.x = clockScale;
        this.clockHandSpriteContainer.scale.y = clockScale;
        this.clockHandSpriteContainer.x = this.clockSprite.width / 2 + 2;
        this.clockHandSpriteContainer.y = this.clockSprite.height / 2 + 2;
        this.clockHandSpriteContainer.addChild(this.clockHandSprite);
        this.clockHandSprite.x = - this.clockHandSprite.width / 2;
        this.clockHandSprite.y = - this.clockHandSprite.height;

        // shadow rectangle
        let shadowRectangle = getRoundedRectangle(1, -1, 
            this.clockSprite.width*2.5 + this.clockSprite.width*0.02,
            this.clockSprite.height + 4 + this.clockSprite.height*0.02,
            2, 0x000000);

        // RECTANGLE
        let rectangleClockColor = 0xF1EDE1;
        let rectangleClock = getRoundedRectangle(0, -2, 
            this.clockSprite.width*2.5, this.clockSprite.height + 4, 2, rectangleClockColor);

        // TEXT
        this.timeText = new PIXI.Text(time, textStyle("timeText"));
        this.timeText.x = this.clockSprite.width*1.4;
        this.timeText.y = this.clockSprite.height/2 - this.timeText.height/2;
        this.timeText.resolution = 2;
        
        this.container.addChild(shadowRectangle);
        this.container.addChild(rectangleClock);
        this.container.addChild(this.timeText);
        this.container.addChild(this.clockSprite);
        this.container.addChild(this.clockHandSpriteContainer);
    }

    initObject() {
        this.app.stage.addChild(this.container);
        console.log("clock initialized");
    }
  
    update(delta) {
        this.frameCounter += 1;
        // with FPS = 60, delta = 1/60 s (this.app.ticker.FPS)
        if (this.frameCounter === this.app.ticker.integerFPS) {
            if (this.timeText.text > 0) {
                this.currentTime += 1;
                let radius = (this.currentTime / this.totalTime);
                this.clockHandSpriteContainer.rotation = 2.0 * Math.PI * radius;
                this.timeText.text = this.timeText.text - 1;
            }
            // else new wave
            this.frameCounter = 0;
        }
    }

    resetClock(newTime) {
        this.currentTime = 0.0;
        this.totalTime = newTime;
        this.frameCounter = 0;
        this.clockHandSpriteContainer.rotation = 0.0;
    }

  
}