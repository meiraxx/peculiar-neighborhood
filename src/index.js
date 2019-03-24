import $ from 'pixi.js';
import Fog from './fog';
import StaticMap from './staticMap';
import Player from './player';

function loadProgressHandler(loader,resource) {
  console.log("loading " + resource.url + " "  + loader.progress + "%");
}
  
  
const rootElement = document.getElementById('rootElement');

//Create a Pixi Application
let app = new PIXI.Application({ 
	width: 1024,         // default: 800
	height: 1024,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: 1,       // default: 1
	forceCanvas: true 	// default: false
  }
);
	
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "Canvas"
}

// initial console logging: "PixiJS 4.8.6 - WebGL/Canvas - http://www.pixijs.com/"
PIXI.utils.sayHello(type);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

var fog = new Fog(rootElement,app);
var staticMap = new StaticMap(rootElement,app);
var player = new Player(rootElement, app);
PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( (loader, resources) => {
	staticMap.setupOnResourcesLoaded();
	// fog is really heavy on computation, my pc lags a lot when this is on
	// TODO: try to mitigate this lag by having a ON and OFF button on the browser (removeChild and addChild, or using the visible property)
	fog.setupOnResourcesLoaded();
	player.setupOnResourcesLoaded(512,512);
});



// background music is also heavy
// TODO: maybe get a 20 second mp3 file instead of 2 minutes to try to improve this
let music = document.createElement("audio");
music.src = "assets/soundtrack.mp3";
music.setAttribute("preload", "auto");
music.setAttribute("controls", "none");
music.setAttribute("loop", "loop");
music.style.display = "none";
music.volume = 0.4;
document.body.appendChild(music);
music.play();