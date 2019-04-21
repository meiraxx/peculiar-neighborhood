
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

  initPhysicsColliders(MATTER, physicsEngine, mapWidth, mapHeight, colliderThickness) { 
	//top down map , so no gravity 
	physicsEngine.world.gravity.x = 0;
	physicsEngine.world.gravity.y = 0;
	//house box
	//this.testBox = MATTER.Bodies.rectangle(800,800,100,100);
	
	//outer  bounds
	this.outerBoundLeft = MATTER.Bodies.rectangle(-50, mapHeight/2, colliderThickness, mapHeight, {isStatic: true});
	this.outerBoundRight = MATTER.Bodies.rectangle(mapWidth - 50, mapHeight/2, colliderThickness, mapHeight, {isStatic: true});
	this.outerBoundBottom = MATTER.Bodies.rectangle(mapWidth/2, mapHeight - 50, mapWidth, colliderThickness, {isStatic: true});
	this.outerBoundTop = MATTER.Bodies.rectangle(mapWidth/2, -50, mapWidth, colliderThickness, {isStatic: true});
	//MATTER.Body.setStatic(this.testBox, true);
	
	MATTER.World.add(physicsEngine.world,[this.outerBoundLeft,this.outerBoundRight,this.outerBoundTop,this.outerBoundBottom]);
  }
  initObject() {
  	this.app.stage.addChild(this.backgroundSprite);
    console.log("background initialized");
  }
  
}