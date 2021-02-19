
//Initial settings


//---------- Cloth settings ----------
 const COLS = 10;
 const ROWS = 10;
 const SPACING = 25;
 const INITIAL_X = 200;
 const INITIAL_Y = 100;
 const RENDERFLEX = false;
 const RENDERPOINTS = false;

 //wind
 let WIND;

 //--------- Particle settings --------
const ParticleMass = 0.5;
const SpringConstant = 5;
const DampingConstant = 0.5;
const SpringAtRest = SPACING + 10;
const ParticleRadius = 5;

const TIMESTEP = 0.1; //JAMES BOND <3

 let matrix = [];
 let cloth;
 let nrPoints = COLS*ROWS;
 let nrSprings = 0;

function setup() {
	createCanvas(windowWidth,windowHeight);
	
	//WIND = createVector((Math.random() - 0.5 ) * 20, 0)

	//Create new cloth
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, SPACING);
	console.log(nrPoints);
	console.log(nrSprings);
}

function mousePressed() {
	//pilot();
	//facit();

}

function draw() {

	background(230)
	line(0, 100, width, 100);
	line(100, 50, 100, height);
	cloth.updateCloth();

}


function pilot(){

	p1.calculateForce();
	p2.calculateForce();

	p1.calculateNextStep();
	p2.calculateNextStep();
}

