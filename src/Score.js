import * as PIXI from 'pixi.js'
import { textStyle } from "./lib/PixiUtilMethods";

export default class Score {
    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos) {
        let style = textStyle("scoreText");
        this.container = new PIXI.Container();
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "scoreContainer";
        this.container._zIndex = Number.MAX_SAFE_INTEGER;

        this.previousValue = 0;
        this.scoreText = new PIXI.Text("Score: " + 0, style);
        this.scoreText.resolution = 2;

        this.container.addChild(this.scoreText);
    }

    initObject() {
        this.app.stage.addChild(this.container);
		console.log("score initialized");
    }

    addScore(value) {
        let resultValue = this.previousValue + value;
        // score addition cases
        if (resultValue >= 10 && this.previousValue < 10) {
            this.container.x -= 10;
        }
        else if (resultValue >= 100 && this.previousValue < 100) {
            this.container.x -= 10;
        }
        // score subtraction cases
        else if (resultValue <= 10 && this.previousValue > 10) {
            this.container.x += 10;
        }
        else if (resultValue <= 100 && this.previousValue > 100) {
            this.container.x += 10;
        }
        
        this.scoreText.text = "Score: " + resultValue;
        this.previousValue = resultValue;
    }
}