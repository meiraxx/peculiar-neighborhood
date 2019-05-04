import * as PIXI from 'pixi.js'

export default class StaticMap {
	
  constructor(app) {
	this.app = app;
  }
  
  static loadResources(app) {
    app.loader.add("assets/staticElements/background.png");
  }

  
  prepareObject() {
  	let backgroundTexture = this.app.loader.resources["assets/staticElements/background.png"].texture;
  	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
    this.backgroundSprite.name = "background";
    this.backgroundSprite.yForZOrdering = this.backgroundSprite.y ;//+ this.backgroundSprite.height;

  }

  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}