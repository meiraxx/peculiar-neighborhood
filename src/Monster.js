import UserInterface from './UserInterface';
import { getRandomArbitraryFloat, getRandomArbitraryInt } from "./lib/UtilMethods";
import { containSpriteInsideContainer, hitTestRectangle, setTextureOnlyIfNeeded } from "./lib/PixiUtilMethods";
import HealthBar from "./HealthBar";

export default class Monster {
	static loadResources() {
		PIXI.loader.add("assets/monsters/angryMonster.png");
		PIXI.loader.add("assets/monsters/normalMonster.png");
		PIXI.loader.add("assets/capturedMonsters/angryMonster.png");
		PIXI.loader.add("assets/capturedMonsters/normalMonster.png");
	}
	
	constructor(app, isAngry) {
		this.app = app;
		this.isAngry = isAngry;
		this.healthBar = new HealthBar(this.app);
	}
	
	prepareObject(x_pos, y_pos, i) {
		// SETUP monster
		if (this.isAngry) {
			this.monsterTexture = PIXI.loader.resources["assets/monsters/angryMonster.png"].texture;
			this.capturedMonsterTexture = 
				PIXI.loader.resources["assets/capturedMonsters/angryMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, (32*6)/10, 8, 0xFF3300, 6);
			//this.healthBar.prepareObject(x_pos, y_pos - 12, 64, 8, 0xFF3300, 6);
		}
		else {
			this.monsterTexture = PIXI.loader.resources["assets/monsters/normalMonster.png"].texture;
			this.capturedMonsterTexture = 
				PIXI.loader.resources["assets/capturedMonsters/normalMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, 32, 8, 0xFF3300, 10);
			//this.healthBar.prepareObject(x_pos, y_pos - 12, 64, 8, 0xFF3300, 10);
		}

		this.monsterSprite = new PIXI.Sprite(this.monsterTexture);
		this.monsterSprite.scale.x = 0.05;
		this.monsterSprite.scale.y = 0.05;
		this.monsterSprite.x = Math.round(x_pos - (this.monsterSprite.width/2));
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterSprite.name = "monster" + i;
		this.monsterSprite.captured = false;
		this.newDirTimeStep = 50.0;
		this.timeSinceNewDir = 0.0;
	}

	initObject() {
		this.healthBar.initObject();
		this.app.stage.addChild(this.monsterSprite);
		console.log("monster character initialized");
	}

	initLoop(player) {
		// start the monster loop
		this.app.ticker.add(delta => this.monsterLoop(delta, player));
		console.log("monster loop initialized");
	}

	monsterLoop(delta, player) {
		if (!player.ui.isPaused() && !this.isCaptured()) {
			this.timeSinceNewDir += delta;
			if(this.timeSinceNewDir > this.newDirTimeStep) {
				this.timeSinceNewDir = 0.0;

				let randomNumber = Math.random();
				if (randomNumber >= 0 && randomNumber < 0.25) {
					this.monsterSprite.vx = 2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.25 && randomNumber < 0.50) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = 2;
				}
				else if (randomNumber >= 0.50 && randomNumber < 0.75) {
					this.monsterSprite.vx = -2;
					this.monsterSprite.vy = 0;
				}
				else if (randomNumber >= 0.75 && randomNumber < 1) {
					this.monsterSprite.vx = 0;
					this.monsterSprite.vy = -2;
				}
				//this.matter.Body.applyForce(this.monsterCollider ,this.monsterCollider.position, this.force);
			}

			let monsterHitsMapBound = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});


			let allVisibleNets = this.app.stage.children.filter(child => 
				child.name.indexOf("net") !== -1 && child.visible === true);
			let allVisibleBullets = this.app.stage.children.filter(child => 
				child.name.indexOf("bullet") !== -1 && child.visible === true);

			if (allVisibleNets !== undefined && allVisibleNets.length !== 0) {
				//console.log(allVisibleNets);
				for (var i = 0; i < allVisibleNets.length; i++) {
				    if(hitTestRectangle(this.monsterSprite, allVisibleNets[i])) {
				    	// make it invisible
				    	allVisibleNets[i].visible = false;
				    	// stop monster
						this.stopMonster();
					}
				}
			}
			
			if (allVisibleBullets !== undefined && allVisibleBullets.length !== 0) {
				for (var i = 0; i < allVisibleBullets.length; i++) {
				    if(hitTestRectangle(this.monsterSprite, allVisibleBullets[i])) {
				    	// make it invisible
				    	allVisibleBullets[i].visible = false;
				    	// stop monster
						this.harmMonster("pistol");
					}
				}
			}

			if (monsterHitsMapBound !== "none") {
				this.reverseMonsterDirection();
			}
			else if (this.monsterSprite.vx !== 0) {
				// walking horizontally
				this.monsterSprite.x += this.monsterSprite.vx;
				// move healthbar
				this.healthBar.container.x += this.monsterSprite.vx;
			}
			else if (this.monsterSprite.vy !== 0) {
				// walking vertically
				this.monsterSprite.y += this.monsterSprite.vy;
				// move healthbar
				this.healthBar.container.y += this.monsterSprite.vy;
			}
			else {
				// character isn't walking: do nothing
			}
		}
	}

	reverseMonsterDirection() {
		// if monsters hits wall we reverse his speed so he doesn't stop moving
		if (this.monsterSprite.vx !== 0) {
			this.monsterSprite.vx *= -1;
		}
		else if (this.monsterSprite.vy !== 0){
			this.monsterSprite.vy *= -1;
		}
		else {
			// shouldn't happen
		}
	}

	stopMonster() {
		let healthValue = +this.healthBar.container.valueText.text; // convert to string to int

		// monster must be with less than half of his HP to be captured
		if (healthValue <= this.healthBar.container.maxHealth/2) {
			setTextureOnlyIfNeeded(this.monsterSprite, this.capturedMonsterTexture);
			this.monsterSprite.captured = true;
			this.monsterSprite.vx = 0;
			this.monsterSprite.vy = 0;
		}
	}

	harmMonster(weapon) {
		if (weapon === "pistol") {
			// weapon: 50% chance 1 dmg, 50% chance 2 dmg
			let randomInt = getRandomArbitraryInt(1, 2);
			this.healthBar.subtractHealth(randomInt);
		}
	}

	isCaptured() {
		return this.monsterSprite.captured;
	}
}
