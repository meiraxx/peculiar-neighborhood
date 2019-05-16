import * as PIXI from 'pixi.js';

import { getRandomArbitraryInt, populatedArray } from "./lib/UtilMethods";

export default class TimedEvent {
	constructor(app, func, type, time) {
		this.app = app;
		this.frameCounter = 0;
		this.func = func;
		this.type = type;
		this.time = time;
		this.oneTimeRan = false;
	}

	//this.timedEvent = persistentEvent(delta, 2, function() { changeViewMode(myvar); })
    // timedEvent.oneTimeEvent(delta, time)
    // timedEvent.startPersistentEvent(delta, repetitionTime, func)
	runOneTimeEvent(delta) {
		let eventTime = this.time;
		this.frameCounter += 1;
		if (this.frameCounter === this.app.ticker.integerFPS * eventTime) {
			this.func();
			this.oneTimeRan = true;
		}
	}

	runPersistentEvent(delta) {
		let repetitionTime = this.time;
		this.frameCounter += 1;
		if (this.frameCounter === this.app.ticker.integerFPS * repetitionTime) {
			//console.log("Persistent function called");
			this.func();
			this.frameCounter = 0;
		}
		
	}

	runEvent(delta) {
		if (this.type === "persistent") {
			this.runPersistentEvent(delta);
		} else if (this.type === "oneTime") {
			this.runOneTimeEvent(delta);
		}
	}

}
