import $ from 'pixi.js';


export default class {
  
  constructor(rootElement) {
    this.rootElement = rootElement;
  }
  
  render() {

	let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type);
	
	//Create a Pixi Application
	let app = new PIXI.Application({ 
		width: 256,         // default: 800
		height: 256,        // default: 600
		antialias: true,    // default: false
		transparent: false, // default: false
		resolution: 1       // default: 1
	  }
	);

	//Add the canvas that Pixi automatically created for you to the HTML document
	document.body.appendChild(app.view);

	
  }
  
}