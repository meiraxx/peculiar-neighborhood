/*
// CODE FOR INTERACTIVE MOUSE ACTIONS IF WE WANT TO HAVE THEM.
// davidfig github for more helper pixi libs: https://github.com/davidfig
// create viewport
var viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: appWidth,
    worldHeight: appHeight,
 
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
});

// activate plugins
viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

// add the viewport to the stage
app.stage.addChild(viewport);
document.body.appendChild(app.view);
*/



/*
// RENDER IT OURSELVES (more low-level control perhaps)
var viewWidth = (renderer.width / renderer.resolution);﻿
var back = new PIXI.Container();
back.scale.x = 1024 / viewWidth;
back.scale.y = back.scale.x;
app.stage.addChild(back);
*/

/*
var renderer = PIXI.autoDetectRenderer(1024, 1024);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
// create a background...
var background = PIXI.Sprite.fromImage('assets/background.png');
background.width = renderer.width;
background.height = renderer.height;

// add background to stage...
stage.addChild(background);
animate();

function animate() {
	// render the stage
	renderer.render(stage);

	requestAnimationFrame(animate);
}
*/