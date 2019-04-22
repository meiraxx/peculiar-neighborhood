import { textStyle, getRoundedRectangle } from "./lib/PixiUtilMethods";

export default class HealthBar {
	static loadResources() {
        // nothing
    }

    constructor(app) {
    	this.app = app;
    }

    prepareObject(x_pos, y_pos, width, height, colorCode, maxHealth) {
        //green: 0x4CBB17; red: 0xFF3300
        // create the health bar
        this.container = new PIXI.Container();

        // health properties
        this.container.maxHealth = maxHealth;
        this.container.currHealth = maxHealth;

        // healthbar global position
        this.container.x = x_pos;
        this.container.y = y_pos;
        this.container.name = "healthbar";

        // create the max-health rectangle
        let innerBar = getRoundedRectangle(-width/2, 0, width, height, 3, 0x000000);
        this.container.addChild(innerBar);
        this.container.innerBar = innerBar;

        // create the current-health rectangle with an outline effect
        let diffValue = width/32;
        let outerBar = getRoundedRectangle(-width/2 + diffValue/2, diffValue/2, width - diffValue,
            height - diffValue, 3, colorCode);
        this.container.addChild(outerBar);
        this.container.outerBar = outerBar;

        let style = textStyle("healthText");
        let valueText = new PIXI.Text(maxHealth, style);
        valueText.x = -10;
        valueText.y = -15;
        valueText.resolution = 2;
        this.container.addChild(valueText);
        // save health value reference
        this.container.valueText = valueText;

    }

    initObject() {
        this.app.stage.addChild(this.container);
        console.log("healthBar initialized");
    }

    subtractHealth(value) {
        let maxWidth = this.container.innerBar.width;
        let maxHealth = this.container.maxHealth;
        let ratio = maxWidth/maxHealth;
        console.log("Healthbar maxWidth/maxHealth ratio: " + ratio);
        this.container.currHealth -= value;
        this.container.outerBar.width -= value*ratio;
        this.container.valueText.setText(this.container.currHealth);
    }
  
}