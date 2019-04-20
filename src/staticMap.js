
export default class StaticMap {
	
  constructor(app, MATTER,physicsEngine) {
	console.log(MATTER);
	
	
	this.app = app;
	PIXI.loader.add("assets/background.png");
	
  }
  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
	this.backgroundSprite.x = 0;
	this.backgroundSprite.y = 0;
  }
  initPhysicsColliders(MATTER,physicsEngine) { 
	//top down map , so no gravity 
	physicsEngine.world.gravity.x = 0;
	physicsEngine.world.gravity.y = 0;
	//house box
	this.testBox = MATTER.Bodies.rectangle(5,5,200,200);
	MATTER.Body.setStatic(this.testBox, true);
	
	MATTER.World.add(physicsEngine.world,this.testBox);
  }
  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}