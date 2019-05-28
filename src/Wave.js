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
		
		let positions1 = 
			[
			[[140, 1190], [140, 1230], [140, 1260], [400, 1190], [400, 1260]],
			[[205, 490], [205, 530], [280, 500], [280, 530], [255,600]],
			[[1626, 1406], [1525, 937], [1706, 1214], [974, 1405], [701,1302]],
			[[1660, 668], [1668, 716], [1872, 646], [1826, 392], [1715,391]],
			[[1038, 82], [977, 252], [1000, 642], [1185, 630], [683,487]]
			];
		
		//let positions2 = [[700,700], [700,800], [800,700], [800,800], [750,900]];
		let counter = 0;
		this.monsters.forEach(function(m) {
			m.prepareObject(positions1[getRandomArbitraryInt(0,4)][getRandomArbitraryInt(0,4)], counter, i);
			//m.prepareObject(positions2[counter], counter, i);
			m.initObject();
			zSorter.register(m.monsterSprite);
			zSorter.register(m.sightField);
			m.initLoop(player);
			counter += 1;
		});
	}

}
