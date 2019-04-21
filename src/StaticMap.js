
export default class StaticMap {
	
  constructor(app, MATTER,physicsEngine) {
	console.log(MATTER);
	this.app = app;
  }
  
  static loadResources() {
    PIXI.loader.add("assets/background.png");
  }

  
  prepareObject() {
  	let backgroundTexture = PIXI.loader.resources["assets/background.png"].texture;
  	this.backgroundSprite = new PIXI.Sprite(backgroundTexture);
  }
  initPhysicsColliders(MATTER,physicsEngine) { 
	//top down map , so no gravity 
	physicsEngine.world.gravity.x = 0;
	physicsEngine.world.gravity.y = 0;
	//house box
	//this.testBox = MATTER.Bodies.rectangle(800,800,100,100);
	
	//outer  bounds
	this.outerBoundLeft = MATTER.Bodies.rectangle(0,512,100,1024,{isStatic: true});
	this.outerBoundRight = MATTER.Bodies.rectangle(1024,512,100,1024,{isStatic: true});
	this.outerBoundBottom = MATTER.Bodies.rectangle(512,1024 ,1024,100,{isStatic: true});
	this.outerBoundTop = MATTER.Bodies.rectangle(512,-50,1024,100,{isStatic: true});
	//MATTER.Body.setStatic(this.testBox, true);
	
	MATTER.World.add(physicsEngine.world,[this.outerBoundLeft,this.outerBoundRight,this.outerBoundTop,this.outerBoundBottom]);
  }
  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}