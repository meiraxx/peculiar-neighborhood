import * as PIXI from 'pixi.js';
import Monster from "./Monster";
import Wave from "./Wave";

import { getRandomArbitraryInt, populatedArray, functionScopePreserver } from "./lib/UtilMethods";
import { modifyObjectAlpha } from "./lib/PixiUtilMethods";

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
		this.app.statistics.waveIncremented();
	}

	fadeInWaveText(waveIndex, fadeInfactor, speedFactor) {
		let currentTime = speedFactor;
		for (var i = 0; i < fadeInfactor; i++) {
			this.app.timedEventManager.createNewEvent(functionScopePreserver(this, 
				"increaseWaveTextAlpha", [waveIndex, fadeInfactor]), "oneTime", currentTime);
			currentTime += speedFactor;
		}
	}

	fadeOutWaveText(waveIndex, fadeOutfactor, speedFactor) {
		let currentTime = speedFactor;
		for (var i = 0; i < fadeOutfactor; i++) {
			this.app.timedEventManager.createNewEvent(functionScopePreserver(this, 
				"decreaseWaveTextAlpha", [waveIndex, fadeOutfactor]), "oneTime", currentTime);
			currentTime += speedFactor;
		}
	}

	decreaseWaveTextAlpha(waveIndex, factor) {
		this.player.waveText.text = "Wave " + (waveIndex + 1);
		if (waveIndex===0)
			modifyObjectAlpha(this.player.equipText, factor, "subtract");
		modifyObjectAlpha(this.player.waveText, factor, "subtract");
	}

	increaseWaveTextAlpha(waveIndex, factor) {
		this.player.waveText.text = "Wave " + (waveIndex + 1);
		if (waveIndex===0)
			modifyObjectAlpha(this.player.equipText, factor, "add");
		modifyObjectAlpha(this.player.waveText, factor, "add");
	}

	createWaveEvents() {
		let waveIndex;
		let fadeInfactor = 3;
		let fadeOutfactor = 3;
		let speedFactor = 1;

		// wave 0
		waveIndex = 0;
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeInWaveText", 
			[waveIndex, fadeInfactor, speedFactor]), "oneTime", 1);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeOutWaveText", 
			[waveIndex, fadeOutfactor, speedFactor]), "oneTime", 5);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "startWave", [waveIndex]), 
			"oneTime", 2);

		// wave 1
		waveIndex = 1;
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeInWaveText", 
			[waveIndex, fadeInfactor, speedFactor]), "oneTime", 121);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeOutWaveText", 
			[waveIndex, fadeOutfactor, speedFactor]), "oneTime", 125);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "startWave", [waveIndex]), 
			"oneTime", 129);

		// wave 2
		waveIndex = 2;
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeInWaveText", 
			[waveIndex, fadeInfactor, speedFactor]), "oneTime", 241);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "fadeOutWaveText", 
			[waveIndex, fadeOutfactor, speedFactor]), "oneTime", 245);
		this.app.timedEventManager.createNewEvent(functionScopePreserver(this, "startWave", [waveIndex]), 
			"oneTime", 249);
	}

}
