
export default class Tree {
	
	static loadResources() {
		PIXI.loader.add("assets/tree/conifer.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, MATTER, physicsEngine) {
		this.matter = MATTER;
		this.physicsEngine = physicsEngine;
		this.velocity = this.matter.Vector.create(0, 0);
 		
		let tex = PIXI.loader.resources["assets/tree/conifer.png"].texture;
		
		this.sprite = new PIXI.Sprite(tex);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		
		this.collider = 
		MATTER.Bodies.rectangle(this.sprite.x + this.sprite.width / 2.0,
			this.sprite.y + this.sprite.height / 2.0,
		 this.sprite.width, this.sprite.height, {isStatic: true});
 		MATTER.World.add(physicsEngine.world,this.collider);
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("tree  initialized");
	}

}
