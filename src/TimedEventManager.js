import * as PIXI from 'pixi.js';
import TimedEvent from "./TimedEvent";
import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class TimedEventManager {
	constructor(app, zSorter, player) {
		this.app = app;
		this.zSorter = zSorter;
		this.player = player;
		this.timedEventsList = [];
	}

	// use "functionScopePreserver" to preserve function context
	createNewEvent(func, type, time) {
		let timedEvent = new TimedEvent(this.app, func, type, time);
		this.timedEventsList.push(timedEvent);
	}

	runEvents(player, delta) {
		// run all events (oneTime and persistent)
		for (var i = 0; i < this.timedEventsList.length; i++) {
		    if (this.timedEventsList[i].oneTimeRan === false) {
		    	this.timedEventsList[i].runEvent(player, delta);
		    }
		}

		// clean all oneTime events
		for (var i = 0; i < this.timedEventsList.length; i++) {
		    if (this.timedEventsList[i].oneTimeRan === true) {
		    	this.timedEventsList = this.timedEventsList.filter(item => item !== this.timedEventsList[i]);
		    }
		}
	}
}
