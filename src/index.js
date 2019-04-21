import Fog from './Fog';
import StaticMap from './StaticMap';
import Player from './Player';
import Bush from './Bush';
import Viewport from './lib/viewport';
import Monster from './Monster';

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}

var PIXI = require('pixi.js');
PIXI.settings.RESOLUTION = 2;
PIXI.settings.SORTABLE_CHILDREN = true;



var MATTER = require('matter-js');
var physicsEngine = MATTER.Engine.create();



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

//Viewport creation for easily controllable 2D camera
var viewport = new Viewport(app.renderer, 700, 800, app.stage);
viewport.moveTo(700, 800);
viewport.zoom(700);

// 1. LOAD ALL RESOURCES
StaticMap.loadResources();
Player.loadResources();
Bush.loadResources();

// 2. CONSTRUCT MAIN OBJECTS
var staticMap = new StaticMap(app);
var player = new Player(app, viewport);
var bush = new Bush(app);

Monster.prepareResources();
var m0 = new Monster(app);
var m1 = new Monster(app);
var m2 = new Monster(app);
var m3 = new Monster(app);
var monsters = [m0,m1,m2,m3];


PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	// 3. SETUP OBJECTS
	// setup background map
	staticMap.prepareObject();
	let mapWidth = staticMap.backgroundSprite.width;
	let mapHeight = staticMap.backgroundSprite.height;

	// setup player character and UI
	player.prepareObject(mapWidth/2,mapHeight/2,MATTER,physicsEngine);

	// setup other map elements
	bush.prepareObject();
	
	// setup monsters in the corners
	m0.prepareObject(100, 100,MATTER,physicsEngine);
	m1.prepareObject(100, mapHeight - 100 - m0.monsterSprite.height,MATTER,physicsEngine);
	m2.prepareObject(mapWidth - 100 - m0.monsterSprite.width, 100,MATTER,physicsEngine);
	m3.prepareObject(mapWidth - 100 - m0.monsterSprite.width, mapHeight - 100 - m0.monsterSprite.height,MATTER,physicsEngine);

	// 2. INITIALIZE OBJECTS
	// note: you can reorder everything very easily on the screen
	// by reordering the object initializations :)

	staticMap.initObject();
	staticMap.initPhysicsColliders(MATTER,physicsEngine);

	player.initObject();
	
	monsters.forEach(function(m) {
		m.initObject();
	});
	bush.initObject();

	player.ui.initHealthbar();
	player.ui.initCards();
	player.ui.initPauseScreen();
	
	// 3. PUT LOOPS RUNNING
	player.initLoop();
	monsters.forEach(function(m) {		
		m.initLoop();
	});
	MATTER.Engine.run(physicsEngine);


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