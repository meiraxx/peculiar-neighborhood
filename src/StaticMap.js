
export default class StaticMap {
	
  constructor(app) {
	this.app = app;
  }
  
  static loadResources() {
    PIXI.loader.add("assets/staticElements/background.png");
  }

  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/staticElements/background.png"].texture;
  	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
    this.backgroundSprite.name = "background";
  }

  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}