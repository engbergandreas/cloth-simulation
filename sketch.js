//Initial settings


//---------- Cloth settings ----------
let cloth;
 const COLS = 20;
 const ROWS = 14;
 const SPACING = 30;
 const INITIAL_X = 120;
 const INITIAL_Y = 100;
 const RENDERFLEX = false;
 const RENDERPOINTS = true;
 const RENDERSPRINGS = false;
 const RENDERTEXTURE = true;
 let STATIC_WIND = true;

 //wind
 let WIND;
 let DIR; // Direction of the wind
 let PerlinOff = 0.0; // Step for Perlin noise

 //--------- Particle settings --------
 let ParticleMass = 0.5;
 let SpringConstant = 5;
 let DampingConstant = 0.5;
 const SpringAtRest = SPACING + 1;
 const ParticleRadius = 4;

const TIMESTEP = 0.1; //JAMES BOND <3

 let matrix = [];
 let nrPoints = COLS*ROWS;
 let nrSprings = 0;

 //-------- GUI --------
 //var guiProvider = 'QuickSettings';
 let massSlider;
 let springSlider;
 let dampingSlider;
 let resetButton;
 let windButton;
 //let gui;

 let guiContainer;
 let containerWidth;
 let containerHeight;
 let marginX;
 let marginY;
 
 let elementWidth;
 let elementHeight;
 
 let draggingArrow; 
 let v0;
 let v1;
 let inconsolata;
 let _text;

 //let button;
let flagimg;

function preload() {
	// inconsolata = loadFont('./Inconsolata.ttf');
	// console.log(inconsolata);
}
let uiText;

function setup() {
	createCanvas(windowWidth,windowHeight, WEBGL);
	flagimg = loadImage('mt_flagga.png');
	DIR = createVector();
	
	WIND = DIR; //Start at specified DIR

	//Create new cloth
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, SPACING);

	

	//Create UI
	//Settings for GUI
	uiText = new TextUI('');
	
	containerWidth = 200;
	containerHeight = 300;
	elementWidth = 160;
	elementHeight = 25;
	
	marginX = (containerWidth - elementWidth) / 2;
	marginY = 40;

	guiContainer = new GuiContainer(900, 200, containerWidth, containerHeight); //x, y, w, h

  	resetButton = createButton("Reset"); 
	resetButton.size(elementWidth, elementHeight);
	resetButton.position(965 , 500 - marginY);
	resetButton.mousePressed(resetButtonPressed);

	windButton = createButton("Wind type");
	windButton.mousePressed(windButtonPressed);
	windButton.size(elementWidth, elementHeight);
	windButton.position(965, 600);
	
	massSlider = createSlider(0.1, 1.5, 0.5, 0.05); 
	massSlider.size(elementWidth, elementHeight);
	massSlider.position(965, 300);
	springSlider = createSlider(0.1, 9.9, 5, 0.05); 
	springSlider.size(elementWidth, elementHeight);
	springSlider.position(965, 350);
	dampingSlider = createSlider(0, 1.5, 0.2, 0.01);
	dampingSlider.position(965, 400);
	dampingSlider.size(elementWidth, elementHeight);

	ParticleMass = massSlider.value();
	SpringConstant = springSlider.value();
	DampingConstant = dampingSlider.value();
	firstTime = true;

	v0 = createVector(1200, 800);
  	v1 = createVector(1100, 900);
	draggingArrow = false;	
}

// function mousePressed() {
// 	//console.log(massSlider.value());
// }

function draw() {
	translate(-width/2,-height/2)
	background(50)
	
	line(100, 50, 100, height);
	stroke(256);
	fill(256);
	rect(100, 50, 20, height);
	fill(255,200,0);
	stroke(255,200,0);
	ellipse(110, 50, 50);

	//box(0); //maybe needed maybe not
	cloth.updateCloth();
	
	ParticleMass = massSlider.value();
	SpringConstant = springSlider.value();
	DampingConstant = dampingSlider.value();

	guiContainer.show(mouseX, mouseY);

	WIND = STATIC_WIND ? static_wind() : wind(); // Fluxuation of wind

	
	// //UI text
	// uiText.draw("Mass: " + ParticleMass, 1000, 293);
	// uiText.draw("Spring: " + SpringConstant, 1000, 343);
	// uiText.draw("Damping: " + DampingConstant, 1000, 393);
	
	// console.log(firstime);
	 if(firstTime){
	 	v0 = createVector(1200, 800);
  	 	v1 = createVector(1250, 780);
	 	drawArrow(v0, v1, 'black');
	 	firstTime = false;
	 }

	fill(51)
	stroke(255);
	//strokeWeight(5)
	ellipse(1200, 800, 200,200,50);

	//console.log(draggingArrow);
	if(draggingArrow){
		//console.log("dragging");
		if(abs(1200 - mouseX) < 100 && abs(800 - mouseY) < 100){
			//mag(v0)
			//console.log("in circle area");
			v0.set(1200, 800);
			v1.set(mouseX, mouseY);
			//drawArrow(v2, v3, 'black');
			
		}
	}
	drawArrow(v0, v1.copy().sub(1200, 800), 'white');	
	DIR = v1.copy().sub(v0).mult(0.1);
}

// --- ARROW FOR WIND ---
function drawArrow(base, vec, myColor) {
	push();
	stroke(myColor);
	strokeWeight(2.5);
	fill(myColor);
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}

function resetButtonPressed(){
	nrSprings = 0;
	//console.log("pressed");
	// ParticleMass = 0.5;
	// SpringConstant = 5;
	// DampingConstant = 0.5;
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, SPACING);
	// massSlider.value(0.5);
	// springSlider.value(5);
	// dampingSlider.value(0.5);
}

function windButtonPressed(){
	STATIC_WIND = !STATIC_WIND;
	console.log("WIND CHANGED TO STATIC", STATIC_WIND);
}

 function mousePressed() {
 	guiContainer.pressed(mouseX, mouseY);
	draggingArrow = true; 
 }
  
function mouseReleased() {
	guiContainer.notPressed();
	draggingArrow = false;
}

function pilot(){

	p1.calculateForce();
	p2.calculateForce();

	p1.calculateNextStep();
	p2.calculateNextStep();
}

// function wind() {
// 	let v = createVector();

// 	//Slight variation around dir
// 	v.x = DIR.x*3*abs(sin(Math.random()));
// 	v.y = DIR.y*3*abs(sin(Math.random()));
// 	return v;
// }

function wind() {
	PerlinOff += 0.01; // Step forward
	let v = createVector(DIR.x*2*noise(PerlinOff), DIR.y*2*noise(PerlinOff));
	return v;
}

function static_wind() {
	let v = DIR;
	return v;
}

