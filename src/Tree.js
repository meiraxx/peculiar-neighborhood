export default class Tree {
	
	static loadResources() {
		PIXI.loader.add("assets/staticElements/conifer.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, i) {
		let treeTexture = PIXI.loader.resources["assets/staticElements/conifer.png"].texture;
		
		this.sprite = new PIXI.Sprite(treeTexture);
		this.sprite.scale.x = 0.3;
		this.sprite.scale.y = 0.3;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-tree" + i;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
		console.log("tree initialized");
	}

}
