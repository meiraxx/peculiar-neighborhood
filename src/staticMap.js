import $ from 'pixi.js';


export default class StaticMap {
  
  
  constructor(rootElement, app) {
    this.rootElement = rootElement;
	this.app = app;
	PIXI.loader.add("assets/background.png");
  }
  
  setupOnResourcesLoaded() {
	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
	this.app.stage.addChild(this.backgroundSprite);
  }
  
}