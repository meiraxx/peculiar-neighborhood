import * as PIXI from 'pixi.js';
import TimedEvent from "./TimedEvent";
import WaveOrganizer from "./WaveOrganizer";
import { getRandomArbitraryInt, populatedArray, functionScopePreserver } from "./lib/UtilMethods";

export default class TimedEventManager {
	constructor(app, zSorter, player) {
		this.app = app;
		this.zSorter = zSorter;
		this.player = player;
		this.waveOrganizer = new WaveOrganizer(app, zSorter, player);
		this.timedEvents = []
	}

	createNewEvent(func, type, time) {
		let timedEvent = new TimedEvent(this.app, func, type, time);
		this.timedEvents.push(timedEvent);
	}

	createDefaultEvents() {
		this.createNewEvent(functionScopePreserver(this.waveOrganizer, "startWave", [0]), "oneTime", 2);
		this.createNewEvent(functionScopePreserver(this.waveOrganizer, "startWave", [1]), "oneTime", 22);
		this.createNewEvent(functionScopePreserver(this.waveOrganizer, "startWave", [2]), "oneTime", 42);
	}

	runDefaultEvents(delta) {
		// run all events (oneTime and persistent)
		for (var i = 0; i < this.timedEvents.length; i++) {
		    if (this.timedEvents[i].oneTimeRan === false) {
		    	this.timedEvents[i].runEvent(delta);
		    }
		}

		// clean all oneTime events
		for (var i = 0; i < this.timedEvents.length; i++) {
		    if (this.timedEvents[i].oneTimeRan === true) {
		    	this.timedEvents = this.timedEvents.filter(item => item !== this.timedEvents[i]);
		    }
		}
	}

	initDefaultEventsLoop() {
		this.createDefaultEvents();
		this.app.ticker.add(delta => this.runDefaultEvents(delta));
	}
}
