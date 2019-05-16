import Fog from "./Fog";
import StaticMap from "./StaticMap";
import Player from "./Player";
import Bush from "./Bush";
import Viewport from "./lib/viewport";
import Monster from "./Monster";
import Tree from "./Tree";
import House from "./House";
import ZSorter from "./ZSorter";
import TimedEventManager from "./TimedEventManager";
import * as PIXI from "pixi.js";
//import "pixi-sound";

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}

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
		forceCanvas: false, // default: false
		autoStart: false,
		//sharedTicker: true,
	}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//Viewport creation for easily controllable 2D camera
var viewport = new Viewport(app.renderer, 700, 800, app.stage);

// 1. LOAD ALL RESOURCES
StaticMap.loadResources(app);
Player.loadResources(app);
Bush.loadResources(app);
Tree.loadResources(app);
Monster.loadResources(app);
House.loadResources(app);
Fog.loadResources(app);
// 2. CONSTRUCT MAIN OBJECTS
var staticMap = new StaticMap(app);
var player = new Player(app, viewport);

var m0 = new Monster(app, true);
var m1 = new Monster(app, true);
var m2 = new Monster(app, false);
var m3 = new Monster(app, false);
var monsters = [m0, m1, m2, m3];

var tree0 = new Tree(app);
var house0 = new House(app);
var house1 = new House(app);
var bush0 = new Bush(app);

var blockers = [tree0, house0, house1];
var hiders = [bush0]

var fog = new Fog(app);
var zSorter = new ZSorter(app);

var timedEventManager = new TimedEventManager(app, zSorter, player);

app.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( () => {
	// 3. SETUP AND INITIALIZE OBJECTS
	// setup background map
	staticMap.prepareObject();
	staticMap.initObject();
	zSorter.register(staticMap.backgroundSprite);
	let mapWidth = staticMap.backgroundSprite.width;
	let mapHeight = staticMap.backgroundSprite.height;
	let colliderThickness = 100;

	fog.prepareObject();

	// setup player character and UI
	player.prepareObject(mapWidth/2,mapHeight/2);
	let playerWidth = player.playerSprite.height;
	let playerHeight = player.playerSprite.height;
	player.initObject();
	zSorter.register(player.playerSprite);

	// setup blockers
	tree0.prepareObject(mapWidth - 100, 100, 0);
	house0.prepareObject(100, mapHeight - 300, 0);
	house1.prepareObject(mapWidth - 200, mapHeight - 200, 1);

	// setup hiders
	bush0.prepareObject(10, 400, 0);


	// init all and register z ordering
	blockers.forEach(function(b) {
		b.initObject();
		zSorter.register(b.sprite);
	});

	hiders.forEach(function(h) {
		h.initObject();
		zSorter.register(h.sprite);
	});

	//fog is topmost except ui
	fog.initObject();


	// initialize UI in the end because its Z ordering is always the greatest
	player.initUI();
	
	// 4. PUT LOOPS RUNNING
	player.initLoop();

	timedEventManager.initDefaultEventsLoop();

	fog.initLoop(player);

	zSorter.initLoop();

});

/*
PIXI.sound.Sound.from({
    url: 'assets/soundtrack.mp3',
    autoPlay: true,
    complete: function() {
        console.log('Sound finished');
    }
});*/

app.ticker = PIXI.Ticker.shared;
app.ticker.autoStart = false;
app.ticker.stop();
app.ticker.integerFPS = Math.round(app.ticker.FPS);

function animate(time) {
    app.ticker.update(time);
    app.renderer.render(app.stage);
    requestAnimationFrame(animate);
}
animate(performance.now());

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