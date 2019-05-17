import * as PIXI from 'pixi.js'
import { textStyle } from "./lib/PixiUtilMethods";

export default class Score {
    constructor(app) {
    	this.app = app;
    }

    prepareObject(x1_pos, y1_pos, x2_pos, y2_pos) {
        this.totalContainer = new PIXI.Container();
        this.totalContainer.x = x1_pos;
        this.totalContainer.y = y1_pos;
        this.totalContainer.name = "totalScoreContainer";
        this.totalContainer._zIndex = Number.MAX_SAFE_INTEGER;
        this.previousValue = 0;

        this.totalScoreText = new PIXI.Text("Reputation: " + 0, textStyle("totalScoreText"));
        this.totalScoreText.resolution = 2;
        this.totalContainer.addChild(this.totalScoreText);


        this.changeContainer = new PIXI.Container();
        this.changeContainer.x = x2_pos;
        this.changeContainer.y = y2_pos;
        this.changeContainer.name = "changeScoreContainer";
        this.changeContainer._zIndex = Number.MAX_SAFE_INTEGER-1;
        this.scoreChangeText = new PIXI.Text("rep +0", textStyle("scoreChangeText"));
        this.scoreChangeText.resolution = 2;
        this.scoreChangeText.visible = true;
        this.changeContainer.addChild(this.scoreChangeText);
    }

    initObject() {
        this.app.stage.addChild(this.totalContainer);
        this.app.stage.addChild(this.changeContainer);
		console.log("score initialized");
    }

    addScore(value) {
        // score change text
        if (value > 0) {
            this.scoreChangeText.text = "rep +" + value;
            this.scoreChangeText.style.fill = 0x00FF00;
            this.scoreChangeText.visible = true;
        } else {
            this.scoreChangeText.text = "rep " + value;
            this.scoreChangeText.style.fill = 0xFF0000;
            this.scoreChangeText.visible = true;
        }

        //if (this.scoreChangeText.alpha < 1) {
        //    this.scoreChangeText.alpha += .01;
        //}
        
        // total score text
        let resultValue = this.previousValue + value;
        this.totalScoreText.text = "Reputation: " + resultValue;
        console.log(this.totalScoreText.text.length);
        this.totalScoreText.x = -this.totalScoreText.text.length*2;
        this.totalScoreText.style.fill = (resultValue===0)?0xFFFFFF:(resultValue>0)?0x00FF00:0xFF0000;
        this.previousValue = resultValue;
    }
}