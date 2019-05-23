import * as PIXI from 'pixi.js'
import { textStyle, modifyObjectAlpha } from "./lib/PixiUtilMethods";
import { functionScopePreserver } from "./lib/UtilMethods";

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

        this.totalScoreText = new PIXI.Text("Reputation: " + 0, 
            textStyle("Courier New", 20, "right", ["#000000", "#ffffff", "#000000"], "#000000", 2));

        this.totalScoreText.resolution = 2;
        this.totalContainer.addChild(this.totalScoreText);


        this.changeContainer = new PIXI.Container();
        this.changeContainer.x = x2_pos;
        this.changeContainer.y = y2_pos;
        this.changeContainer.name = "changeScoreContainer";
        this.changeContainer._zIndex = Number.MAX_SAFE_INTEGER-1;
        this.scoreChangeText = new PIXI.Text("rep +0", 
            textStyle("Comic Sans MS", 13, "right", ["#000000", "#ffffff", "#000000"], "#000000", 1));

        this.scoreChangeText.resolution = 2;
        this.scoreChangeText.alpha = 0;
        this.changeContainer.addChild(this.scoreChangeText);
    }

    initObject() {
        this.app.stage.addChild(this.totalContainer);
        this.app.stage.addChild(this.changeContainer);
		console.log("score initialized");
    }

    fadeInScoreChangeText(value, fadeInfactor, speedFactor) {
        let currentTime = speedFactor;
        for (var i = 0; i < fadeInfactor; i++) {
            this.app.timedEventManager.createNewEvent(functionScopePreserver(this, 
                "increaseScoreChangeTextAlpha", [value, fadeInfactor]), "oneTime", currentTime);
            currentTime += speedFactor;
        }
    }

    fadeOutScoreChangeText(value, fadeOutfactor, speedFactor) {
        let currentTime = speedFactor;
        for (var i = 0; i < fadeOutfactor; i++) {
            this.app.timedEventManager.createNewEvent(functionScopePreserver(this, 
                "decreaseScoreChangeTextAlpha", [value, fadeOutfactor]), "oneTime", currentTime);
            currentTime += speedFactor;
        }
    }

    decreaseScoreChangeTextAlpha(value, factor) {
        this.modifyScoreChangeText(value);
        modifyObjectAlpha(this.scoreChangeText, factor, "subtract");
    }

    increaseScoreChangeTextAlpha(value, factor) {
        this.modifyScoreChangeText(value);
        modifyObjectAlpha(this.scoreChangeText, factor, "add");
    }

    modifyScoreChangeText(value) {
        if (value > 0) {
            this.scoreChangeText.text = "rep +" + value;
            this.scoreChangeText.style.fill = ["#00ff00"];
        } else {
            this.scoreChangeText.text = "rep " + value;
            this.scoreChangeText.style.fill = ["#ff0000"];
        }
    }

    addScore(value) {
        // score change text
        this.fadeInScoreChangeText(value, 1, 0.1);
        this.fadeOutScoreChangeText(value, 3, 0.5);

        // total score text
        let resultValue = this.previousValue + value;
        this.totalScoreText.text = "Reputation: " + resultValue;

        this.totalScoreText.x = -this.totalScoreText.text.length*2;
        this.totalScoreText.style.fill = (resultValue===0)?["#000000", "#ffffff", "#000000"]:
            (resultValue>0)?["#007a00", "#00ff00", "#007a00"]:["#99040e", "#ff0000", "#99040e"];
        this.previousValue = resultValue;
        this.app.statistics.setScore(this.previousValue);
    }

}