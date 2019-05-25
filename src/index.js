import Fog from "./Fog";
import StaticMap from "./StaticMap";
import Player from "./Player";
import Bush from "./Bush";
import Viewport from "./lib/viewport";
import Monster from "./Monster";
import Tree from "./Tree";
import House from "./House";
import Car from "./Car";
import Fence from "./Fence";
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
Car.loadResources(app);
Fence.loadResources(app);
Fog.loadResources(app);
// 2. CONSTRUCT MAIN OBJECTS
var staticMap = new StaticMap(app);
var player = new Player(app, viewport);

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

var blockers = [whiteHouse, yellowHouse, redHouse, purpleHouse, greenHouse, blueHouse,
				tree0, tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9,
				tree10, tree11, tree12, tree13];

var bush0 = new Bush(app);
var bush1 = new Bush(app);
var bush2 = new Bush(app);
var bush3 = new Bush(app);
var bush4 = new Bush(app);
var bush5 = new Bush(app);
var bush6 = new Bush(app);
var bush7 = new Bush(app);

var car0 = new Car(app);
var car1 = new Car(app);
var car2 = new Car(app);
var car3 = new Car(app);
var car4 = new Car(app);

var hRedFence0 = new Fence(app);
var hRedFence1 = new Fence(app);
var hRedFence2 = new Fence(app);
var hRedFence3 = new Fence(app);
var vRedFence0 = new Fence(app);
var vRedFence1 = new Fence(app);
var vRedFence2 = new Fence(app);

var hBlueFence0 = new Fence(app);
var hBlueFence1 = new Fence(app);
var hBlueFence2 = new Fence(app);
var hBlueFence3 = new Fence(app);
var hBlueFence4 = new Fence(app);
var hBlueFence5 = new Fence(app);
var hBlueFence6 = new Fence(app);
var hBlueFence7 = new Fence(app);
var vBlueFence0 = new Fence(app);
var vBlueFence1 = new Fence(app);
var vBlueFence2 = new Fence(app);
var vBlueFence3 = new Fence(app);

var hYellowFence0 = new Fence(app);
var hYellowFence1 = new Fence(app);
var hYellowFence2 = new Fence(app);
var hYellowFence3 = new Fence(app);
var vYellowFence0 = new Fence(app);
var vYellowFence1 = new Fence(app);
var vYellowFence2 = new Fence(app);
var vYellowFence3 = new Fence(app);

var bushes = [bush0, bush1, bush2, bush3, bush4, bush5, bush6, bush7];
var cars = [car0, car1, car2, car3, car4];
var fences = [hRedFence0, hRedFence1, hRedFence2, hRedFence3, vRedFence0, vRedFence1, vRedFence2,
			hBlueFence0, hBlueFence1, hBlueFence2, hBlueFence3, hBlueFence4, hBlueFence5, hBlueFence6, hBlueFence7,
			vBlueFence0, vBlueFence1, vBlueFence2, vBlueFence3, vYellowFence0, vYellowFence1, vYellowFence2, vYellowFence3,
			hYellowFence0, hYellowFence1, hYellowFence2, hYellowFence3];

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
	blueHouse.prepareObject(70, 930, "blue");
	redHouse.prepareObject(171, 247, "red");
	// middle houses
	whiteHouse.prepareObject(940, 310, "white");
	greenHouse.prepareObject(845, 1110, "green");
	// right-side houses
	yellowHouse.prepareObject(1650, 75, "yellow");
	purpleHouse.prepareObject(1635, 950, "purple");

	// bushes
	bush0.prepareObject(121, 473, 0);
	bush1.prepareObject(400, 1228, 1);
	bush2.prepareObject(1287, 246, 2);
	bush3.prepareObject(1215, 640, 3);
	bush4.prepareObject(740, 1050, 4);
	bush5.prepareObject(1148, 1368, 5);
	bush6.prepareObject(1683, 383, 6);
	bush7.prepareObject(1855, 864, 7);

	// cars
	car0.prepareObject(292, 50, 0, 3);
	car1.prepareObject(8, 1422, 1, 1);
	car2.prepareObject(1085, 975, 2, 2);
	car3.prepareObject(1518, 438, 3, 3);
	car4.prepareObject(1863, 1223, 4, 1);

	// fences
	// red
	hRedFence0.prepareObject(40, 554, 0, "red", "horizontal");
	hRedFence1.prepareObject(168-11, 554, 1, "red", "horizontal");
	hRedFence2.prepareObject(296-22, 554, 2, "red", "horizontal");
	hRedFence3.prepareObject(617-128, 554, 3, "red", "horizontal");
	vRedFence0.prepareObject(617-11, 554-144+54, 0, "red", "vertical");
	vRedFence1.prepareObject(617-11, 554-144*2+54+84, 1, "red", "vertical");
	vRedFence2.prepareObject(617-11, 266-144+54+168, 2, "red", "vertical");

	// blue
	hBlueFence0.prepareObject(0, 752, 0, "blue", "horizontal");
	hBlueFence1.prepareObject(128-11, 752, 1, "blue", "horizontal");
	hBlueFence2.prepareObject(256-22, 752, 2, "blue", "horizontal");
	hBlueFence3.prepareObject(512-23, 752, 3, "blue", "horizontal");
	hBlueFence4.prepareObject(0, 1334, 4, "blue", "horizontal");
	hBlueFence5.prepareObject(128-11, 1334, 5, "blue", "horizontal");
	hBlueFence6.prepareObject(256-22, 1334, 6, "blue", "horizontal");
	hBlueFence7.prepareObject(512-23, 1334, 7, "blue", "horizontal");
	vBlueFence0.prepareObject(617-11, 752, 0, "blue", "vertical");
	vBlueFence1.prepareObject(617-11, 752+144-84, 1, "blue", "vertical");
	vBlueFence2.prepareObject(617-11, 1334-144*2+84+54*2+5.5, 2, "blue", "vertical");
	vBlueFence3.prepareObject(617-11, 1334-144*3+84+54*3+5.5, 3, "blue", "vertical");

	// yellow
	vYellowFence0.prepareObject(1469, 0, 0, "yellow", "vertical");
	vYellowFence1.prepareObject(1469, 144-84, 1, "yellow", "vertical");
	vYellowFence2.prepareObject(1469, 144*2+54+84, 2, "yellow", "vertical");
	vYellowFence3.prepareObject(1469, 0, 3, "yellow", "vertical");
	hYellowFence0.prepareObject(1469, 571-54, 0, "yellow", "horizontal");
	hYellowFence1.prepareObject(1469+128-11, 571-54, 1, "yellow", "horizontal");
	hYellowFence2.prepareObject(1469+128*2-11*2, 571-54, 2, "yellow", "horizontal");
	hYellowFence3.prepareObject(1469+128*4-11*4-16.5, 571-54, 3, "yellow", "horizontal");

	// init all and register z ordering
	blockers.forEach(function(b) {
		b.initObject();
		zSorter.register(b.sprite);
	});

	bushes.forEach(function(b) {
		b.initObject();
		zSorter.register(b.sprite);
	});

	cars.forEach(function(c) {
		c.initObject();
		zSorter.register(c.sprite);
	});

	fences.forEach(function(f) {
		f.initObject();
		zSorter.register(f.sprite);
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