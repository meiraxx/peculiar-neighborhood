import * as PIXI from 'pixi.js'
export default class ZSorter {
	
	constructor(app) {
		this.app = app;
		this.sprites = [];
	}
	initLoop() {
		this.app.ticker.add(delta => this.sort());
		console.log("zsorter loop initialized");
	}

	register(spriteToSort) {
		this.sprites.push(spriteToSort);
	}

	sort() {
		/*this.app.stage.children.sort(function(a,b) {
			a.position.y 
		})*/
		for (var i = this.sprites.length - 1; i >= 0; i--) {
			this.sprites[i]._zIndex = this.sprites[i].yForZOrdering;
		}
		this.app.stage.sortChildren();
	}

}
