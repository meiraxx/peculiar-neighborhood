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
		this.defaultTimedEvents = [];
		this.customTimedEvents = [];
	}

	createNewEvent(array, func, type, time) {
		let timedEvent = new TimedEvent(this.app, func, type, time);
		array.push(timedEvent);
	}

	createCustomEvent(func, type, time) {
		// use "functionScopePreserver" to preserve function context
		this.createNewEvent(this.customTimedEvents, func, type, time);
	}

	createEvents(array) {
		// wave 0
		this.createNewEvent(array, functionScopePreserver(this.waveOrganizer, "startWave", [0]), 
			"oneTime", 2);
		// wave 1
		this.createNewEvent(array, functionScopePreserver(this.waveOrganizer, "startWave", [1]), 
			"oneTime", 32);
		// wave 2
		this.createNewEvent(array, functionScopePreserver(this.waveOrganizer, "startWave", [2]), 
			"oneTime", 62);
	}

	runEvents(array, player, delta) {
		// run all events (oneTime and persistent)
		for (var i = 0; i < array.length; i++) {
		    if (array[i].oneTimeRan === false) {
		    	array[i].runEvent(player, delta);
		    }
		}

		// clean all oneTime events
		for (var i = 0; i < array.length; i++) {
		    if (array[i].oneTimeRan === true) {
		    	array = array.filter(item => item !== array[i]);
		    }
		}
	}

	initDefaultEventsLoop() {
		this.createEvents(this.defaultTimedEvents);
		this.app.ticker.add(delta => this.runEvents(this.defaultTimedEvents, this.player, delta));
	}
}
