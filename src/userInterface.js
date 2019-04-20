import HealthBar from "./HealthBar";
import Cards from "./Cards";

export default class UserInterface {
	static loadResources() {
		HealthBar.loadResources();
		Cards.loadResources();
	}
	
	constructor(app) {
		this.app = app;
		this.healthBar = new HealthBar(this.app);
		this.cards = new Cards(this.app);
	}

	prepareHealthbar(x_pos, y_pos, width, height, colorCode, maxHealth) {
		this.healthBar.prepareObject(x_pos, y_pos, width, height, colorCode, maxHealth);
	}

	initHealthbar() {
		this.healthBar.initObject();
	}

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
		this.cards.highlightCard(card);
	}
}
