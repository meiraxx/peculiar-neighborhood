import Fog from "./Fog";
import StaticMap from "./StaticMap";
import Player from "./Player";
import Bush from "./Bush";
import Viewport from "./lib/viewport";
import Monster from "./Monster";
import Tree from "./Tree";
import House from "./House";
import ZSorter from "./ZSorter";
import WaveOrganizer from "./WaveOrganizer";
import TimedEventManager from "./TimedEventManager";
import GameStatistics from "./GameStatistics";
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
var tree1 = new Tree(app);
var tree2 = new Tree(app);
var tree3 = new Tree(app);
var tree4 = new Tree(app);
var tree5 = new Tree(app);
var tree6 = new Tree(app);
var tree7 = new Tree(app);
var tree8 = new Tree(app);
var tree9 = new Tree(app);
var tree10 = new Tree(app);
var tree11 = new Tree(app);
var tree12 = new Tree(app);
var tree13 = new Tree(app);

var whiteHouse = new House(app);
var yellowHouse = new House(app);
var redHouse = new House(app);
var purpleHouse = new House(app);
var greenHouse = new House(app);
var blueHouse = new House(app);
var bush0 = new Bush(app);

var blockers = [whiteHouse, yellowHouse, redHouse, purpleHouse, greenHouse, blueHouse,
				tree0, tree1, tree2, tree3, tree4, tree5, tree6, tree7];
var hiders = [bush0]

var fog = new Fog(app);
var zSorter = new ZSorter(app);
var statistics = new GameStatistics(app);


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
	// left-side trees
	tree0.prepareObject(128, 100, 0);
	tree1.prepareObject(30, 770, 1);
	tree2.prepareObject(490, 898, 2);
	tree3.prepareObject(16, 1214, 3);
	// middle trees
	tree4.prepareObject(840, 214, 4);
	tree5.prepareObject(840, 570, 5);
	tree6.prepareObject(1280, 570, 6);
	tree7.prepareObject(730, 1230, 7);
	// right-side trees
	tree8.prepareObject(1525, 80, 8);
	tree9.prepareObject(1590, 315, 9);
	tree10.prepareObject(1930, 385, 10);
	tree11.prepareObject(1495, 720, 11);
	tree12.prepareObject(1925, 790, 12);
	tree13.prepareObject(1510, 1180, 13);

	// left-side houses
	redHouse.prepareObject(70, 930, "red");
	blueHouse.prepareObject(171, 247, "blue");
	// middle houses
	whiteHouse.prepareObject(940, 310, "white");
	greenHouse.prepareObject(845, 1110, "green");
	// right-side houses
	yellowHouse.prepareObject(1650, 75, "yellow");
	purpleHouse.prepareObject(1635, 950, "purple");
	
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
	zSorter.register(fog.fogSprite0);
	zSorter.register(fog.fogSprite1);

	// timedEventManager
	app.timedEventManager = new TimedEventManager(app, zSorter, player);
	var waveOrganizer = new WaveOrganizer(app, zSorter, player);
	waveOrganizer.createWaveEvents();

	app.ticker.add(delta => app.timedEventManager.runEvents(player, delta));

	// initialize UI in the end because its Z ordering is always the greatest
	player.initUI();
	
	// 4. PUT LOOPS RUNNING
	player.initLoop();

	fog.initLoop(player);

	zSorter.initLoop();

	statistics.initLoop();

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