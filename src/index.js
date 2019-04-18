import Fog from './fog';
import StaticMap from './staticMap';
import Player from './player';
import Bush from './bush';
import Healthbar from './healthbar';

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

var staticMap = new StaticMap(app);
var player = new Player(app);
var healthbar = new Healthbar(app);
var bush = new Bush(app);
var fog = new Fog(app);

PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	staticMap.setupOnResourcesLoaded();
	let mapWidth = staticMap.backgroundSprite.width;
	let mapHeight = staticMap.backgroundSprite.height;

	player.setupOnResourcesLoaded(mapWidth/2,mapHeight/2);
	bush.setupOnResourcesLoaded();

	// TODO: make healthbar and other ui elements static
	healthbar.setupOnResourcesLoaded(mapWidth/2, mapHeight - 32, 128, 16);
	//TODO: integrate other UI elements such as cards and weapons which are already in dropbox folder
	//fog.setupOnResourcesLoaded();
});

let music = document.createElement("audio");
music.src = "assets/soundtrack.mp3";
music.setAttribute("preload", "auto");
music.setAttribute("controls", "none");
music.setAttribute("loop", "loop");
music.style.display = "none";
music.volume = 0.4;
document.body.appendChild(music);
music.play();