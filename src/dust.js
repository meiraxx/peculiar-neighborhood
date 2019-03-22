import $ from 'pixi.js';


export default class Dust {
  
  
  constructor(rootElement, app) {
    this.rootElement = rootElement;
	this.app = app;
	PIXI.loader.add("assets/dust.png");
  }
  
  setupOnResourcesLoaded() {
	let dustTexture = PIXI.loader.resources["assets/dust.png"].texture;
	this.dustSprite0 = new PIXI.Sprite(dustTexture);
	this.dustSprite0.x = -1024;
	this.dustSprite1 = new PIXI.Sprite(dustTexture);
	this.dustSprite1.x = 0;
	this.app.stage.addChild(this.dustSprite0);
	this.app.stage.addChild(this.dustSprite1);
	console.log("staged the dust images");
	this.app.ticker.add( (delta) => this.dustLoop(delta));
  }
   
  dustLoop(delta) {
	  this.dustSprite0.x += 0.2;
	  this.dustSprite0.x = this.dustSprite0.x >= 1024 ? -1024 : this.dustSprite0.x;
	  
	  this.dustSprite1.x += 0.2;
	  this.dustSprite1.x = this.dustSprite1.x >= 1024 ? -1024 : this.dustSprite1.x;
  }
  
}