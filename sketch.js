
//Initial settings


//---------- Cloth settings ----------
 const COLS = 10;
 const ROWS = 10;
 const SPACING = 40;
 const INITIAL_X = 400;
 const INITIAL_Y = 100;
 const RENDERFLEX = false;

 //wind
 let WIND;

 //--------- Particle settings --------
const ParticleMass = 10;
const SpringConstant = 15;
const DampingConstant = 10;
const SpringAtRest = SPACING + 10;
const ParticleRadius = 5;

const TIMESTEP = 0.1; //JAMES BOND <3

 let matrix = [];
 let cloth;
 

function setup() {
	createCanvas(windowWidth,windowHeight);
	
	WIND = createVector((Math.random() - 0.5 ) * 40, 0)


	//Create new cloth
	cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, SPACING);


	test = {neighbors : [10, 20, 30, 50], type : ["tension", "shear", "shear", "tension"]};
	for(let i = 0; i < test.neighbors.length; i++) {
		console.log(test.neighbors[i], test.type[i])
	}
	test.neighbors.push(30);
	test.type.push("hej");
	console.log(test)
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

