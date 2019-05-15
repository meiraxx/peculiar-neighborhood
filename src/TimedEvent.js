import * as PIXI from 'pixi.js';

import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class TimedEvent {
	constructor(app, func, type) {
		this.app = app;
		this.frameCounter = 0;
		this.func = func;
		this.type = type;
	}

	//this.timedEvent = persistentEvent(delta, 2, function() { changeViewMode(myvar); })
    // timedEvent.oneTimeEvent(delta, time)
    // timedEvent.startPersistentEvent(delta, repetitionTime, func)
	startOneTimeEvent(delta, eventTime) {
		this.frameCounter += 1;
		if (this.frameCounter === this.app.ticker.integerFPS * eventTime) {
			this.func();
		}
	}

	startPersistentEvent(delta, repetitionTime) {
		this.frameCounter += 1;
		if (this.frameCounter === this.app.ticker.integerFPS * repetitionTime) {
			//console.log("Persistent function called");
			this.func();
			this.frameCounter = 0;
		}
		
	}

	startEvent(delta, time) {
		if (this.type === "persistent") {
			this.startPersistentEvent(delta, time);
		} else if (this.type === "oneTime") {
			this.startOneTimeEvent(delta, time);
		}
	}

}
