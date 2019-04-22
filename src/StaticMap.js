
export default class StaticMap {
	
  constructor(app) {
	this.app = app;
  }
  
  static loadResources() {
    PIXI.loader.add("assets/background.png");
  }

  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
  	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
    this.backgroundSprite.name = "background";
  }

  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}