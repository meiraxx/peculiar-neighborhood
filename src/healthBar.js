export default class HealthBar {
	static loadResources() {
    // nothing
  }

  constructor(app) {
  	this.app = app;
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
  
}