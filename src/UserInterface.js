import HealthBar from "./HealthBar";
import Cards from "./Cards";
import PauseScreen from "./PauseScreen";
import Crosshair from "./Crosshair";
import CardsInfo from "./CardsInfo";
import Missile from "./Missile";
import Score from "./Score";
import Clock from "./Clock";
import * as PIXI from 'pixi.js'

export default class UserInterface {
	static loadResources(app) {
		Cards.loadResources(app);
		PauseScreen.loadResources(app);
		Crosshair.loadResources(app);
		Missile.loadResources(app);
		CardsInfo.loadResources(app);
		Clock.loadResources(app);
	}
	
	constructor(app) {
		this.app = app;
		this.healthBar = new HealthBar(this.app);
		this.cards = new Cards(this.app);
		this.pauseScreen = new PauseScreen(this.app);
		this.crosshair = new Crosshair(this.app);
		this.clock = new Clock(this.app);
		// initialize 10 bullet objects (max bullets in screen at the same time)
		this.shootDirection = new PIXI.Point(0,0);
		this.currentBullet = 0;
		this.currentNet = 0;
		this.currentBatCollider = 0;
		this.bullets = [];
		this.nets = [];
		this.batColliders = [];
		this.paused = false;
		this.currentClicks = 0;
		this.clickerLimit = 4;

		for (var i = 10; i >= 0; i--) {
			this.bullets.push(new Missile(app,"bulletCollider"));
			this.nets.push(new Missile(app,"netCollider"));
			this.batColliders.push(new Missile(app,"batCollider"));
		}
		this.cardsInfo = new CardsInfo(app);
		this.score = new Score(app);
	}

	prepareObject(x_pos, y_pos, viewport, playerSprite) {
		this.currentItem = "none";
		this.viewport = viewport;

		// position relative to player
		this.prepareHealthbar(x_pos - 1, y_pos - 4);
		this.prepareCrosshair(x_pos, y_pos);
		this.prepareMissiles(x_pos, y_pos);
		this.prepareCardsInfo(x_pos, y_pos);
		this.prepareClock(viewport.center.x + 220, viewport.center.y - 490);

		// relative to both player and viewport
		this.prepareCards(viewport.center.x - 718, viewport.center.y - 108);
		this.prepareScore(viewport.center.x + 218, viewport.center.y - 518, 
			x_pos, y_pos);
		this.preparePauseScreen(x_pos, viewport.center.y + playerSprite.height/2 - 338);
	}

	initObject() {
		this.initHealthbar();
		this.initCards();
		this.initCrosshair();
		this.initMissiles();
		this.initCardsInfo();
		this.initScore();
		this.initClock();
		// pause screen always in the end
		this.initPauseScreen();
	}

	prepareClock(x_pos,y_pos) {
		this.clock.prepareObject(x_pos,y_pos);
	}
	initClock() {
		this.clock.initObject();
	}
	updateClock(delta) {
		if(!this.isPaused())
			this.clock.update(delta);
	}

	// HEALTHBAR
	prepareHealthbar(x_pos, y_pos) {
		this.healthBar.prepareObject(x_pos, y_pos, 64, 8, 0x4CBB17, 0xFFFFFF, 20);
	}

	initHealthbar() {
		this.healthBar.initObject();
	}

	// CARDS
	prepareCards(x_pos, y_pos) {
		this.cards.prepareObject(x_pos, y_pos);
	}

	initCards() {
		this.cards.initObject();
	}

	resortCards(whistleZ, batZ, pistolZ, netgunZ) {
		this.cards.resortCards(whistleZ, batZ, pistolZ, netgunZ);
	}

	highlightCard(card) {
		this.currentItem = card;
		this.cards.highlightCard(card);
	}

	// PAUSE
	preparePauseScreen(x_pos, y_pos) {
		this.pauseScreen.prepareObject(x_pos, y_pos, 350, 400);
	}

	initPauseScreen() {
		this.pauseScreen.initObject();
	}

	togglePause() {
		this.pauseScreen.toggle(this);
	}

	isPaused() {
		return (this.pauseScreen.container.visible || this.cardsInfo.displayed) ||
			this.paused;
	}


	// bullets & nets
	prepareMissiles(x_pos, y_pos) {
 		for (var i = 10; i >= 0; i--) {
			this.bullets[i].prepareObject(x_pos, y_pos, i);
			this.nets[i].prepareObject(x_pos, y_pos, i);
			this.batColliders[i].prepareObject(x_pos, y_pos, i);
		}
	}

	initMissiles() {
		for (var i = 10; i >= 0; i--) {
			this.bullets[i].initObject();
			this.nets[i].initObject();
			this.batColliders[i].initObject();
		}
	}

	updateMissileColliders(delta) {
		//update missile colliders
		for (var i = this.bullets.length - 1; i >= 0; i--) {
			this.bullets[i].update(delta, 200);
			this.nets[i].update(delta, 200);
			this.batColliders[i].update(delta, 60);
		}
	}


	// CROSSHAIR
	prepareCrosshair(x_pos, y_pos) {
		this.crosshair.prepareObject(x_pos, y_pos);
	}

	initCrosshair() {
		this.crosshair.initObject();
	}
	
	moveCrosshair(event) {
		if (!this.isPaused()) {
			this.crosshair.sprite.visible = this.shootableItem();
			//top left based
			let mousePosOnSphereAroundPlayer = new PIXI.Point(event.screenX, event.screenY);
			mousePosOnSphereAroundPlayer.x /= window.screen.availWidth;
			mousePosOnSphereAroundPlayer.x -= 0.5;
			mousePosOnSphereAroundPlayer.y /= window.screen.availHeight;
			mousePosOnSphereAroundPlayer.y -= 0.5;
			this.shootDirection.x = mousePosOnSphereAroundPlayer.x;
			this.shootDirection.y = mousePosOnSphereAroundPlayer.y;
			let length = Math.sqrt(this.shootDirection.x * this.shootDirection.x + this.shootDirection.y * this.shootDirection.y);
			if(length != 0) {
				this.shootDirection.x /= length;
				this.shootDirection.y /= length;
			}
		}
	}

	updateCrosshairOnScreen(playerSprite) {
		//update crosshair
		this.crosshair.sprite.x = playerSprite.x - this.crosshair.sprite.width / 2 
			+ playerSprite.width / 2 + 100.0 *  this.shootDirection.x;
		this.crosshair.sprite.y = playerSprite.y - this.crosshair.sprite.height / 2 
			+ playerSprite.height / 2 + 100.0 * this.shootDirection.y;
	}

	shootableItem() {
		return (this.currentItem === "pistol" || this.currentItem === "netgun" || 
			this.currentItem === "bat");
	}

	usableItem() {
		return (this.currentItem === "pistol" || this.currentItem === "netgun"
			|| this.currentItem === "bat" || this.currentItem === "whistle");
	}

	// CARDS INFO
	prepareCardsInfo(x_pos, y_pos) {
		this.cardsInfo.prepareObject(x_pos, y_pos);
	}

	initCardsInfo() {
		this.cardsInfo.initObject();
	}

	toggleCardsInfo(cardInfo) {
		this.cardsInfo.toggle(cardInfo);
	}

	// SCORE
	prepareScore(x1_pos, y1_pos, x2_pos, y2_pos) {
		this.score.prepareObject(x1_pos, y1_pos, x2_pos, y2_pos);
	}

	initScore() {
		this.score.initObject();
	}

	addScore(value) {
		this.score.addScore(value, this.viewport);
	}

	useItem(playerSprite, event) {
		if (event.button===0 && !this.isPaused() && this.usableItem()) {
			let angle = Math.acos(this.shootDirection.y);
			angle *= this.shootDirection.x > 0.0 ? -1 : 1;
			if (this.currentItem === "netgun") {
				this.nets[this.currentNet].go(
					playerSprite.x + playerSprite.width/2 - this.shootDirection.y * this.nets[0].sprite.width / 2,
					playerSprite.y + playerSprite.height/2 + this.shootDirection.x * this.nets[0].sprite.height / 2,
					10.0 * this.shootDirection.x,
					10.0 * this.shootDirection.y,
					angle,
					true);
				this.currentNet = (this.currentNet + 1) % 10;
			} else if (this.currentItem === "pistol") {
				this.bullets[this.currentBullet].go(
					playerSprite.x + playerSprite.width/2 - this.shootDirection.y * this.bullets[0].sprite.width / 2,
					playerSprite.y + playerSprite.height/2 + this.shootDirection.x * this.bullets[0].sprite.height / 2,
					10.0 * this.shootDirection.x,
					10.0 * this.shootDirection.y,
					angle,
					true);
				this.currentBullet = (this.currentBullet + 1) % 10;
			} else if (this.currentItem === "bat") {
				this.batColliders[this.currentBatCollider].go(
					playerSprite.x + playerSprite.width/2 - this.shootDirection.y * this.batColliders[0].sprite.width / 2,
					playerSprite.y + playerSprite.height/2 + this.shootDirection.x * this.batColliders[0].sprite.height / 2,
					10.0 * this.shootDirection.x,
					10.0 * this.shootDirection.y,
					angle,
					false);
				this.currentBatCollider = (this.currentBatCollider + 1) % 10;
			} else if (this.currentItem === "whistle") {
				// todo: call pet
			}
		}
	}

}
