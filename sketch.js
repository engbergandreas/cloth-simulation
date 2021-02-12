
//Initial settings


//---------- Cloth settings ----------
 const COLS = 10;
 const ROWS = 10;
 const SPACING = 40;
 const INITIAL_X = 400;
 const INITIAL_Y = 100;

 //wind
 let WIND;

 //--------- Particle settings --------
const ParticleMass = 5;
const SpringConstant = 10;
const DampingConstant = 5;
const SpringAtRest = 50;
const ParticleRadius = 5;

const TIMESTEP = 0.1; //JAMES BOND <3

 let matrix = [];
 let cloth;
 

function setup() {
	createCanvas(1200, 900);
	
	WIND = createVector(7, -25);

	//Create new cloth
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, SPACING);


	test = {neighbors : [10, 20, 30, 50], type : ["tension", "shear", "shear", "tension"]};
	for(let i = 0; i < test.neighbors.length; i++) {
		console.log(test.neighbors[i], test.type[i])
	}
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

