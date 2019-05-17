import * as PIXI from 'pixi.js';
import Monster from "./Monster";
import Wave from "./Wave";

import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class WaveOrganizer {
	constructor(app, zSorter, player) {
		this.app = app;
		this.zSorter = zSorter;
		this.player = player;
		
		// n_normal, hp_normal, speed_normal, n_angry, hp_angry, speed_angry
		this.waves = [
			new Wave(this.app, 3, 10, 2, 2, 15, 2),
			new Wave(this.app, 3, 15, 2, 2, 20, 2),
			new Wave(this.app, 3, 20, 2, 2, 25, 2)
		]
	}

	startWave(i) {
		this.waves[i].startWave(this.zSorter, this.player, i);
	}
}
