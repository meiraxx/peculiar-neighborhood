import * as PIXI from 'pixi.js';
import TimedEvent from "./TimedEvent";

import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class TimedEventManager {
	constructor(app, zSorter, player) {
		this.app = app;
		this.zSorter = zSorter;
		this.player = player;
		this.timedEvents = []
	}

	createNewEvent(func, type) {
		let timedEvent = new TimedEvent(this.app, func, type);
		this.timedEvents.push(timedEvent);
	}

	createDefaultEvents() {
		this.createNewEvent(function() { console.log("LOL!"); }, "persistent");
	}

	initDefaultEvents(delta) {
		for (var i = 0; i < this.timedEvents.length; i++) {
		    //console.log(this.timedEvents[i]);
		    this.timedEvents[i].startEvent(delta, 5);
		}
	}

	initDefaultEventsLoop() {
		this.createDefaultEvents();
		this.app.ticker.add(delta => this.initDefaultEvents(delta));
	}
}
