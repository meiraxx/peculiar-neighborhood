import * as PIXI from 'pixi.js'
import UserInterface from './UserInterface';
import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";
import { containSpriteInsideContainer, setTexturesOnlyIfNeeded, detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision, applyFilter } from "./lib/PixiUtilMethods";
import HealthBar from "./HealthBar";

export default class Monster {
	static loadResources(app) {
		app.loader.add("assets/monsters/angryMonster.png");
		app.loader.add("assets/monsters/normalMonster.png");
		app.loader.add("assets/capturedMonsters/angryMonster.png");
		app.loader.add("assets/capturedMonsters/normalMonster.png");
		app.loader.add("assets/deadMonsters/angryMonster.png");
		app.loader.add("assets/deadMonsters/normalMonster0.png");
		app.loader.add("assets/deadMonsters/normalMonster1.png");
		app.loader.add("assets/deadMonsters/normalMonster2.png");
		app.loader.add("assets/deadMonsters/normalMonster3.png");
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

			this.deadMonsterTexture0 = this.app.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.deadMonsterTexture1 = this.app.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.deadMonsterTexture2 = this.app.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.deadMonsterTexture3 = this.app.loader.resources["assets/deadMonsters/angryMonster.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, 48, 8, 0xFF3300, 0xFFFFFF, 15);
		}
		else {
			this.monsterTexture = this.app.loader.resources["assets/monsters/normalMonster.png"].texture;
			this.capturedMonsterTexture = 
				this.app.loader.resources["assets/capturedMonsters/normalMonster.png"].texture;
			
			this.deadMonsterTexture0 = this.app.loader.resources["assets/deadMonsters/normalMonster0.png"].texture;
			this.deadMonsterTexture1 = this.app.loader.resources["assets/deadMonsters/normalMonster1.png"].texture;
			this.deadMonsterTexture2 = this.app.loader.resources["assets/deadMonsters/normalMonster2.png"].texture;
			this.deadMonsterTexture3 = this.app.loader.resources["assets/deadMonsters/normalMonster3.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos - 12, 32, 8, 0xFF3300, 0xFFFFFF, 10);
		}
		this.deadMonsterTextureArray = [this.deadMonsterTexture0, this.deadMonsterTexture1,
			this.deadMonsterTexture2, this.deadMonsterTexture3];

		this.monsterSprite = new PIXI.AnimatedSprite([this.monsterTexture], true);
		this.monsterSprite.animationSpeed = 0.025;
		this.monsterSprite.loop = false;

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
		this.CaptureLoopInited = false;

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
			if (!player.ui.isPaused()) {
				this.recalculateDirection(delta);
			}
			this.handleMissileCollisions(delta, player);
			if (!player.ui.isPaused()) {
				this.handleAllDetainerCollisions(player)
				this.handleContainerCollisionsAndMove();
			}
		}
		//update z ordering
		this.monsterSprite.yForZOrdering = this.monsterSprite.y + this.monsterSprite.height;
	}

	handleMissileCollisions(delta, player) {
		// OPTIMIZED FUNCTION: assumes only one type of collider collides at the same time w/ monster
		let allActiveNets = this.app.stage.children.filter(child => 
			child.name.indexOf("netCollider") !== -1 && child.active === true);
		// net collision
		if (populatedArray(allActiveNets)) {
			for (var i = 0; i < allActiveNets.length; i++) {
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
			    if (checkDynamicIntoDynamicCollision(this.monsterSprite, allActiveBullets[i])) {
			    	// make bullet invisible and inactive
			    	allActiveBullets[i].active = false;
			    	allActiveBullets[i].visible = false;
			    	// harm monster
					this.getHarmed(delta, player, "pistol");
				}
			}
			return;
		}

		let allActiveBatColliders = this.app.stage.children.filter(child => 
			child.name.indexOf("batCollider") !== -1 && child.active === true);
		if (populatedArray(allActiveBatColliders)) {
			for (var i = 0; i < allActiveBatColliders.length; i++) {
				if (checkDynamicIntoDynamicCollision(this.monsterSprite, allActiveBatColliders[i])) {
			    	// make bullet invisible
			    	allActiveBatColliders[i].active = false;
			    	// harm monster
					this.getHarmed(delta, player, "bat");
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
		}
	}

	handleContainerCollisionsAndMove() {
		let monsterHitsMapBound = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 2048, height: 1536}, "revert");

		this.moveMonster();
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

		// player/monster collision
		if(detainSpriteOutsideDetainer(this.monsterSprite, player.playerSprite, "stop") !== "none") {
			return;
		}

		// monster/monster collision
		if (populatedArray(otherLiveMonsters)) {
			for (var i = 0; i < otherLiveMonsters.length; i++) {
			    if(detainSpriteOutsideDetainer(this.monsterSprite, otherLiveMonsters[i], "stop") !== "none") {
			    	return;
				}
			}
		}

		// static elements collision
		if (populatedArray(staticBlockers)) {
			for (var i = 0; i < staticBlockers.length; i++) {
			    if(detainSpriteOutsideDetainer(this.monsterSprite, staticBlockers[i], "revert") !== "none") {
					return;
				}
			}
		}
	}

	isNotIgnorable() {
		return (!this.isDead() && !this.isCaptured());
	}

	stopMonster() {
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
	}

	animatedCapture(delta, player) {
		let otherElements = this.app.stage.children.filter(child => 
			child.name !== this.monsterSprite.name);
		if (!this.animationDone) {
			this.timeSinceTwitch += delta;
			setTexturesOnlyIfNeeded(this.monsterSprite, [this.capturedMonsterTexture]);
			player.ui.paused = true;
			applyFilter(otherElements, "darken");
			
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
				setTexturesOnlyIfNeeded(this.monsterSprite, [this.capturedMonsterTexture]);
				this.stopMonster();
				player.ui.addScore(this.isAngry?(2*player.ui.clock.timeText.text):(1*player.ui.clock.timeText.text));
			} else {
				// monster escaped
				setTexturesOnlyIfNeeded(this.monsterSprite, [this.monsterTexture]);
			}
		}
	}

	maybeGetCaptured(player) {
		this.animationDone = false;
		if (!this.CaptureLoopInited) {
			this.app.ticker.add(delta => this.animatedCapture(delta, player));
			this.CaptureLoopInited = true;
		}
	}

	getHarmed(delta, player, weapon) {
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
			this.killMonster(delta, player);
		}
		// else monster is ok!
	}

	killMonster(delta, player) {
		setTexturesOnlyIfNeeded(this.monsterSprite, this.deadMonsterTextureArray);
		this.monsterSprite.play();
		this.monsterSprite.dead = true;
		console.log(this.monsterSprite.getBounds());
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		player.ui.addScore(this.isAngry?(-2*player.ui.clock.timeText.text):(-1*player.ui.clock.timeText.text));
	}

	isCaptured() {
		return this.monsterSprite.captured;
	}

	isDead() {
		return this.monsterSprite.dead;
	}
}
