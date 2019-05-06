import * as PIXI from 'pixi.js'
import UserInterface from './UserInterface';
import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";
import { containSpriteInsideContainer, setTextureOnlyIfNeeded, detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision, applyFilter } from "./lib/PixiUtilMethods";
import HealthBar from "./HealthBar";

export default class Monster {
	static loadResources(app) {
		app.loader.add("assets/monsters/angryMonster.png");
		app.loader.add("assets/monsters/normalMonster.png");
		app.loader.add("assets/capturedMonsters/angryMonster.png");
		app.loader.add("assets/capturedMonsters/normalMonster.png");
		app.loader.add("assets/deadMonsters/angryMonster.png");
		app.loader.add("assets/deadMonsters/normalMonster.png");
	}
	
	constructor(app, isAngry) {
		this.app = app;
		this.isAngry = isAngry;
		this.healthBar = new HealthBar(this.app);
	}
	
	prepareObject(x_pos, y_pos, i) {
		// SETUP monster
		//console.log("monster" + i);
		if (this.isAngry) {
			this.monsterTexture = this.app.loader.resources["assets/monsters/angryMonster.png"].texture;
			this.capturedMonsterTexture = 
				this.app.loader.resources["assets/capturedMonsters/angryMonster.png"].texture;
			this.deadMonsterTexture = 
				this.app.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, 48, 8, 0xFF3300, 0xFFFFFF, 15);
		}
		else {
			this.monsterTexture = this.app.loader.resources["assets/monsters/normalMonster.png"].texture;
			this.capturedMonsterTexture = 
				this.app.loader.resources["assets/capturedMonsters/normalMonster.png"].texture;
			this.deadMonsterTexture = 
				this.app.loader.resources["assets/deadMonsters/normalMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 6, 32, 8, 0xFF3300, 0xFFFFFF, 10);
		}

		this.monsterSprite = new PIXI.Sprite(this.monsterTexture);
		if (this.isAngry) {
			this.monsterSprite.scale.x = 0.06;
			this.monsterSprite.scale.y = 0.06;
		}
		else {
			this.monsterSprite.scale.x = 0.15;
			this.monsterSprite.scale.y = 0.15;
		}

		this.monsterSprite.x = Math.round(x_pos - (this.monsterSprite.width/2));
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterSprite.name = "monster" + i;
		this.monsterSprite.captured = false;
		this.monsterSprite.dead = false;
		this.monsterSprite.grabbed = false;
		this.timeSinceNewDir = 0.0;
		this.newDirTimeStep = 50.0;

		this.monsterStopped = false;
		this.timeSinceTwitch = 0.0;
		this.newTwitchDirTime = 5.0;
		this.twitchDirectionShift = 0;
		this.totalTwitchCounter = 0;
		this.animationDone = false;

		// hack to be able to move healthbar when finding children
		this.monsterSprite.healthBar = this.healthBar;
		this.monsterSprite.isAngry = this.isAngry;
		this.monsterSprite.yForZOrdering = this.monsterSprite.y + this.monsterSprite.height;

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
		if (this.isNotIgnorable()) {
			this.handleAllDetainerCollisions(player)
			this.handleContainerCollisions();
			if (!player.ui.isPaused()) {
				this.recalculateDirection(delta);
				this.moveMonster();
			}
		}
		//update z ordering
		this.monsterSprite.yForZOrdering = this.monsterSprite.y + this.monsterSprite.height;
	}

	handleMissileCollisions(player) {
		// OPTIMIZED FUNCTION: assumes only one type of collider collides at the same time w/ monster
		let allActiveNets = this.app.stage.children.filter(child => 
			child.name.indexOf("netCollider") !== -1 && child.active === true);
		// net collision
		if (populatedArray(allActiveNets)) {
			for (var i = 0; i < allActiveNets.length; i++) {
			    //if(detainSpriteOutsideDetainer(allActiveNets[i], this.monsterSprite) !== "none") {
			    if (checkDynamicIntoDynamicCollision(this.monsterSprite, allActiveNets[i])) {
			    	// make net invisible and inactive
			    	allActiveNets[i].active = false;
			    	allActiveNets[i].visible = false;
			    	// convert health string to int
			    	let healthValue = +this.healthBar.container.valueText.text;
			    	// if monster health is below half
			    	if (healthValue <= this.healthBar.container.maxHealth/2) {
			    		// capture monster
						this.maybeGetCaptured(player);
			    	}
				}
			}
			return;
		}

		let allActiveBullets = this.app.stage.children.filter(child => 
			child.name.indexOf("bulletCollider") !== -1 && child.active === true);
		if (populatedArray(allActiveBullets)) {
			for (var i = 0; i < allActiveBullets.length; i++) {
			    //if(detainSpriteOutsideDetainer(allActiveBullets[i], this.monsterSprite) !== "none") {
			    if (checkDynamicIntoDynamicCollision(this.monsterSprite, allActiveBullets[i])) {
			    	// make bullet invisible and inactive
			    	allActiveBullets[i].active = false;
			    	allActiveBullets[i].visible = false;
			    	// harm monster
					this.getHarmed(player, "pistol");
				}
			}
			return;
		}

		let allActiveBatColliders = this.app.stage.children.filter(child => 
			child.name.indexOf("batCollider") !== -1 && child.active === true);
		if (populatedArray(allActiveBatColliders)) {
			for (var i = 0; i < allActiveBatColliders.length; i++) {
				//if (checkDynamicIntoDynamicCollision(this.monsterSprite, allActiveBatColliders[i])) {
			    if(detainSpriteOutsideDetainer(allActiveBatColliders[i], this.monsterSprite) !== "none") {
			    	// make bullet invisible
			    	allActiveBatColliders[i].active = false;
			    	// harm monster
					this.getHarmed(player, "bat");
				}
			}
			return;
		}
	}

	recalculateDirection(delta) {
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
			//this.monsterSprite.vx = 0;
			//this.monsterSprite.vy = 0;
		}
	}

	handleContainerCollisions() {
		let monsterHitsMapBound = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 1024, height: 1024});
		if (monsterHitsMapBound !== "none") {
			this.reverseMonsterDirection();
		}
	}

	moveMonster() {
		if (this.monsterSprite.vx !== 0) {
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

	twitchMonster(valueX, valueY) {
		let oldMonsterSpriteVX = this.monsterSprite.vx;
		let oldMonsterSpriteVY = this.monsterSprite.vy;
		this.monsterSprite.vx = valueX;
		this.monsterSprite.vy = valueY;
		this.moveMonster();
		this.monsterSprite.vx = oldMonsterSpriteVX;
		this.monsterSprite.vy = oldMonsterSpriteVY;
	}

	handleAllDetainerCollisions(player) {
		let otherLiveMonsters = this.app.stage.children.filter(child =>
			child.name !== this.monsterSprite.name && child.name.indexOf("monster") !== -1 &&
			!child.captured && !child.dead);

		let staticBlockers = this.app.stage.children.filter(child => 
			child.name.indexOf("blocker") !== -1);

		this.handleMissileCollisions(player);

		// monster/monster collision
		if (populatedArray(otherLiveMonsters)) {
			for (var i = 0; i < otherLiveMonsters.length; i++) {
			    if(detainSpriteOutsideDetainer(this.monsterSprite, otherLiveMonsters[i]) !== "none") {
		    	//if (checkDynamicIntoDynamicCollision(this.monsterSprite, otherLiveMonsters[i])) {
			    	this.stopMonster();
				}
			}
		}

		// player/monster collision
		//if (checkDynamicIntoDynamicCollision(this.monsterSprite, player.playerSprite)) {
		if(detainSpriteOutsideDetainer(this.monsterSprite, player.playerSprite) !== "none") {
			this.stopMonster();
		}

		// static elements collision
		if (populatedArray(staticBlockers)) {
			for (var i = 0; i < staticBlockers.length; i++) {
			    if(detainSpriteOutsideDetainer(this.monsterSprite, staticBlockers[i])!=="none") {
					// monster reverts direction
					this.reverseMonsterDirection();
					return false;
				}
			}
		}
		return true;
	}

	isNotIgnorable() {
		return (!this.isDead() && !this.isCaptured());
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
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterStopped = true;
	}

	animatedCapture(delta, player) {
		let otherElements = this.app.stage.children.filter(child => 
			child.name !== this.monsterSprite.name);
		if (!this.animationDone) {
			this.timeSinceTwitch += delta;
			setTextureOnlyIfNeeded(this.monsterSprite, this.capturedMonsterTexture);
			player.ui.paused = true;
			applyFilter(otherElements, "darken");
			//console.log(this.monsterSprite.x + "," + this.monsterSprite.y);
			
			if(this.timeSinceTwitch > this.newTwitchDirTime) {
				this.timeSinceTwitch = 0.0;
				if (this.twitchDirectionShift===0) {
					this.twitchMonster(0, -2); // up
				} else if (this.twitchDirectionShift===1) {
					this.twitchMonster(0, 2); // back-down
				}
				else if (this.twitchDirectionShift===2) {
					this.twitchMonster(0, 2); // down
				} else if (this.twitchDirectionShift===3) {
					this.twitchMonster(0, -2); // back-up
				}
				this.totalTwitchCounter += 1;
				this.twitchDirectionShift = (this.twitchDirectionShift+1)%4;
			}
		}

		if (this.totalTwitchCounter === 16) {
			player.ui.paused = false;
			this.totalTwitchCounter = 0;
			this.timeSinceTwitch = 0.0;
			this.animationDone = true;
			applyFilter(otherElements, "reset");

			let doubleHealthValue = (+this.healthBar.container.valueText.text - 1)*2;
			let maxHealthValue = this.healthBar.container.maxHealth;
			let escapeProbability = doubleHealthValue/maxHealthValue;
			let randomNumber = Math.random();
			let monsterCaught = (randomNumber >= escapeProbability);
			
			if (monsterCaught) {
				// monster caught
				this.monsterSprite.captured = true;
				setTextureOnlyIfNeeded(this.monsterSprite, this.capturedMonsterTexture);
				this.stopMonster();
				console.log("apanhado");
				player.ui.addScore(this.isAngry?2:1);
			} else {
				// monster escaped
				console.log("escapou");
				console.log(this.monsterSprite.captured);
				console.log(this.monsterSprite.dead);
				setTextureOnlyIfNeeded(this.monsterSprite, this.monsterTexture);
			}
			this.app.ticker = this.app.ticker.remove(this.animatedCapture);
			console.log(this.app.ticker);
		}
	}

	maybeGetCaptured(player) {
		this.animationDone = false;
		this.app.ticker.add(delta => this.animatedCapture(delta, player));
	}

	getHarmed(player, weapon) {
		if (weapon === "pistol") {
			// pistol: 49% chance 1 dmg, 49% chance 2 dmg, 2% change 15 dmg
			// be careful not to kill the monsters!
			let superCriticalProb = 0.02;
			let randomNumber = Math.random();

			if (randomNumber < superCriticalProb) {
				this.healthBar.subtractHealth(15);
			} else {
				// normal hit
				let randomInt = getRandomArbitraryInt(1, 2);
				this.healthBar.subtractHealth(randomInt)
			}
			
		} else if (weapon === "bat") {
			// bat: 3 dmg
			this.healthBar.subtractHealth(3);
		}

		let healthValue = +this.healthBar.container.valueText.text;

		if (!this.healthBar.isChanged() && healthValue <= this.healthBar.container.maxHealth/2) {
			// healthbar color change
			this.healthBar.changeBarColor(0xffffff);
			this.healthBar.changeTextColor(0xffffff);
		}

		// if health is 0 then monster is dead
		if (healthValue === 0) {
			this.killMonster(player);
		}
		// else monster is ok!
	}

	killMonster(player) {
		setTextureOnlyIfNeeded(this.monsterSprite, this.deadMonsterTexture);
		this.monsterSprite.dead = true;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		player.ui.addScore(this.isAngry?-2:-1);
	}

	isCaptured() {
		return this.monsterSprite.captured;
	}

	isDead() {
		return this.monsterSprite.dead;
	}
}
