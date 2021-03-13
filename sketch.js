//Initial settings
let EULER = false;
let RK4 = true;

//---------- Cloth settings ----------
let cloth;
const COLS = 25;
const ROWS = 20;
const SPACING = 15;
const INITIAL_X = 120;
const INITIAL_Y = 100;
const INITIAL_Z = 0;
let RENDERFLEXSPRINGS = false;
let RENDERPOINTS = false;
let RENDERSPRINGS = false;
let RENDERTEXTURE = true;

// ------ Default values of cloth----
const DEFAULTMASS = 0.4;
const DEFAULTSPRING = 7.5;
const DEFAULTDAMPING = 0.15;
const DEFAULTTIMESTEP = 0.1;

let STATIC_WIND = false;

// -------- Wind settings --------
let WIND;
let DIR; // Direction of the wind
let PerlinOff = 0.0; // Step for Perlin noise

//--------- Particle settings --------
let ParticleMass;
let SpringConstant;
let DampingConstant;
const SpringAtRest = SPACING;
const ParticleRadius = 4;

let TIMESTEP; //JAMES BOND <3 not anymore

let matrix = [];
let nrPoints = COLS * ROWS;
let nrSprings = 0;

let draggingArrow;
let v0;
let v1;
let inconsolata;
let _text;

//let button;
let flagimg;
let gui;
let lightDir;


function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	flagimg = loadImage('mt_flagga.png');
	grassimg = loadImage('grass.jpg');

	//console.log(bgimg)

	DIR = createVector(0,0,0);

	WIND = DIR; //Start at specified DIR

	//Create new cloth
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, INITIAL_Z, SPACING);

	gui = new GUI();
	
	ParticleMass = DEFAULTMASS;
	SpringConstant = DEFAULTSPRING;
	DampingConstant = DEFAULTDAMPING;
	TIMESTEP = DEFAULTTIMESTEP;
	firstTime = true;
	frameRate(30)
}

function draw() {
	background(147,195,205);

	//let time = millis();
	push();
	// rotate(HALF_PI , createVector(0,1,0));
	translate(-width / 2, -height / 2)
	
	//ambientLight(150, 150, 150);
	//lightDir = createVector(500, 500, -1);
	//directionalLight(250, 250, 250, lightDir);

	fill(255, 200, 0);
	noStroke();
	push();
		translate(110,50);
		sphere(25);
		push();
			translate(0, height/2);
			//rotateX(HALF_PI);
			noStroke();
			fill(225);
			//stroke(100);
			//cylinder(100, 5); //NÄE AJABAJA
			box(10,height, 10);
		pop();
		push();
			translate(0, height);
			rotateX(HALF_PI);
			noStroke();
			fill(71,112,71);
			plane(width*10);
		pop();
	pop();
	cloth.updateCloth();
	pop();

	//Draw UI
	push()
	translate(-width / 2, -height / 2)
	gui.renderGUI();
	pop();


	ParticleMass = massSlider.value();
	SpringConstant = springSlider.value();
	DampingConstant = dampingSlider.value();
	TIMESTEP = timestepSlider.value();

	WIND = STATIC_WIND ? static_wind() : wind(); // Fluxuation of wind
	//console.log("Wind direction: " + WIND);
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

function mousePressed() {
	guiContainer.pressed(mouseX, mouseY);
	draggingArrow = true;
}

function mouseReleased() {
	guiContainer.notPressed();
	draggingArrow = false;
}

function wind() {
	PerlinOff += 0.01; // Step forward

	//DIR lacks z value, add perlin noise in z direction as wind.
	let v = createVector(DIR.x * 20 * noise(PerlinOff), DIR.y * 20 * noise(PerlinOff), DIR.x * 50 * (noise(PerlinOff)-0.5));
	return v;
}

function static_wind() {
	let v = DIR.copy().mult(10);
	return v;
}

