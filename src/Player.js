import { keyboard } from "./lib/UtilMethods";
import { setTexturesOnlyIfNeeded, containSpriteInsideContainer, detainSpriteOutsideDetainer, 
	checkDynamicIntoDynamicCollision, textStyle } from "./lib/PixiUtilMethods";
import UserInterface from './UserInterface';
import * as PIXI from 'pixi.js'

export default class Player {
	static loadResources(app) {
		// NONE
		app.loader.add("assets/character/none/front1.png");
		app.loader.add("assets/character/none/back1.png");
		app.loader.add("assets/character/none/right1.png");
		app.loader.add("assets/character/none/left1.png");
		app.loader.add("assets/character/none/front2.png");
		app.loader.add("assets/character/none/back2.png");
		app.loader.add("assets/character/none/right2.png");
		app.loader.add("assets/character/none/left2.png");
		app.loader.add("assets/character/none/front3.png");
		app.loader.add("assets/character/none/back3.png");
		app.loader.add("assets/character/none/right3.png");
		app.loader.add("assets/character/none/left3.png");
		app.loader.add("assets/character/none/front4.png");
		app.loader.add("assets/character/none/back4.png");
		app.loader.add("assets/character/none/right4.png");
		app.loader.add("assets/character/none/left4.png");
		// BAT
		app.loader.add("assets/character/bat/front1.png");
		app.loader.add("assets/character/bat/back1.png");
		app.loader.add("assets/character/bat/right1.png");
		app.loader.add("assets/character/bat/left1.png");
		app.loader.add("assets/character/bat/front2.png");
		app.loader.add("assets/character/bat/back2.png");
		app.loader.add("assets/character/bat/right2.png");
		app.loader.add("assets/character/bat/left2.png");
		app.loader.add("assets/character/bat/front3.png");
		app.loader.add("assets/character/bat/back3.png");
		app.loader.add("assets/character/bat/right3.png");
		app.loader.add("assets/character/bat/left3.png");
		app.loader.add("assets/character/bat/front4.png");
		app.loader.add("assets/character/bat/back4.png");
		app.loader.add("assets/character/bat/right4.png");
		app.loader.add("assets/character/bat/left4.png");
		// PISTOL
		app.loader.add("assets/character/pistol/front1.png");
		app.loader.add("assets/character/pistol/back1.png");
		app.loader.add("assets/character/pistol/right1.png");
		app.loader.add("assets/character/pistol/left1.png");
		app.loader.add("assets/character/pistol/front2.png");
		app.loader.add("assets/character/pistol/back2.png");
		app.loader.add("assets/character/pistol/right2.png");
		app.loader.add("assets/character/pistol/left2.png");
		app.loader.add("assets/character/pistol/front3.png");
		app.loader.add("assets/character/pistol/back3.png");
		app.loader.add("assets/character/pistol/right3.png");
		app.loader.add("assets/character/pistol/left3.png");
		app.loader.add("assets/character/pistol/front4.png");
		app.loader.add("assets/character/pistol/back4.png");
		app.loader.add("assets/character/pistol/right4.png");
		app.loader.add("assets/character/pistol/left4.png");
		// NETGUN
		app.loader.add("assets/character/netgun/front1.png");
		app.loader.add("assets/character/netgun/back1.png");
		app.loader.add("assets/character/netgun/right1.png");
		app.loader.add("assets/character/netgun/left1.png");
		app.loader.add("assets/character/netgun/front2.png");
		app.loader.add("assets/character/netgun/back2.png");
		app.loader.add("assets/character/netgun/right2.png");
		app.loader.add("assets/character/netgun/left2.png");
		app.loader.add("assets/character/netgun/front3.png");
		app.loader.add("assets/character/netgun/back3.png");
		app.loader.add("assets/character/netgun/right3.png");
		app.loader.add("assets/character/netgun/left3.png");
		app.loader.add("assets/character/netgun/front4.png");
		app.loader.add("assets/character/netgun/back4.png");
		app.loader.add("assets/character/netgun/right4.png");
		app.loader.add("assets/character/netgun/left4.png");
		// WHISTLE
		app.loader.add("assets/character/whistle/front1.png");
		app.loader.add("assets/character/whistle/back1.png");
		app.loader.add("assets/character/whistle/right1.png");
		app.loader.add("assets/character/whistle/left1.png");
		app.loader.add("assets/character/whistle/front2.png");
		app.loader.add("assets/character/whistle/back2.png");
		app.loader.add("assets/character/whistle/right2.png");
		app.loader.add("assets/character/whistle/left2.png");
		app.loader.add("assets/character/whistle/front3.png");
		app.loader.add("assets/character/whistle/back3.png");
		app.loader.add("assets/character/whistle/right3.png");
		app.loader.add("assets/character/whistle/left3.png");
		app.loader.add("assets/character/whistle/front4.png");
		app.loader.add("assets/character/whistle/back4.png");
		app.loader.add("assets/character/whistle/right4.png");
		app.loader.add("assets/character/whistle/left4.png");
		// DEAD
		app.loader.add("assets/character/dead/characterFrontDead.png")
		UserInterface.loadResources(app);
	}

	constructor(app, viewport) {
		this.app = app;
		this.viewport = viewport;
		this.ui = new UserInterface(app);
		this.activeMissile = undefined;
	}
	
	prepareObject(x_pos, y_pos) {
		// SETUP player
		// NONE
		let playerNoneFrontTexture0 = this.app.loader.resources["assets/character/none/front1.png"].texture;
		let playerNoneBackTexture0 = this.app.loader.resources["assets/character/none/back1.png"].texture;
		let playerNoneRightTexture0 = this.app.loader.resources["assets/character/none/right1.png"].texture;
		let playerNoneLeftTexture0 = this.app.loader.resources["assets/character/none/left1.png"].texture;
		let playerNoneFrontTexture1 = this.app.loader.resources["assets/character/none/front2.png"].texture;
		let playerNoneBackTexture1 = this.app.loader.resources["assets/character/none/back2.png"].texture;
		let playerNoneRightTexture1 = this.app.loader.resources["assets/character/none/right2.png"].texture;
		let playerNoneLeftTexture1 = this.app.loader.resources["assets/character/none/left2.png"].texture;
		let playerNoneFrontTexture2 = this.app.loader.resources["assets/character/none/front3.png"].texture;
		let playerNoneBackTexture2 = this.app.loader.resources["assets/character/none/back3.png"].texture;
		let playerNoneRightTexture2 = this.app.loader.resources["assets/character/none/right3.png"].texture;
		let playerNoneLeftTexture2 = this.app.loader.resources["assets/character/none/left3.png"].texture;
		let playerNoneFrontTexture3 = this.app.loader.resources["assets/character/none/front4.png"].texture;
		let playerNoneBackTexture3 = this.app.loader.resources["assets/character/none/back4.png"].texture;
		let playerNoneRightTexture3 = this.app.loader.resources["assets/character/none/right4.png"].texture;
		let playerNoneLeftTexture3 = this.app.loader.resources["assets/character/none/left4.png"].texture;
		// BAT
		let playerBatFrontTexture0 = this.app.loader.resources["assets/character/bat/front1.png"].texture;
		let playerBatBackTexture0 = this.app.loader.resources["assets/character/bat/back1.png"].texture;
		let playerBatRightTexture0 = this.app.loader.resources["assets/character/bat/right1.png"].texture;
		let playerBatLeftTexture0 = this.app.loader.resources["assets/character/bat/left1.png"].texture;
		let playerBatFrontTexture1 = this.app.loader.resources["assets/character/bat/front2.png"].texture;
		let playerBatBackTexture1 = this.app.loader.resources["assets/character/bat/back2.png"].texture;
		let playerBatRightTexture1 = this.app.loader.resources["assets/character/bat/right2.png"].texture;
		let playerBatLeftTexture1 = this.app.loader.resources["assets/character/bat/left2.png"].texture;
		let playerBatFrontTexture2 = this.app.loader.resources["assets/character/bat/front3.png"].texture;
		let playerBatBackTexture2 = this.app.loader.resources["assets/character/bat/back3.png"].texture;
		let playerBatRightTexture2 = this.app.loader.resources["assets/character/bat/right3.png"].texture;
		let playerBatLeftTexture2 = this.app.loader.resources["assets/character/bat/left3.png"].texture;
		let playerBatFrontTexture3 = this.app.loader.resources["assets/character/bat/front4.png"].texture;
		let playerBatBackTexture3 = this.app.loader.resources["assets/character/bat/back4.png"].texture;
		let playerBatRightTexture3 = this.app.loader.resources["assets/character/bat/right4.png"].texture;
		let playerBatLeftTexture3 = this.app.loader.resources["assets/character/bat/left4.png"].texture;
		// PISTOL
		let playerPistolFrontTexture0 = this.app.loader.resources["assets/character/pistol/front1.png"].texture;
		let playerPistolBackTexture0 = this.app.loader.resources["assets/character/pistol/back1.png"].texture;
		let playerPistolRightTexture0 = this.app.loader.resources["assets/character/pistol/right1.png"].texture;
		let playerPistolLeftTexture0 = this.app.loader.resources["assets/character/pistol/left1.png"].texture;
		let playerPistolFrontTexture1 = this.app.loader.resources["assets/character/pistol/front2.png"].texture;
		let playerPistolBackTexture1 = this.app.loader.resources["assets/character/pistol/back2.png"].texture;
		let playerPistolRightTexture1 = this.app.loader.resources["assets/character/pistol/right2.png"].texture;
		let playerPistolLeftTexture1 = this.app.loader.resources["assets/character/pistol/left2.png"].texture;
		let playerPistolFrontTexture2 = this.app.loader.resources["assets/character/pistol/front3.png"].texture;
		let playerPistolBackTexture2 = this.app.loader.resources["assets/character/pistol/back3.png"].texture;
		let playerPistolRightTexture2 = this.app.loader.resources["assets/character/pistol/right3.png"].texture;
		let playerPistolLeftTexture2 = this.app.loader.resources["assets/character/pistol/left3.png"].texture;
		let playerPistolFrontTexture3 = this.app.loader.resources["assets/character/pistol/front4.png"].texture;
		let playerPistolBackTexture3 = this.app.loader.resources["assets/character/pistol/back4.png"].texture;
		let playerPistolRightTexture3 = this.app.loader.resources["assets/character/pistol/right4.png"].texture;
		let playerPistolLeftTexture3 = this.app.loader.resources["assets/character/pistol/left4.png"].texture;
		// NETGUN
		let playerNetgunFrontTexture0 = this.app.loader.resources["assets/character/netgun/front1.png"].texture;
		let playerNetgunBackTexture0 = this.app.loader.resources["assets/character/netgun/back1.png"].texture;
		let playerNetgunRightTexture0 = this.app.loader.resources["assets/character/netgun/right1.png"].texture;
		let playerNetgunLeftTexture0 = this.app.loader.resources["assets/character/netgun/left1.png"].texture;
		let playerNetgunFrontTexture1 = this.app.loader.resources["assets/character/netgun/front2.png"].texture;
		let playerNetgunBackTexture1 = this.app.loader.resources["assets/character/netgun/back2.png"].texture;
		let playerNetgunRightTexture1 = this.app.loader.resources["assets/character/netgun/right2.png"].texture;
		let playerNetgunLeftTexture1 = this.app.loader.resources["assets/character/netgun/left2.png"].texture;
		let playerNetgunFrontTexture2 = this.app.loader.resources["assets/character/netgun/front3.png"].texture;
		let playerNetgunBackTexture2 = this.app.loader.resources["assets/character/netgun/back3.png"].texture;
		let playerNetgunRightTexture2 = this.app.loader.resources["assets/character/netgun/right3.png"].texture;
		let playerNetgunLeftTexture2 = this.app.loader.resources["assets/character/netgun/left3.png"].texture;
		let playerNetgunFrontTexture3 = this.app.loader.resources["assets/character/netgun/front4.png"].texture;
		let playerNetgunBackTexture3 = this.app.loader.resources["assets/character/netgun/back4.png"].texture;
		let playerNetgunRightTexture3 = this.app.loader.resources["assets/character/netgun/right4.png"].texture;
		let playerNetgunLeftTexture3 = this.app.loader.resources["assets/character/netgun/left4.png"].texture;
		// WHISTLE
		let playerWhistleFrontTexture0 = this.app.loader.resources["assets/character/whistle/front1.png"].texture;
		let playerWhistleBackTexture0 = this.app.loader.resources["assets/character/whistle/back1.png"].texture;
		let playerWhistleRightTexture0 = this.app.loader.resources["assets/character/whistle/right1.png"].texture;
		let playerWhistleLeftTexture0 = this.app.loader.resources["assets/character/whistle/left1.png"].texture;
		let playerWhistleFrontTexture1 = this.app.loader.resources["assets/character/whistle/front2.png"].texture;
		let playerWhistleBackTexture1 = this.app.loader.resources["assets/character/whistle/back2.png"].texture;
		let playerWhistleRightTexture1 = this.app.loader.resources["assets/character/whistle/right2.png"].texture;
		let playerWhistleLeftTexture1 = this.app.loader.resources["assets/character/whistle/left2.png"].texture;
		let playerWhistleFrontTexture2 = this.app.loader.resources["assets/character/whistle/front3.png"].texture;
		let playerWhistleBackTexture2 = this.app.loader.resources["assets/character/whistle/back3.png"].texture;
		let playerWhistleRightTexture2 = this.app.loader.resources["assets/character/whistle/right3.png"].texture;
		let playerWhistleLeftTexture2 = this.app.loader.resources["assets/character/whistle/left3.png"].texture;
		let playerWhistleFrontTexture3 = this.app.loader.resources["assets/character/whistle/front4.png"].texture;
		let playerWhistleBackTexture3 = this.app.loader.resources["assets/character/whistle/back4.png"].texture;
		let playerWhistleRightTexture3 = this.app.loader.resources["assets/character/whistle/right4.png"].texture;
		let playerWhistleLeftTexture3 = this.app.loader.resources["assets/character/whistle/left4.png"].texture;

		// NONE
		this.playerNoneFrontTextureArray = [playerNoneFrontTexture0, playerNoneFrontTexture1,
			playerNoneFrontTexture2, playerNoneFrontTexture3];
		this.playerNoneBackTextureArray = [playerNoneBackTexture0, playerNoneBackTexture1,
			playerNoneBackTexture2, playerNoneBackTexture3];
		this.playerNoneRightTextureArray = [playerNoneRightTexture0, playerNoneRightTexture1,
			playerNoneRightTexture2, playerNoneRightTexture3];
		this.playerNoneLeftTextureArray = [playerNoneLeftTexture0, playerNoneLeftTexture1,
			playerNoneLeftTexture2, playerNoneLeftTexture3];
		// BAT
		this.playerBatFrontTextureArray = [playerBatFrontTexture0, playerBatFrontTexture1,
			playerBatFrontTexture2, playerBatFrontTexture3];
		this.playerBatBackTextureArray = [playerBatBackTexture0, playerBatBackTexture1,
			playerBatBackTexture2, playerBatBackTexture3];
		this.playerBatRightTextureArray = [playerBatRightTexture0, playerBatRightTexture1,
			playerBatRightTexture2, playerBatRightTexture3];
		this.playerBatLeftTextureArray = [playerBatLeftTexture0, playerBatLeftTexture1,
			playerBatLeftTexture2, playerBatLeftTexture3];
		// PISTOL
		this.playerPistolFrontTextureArray = [playerPistolFrontTexture0, playerPistolFrontTexture1,
			playerPistolFrontTexture2, playerPistolFrontTexture3];
		this.playerPistolBackTextureArray = [playerPistolBackTexture0, playerPistolBackTexture1,
			playerPistolBackTexture2, playerPistolBackTexture3];
		this.playerPistolRightTextureArray = [playerPistolRightTexture0, playerPistolRightTexture1,
			playerPistolRightTexture2, playerPistolRightTexture3];
		this.playerPistolLeftTextureArray = [playerPistolLeftTexture0, playerPistolLeftTexture1,
			playerPistolLeftTexture2, playerPistolLeftTexture3];
		// NETGUN
		this.playerNetgunFrontTextureArray = [playerNetgunFrontTexture0, playerNetgunFrontTexture1,
			playerNetgunFrontTexture2, playerNetgunFrontTexture3];
		this.playerNetgunBackTextureArray = [playerNetgunBackTexture0, playerNetgunBackTexture1,
			playerNetgunBackTexture2, playerNetgunBackTexture3];
		this.playerNetgunRightTextureArray = [playerNetgunRightTexture0, playerNetgunRightTexture1,
			playerNetgunRightTexture2, playerNetgunRightTexture3];
		this.playerNetgunLeftTextureArray = [playerNetgunLeftTexture0, playerNetgunLeftTexture1,
			playerNetgunLeftTexture2, playerNetgunLeftTexture3];
		// NETGUN
		this.playerWhistleFrontTextureArray = [playerWhistleFrontTexture0, playerWhistleFrontTexture1,
			playerWhistleFrontTexture2, playerWhistleFrontTexture3];
		this.playerWhistleBackTextureArray = [playerWhistleBackTexture0, playerWhistleBackTexture1,
			playerWhistleBackTexture2, playerWhistleBackTexture3];
		this.playerWhistleRightTextureArray = [playerWhistleRightTexture0, playerWhistleRightTexture1,
			playerWhistleRightTexture2, playerWhistleRightTexture3];
		this.playerWhistleLeftTextureArray = [playerWhistleLeftTexture0, playerWhistleLeftTexture1,
			playerWhistleLeftTexture2, playerWhistleLeftTexture3];

		// current texture
		this.playerCurrentTextureArray = this.playerNoneFrontTextureArray;
		this.ui.command = "down";

		// https://stackoverflow.com/questions/42696099/pixi-js-animatedsprite-lag-on-first-play
		this.playerSprite = new PIXI.AnimatedSprite(this.playerCurrentTextureArray);
		this.playerSprite.animationSpeed = 0.20;
		this.playerSprite.loop = true;

		this.playerSprite.scale.x = 0.15;
		this.playerSprite.scale.y = 0.15;
		this.playerSprite.x = Math.round(x_pos - (this.playerSprite.width/2));
		this.playerSprite.y = y_pos;
		this.playerSprite.vx = 0;
		this.playerSprite.vy = 0;
		this.playerSprite.yForZOrdering = this.playerSprite.y + this.playerSprite.height;
 		this.playerSprite.name = "player";
 		this.playerSprite.velocity = 3;
 		this.collisionProperties = this.getCorrectedBoundsAndVelocity();
 		this.playerSprite.contextClass = this;
 		this.isGrabbing = false;
 		this.grabbedMonster = undefined;
 		this.interactedMonstersList = [];

		this.viewport.moveTo(x_pos + this.viewport._width/4, y_pos + this.viewport._height/2 + this.playerSprite.height/2);
		this.viewport.zoom(600);

		// SETUP player UI
		this.ui.prepareObject(x_pos, y_pos, this.viewport, this.playerSprite);
		// SETUP other player dependant stuff
		this.waveContainer = new PIXI.Container();
        this.waveContainer.x = this.viewport.center.x - 253;
        this.waveContainer.y = this.viewport.center.y - 418;
        this.waveContainer.name = "waveContainer";
        this.waveContainer._zIndex = Number.MAX_SAFE_INTEGER-1;
        this.waveText = new PIXI.Text("Wave i", 
			textStyle("Courier New", 48, "center", ["#000000", "#cef442", "#000000"], "#000000", 4));
        this.waveText.resolution = 2;
        this.waveText.alpha = 0;
        this.equipText = new PIXI.Text("EQUIP YOUR WEAPON", 
			textStyle("Comic Sans MS", 18, "center", ["#000000", "#cef442", "#000000"], "#000000", 3));
        this.equipText.resolution = 2;
        this.equipText.alpha = 0;
        this.equipText.x = -this.equipText.text.length;
        this.equipText.y += 40;
        this.waveContainer.addChild(this.waveText);
        this.waveContainer.addChild(this.equipText);
		// KEY STROKE EVENTS
		// walk
		this.leftKey = keyboard("a");
		this.rightKey = keyboard("d");
		this.downKey = keyboard("s");
		this.upKey = keyboard("w");

		// equip/unequip items
		this.zeroKey = keyboard("0");
		this.oneKey = keyboard("1");
		this.twoKey = keyboard("2");
		this.threeKey = keyboard("3");
		this.fourKey = keyboard("4");

		// see items info
		this.f1Key = keyboard("F1");
		this.f2Key = keyboard("F2");
		this.f3Key = keyboard("F3");
		this.f4Key = keyboard("F4");

		// interact
		this.fKey = keyboard("f");

		// pause
		this.pKey = keyboard("p");
		this.escKey = keyboard("Escape");

		// MOVEMENT KEYS
		// note: comment second conditions and movement resets on key press to obtain diagonal movements,
		// but beware it's going to be a twice-as-fast movement, so there needs to be code to divide
		// the speed by half on certain conditions
		this.leftKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.command = "left";
				this.playerSprite.vx = -this.playerSprite.velocity;
				this.playerSprite.vy = 0;
				this.updatePlayerSprite();
			}
		};
		this.leftKey.release = () => {
			if (!this.rightKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.rightKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.command = "right";
				this.playerSprite.vx = this.playerSprite.velocity;
				this.playerSprite.vy = 0;
				this.updatePlayerSprite();
			}
		};
		this.rightKey.release = () => {
			if (!this.leftKey.isDown && this.playerSprite.vy === 0) {
				this.playerSprite.vx = 0;
			}
		};

		this.downKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.command = "down";
				this.playerSprite.vx = 0;
				this.playerSprite.vy = this.playerSprite.velocity;
				this.updatePlayerSprite();
			}
		};
		this.downKey.release = () => {
			if (!this.upKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		this.upKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.command = "up";
				this.playerSprite.vx = 0;
				this.playerSprite.vy = -this.playerSprite.velocity;
				this.updatePlayerSprite();
			}
		};
		this.upKey.release = () => {
			if (!this.downKey.isDown && this.playerSprite.vx === 0) {
				this.playerSprite.vy = 0;
			}
		};

		// UI KEYS
		// zIndex: https://github.com/pixijs/pixi.js/issues/300
		this.zeroKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("none");
				this.ui.crosshair.sprite.visible = false;
				this.updatePlayerSprite();
			}
		};
		this.zeroKey.release = () => {
		};

		this.oneKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("bat");
				this.ui.crosshair.sprite.visible = true;
				this.updatePlayerSprite();
			}
		};
		this.oneKey.release = () => {
		};

		this.twoKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("pistol");
				this.ui.crosshair.sprite.visible = true;
				this.updatePlayerSprite();
			}
		};
		this.twoKey.release = () => {
		};

		this.threeKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("netgun");
				this.ui.crosshair.sprite.visible = true;
				this.updatePlayerSprite();
			}
		};
		this.threeKey.release = () => {
		};

		this.fourKey.press = () => {
			if (!this.ui.isPaused()) {
				this.ui.highlightCard("whistle");
				this.ui.crosshair.sprite.visible = false;
				this.updatePlayerSprite();
			}
		};
		this.fourKey.release = () => {
		};

		this.f1Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardBatInfo");
			}
		};
		this.f1Key.release = () => {
		};

		this.f2Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardPistolInfo");
			}
		};
		this.f2Key.release = () => {
		};

		this.f3Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardNetgunInfo");
			}
		};
		this.f3Key.release = () => {
		};

		this.f4Key.press = () => {
			if (!this.ui.pauseScreen.container.visible) {
				this.ui.toggleCardsInfo("cardWhistleInfo");
			}
		};
		this.f4Key.release = () => {
		};

		this.fKey.press = () => {
			if (!this.ui.isPaused()) {
				this.pressFNearestMonster();
			}
		};
		this.fKey.release = () => {
		};

		// PAUSE: "P" or "Esc"
		this.pKey.press = () => {
			this.ui.togglePause();
		};
		this.pKey.release = () => {
			console.log("statistics: ");
			console.log(this.app.statistics.toString());
		};

		this.escKey.press = () => {
			this.ui.togglePause();
		};
		this.escKey.release = () => {
		};

		//mouse input
		window.addEventListener("mousemove", event => {
			this.ui.moveCrosshair(event,this.ui.command);
		});

		window.addEventListener("click", event => {
			// mouse events:
			// - right-handed: 0 for mouse1, 1 for wheel-click, 2 for mouse2
			// - left-handed: 2 for mouse1, 1 for wheel-click, 0 for mouse2
			this.ui.useItem(this.playerSprite, event);
		});
	}

	initObject() {
		this.app.stage.addChild(this.waveContainer);
		this.app.stage.addChild(this.playerSprite);
		console.log("player character initialized");
	}

	initLoop() {
		// start the player loop
		this.app.ticker.add(delta => this.playerLoop(delta));
		console.log("player loop initialized");
	}

	initUI() {
		this.ui.initObject();
	}

	pressFNearestMonster() {
		let monsters = this.app.stage.children.filter(child => child.name.indexOf("monster") !== -1);

		if (monsters !== undefined && monsters.length !== 0 && !this.isGrabbing) {
			for (var i = 0; i < monsters.length; i++) {
				if (monsters[i].dead && !this.isGrabbing && checkDynamicIntoDynamicCollision(this.playerSprite, monsters[i])) {
					for (var j = 0; j < this.interactedMonstersList.length; j++) {
						if (this.interactedMonstersList[j]===monsters[i]) {
							return;
						}
					}
					// hide respects text
					monsters[i].interactText.visible = false;
					// play ghost animation
					monsters[i].contextClass.playLeaveBodyAnimation();
					// give small compensation for paying respects
					this.ui.addScore(50);
					// update interacted monster list
					this.interactedMonstersList.push(monsters[i]);
					return;
				}
			    else if (monsters[i].captured && !this.isGrabbing && checkDynamicIntoDynamicCollision(this.playerSprite, monsters[i])) {
			    	this.isGrabbing = true;
					monsters[i].x = this.playerSprite.x;
					monsters[i].y = this.playerSprite.y;
					monsters[i].interactionContainer.x = monsters[i].x - monsters[i].width/2;
					monsters[i].interactionContainer.y = monsters[i].y - 18;
					// hide grab text
					monsters[i].interactText.visible = false;
					this.grabbedMonster = monsters[i];
					return;
				}
			}
		}
		else {
			let interacted = false;
			// get drop-monster points
			for (var i = 0; i < this.interactedMonstersList.length; i++) {
				if (this.interactedMonstersList[i]===this.grabbedMonster) {
					interacted = true;
					break;
				}
			}
			this.isGrabbing = false;

			let timeFactor = +this.ui.clock.timeText.text;
			let waveFactor = this.grabbedMonster.waveIndex+1;
			let scoreValue = this.grabbedMonster.isAngry?(2*timeFactor*waveFactor):(1*timeFactor*waveFactor);
			if (!interacted) {
				if (this.grabbedMonster.contextClass.checkMonsterInCorrectGarden()) {
					console.log("valid drop");
					this.ui.addScore(scoreValue);
					this.app.statistics.monsterCured();
					this.interactedMonstersList.push(this.grabbedMonster);
				} else {
					console.log("invalid drop");
					this.grabbedMonster.interactText.visible = true;
				}
			}
			this.grabbedMonster = undefined;
		}
	}

	updatePlayerSprite() {
		switch(this.ui.currentItem) {
			case "none":
				this.app.statistics.weaponUnequipped();
				break;
			case "bat":
				this.app.statistics.baseballBatEquipped();
				break;
			case "pistol":
				this.app.statistics.gunEquipped();
				break;
			case "netgun":
				this.app.statistics.netgunEquipped();
				break;
			case "whistle":
				this.app.statistics.whistleEquipped();
				break;
			default:
				// do nothing
		}
		switch(this.ui.command) {
			case "left":
				switch(this.ui.currentItem) {
					case "none":
						this.playerCurrentTextureArray = this.playerNoneLeftTextureArray;
						break;
					case "bat":
						this.playerCurrentTextureArray = this.playerBatLeftTextureArray;
						break;
					case "pistol":
						this.playerCurrentTextureArray = this.playerPistolLeftTextureArray;
						break;
					case "netgun":
						this.playerCurrentTextureArray = this.playerNetgunLeftTextureArray;
						break;
					case "whistle":
						this.playerCurrentTextureArray = this.playerWhistleLeftTextureArray;
						break;
					default:
						// do nothing
				}
				break;
			case "right":
				switch(this.ui.currentItem) {
					case "none":
						this.playerCurrentTextureArray = this.playerNoneRightTextureArray;
						break;
					case "bat":
						this.playerCurrentTextureArray = this.playerBatRightTextureArray;
						break;
					case "pistol":
						this.playerCurrentTextureArray = this.playerPistolRightTextureArray;
						break;
					case "netgun":
						this.playerCurrentTextureArray = this.playerNetgunRightTextureArray;
						break;
					case "whistle":
						this.playerCurrentTextureArray = this.playerWhistleRightTextureArray;
						break;
					default:
						// do nothing
				}
				break;
			case "down":
				switch(this.ui.currentItem) {
					case "none":
						this.playerCurrentTextureArray = this.playerNoneFrontTextureArray;
						break;
					case "bat":
						this.playerCurrentTextureArray = this.playerBatFrontTextureArray;
						break;
					case "pistol":
						this.playerCurrentTextureArray = this.playerPistolFrontTextureArray;
						break;
					case "netgun":
						this.playerCurrentTextureArray = this.playerNetgunFrontTextureArray;
						break;
					case "whistle":
						this.playerCurrentTextureArray = this.playerWhistleFrontTextureArray;
						break;
					default:
						// do nothing
				}
				break;
			case "up":
				switch(this.ui.currentItem) {
					case "none":
						this.playerCurrentTextureArray = this.playerNoneBackTextureArray;
						break;
					case "bat":
						this.playerCurrentTextureArray = this.playerBatBackTextureArray;
						break;
					case "pistol":
						this.playerCurrentTextureArray = this.playerPistolBackTextureArray;
						break;
					case "netgun":
						this.playerCurrentTextureArray = this.playerNetgunBackTextureArray;
						break;
					case "whistle":
						this.playerCurrentTextureArray = this.playerWhistleBackTextureArray;
						break;
					default:
						// do nothing
				}
			default:
				// do nothing
		}
		setTexturesOnlyIfNeeded(this.playerSprite, this.playerCurrentTextureArray);
	}

	movePlayer() {
		if (this.playerSprite.vx !== 0) {
			// walking animation
			this.playerSprite.play();
			// walking horizontally
			this.playerSprite.x += this.playerSprite.vx;
			// camera effect
			this.viewport.move(this.playerSprite.vx, 0);
			// move healthbar
			this.ui.healthBar.container.x += this.playerSprite.vx;
			// move cards container
			this.ui.cards.container.x += this.playerSprite.vx;
			// move invisible cards info container
			this.ui.cardsInfo.container.x += this.playerSprite.vx;
			// move invisible pause screen
			this.ui.pauseScreen.container.x += this.playerSprite.vx;
			// move score text
			this.ui.score.totalContainer.x += this.playerSprite.vx;
			this.ui.score.changeContainer.x += this.playerSprite.vx;
			this.ui.clock.container.x += this.playerSprite.vx;
			// move grabbed monster
			if (this.isGrabbing) {
				this.grabbedMonster.x += this.playerSprite.vx;
				this.grabbedMonster.interactionContainer.x += this.playerSprite.vx;
			}
			// move other player dependant objects
			this.waveContainer.x += this.playerSprite.vx;
		}
		else if (this.playerSprite.vy !== 0) {
			// walking animation
			this.playerSprite.play();
			// walking vertically
			this.playerSprite.y += this.playerSprite.vy;
			// camera effect
			this.viewport.move(0, this.playerSprite.vy);
			// move healthbar
			this.ui.healthBar.container.y += this.playerSprite.vy;
			// move cards container
			this.ui.cards.container.y += this.playerSprite.vy;
			// move invisible cards info container
			this.ui.cardsInfo.container.y += this.playerSprite.vy;
			// move invisible pause screen
			this.ui.pauseScreen.container.y += this.playerSprite.vy;
			// move score text
			this.ui.score.totalContainer.y += this.playerSprite.vy;
			this.ui.score.changeContainer.y += this.playerSprite.vy;
			this.ui.clock.container.y += this.playerSprite.vy;
			// move grabbed monster
			if (this.isGrabbing) {
				this.grabbedMonster.y += this.playerSprite.vy;
				this.grabbedMonster.interactionContainer.y += this.playerSprite.vy;
			}
			// move other player dependant objects
			this.waveContainer.y += this.playerSprite.vy;
		}
		else {
			// character isn't walking: do nothing
			let isResetFrame = (this.playerSprite.currentFrame === 0) || (this.playerSprite.currentFrame === 2);
			if (this.playerSprite.playing && isResetFrame) {
				this.playerSprite.stop();
			}
		}
	}

	playerIsMoving() {
		return (this.playerSprite.vx !== 0 || this.playerSprite.vy !== 0);
	}

	playerLoop(delta) {
		if (!this.ui.isPaused()) {
			this.collisionProperties = this.getCorrectedBoundsAndVelocity();
			this.handleAllDetainerCollisions();
			this.handleContainerCollisionsAndMove();
			this.ui.updateCrosshairOnScreen(this.playerSprite);
			this.ui.updateMissileColliders(delta);
			this.ui.updateClock(delta);
			this.ui.pistolCooldown.update(delta, this.playerSprite.position);
			this.ui.netgunCooldown.update(delta, this.playerSprite.position);
			//update zordering pos
			this.playerSprite.yForZOrdering = this.playerSprite.y + this.playerSprite.height;
		}
	}

	handleAllDetainerCollisions() {
		let monsters = this.app.stage.children.filter(child => child.name.indexOf("monster") !== -1);
		let staticBlockers = this.app.stage.children.filter(child => 
			child.name.indexOf("blocker") !== -1);

		// player/monster collisions
		if (monsters !== undefined && monsters.length !== 0) {
			for (var i = 0; i < monsters.length; i++) {
			    if (!monsters[i].captured && !monsters[i].dead &&
			    	detainSpriteOutsideDetainer(this.collisionProperties, monsters[i].contextClass.getCorrectedBoundsAndVelocity(), "stop") !== "none") {
					this.resetPlayerVelocity();
					return;
				}
			}
		}

		// static elements collision
		if (staticBlockers !== undefined && staticBlockers.length !== 0) {
			for (var i = 0; i < staticBlockers.length; i++) {
				let staticBlockersBound = staticBlockers[i].contextClass.getCorrectedBounds(this.playerSprite);
			    if (detainSpriteOutsideDetainer(this.collisionProperties, staticBlockersBound, "stop") !== "none"){
			    	this.resetPlayerVelocity();
			    	return;
			    }
			}
		}
	}

	handleContainerCollisionsAndMove() {
		// map width and map height
		let mapBounds = {x: 0, y: 0, width: 2048, height: 1536};
		if (containSpriteInsideContainer(this.collisionProperties, mapBounds, "stop") !== "none") {
			this.resetPlayerVelocity();
		}

		this.movePlayer();
	}

	getCorrectedBoundsAndVelocity() {
		let correction = 25;
		let canWalkHeight = (7/10)*this.playerSprite.height;
		return {x: this.playerSprite.x+correction, y: this.playerSprite.y + canWalkHeight, 
			width: this.playerSprite.width-correction*1.5, height: this.playerSprite.height - canWalkHeight,
			vx: this.playerSprite.vx, vy: this.playerSprite.vy};
	}

	resetPlayerVelocity() {
		this.playerSprite.vx = this.collisionProperties.vx;
		this.playerSprite.vy = this.collisionProperties.vy;
	}
}
