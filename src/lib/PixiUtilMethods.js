import * as PIXI from 'pixi.js'
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
		    fill: ['#ffffff'],
		    stroke: '#000000',
		    strokeThickness: 1,
		});
	}
	else if (choice === "gamePausedText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Courier New',
		    fontSize: 28,
		    align : 'center',
		    fill: ['#d8c3d0'],
		});
	}
	else if (choice === "gameHelpText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Courier New',
		    fontSize: 14,
		    align : 'left',
		    fill: ['#d8c3d0'],
		});
	}
	else if (choice === "totalScoreText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Courier New',
		    fontSize: 20,
		    align : 'right',
		    fill: ['#ffffff'],
		    stroke: '#000000',
		    strokeThickness: 2,
		});
	}
	else if (choice === "scoreChangeText") {
		textStyle = new PIXI.TextStyle({
		    fontFamily: 'Courier New',
		    fontSize: 11,
		    align : 'right',
		    fill: ['#ffffff'],
		    stroke: '#000000',
		    strokeThickness: 1,
		});
	}
	return textStyle;
}

function setTextureOnlyIfNeeded(sprite, newTexture) {
	if (sprite.texture !== newTexture) {
		sprite.texture = newTexture;
	}
}

function getRoundedRectangle(x_pos, y_pos, width, height, roundFactor, colorcode) {
	let roundedRectangle = new PIXI.Graphics();
	roundedRectangle.beginFill(colorcode);
    roundedRectangle.drawRoundedRect(x_pos, y_pos, width, height, roundFactor);
    roundedRectangle.endFill();
	return roundedRectangle;
}

function setGraphicsFillColor(graphicsObject, colorcode) {
	graphicsObject.beginFill(colorcode);
    graphicsObject.endFill();
    return graphicsObject;
}

function containSpriteInsideContainer(sprite, container) {
	let collision = "none";
	let unitvx = sprite.vx/Math.abs(sprite.vx);
	let unitvy = sprite.vy/Math.abs(sprite.vy);

	if (isNaN(unitvx)) {
		unitvx = 0;
	}

	if (isNaN(unitvy)) {
		unitvy = 0;
	}

	// top hit
	if (sprite.y + unitvy <= container.y && unitvy < 0) {
		//console.log("Top hit: " + sprite.y);
		sprite.y = container.y;
		collision = "top";
	}

	// bottom hit
	if (sprite.y + sprite.height - unitvy >= container.height && unitvy > 0) {
		//console.log("Bottom hit: " + sprite.y);
		sprite.y = container.height - sprite.height + unitvy;
		collision = "bottom";
	}

	// left hit
	if (sprite.x + unitvx <= container.x && unitvx < 0) {
		//console.log("Left hit: " + sprite.x);
		sprite.x = container.x;
		collision = "left";
	}

	// right hit
	if (sprite.x + sprite.width - unitvx >= container.width && unitvx > 0) {
		//console.log("Right hit: " + sprite.x);
		sprite.x = container.width - sprite.width + unitvx;
		collision = "right";
	}

	return collision;
}

function detainSpriteOutsideDetainer(sprite, detainer) {
	let collision = "none";

	let unitvx = sprite.vx/Math.abs(sprite.vx);
	let unitvy = sprite.vy/Math.abs(sprite.vy);

	if (isNaN(unitvx)) {
		unitvx = 0;
	}

	if (isNaN(unitvy)) {
		unitvy = 0;
	}

	let detainerMinY = detainer.y;
	let detainerMaxY = detainer.y + detainer.height;
	let detainerMinX = detainer.x;
	let detainerMaxX = detainer.x + detainer.width;

	if (sprite.y + sprite.vy >= detainerMaxY) {
		//
	}
	else if (sprite.x + sprite.vx >= detainerMaxX) {
		//
	}
	else if (sprite.y + sprite.vy + sprite.height <= detainerMinY) {
		//
	}
	else if (sprite.x + sprite.vx + sprite.width <= detainerMinX) {
		//
	}
	// collision in all other cases
	else {
		let condtop = sprite.y + sprite.height <= detainerMinY &&
			sprite.y + sprite.height + sprite.vy > detainerMinY && unitvy > 0;

		let condleft = sprite.x + sprite.vx < detainerMinX  && unitvx > 0;

		let condright = sprite.x + sprite.vx < detainerMaxX && unitvx < 0;

		let condbottom = sprite.y >= detainerMaxY &&
			sprite.y + sprite.vy < detainerMaxY && unitvy < 0;

		//console.log(sprite.vx + "," + sprite.vy);
		//console.log(sprite.y + "," + (sprite.y + sprite.vy) + "," + detainerMaxY);
		//console.log("" + [condtop, condleft, condright, condbottom]);
		if (condtop) {
			sprite.y = detainerMinY - sprite.height;
			collision = "top";
		}

		if (condleft) {
			sprite.x = detainerMinX - sprite.width;
			collision = "left";
		}

		if (condright) {
			sprite.x = detainerMaxX;
			collision = "right";
		}

		if (condbottom) {
			sprite.y = detainerMaxY;
			collision = "bottom";
		}
	}
	return collision;
}

// used for no-block collisions
function checkDynamicIntoDynamicCollision(sprite1,sprite2) {
	//Define the variables we'll need to calculate
	let hit, combinedHalfWidths, combinedHalfHeights, xDistance, yDistance;

	//hit will determine whether there's a collision
	hit = false;

	//Find the center points of each sprite
	sprite1.centerX = sprite1.x + sprite1.width / 2;
	sprite1.centerY = sprite1.y + sprite1.height / 2;
	sprite2.centerX = sprite2.x + sprite2.width / 2;
	sprite2.centerY = sprite2.y + sprite2.height / 2;

	//Find the half-widths and half-heights of each sprite
	sprite1.halfWidth = sprite1.width / 2;
	sprite1.halfHeight = sprite1.height / 2;
	sprite2.halfWidth = sprite2.width / 2;
	sprite2.halfHeight = sprite2.height / 2;

	//Calculate the distance vector between the sprites
	xDistance = Math.abs(sprite1.centerX - sprite2.centerX);
	yDistance = Math.abs(sprite1.centerY - sprite2.centerY);

	//Figure out the combined half-widths and half-heights
	combinedHalfWidths = sprite1.halfWidth + sprite2.halfWidth;
	combinedHalfHeights = sprite1.halfHeight + sprite2.halfHeight;

	//Check for a collision on the x axis
	if (xDistance < combinedHalfWidths) {
		//A collision might be occurring. Check for a collision on the y axis
		if (yDistance < combinedHalfHeights) {
		  //There's definitely a collision happening
		  hit = true;
		}
		else {
		  //There's no collision on the y axis
		  hit = false;
		}
	}
	else {
		//There's no collision on the x axis
		hit = false;
	}
	//'hit' will be either 'true' or 'false'
	return hit;
}

function applyFilter(elementArray, filter) {
	// needs WEBGL
	let colorMatrix = new PIXI.filters.ColorMatrixFilter();

	if (filter==="reset") {
		elementArray.forEach(function(element) {
			element.filters = undefined;
		});
	}
	else {
		elementArray.forEach(function(element) {
			element.filters = [colorMatrix];
		});

		if (filter==="darken") {
			colorMatrix.brightness(0.3, false);
		}
		else if (filter==="night") {
			colorMatrix.night(0.2, true);
		}
		else if (filter==="predator") {
			colorMatrix.predator(1, true);
		}
	}
	
}

export {textStyle, setTextureOnlyIfNeeded, getRoundedRectangle, containSpriteInsideContainer, detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision, applyFilter};