import * as PIXI from 'pixi.js'
export default class Fog {
	
  constructor(app) {
	this.app = app;
  }
  static loadResources(app) {
		app.loader.add("assets/fog.png");
   }
  prepareObject() {
	let fogTexture = this.app.loader.resources["assets/fog.png"].texture;
	this.fogSprite0 = new PIXI.Sprite(fogTexture);
	this.fogSprite0.x = -1024;
	this.fogSprite1 = new PIXI.Sprite(fogTexture);
	this.fogSprite1.x = 0;
  }
  
  initObject() {
  	this.app.stage.addChild(this.fogSprite0);
	this.app.stage.addChild(this.fogSprite1);
	console.log("fog initialized");
  }

  initLoop() {
  	this.app.ticker.add( (delta) => this.fogLoop(delta));
	console.log("fog loop initialized");
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