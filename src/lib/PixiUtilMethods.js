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

function containSpriteInsideContainer(sprite, container) {
	let collision = "none";
	let unitvx = sprite.vx/Math.abs(sprite.vx);
	let unitvy = sprite.vy/Math.abs(sprite.vy);

	// top hit
	if (sprite.y + unitvy <= container.y) {
		console.log("Top hit: " + sprite.y);
		sprite.y = container.y;
		collision = "top";
	}

	// bottom hit
	if (sprite.y + sprite.height - unitvy >= container.height && unitvy > 0) {
		console.log("Bottom hit: " + sprite.y);
		sprite.y = container.height - sprite.height + unitvy;
		collision = "bottom";
	}

	// left hit
	if (sprite.x + unitvx <= container.x) {
		console.log("Left hit: " + sprite.x);
		sprite.x = container.x;
		collision = "left";
	}

	// right hit
	if (sprite.x + sprite.width - unitvx >= container.width && unitvx > 0) {
		console.log("Right hit: " + sprite.x);
		sprite.x = container.width - sprite.width + unitvx;
		collision = "right";
	}

	return collision;
}

export {textStyle, setTextureOnlyIfNeeded, getRoundedRectangle, containSpriteInsideContainer};