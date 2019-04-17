import $ from 'pixi.js';
import Fog from './fog';
import StaticMap from './staticMap';
import Player from './player';
import Bush from './bush';
import Healthbar from './healthbar';

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}

let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "Canvas";
}

// div objects:
// dynamic
const rootElement = document.getElementById('rootElement');

// pixi app object
let app = new PIXI.Application({
		width: 1024,         // default: 800
		height: 1024,        // default: 600
		antialias: false,    // default: false
		transparent: true, // default: false
		resolution: 1,       // default: 1
		forceCanvas: true 	// default: false
	}
);

// initial console logging: "PixiJS 4.8.6 - WebGL/Canvas - http://www.pixijs.com/"
PIXI.utils.sayHello(type);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

var staticMap = new StaticMap(rootElement,app);
var player = new Player(rootElement, app);
var healthbar = new Healthbar(rootElement, app);
var bush = new Bush(rootElement, app);
var fog = new Fog(rootElement,app);
//TODO: make smooth scroll work

PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	staticMap.setupOnResourcesLoaded();
	player.setupOnResourcesLoaded(512,512);
	bush.setupOnResourcesLoaded();

	// TODO: make healthbar and other ui elements static
	healthbar.setupOnResourcesLoaded(512, 4);
	//TODO: integrate other UI elements such as cards and weapons which are already in dropbox folder
	//fog.setupOnResourcesLoaded();
});

/*
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

let music = document.createElement("audio");
music.src = "assets/soundtrack.mp3";
music.setAttribute("preload", "auto");
music.setAttribute("controls", "none");
music.setAttribute("loop", "loop");
music.style.display = "none";
music.volume = 0.4;
document.body.appendChild(music);
music.play();