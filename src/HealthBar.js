import { textStyle, getRoundedRectangle } from "./lib/PixiUtilMethods";

export default class HealthBar {
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
        this.container.valueText = new PIXI.Text(maxHealth, style);

        this.calculateHealthTextX();
        this.container.valueText.y = -15;
        this.container.valueText.resolution = 2;
        this.container.addChild(this.container.valueText);
    }

    initObject() {
        this.app.stage.addChild(this.container);
        console.log("healthBar initialized");
    }

    calculateHealthTextX() {
        if (this.container.currHealth < 10)
            this.container.valueText.x = -5;
        else
            this.container.valueText.x = -10;
    }

    subtractHealth(value) {
        if (this.container.currHealth - value > 0) {
            let maxWidth = this.container.innerBar.width;
            let maxHealth = this.container.maxHealth;
            let ratio = maxWidth/maxHealth;
            console.log("Healthbar maxWidth/maxHealth ratio: " + ratio);
            this.container.currHealth -= value;
            this.container.outerBar.width -= value*ratio;
        }
        else {
            this.container.currHealth = 0;
            this.container.outerBar.width = 0;
        }
        this.calculateHealthTextX();
        this.container.valueText.setText(this.container.currHealth);
    }
  
}