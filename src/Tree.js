import * as PIXI from 'pixi.js';

export default class Tree {
	
	static loadResources(app) {
		app.loader.add("assets/staticElements/tree/tree-night.png");
	}
	
	constructor(app) {
		this.app = app;
		
	}
	
	prepareObject(x_pos, y_pos, i) {
		let treeTexture = this.app.loader.resources["assets/staticElements/tree/tree-night.png"].texture;
		
		this.sprite = new PIXI.Sprite(treeTexture);
		this.sprite.scale.x = 1;
		this.sprite.scale.y = 1;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
		this.sprite.name = "blocker-tree" + i;
	    this.sprite.yForZOrdering = this.sprite.y + this.sprite.height;
	    this.sprite.contextClass = this;
	    this.sprite.walkableHeight = 90;
	    this.sprite.walkableWidth = 26;
	}

	initObject() {
		this.app.stage.addChild(this.sprite);
	}

	getCorrectedBounds() {
		return {x: this.sprite.x + this.sprite.walkableWidth, y: this.sprite.y + this.sprite.walkableHeight, 
			width: this.sprite.width - this.sprite.walkableWidth*2, height: this.sprite.height - this.sprite.walkableHeight};
	}

}
