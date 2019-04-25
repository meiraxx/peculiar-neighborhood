import Fog from "./Fog";
import StaticMap from "./StaticMap";
import Player from "./Player";
import Bush from "./Bush";
import Viewport from "./lib/viewport";
import Monster from "./Monster";
import Tree from "./Tree";
import House from "./House";

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}

var PIXI = require("pixi.js");
PIXI.settings.RESOLUTION = 2;
PIXI.settings.SORTABLE_CHILDREN = true;

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
		forceCanvas: false 	// default: false
	}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//Viewport creation for easily controllable 2D camera
var viewport = new Viewport(app.renderer, 700, 800, app.stage);
viewport.moveTo(700, 800);
viewport.zoom(700);

// 1. LOAD ALL RESOURCES
StaticMap.loadResources();
Player.loadResources();
Bush.loadResources();
Tree.loadResources();
Monster.loadResources();
House.loadResources();

// 2. CONSTRUCT MAIN OBJECTS
var staticMap = new StaticMap(app);
var player = new Player(app, viewport);

var m0 = new Monster(app, true);
var m1 = new Monster(app, true);
var m2 = new Monster(app, false);
var m3 = new Monster(app, false);
var monsters = [m0, m1, m2, m3];

var bush0 = new Bush(app);
//var tree0 = new Tree(app);

var house0 = new House(app);
//var house1 = new House(app);
var houses = [house0/*, house1*/];

PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	// 3. SETUP AND INITIALIZE OBJECTS
	// setup background map
	staticMap.prepareObject();
	staticMap.initObject();
	let mapWidth = staticMap.backgroundSprite.width;
	let mapHeight = staticMap.backgroundSprite.height;
	let colliderThickness = 100;

	// setup player character and UI
	player.prepareObject(mapWidth/2,mapHeight/2);
	player.initObject();
	let playerWidth = player.playerSprite.height;
	let playerHeight = player.playerSprite.height;

	// setup monsters in the corners
	m0.prepareObject(100, 100, 0);
	m1.prepareObject(100, 200, 1);
	m2.prepareObject(200, 100, 2);
	m3.prepareObject(200, 200, 3);
	monsters.forEach(function(m) {
		m.initObject();
	});

	// setup other map elements
	bush0.prepareObject(10, 400, 0);
	bush0.initObject();
	//tree0.prepareObject(mapWidth - 100, mapHeight - 300, 0);
	//tree0.initObject();

	house0.prepareObject(mapWidth - 200, mapHeight - 200, 0);
	//house1.prepareObject(100, mapHeight - 300, 0);

	houses.forEach(function(h) {
		h.initObject();
	});

	// initialize UI in the end
	player.initUI();

	// 4. PUT LOOPS RUNNING
	player.initLoop();

	monsters.forEach(function(m) {
		m.initLoop(player);
	});
	
});

/*
let music = document.createElement("audio");
music.src = "assets/soundtrack.mp3";
music.setAttribute("preload", "auto");
music.setAttribute("controls", "none");
music.setAttribute("loop", "loop");
music.style.display = "none";
music.volume = 0.4;
document.body.appendChild(music);
music.play();
*/