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

function textStyle(choice) {
	// test here: https://pixijs.io/pixi-text-style/
	let textStyle = undefined;
	// healthbar
	if (choice === "richText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Arial',
		    fontSize: 14,
		    fontStyle: 'italic',
		    fontWeight: 'bold',
		    fill: ['#ffffff', '#00ff99'], // gradient
		    stroke: '#4a1850',
		    strokeThickness: 5,
		    dropShadow: true,
		    dropShadowColor: '#000000',
		    dropShadowBlur: 4,
		    dropShadowAngle: Math.PI / 6,
		    dropShadowDistance: 6,
		    wordWrap: true,
		    wordWrapWidth: 440,
		});
	}
	else if (choice === "healthText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Courier New',
		    fontSize: 14,
		    //fontWeight: 'bold',
		    //fontStyle: 'italic',
		    fill: ['#ffffff'],
		    stroke: '#000000',
		    strokeThickness: 1,
		});
	}
	return textStyle;
}

function setTextureOnlyIfNeeded(sprite, newTexture) {
	if (sprite.texture !== newTexture) {
		sprite.setTexture(newTexture);
	}
}

export {keyboard, textStyle, setTextureOnlyIfNeeded};