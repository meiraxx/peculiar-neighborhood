export default class StaticMap {
	
  constructor(app) {
	this.app = app;
	PIXI.loader.add("assets/background.png");
  }
  
  setupOnResourcesLoaded() {
	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
	this.backgroundSprite.x = 0;
	this.backgroundSprite.y = 0;
	this.app.stage.addChild(this.backgroundSprite);
	console.log("background initialized");
  }
  
}