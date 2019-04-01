import $ from 'pixi.js';


export default class Fog {
	
  constructor(rootElement, app) {
    this.rootElement = rootElement;
	this.app = app;
	PIXI.loader.add("../assets/fog.png");
  }
  
  setupOnResourcesLoaded() {
	let fogTexture = PIXI.loader.resources["../assets/fog.png"].texture;
	this.fogSprite0 = new PIXI.Sprite(fogTexture);
	this.fogSprite0.x = -1024;
	this.fogSprite1 = new PIXI.Sprite(fogTexture);
	this.fogSprite1.x = 0;
	this.app.stage.addChild(this.fogSprite0);
	this.app.stage.addChild(this.fogSprite1);
	console.log("staged the fog images");
	this.app.ticker.add( (delta) => this.fogLoop(delta));
  }
  
  // fog movement only works in Linux when we force Canvas mode instead of WebGL
  // both work in Windows
  fogLoop(delta) {
	  this.fogSprite0.x += 0.2;
	  this.fogSprite0.x = this.fogSprite0.x >= 1024 ? -1024 : this.fogSprite0.x;
	  
	  this.fogSprite1.x += 0.2;
	  this.fogSprite1.x = this.fogSprite1.x >= 1024 ? -1024 : this.fogSprite1.x;
  }
  
}