import * as PIXI from 'pixi.js'
function textStyle(fontFamily, fontSize, align, fill, stroke, strokeThickness) {
	// test here: https://pixijs.io/pixi-text-style/
	/*
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
	*/
	return new PIXI.TextStyle({
	    fontFamily: fontFamily,
	    fontSize: fontSize,
	    fill: fill,
	    stroke: stroke,
	    strokeThickness: strokeThickness,
	});
}

function setTextureOnlyIfNeeded(sprite, newTexture) {
	if (sprite.texture !== newTexture) {
		sprite.texture = newTexture;
	}
}

function setTexturesOnlyIfNeeded(animatedSprite, newTextures) {
	if (animatedSprite.textures !== newTextures) {
		animatedSprite.textures = newTextures;
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

function containSpriteInsideContainer(sprite, container, action = "stop") {
	let collision = "none";
	let unitvx = sprite.vx/Math.abs(sprite.vx);
	let unitvy = sprite.vy/Math.abs(sprite.vy);

	if (isNaN(unitvx)) {
		unitvx = 0;
	}

	if (isNaN(unitvy)) {
		unitvy = 0;
	}

	let condtop = sprite.y + unitvy <= container.y && unitvy < 0;

	let condleft = sprite.x + unitvx <= container.x && unitvx < 0;

	let condright = sprite.x + sprite.width - unitvx >= container.width && unitvx > 0;

	let condbottom = sprite.y + sprite.height - unitvy >= container.height && unitvy > 0;

	if (condtop || condleft || condright || condbottom) {
		if (action === "stop") {
			sprite.vx = 0;
			sprite.vy = 0;
		} else if (action === "revert") {
			sprite.vx *= -1;
			sprite.vy *= -1;
		} else if (action === "noaction") {
			// no action
		}
	}

	// top hit
	if (condtop) {
		//sprite.y = container.y;
		collision = "top";
	}

	// left hit
	if (condleft) {
		//sprite.x = container.x;
		collision = "left";
	}

	// right hit
	if (condright) {
		//sprite.x = container.width - sprite.width + unitvx;
		collision = "right";
	}

	// bottom hit
	if (condbottom) {
		//sprite.y = container.height - sprite.height + unitvy;
		collision = "bottom";
	}

	return collision;
}

function detainSpriteOutsideDetainer(sprite, detainer, action = "stop") {
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

	let condNonCollision1 = sprite.y + sprite.vy >= detainerMaxY;
	let condNonCollision2 = sprite.x + sprite.vx >= detainerMaxX;
	let condNonCollision3 = sprite.y + sprite.vy + sprite.height <= detainerMinY;
	let condNonCollision4 = sprite.x + sprite.vx + sprite.width <= detainerMinX;

	if (condNonCollision1 || condNonCollision2 || condNonCollision3 || condNonCollision4) {
		// no collision
	}
	// collision in all other cases
	else {
		let condtop = sprite.y + sprite.height <= detainerMinY &&
			sprite.y + sprite.height + sprite.vy > detainerMinY && unitvy > 0;

		let condleft = sprite.x + sprite.vx < detainerMinX  && unitvx > 0;

		let condright = sprite.x + sprite.vx < detainerMaxX && unitvx < 0;

		let condbottom = sprite.y >= detainerMaxY &&
			sprite.y + sprite.vy < detainerMaxY && unitvy < 0;

		if (condtop || condleft || condright || condbottom) {
			if (action === "stop") {
				sprite.vx = 0;
				sprite.vy = 0;
			} else if (action === "revert") {
				sprite.vx *= -1;
				sprite.vy *= -1;
			} else if (action === "noaction") {
				// no action
			}
		}

		if (condtop) {
			//sprite.y = detainerMinY - sprite.height;
			collision = "top";
		}

		if (condleft) {
			//sprite.x = detainerMinX - sprite.width;
			collision = "left";
		}

		if (condright) {
			//sprite.x = detainerMaxX;
			collision = "right";
		}

		if (condbottom) {
			//sprite.y = detainerMaxY;
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

function modifyObjectAlpha(pixiObject, alphaFactor, operation) {
	let alphaDelta = 1/alphaFactor;

	if (operation==="subtract") {
		let newAlpha = pixiObject.alpha - alphaDelta;
		if (newAlpha <= 0) {
			pixiObject.alpha = 0;
		}
		else {
			pixiObject.alpha = newAlpha;
		}
	}
	else if (operation==="add") {
		let newAlpha = pixiObject.alpha + alphaDelta;
		if (newAlpha >= 1) {
			pixiObject.alpha = 1;
		}
		else {
			pixiObject.alpha = newAlpha;
		}
	}
}

export {textStyle, setTextureOnlyIfNeeded, setTexturesOnlyIfNeeded, getRoundedRectangle, containSpriteInsideContainer, 
	detainSpriteOutsideDetainer, checkDynamicIntoDynamicCollision, applyFilter, modifyObjectAlpha};