function keyboard(value) {
	// list of keys: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
	let key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	// downHandler
	key.downHandler = event => {
		if (event.key === key.value) {
			if (key.isUp && key.press){
				key.press();
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
			// do not prevent default so that it scrolls into the hidden parts of the map (event.preventDefault();)
		}
	};

	// upHandler
	key.upHandler = event => {
		if (event.key === key.value) {
			if (key.isDown && key.release){
				key.release();
				key.isDown = false;
				key.isUp = true;
			}
			event.preventDefault();
			// do not prevent default so that it scrolls into the hidden parts of the map (event.preventDefault();)
		}
	};

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);
	
	window.addEventListener(
		"keydown", downListener, false
	);
	window.addEventListener(
		"keyup", upListener, false
	);
	
	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener("keydown", downListener);
		window.removeEventListener("keyup", upListener);
	};
	return key;
}

function getRandomArbitraryFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomArbitraryInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {keyboard, getRandomArbitraryFloat, getRandomArbitraryInt};