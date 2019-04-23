import HealthBar from "./HealthBar";
import Cards from "./Cards";
import PauseScreen from "./PauseScreen";
import Crosshair from "./Crosshair";
import Missile from './Missile';

export default class UserInterface {
	static loadResources() {
		HealthBar.loadResources();
		Cards.loadResources();
		PauseScreen.loadResources();
		Crosshair.loadResources();
		Missile.loadResources();
	}
	
	constructor(app) {
		this.app = app;
		this.healthBar = new HealthBar(this.app);
		this.cards = new Cards(this.app);
		this.pauseScreen = new PauseScreen(this.app);
		this.crosshair = new Crosshair(this.app);

		// initialize 10 bullet objects (max bullets in screen at the same time)
		this.shootDirection = new PIXI.Point(0,0);
		this.currentBullet = 0;
		this.currentNet = 0;
		this.bullets = [];
		this.nets = [];
		for (var i = 10; i >= 0; i--) {
			this.bullets.push(new Missile(app,"bullet"));
			this.nets.push(new Missile(app,"net"));
		}
		

	}

	prepareObject(x_pos, y_pos) {
		this.currentItem = "none";
		this.prepareHealthbar(x_pos - 1, y_pos - 4);
		this.prepareCards(x_pos - 530, 690);
		this.prepareCrosshair(x_pos, y_pos);
		this.prepareMissiles(x_pos, y_pos);
		this.preparePauseScreen(x_pos, y_pos);
	}

	initObject() {
		this.initHealthbar();
		this.initCards();
		this.initCrosshair();
		this.initMissiles();
		// pause screen always in the end
		this.initPauseScreen();
	}

	// HEALTHBAR
	prepareHealthbar(x_pos, y_pos) {
		this.healthBar.prepareObject(x_pos, y_pos, 64, 8, 0x4CBB17, 20);
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

	resortCards(batZ, pistolZ, netgunZ) {
		this.cards.resortCards(batZ, pistolZ, netgunZ);
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
		// TODO: pause screen with command information
		this.pauseScreen.toggle();
	}

	isPaused() {
		return this.pauseScreen.container.visible;
	}

	// bullets & nets
	prepareMissiles(x_pos, y_pos) {
 		for (var i = 10; i >= 0; i--) {
			this.bullets[i].prepareObject(x_pos, y_pos, i);
			this.nets[i].prepareObject(x_pos, y_pos, i);
		}
	}

	initMissiles() {
		for (var i = 10; i >= 0; i--) {
			this.bullets[i].initObject();
			this.nets[i].initObject();
		}
	}

	// CROSSHAIR
	prepareCrosshair(x_pos, y_pos) {
		this.crosshair.prepareObject(x_pos, y_pos);
	}

	initCrosshair() {
		this.crosshair.initObject();
	}
	
	shootableItem() {
		return (this.currentItem === "pistol" || this.currentItem === "netgun");
	}

}
