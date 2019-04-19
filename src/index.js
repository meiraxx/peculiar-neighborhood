import Fog from './fog';
import StaticMap from './staticMap';
import Player from './player';
import Bush from './bush';

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}

var PIXI = require('pixi.js');

let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "Canvas";
}

// initial console logging: "PixiJS 4.8.6 - WebGL/Canvas - http://www.pixijs.com/"
PIXI.utils.sayHello(type);

const appWidth = 2048;
const appHeight = 1536;

// pixi app object
let app = new PIXI.Application({
		width: appWidth,         // default: 800
		height: appHeight,        // default: 600
		antialias: false,    // default: false
		transparent: false, // default: false
		resolution: 1,       // default: 1
		forceCanvas: true 	// default: false
	}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// construct main objects
var staticMap = new StaticMap(app);
var player = new Player(app);
var bush = new Bush(app);
//var fog = new Fog(app);


PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	// 1. SETUP OBJECTS
	// setup background map
	staticMap.prepareObject();
	let mapWidth = staticMap.backgroundSprite.width;
	let mapHeight = staticMap.backgroundSprite.height;

	// setup player character and UI
	player.prepareObject(mapWidth/2,mapHeight/2);

	// setup other map elements
	bush.prepareObject();

	//fog.setupOnResourcesLoaded();

	// 2. INITIALIZE OBJECTS
	// note: you can reorder everything very easily on the screen
	// by reordering the object initializations :)
	staticMap.initObject();
	player.initObject();
	bush.initObject();

	// ui stuff should always be above other elements
	player.ui.initHealthbar();

	// 3. PUT LOOPS RUNNING
	player.initLoop();
	//TODO: monster loop
});

/*
staticMap.initObject();
player.initObject();
ui.initObject();
bush.initObject();
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