import * as PIXI from 'pixi.js';
import { getRandomArbitraryInt, populatedArray, getRandomArbitraryFloat } from "./lib/UtilMethods";
import { textStyle, containSpriteInsideContainer, setTexturesOnlyIfNeeded, detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision, applyFilter } from "./lib/PixiUtilMethods";
import HealthBar from "./HealthBar";
import Missile from "./Missile";

const MonsterState = {
	MOVING: 'moving',
	SNIFFLING : 'sniffling'
}

export default class Monster {
	static loadResources(app) {
		app.loader.add("assets/monsters/angry/angryMonsterFront.png");
		app.loader.add("assets/monsters/angry/angryMonsterBack.png");
		app.loader.add("assets/monsters/angry/angryMonsterRight.png");
		app.loader.add("assets/monsters/angry/angryMonsterLeft.png");
		app.loader.add("assets/monsters/normal/normalMonsterFront.png");
		app.loader.add("assets/monsters/normal/normalMonsterBack.png");
		app.loader.add("assets/monsters/normal/normalMonsterRight.png");
		app.loader.add("assets/monsters/normal/normalMonsterLeft.png");
		app.loader.add("assets/capturedMonsters/angryMonster.png");
		app.loader.add("assets/capturedMonsters/normalMonster.png");
		app.loader.add("assets/deadMonsters/angry/angryMonster0.png");
		app.loader.add("assets/deadMonsters/angry/angryMonster1.png");
		app.loader.add("assets/deadMonsters/angry/angryMonster2.png");
		app.loader.add("assets/deadMonsters/angry/angryMonster3.png");
		app.loader.add("assets/deadMonsters/angry/angryMonster4.png");
		app.loader.add("assets/deadMonsters/normal/normalMonster0.png");
		app.loader.add("assets/deadMonsters/normal/normalMonster1.png");
		app.loader.add("assets/deadMonsters/normal/normalMonster2.png");
		app.loader.add("assets/deadMonsters/normal/normalMonster3.png");
		app.loader.add("assets/deadMonsters/souls/ghostframe0.png");
		app.loader.add("assets/deadMonsters/souls/ghostframe1.png");
		app.loader.add("assets/deadMonsters/souls/ghostframe2.png");
		app.loader.add("assets/deadMonsters/souls/ghostframe3.png");
		// sight
		app.loader.add("assets/monsterSight/redSight.png");
		// melee attacks
		app.loader.add("assets/monsterAttacks/angryMonsterFrontOpen.png");
		app.loader.add("assets/monsterAttacks/angryMonsterLeftOpen.png");
		app.loader.add("assets/monsterAttacks/angryMonsterRightOpen.png");
	}
	
	constructor(app, isAngry, health, speed) {
		this.app = app;
		this.isAngry = isAngry;
		this.health = health;
		this.speed = speed;
		this.healthBar = new HealthBar(this.app);
		this.state = MonsterState.MOVING;
		this.slimes = [];
		this.currentSlime = 0;
		this.shootDirection = new PIXI.Point(0,0);
		for (var i = 10; i >= 0; i--) {
			this.slimes.push(new Missile(app,"greenSlimeCollider"));
		}
	}
	
	prepareMissiles(x_pos, y_pos) {
 		for (var i = 10; i >= 0; i--) {
			this.slimes[i].prepareObject(x_pos, y_pos, i);
		}
	}

	initMissiles() {
		for (var i = 10; i >= 0; i--) {
			this.slimes[i].initObject();
		}
	}

	updateMissileColliders(delta) {
		for (var i = this.slimes.length - 1; i >= 0; i--) {
			this.slimes[i].update(delta, 1600);
		}
	}

	prepareObject(position, monsterIndex, waveIndex) {
		// SETUP monster
		let x_pos = position[0];
		let y_pos = position[1];

		if (this.isAngry) {
			this.monsterFrontTexture = this.app.loader.resources["assets/monsters/angry/angryMonsterFront.png"].texture;
			this.monsterBackTexture = this.app.loader.resources["assets/monsters/angry/angryMonsterBack.png"].texture;
			this.monsterRightTexture = this.app.loader.resources["assets/monsters/angry/angryMonsterRight.png"].texture;
			this.monsterLeftTexture = this.app.loader.resources["assets/monsters/angry/angryMonsterLeft.png"].texture;

			this.capturedMonsterTexture = 
				this.app.loader.resources["assets/capturedMonsters/angryMonster.png"].texture;

			this.deadMonsterTexture0 = this.app.loader.resources["assets/deadMonsters/angry/angryMonster0.png"].texture;
			this.deadMonsterTexture1 = this.app.loader.resources["assets/deadMonsters/angry/angryMonster1.png"].texture;
			this.deadMonsterTexture2 = this.app.loader.resources["assets/deadMonsters/angry/angryMonster2.png"].texture;
			this.deadMonsterTexture3 = this.app.loader.resources["assets/deadMonsters/angry/angryMonster3.png"].texture;
			this.deadMonsterTexture4 = this.app.loader.resources["assets/deadMonsters/angry/angryMonster4.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos-12, 48, 8, 0xFF3300, 0xFF3300, this.health);
		}
		else {
			this.monsterFrontTexture = this.app.loader.resources["assets/monsters/normal/normalMonsterFront.png"].texture;
			this.monsterBackTexture = this.app.loader.resources["assets/monsters/normal/normalMonsterBack.png"].texture;
			this.monsterRightTexture = this.app.loader.resources["assets/monsters/normal/normalMonsterRight.png"].texture;
			this.monsterLeftTexture = this.app.loader.resources["assets/monsters/normal/normalMonsterLeft.png"].texture;

			this.capturedMonsterTexture = this.app.loader.resources["assets/capturedMonsters/normalMonster.png"].texture;
			
			this.deadMonsterTexture0 = this.app.loader.resources["assets/deadMonsters/normal/normalMonster0.png"].texture;
			this.deadMonsterTexture1 = this.app.loader.resources["assets/deadMonsters/normal/normalMonster1.png"].texture;
			this.deadMonsterTexture2 = this.app.loader.resources["assets/deadMonsters/normal/normalMonster2.png"].texture;
			this.deadMonsterTexture3 = this.app.loader.resources["assets/deadMonsters/normal/normalMonster3.png"].texture;
			this.deadMonsterTexture4 = this.app.loader.resources["assets/deadMonsters/normal/normalMonster3.png"].texture;
			this.healthBar.prepareObject(x_pos, y_pos-12, 32, 8, 0xFF3300, 0xFF3300, this.health);
		}
		this.deadMonsterTextureArray = [this.deadMonsterTexture0, this.deadMonsterTexture1,
			this.deadMonsterTexture2, this.deadMonsterTexture3, this.deadMonsterTexture4];

		this.soulLeavingTexture0 = this.app.loader.resources["assets/deadMonsters/souls/ghostframe0.png"].texture;
		this.soulLeavingTexture1 = this.app.loader.resources["assets/deadMonsters/souls/ghostframe1.png"].texture;
		this.soulLeavingTexture2 = this.app.loader.resources["assets/deadMonsters/souls/ghostframe2.png"].texture;
		this.soulLeavingTexture3 = this.app.loader.resources["assets/deadMonsters/souls/ghostframe3.png"].texture;
		this.soulLeavingTextureArray = [this.soulLeavingTexture0, this.soulLeavingTexture1, 
			this.soulLeavingTexture2, this.soulLeavingTexture3]
		this.monsterSprite = new PIXI.AnimatedSprite([this.monsterFrontTexture], true);
		this.monsterSprite.animationSpeed = 0.025;
		this.monsterSprite.loop = false;
		this.monsterSprite.waveIndex = waveIndex;
		this.monsterSprite.contextClass = this;
		this.collisionProperties = this.getCorrectedBoundsAndVelocity();

		if (this.isAngry) {
			this.monsterSprite.scale.x = 0.15;
			this.monsterSprite.scale.y = 0.15;
		}
		else {
			this.monsterSprite.scale.x = 0.15;
			this.monsterSprite.scale.y = 0.15;
		}

		this.monsterSprite.x = Math.round(x_pos - (this.monsterSprite.width/2));
		this.monsterSprite.y = y_pos;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		this.monsterSprite.name = "monster-" + waveIndex + "-" + monsterIndex;
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

		this.frameCounter1 = 0;
		this.slimeFrameCounter = 0;
		// 3 to 6 seconds
		this.sightPeriod = getRandomArbitraryInt(3,6);

		// hack to be able to move healthbar when finding children
		this.monsterSprite.healthBar = this.healthBar;
		this.monsterSprite.isAngry = this.isAngry;
		this.monsterSprite.yForZOrdering = this.monsterSprite.y + this.monsterSprite.height;
		this.monsterSprite._zIndex = Number.MAX_SAFE_INTEGER - 3;
		let randomInt = getRandomArbitraryInt(0, 4);
        // same as house colors: yellow, red, purple, green, blue
        let monsterColorsList = ["#fffdd5", "#ffb5b3", "#e5c2ff", "#d0ffde", "#b3dffd"];
        let monsterColorNameList = ["yellow", "red", "purple", "green", "blue"];
        // corrected because I really can't distinguish some of the above...
        //let monsterColorsList = ["#f2f229", "#ff003f", "#e5c2ff", "#10c93b", "#5900ff"];
        this.monsterColor = monsterColorsList[randomInt];
        this.monsterColorName = monsterColorNameList[randomInt];

		this.monsterSprite.interactionContainer = new PIXI.Container();
        this.monsterSprite.interactionContainer.x = x_pos - this.monsterSprite.width;
        this.monsterSprite.interactionContainer.y = y_pos - 18;
        this.monsterSprite.interactionContainer.name = "interactionContainer";
        this.monsterSprite.interactionContainer._zIndex = Number.MAX_SAFE_INTEGER - 1;
        this.monsterSprite.interactText = new PIXI.Text("press F", 
        	textStyle("Courier New", 13, "right", [this.monsterColor], this.monsterColor, 1));

        this.monsterSprite.interactText.resolution = 2;
        this.monsterSprite.interactText.visible = false;
        this.monsterSprite.interactionContainer.addChild(this.monsterSprite.interactText);

        let sightTex = this.app.loader.resources["assets/monsterSight/redSight.png"].texture;
        this.sightField = new PIXI.Sprite(sightTex);
        this.sightField.name = "sightField-" + waveIndex + "-" + monsterIndex;
        this.sightField.visible = false;
        this.sightField.pivot.x = this.sightField.width / 2;
        this.sightField.pivot.y = this.sightField.height / 2;

        this.sightField.pivot.x;
        this.sightField.scale.x = 0;
        this.sightField.scale.y = 0;
        this.sightField.x = this.monsterSprite.x + this.monsterSprite.width/2;
        this.sightField.y = this.monsterSprite.y + this.monsterSprite.height/2;
        //this.monsterSprite.addChild(this.sightField);
        this.sightField._zIndex = this.monsterSprite._zIndex - 4;  

        this.prepareMissiles(this.monsterSprite.x, this.monsterSprite.y);
	}

	initObject() {
		this.healthBar.initObject();
		this.initMissiles();
		this.app.stage.addChild(this.monsterSprite);
		this.app.stage.addChild(this.sightField);
		this.app.stage.addChild(this.monsterSprite.interactionContainer);
	}

	initLoop(player) {
		// start the monster loop
		this.app.ticker.add(delta => this.monsterLoop(delta, player));
		console.log("monster loop initialized");
	}

	monsterLoop(delta, player) {
		if (this.isNotIgnorable()) {
			if (!player.ui.isPaused()) {
				if(this.state == MonsterState.MOVING) {
					this.recalculateDirection(delta);
				}
				this.collisionProperties = this.getCorrectedBoundsAndVelocity();
			}
			this.handleMissileCollisions(delta, player);
			if (!player.ui.isPaused()) {
				this.changeMonsterState(delta, player);
				this.updateMissileColliders(delta);
				this.handleAllDetainerCollisions(player);
				this.handleContainerCollisionsAndMove();
			}
		}
		//update z ordering
		this.monsterSprite.yForZOrdering = this.monsterSprite.y + this.monsterSprite.height;
	}

	sniffle(player) {
		let sightScope = this.isAngry?2.0:3.0;
		if(this.sightField.scale.x < sightScope) {
			this.sightField.visible = true;
			this.sightField.scale.x += sightScope/100;
			this.sightField.scale.y += sightScope/100;
			this.sightField.alpha -= 0.01;
		} else {
			this.sightField.scale.x = 0;
			this.sightField.scale.y = 0;
			this.sightField.visible = false;
			this.sightField.alpha = 1;
			this.frameCounter1 = 0;
			this.state = MonsterState.MOVING;
		}
		return checkDynamicIntoDynamicCollision(this.getSightFieldCorrectedBounds(), player.getCorrectedBoundsAndVelocity(true));
	}

	calculatePlayerDirection(player) {
		this.shootDirection.x = (player.playerSprite.x/window.screen.availWidth) - 0.5;
		this.shootDirection.y = (player.playerSprite.y/window.screen.availHeight) - 0.5;
		let length = Math.sqrt(this.shootDirection.x * this.shootDirection.x + this.shootDirection.y * this.shootDirection.y);
		if(length !== 0) {
			this.shootDirection.x /= length;
			this.shootDirection.y /= length;
		}
	}

	shootSlime(player) {
		this.calculatePlayerDirection(player);
		let angle = Math.acos(this.shootDirection.y) * (this.shootDirection.x > 0.0 ? -1 : 1);
		this.slimes[this.currentSlime].go(
			//player.playerSprite.x + player.playerSprite.width/2 - this.shootDirection.y * this.slimes[0].sprite.width / 2,
			//player.playerSprite.y + player.playerSprite.height/2 + this.shootDirection.x * this.slimes[0].sprite.height / 2,
			this.monsterSprite.x + this.monsterSprite.width/2 - this.shootDirection.y * this.slimes[0].sprite.width / 2,
			this.monsterSprite.y + this.monsterSprite.height/2 + this.shootDirection.x * this.slimes[0].sprite.height / 2,
			10.0 * this.shootDirection.x,
			10.0 * this.shootDirection.y,
			angle,
			true);
		this.currentSlime = (this.currentSlime + 1) % 10;
	}

	changeMonsterState(delta, player) {
		//this.shootSlime(player);
		if(this.state === MonsterState.SNIFFLING) {
			let playerSpotted = this.sniffle(player);
			if(playerSpotted) {
				// player spotted
				// NORMAL MONSTER: SHOOT HIM
				if (!this.isAngry) {
					console.log(this.slimeFrameCounter);
					//let halfFPS = this.app.ticker.integerFPS/2;
					// shoot 0.5 second spaced slimes
					if(this.slimeFrameCounter%30 === 0) {
						this.shootSlime(player);
					}
					this.slimeFrameCounter += 1;
				}
			}
		} else if(this.state === MonsterState.MOVING) {
			this.frameCounter1 += 1;
			let passedTime = (this.frameCounter1/this.app.ticker.integerFPS);
			if(passedTime > this.sightPeriod) {
				this.slimeFrameCounter = 0;
				this.state = MonsterState.SNIFFLING;
				this.monsterSprite.vx = 0;
				this.monsterSprite.vy = 0;
			}
		}
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

			let randomNumber = getRandomArbitraryFloat(0, 1);
			if (randomNumber >= 0 && randomNumber < 0.25) {
				this.monsterSprite.vx = this.speed;
				this.monsterSprite.vy = 0;
			}
			else if (randomNumber >= 0.25 && randomNumber < 0.50) {
				this.monsterSprite.vx = 0;
				this.monsterSprite.vy = this.speed;
			}
			else if (randomNumber >= 0.50 && randomNumber < 0.75) {
				this.monsterSprite.vx = -this.speed;
				this.monsterSprite.vy = 0;
			}
			else if (randomNumber >= 0.75 && randomNumber < 1) {
				this.monsterSprite.vx = 0;
				this.monsterSprite.vy = -this.speed;
			}
		}
	}

	handleContainerCollisionsAndMove() {
		let monsterHitsMapBound = containSpriteInsideContainer(this.monsterSprite, 
				{x: 0, y: 0, width: 2048, height: 1536}, "revert");

		this.moveMonster(true);
	}

	moveMonster(updateSprite=false) {
		if (this.monsterSprite.vx !== 0) {
			// walking horizontally
			this.monsterSprite.x += this.monsterSprite.vx;
			// move healthbar
			this.healthBar.container.x += this.monsterSprite.vx;
			// move interaction container
			this.monsterSprite.interactionContainer.x += this.monsterSprite.vx;
			if (updateSprite) {
				let monsterTexture = (this.monsterSprite.vx>0)?this.monsterRightTexture:this.monsterLeftTexture;
				setTexturesOnlyIfNeeded(this.monsterSprite, [monsterTexture]);
			}
			this.sightField.x += this.monsterSprite.vx;
		}
		else if (this.monsterSprite.vy !== 0) {
			// walking vertically
			this.monsterSprite.y += this.monsterSprite.vy;
			// move healthbar
			this.healthBar.container.y += this.monsterSprite.vy;
			// move interaction container
			this.monsterSprite.interactionContainer.y += this.monsterSprite.vy;
			if (updateSprite) {
				let monsterTexture = (this.monsterSprite.vy>0)?this.monsterFrontTexture:this.monsterBackTexture;
				setTexturesOnlyIfNeeded(this.monsterSprite, [monsterTexture]);
			}
			this.sightField.y += this.monsterSprite.vy;
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

	checkMonsterInCorrectGarden() {
		let gardens = this.app.stage.children.filter(child => 
			child.name.indexOf(this.monsterColorName + "-garden") !== -1);
		let uniqueGarden = gardens[0];

	    if(checkDynamicIntoDynamicCollision(this.monsterSprite, uniqueGarden.gardenBounds)) {
			return true;
		}
		return false;
	}

	handleAllDetainerCollisions(player) {
		let otherLiveMonsters = this.app.stage.children.filter(child =>
			child.name !== this.monsterSprite.name && child.name.indexOf("monster") !== -1 &&
			!child.captured && !child.dead);

		let staticBlockers = this.app.stage.children.filter(child => 
			child.name.indexOf("blocker") !== -1);

		// player/monster collision
		if(detainSpriteOutsideDetainer(this.collisionProperties, player.getCorrectedBoundsAndVelocity(), "stop") !== "none") {
			this.resetMonsterVelocity();
			return;
		}

		// monster/monster collision
		if (populatedArray(otherLiveMonsters)) {
			for (var i = 0; i < otherLiveMonsters.length; i++) {
			    if(detainSpriteOutsideDetainer(this.collisionProperties, otherLiveMonsters[i], "stop") !== "none") {
			    	this.resetMonsterVelocity();
			    	return;
				}
			}
		}

		// static elements collision
		if (populatedArray(staticBlockers)) {
			for (var i = 0; i < staticBlockers.length; i++) {
			    if(detainSpriteOutsideDetainer(this.collisionProperties, staticBlockers[i], "revert") !== "none") {
					this.resetMonsterVelocity();
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

	resetMonsterVelocity() {
		this.monsterSprite.vx = this.collisionProperties.vx;
		this.monsterSprite.vy = this.collisionProperties.vy;
	}

	animatedCapture(delta, player) {
		let otherElements = this.app.stage.children.filter(child => 
			child.name !== this.monsterSprite.name);
		if (!this.animationDone) {
			this.timeSinceTwitch += delta;
			setTexturesOnlyIfNeeded(this.monsterSprite, [this.capturedMonsterTexture]);
			player.ui.speciallyPaused = true;
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
			player.ui.speciallyPaused = false;
			this.totalTwitchCounter = 0;
			this.animationDone = true;
			applyFilter(otherElements, "reset");

			let doubleHealthValue = (+this.healthBar.container.valueText.text - 1)*2;
			let maxHealthValue = this.healthBar.container.maxHealth;
			let escapeProbability = doubleHealthValue/maxHealthValue;
			let randomNumber = getRandomArbitraryFloat(0, 1);
			let monsterCaught = (randomNumber >= escapeProbability);
			
			if (monsterCaught) {
				// monster caught
				this.monsterSprite.captured = true;
				setTexturesOnlyIfNeeded(this.monsterSprite, [this.capturedMonsterTexture]);
				this.stopMonster();
				this.healthBar.container.visible = false;
				this.sightField.alpha = 0;
				this.monsterSprite.interactText.text = "press F to grab";
				this.monsterSprite.interactText.visible = true;
				let timeFactor = +player.ui.clock.timeText.text;
				let waveFactor = this.monsterSprite.waveIndex+1;
				let scoreValue = this.isAngry?(2*timeFactor*waveFactor):(1*timeFactor*waveFactor);
				player.ui.addScore(scoreValue);
				this.app.statistics.netHit();
			} else {
				// monster escaped
				setTexturesOnlyIfNeeded(this.monsterSprite, [this.monsterFrontTexture]);
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
			// pistol: 50% chance 1 dmg, 50% chance 2 dmg, 0% change 9999 dmg
			// be careful not to kill the monsters!
			let superCriticalProb = 0.00;
			let randomNumber = getRandomArbitraryFloat(0, 1);
			this.app.statistics.bulletHit();
			if (randomNumber < superCriticalProb) {
				this.healthBar.subtractHealth(9999);
			} else {
				// normal hit
				let randomInt = getRandomArbitraryInt(1, 2);
				this.healthBar.subtractHealth(randomInt)
			}
			
		} else if (weapon === "bat") {
			// bat: 3 dmg
			this.healthBar.subtractHealth(3);
			this.app.statistics.baseballBatHit();
		}

		let healthValue = +this.healthBar.container.valueText.text;

		if (!this.healthBar.isChanged() && healthValue <= this.healthBar.container.maxHealth/2) {
			// healthbar color change
			this.healthBar.changeBarColor(0xfff600);
			this.healthBar.changeTextColor(0xfff600);
		}

		// if health is 0 then monster is dead
		if (healthValue === 0) {
			this.killMonster(delta, player);
		}
		// else monster is ok!
	}

	killMonster(delta, player) {
		this.playDeadAnimation();
		this.monsterSprite.dead = true;
		this.monsterSprite.vx = 0;
		this.monsterSprite.vy = 0;
		let timeFactor = +player.ui.clock.timeText.text;
		let waveFactor = this.monsterSprite.waveIndex+1;
		let scoreValue = this.isAngry?(-2*timeFactor*waveFactor):(-1*timeFactor*waveFactor);
		player.ui.addScore(scoreValue);
		this.healthBar.container.visible = false;
		this.sightField.alpha = 0;
		this.monsterSprite.interactText.text = " press F to\npay respects";
		this.monsterSprite.interactText.visible = true;
		this.app.statistics.monsterKilled();
	}

	playDeadAnimation() {
		setTexturesOnlyIfNeeded(this.monsterSprite, this.deadMonsterTextureArray);
		this.monsterSprite.play();
	}

	playLeaveBodyAnimation() {
		let previousMonsterHeight = this.monsterSprite.height;
		setTexturesOnlyIfNeeded(this.monsterSprite, this.soulLeavingTextureArray);
		this.monsterSprite.y = this.monsterSprite.y - this.monsterSprite.height + previousMonsterHeight;
		this.monsterSprite.animationSpeed = 0.05;
		this.monsterSprite.play();
	}

	isCaptured() {
		return this.monsterSprite.captured;
	}

	isDead() {
		return this.monsterSprite.dead;
	}

	getCorrectedBoundsAndVelocity() {
		let correction = 0;
		let canWalkHeight = (5/10)*this.monsterSprite.height;
		return {x: this.monsterSprite.x+correction, y: this.monsterSprite.y + canWalkHeight, 
			width: this.monsterSprite.width-correction*1.5, height: this.monsterSprite.height - canWalkHeight,
			vx: this.monsterSprite.vx, vy: this.monsterSprite.vy};
	}

	getSightFieldCorrectedBounds() {
		return {x: this.sightField.x - this.sightField.pivot.x, y: this.sightField.y - this.sightField.pivot.y,
				width: this.sightField.width, height: this.sightField.height};
	}

}
