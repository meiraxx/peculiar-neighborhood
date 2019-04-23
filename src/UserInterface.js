import HealthBar from "./HealthBar";
import Cards from "./Cards";
import PauseScreen from "./PauseScreen";
import Crosshair from "./Crosshair";
import Bullet from "./Bullet";
import CardsInfo from "./CardsInfo";

export default class UserInterface {
	static loadResources() {
		HealthBar.loadResources();
		Cards.loadResources();
		PauseScreen.loadResources();
		Crosshair.loadResources();
		Bullet.loadResources();
		CardsInfo.loadResources();
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
		this.bullets = [];
		for (var i = 10; i >= 0; i--) {
			this.bullets.push(new Bullet(app));
		}
		this.cardsInfo = new CardsInfo(app);
	}

	prepareObject(x_pos, y_pos) {
		this.currentItem = "none";
		this.prepareHealthbar(x_pos - 1, y_pos - 4);
		this.prepareCards(x_pos - 530, 690);
		this.prepareCrosshair(x_pos, y_pos);
		this.prepareBullets(x_pos, y_pos);
		this.prepareCardsInfo(x_pos, y_pos);
		this.preparePauseScreen(x_pos, y_pos);
	}

	initObject() {
		this.initHealthbar();
		this.initCards();
		this.initCrosshair();
		this.initBullets();
		this.initCardsInfo();
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
		this.pauseScreen.toggle();
	}

	isPaused() {
		return (this.pauseScreen.container.visible || this.cardsInfo.displayed);
	}

	// BULLETS
	prepareBullets(x_pos, y_pos) {
 		for (var i = 10; i >= 0; i--) {
			this.bullets[i].prepareObject(x_pos, y_pos, i);
		}
	}

	initBullets() {
		for (var i = 10; i >= 0; i--) {
			this.bullets[i].initObject();
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
}
