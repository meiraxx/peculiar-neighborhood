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

function getRoundedRectangle(x_pos, y_pos, width, height, roundFactor, colorcode) {
	let roundedRectangle = new PIXI.Graphics();
    roundedRectangle.beginFill(colorcode);
    roundedRectangle.drawRoundedRect(x_pos, y_pos, width, height, roundFactor);
    roundedRectangle.endFill();
	return roundedRectangle;
}

export {textStyle, setTextureOnlyIfNeeded, getRoundedRectangle};