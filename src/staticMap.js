export default class StaticMap {
	
  constructor(app, physicsEngine) {
	this.app = app;
	PIXI.loader.add("assets/background.png");
	//this.testBox = Matter.Bodies.rectangle(5,5,200,200);
	//Matter.World.add(physicsEngine,this.testBox);
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