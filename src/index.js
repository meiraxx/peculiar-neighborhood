import $ from 'pixi.js';
import Fog from './fog';
import StaticMap from './staticMap';


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
	resolution: 1       // default: 1
  }
);
	
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
PIXI.utils.sayHello(type);
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
	

var fog = new Fog(rootElement,app);
var staticMap = new StaticMap(rootElement,app);

PIXI.loader.on("progress", (l,r) => loadProgressHandler(l,r)).load( (loader, resources) => {
	staticMap.setupOnResourcesLoaded();	
	fog.setupOnResourcesLoaded();
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

