import * as PIXI from 'pixi.js';
import TimedEvent from "./TimedEvent";
import Monster from "./Monster";
import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class Wave {
	constructor(app, n_regular, health_regular, speed_regular,
			n_angry, health_angry, speed_angry) {
		this.monsters = [];
		for (var i = 0; i < n_regular; i++) {
			this.monsters.push(new Monster(app, false, health_regular, speed_regular));
		}
		for (var i = 0; i < n_angry; i++) {
			this.monsters.push(new Monster(app, true, health_angry, speed_angry));
		}
	}

	getMonsterList() {
		return this.monsters;
	}

	setMonsterList(monsters) {
		this.monsters = monsters;
	}

	startWave(zSorter, player, i) {
		// start monsters loop
		/*
		let positions1 = 
			[
			[[100, 100], [100, 200], [200, 100], [200, 200]],
			[[300, 300], [300, 400], [400, 300], [400, 400]],
			[[700, 700], [700, 800], [800, 700], [800, 800]],
			[[900, 900], [900, 1000], [1000, 900], [1000, 1000]],
			];
		*/
		let positions2 = [[700,700], [700,800], [800,700], [800,800], [750,900]];
		let counter = 0;
		this.monsters.forEach(function(m) {
			//m.prepareObject(positions1[getRandomArbitraryInt(0,3)][getRandomArbitraryInt(0,3)], counter);
			m.prepareObject(positions2[counter], counter, i);
			m.initObject();
			zSorter.register(m.monsterSprite);
			zSorter.register(m.sightField);
			m.initLoop(player);
			counter += 1;
		});
	}

}
