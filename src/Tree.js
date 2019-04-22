
export default class Tree {
	
	static loadResources() {
		PIXI.loader.add("assets/tree/conifer.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos) {
		let treeTexture = PIXI.loader.resources["assets/tree/conifer.png"].texture;
		
		this.sprite = new PIXI.Sprite(treeTexture);
		this.sprite.scale.x = 0.2;
		this.sprite.scale.y = 0.2;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "tree";
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("tree  initialized");
	}

}
