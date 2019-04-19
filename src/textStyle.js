export default function textStyle(choice) {
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
		    fontFamily: 'Arial',
		    fontSize: 14,
		    fill: ['#ffffff'],
		    stroke: '#000000',
		    strokeThickness: 1,
		});
	}
	return textStyle;
}