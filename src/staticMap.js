export default class StaticMap {
	
  constructor(app) {
	this.app = app;
	PIXI.loader.add("assets/background.png");
  }
  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
	this.backgroundSprite.x = 0;
	this.backgroundSprite.y = 0;
  }

  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}