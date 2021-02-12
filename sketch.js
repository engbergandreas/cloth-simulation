let p1, p2, p3, p4;


 // INITIAL SETTINGS
 var gravity = 9.82;
 var mass = 30;
 
 // Mass 1
 var mass1PositionY = 238;
 var mass1PositionX = 89;
 var mass1VelocityY = 0;
 var mass1VelocityX = 0;
 
 // Mass 2
 var mass2PositionY = 106;
 var mass2PositionX = 85;
 var mass2VelocityY = 0;
 var mass2VelocityX = 0;
 
 
 var timeStep = 0.28;
 var anchorX = 209;
 var anchorY = 53;
 var k = 2;
 var damping = 2;
 

function setup() {
	createCanvas(1200, 900);
	pstatic1 = new Point(239, 53, 10, color('black'));
	pstatic2 = new Point(width/2 + 100, 100, 10, color('black'));


	p1 = new Point(109, 238, 20, color('magenta'));
	p2 = new Point(105, 106, 20, color('green'));

	p1.addNeighbors([pstatic1, p2]);
	p2.addNeighbors([p1]);
}


function mousePressed() {
	pilot();
	facit();

	
}

function draw() {
	background(230)
	line(0, 100, width, 100);
	line(100, 50, 100, height);

	pstatic1.render();
	pstatic2.render();
	
	p1.render();
	p2.render();

	facit();
	pilot();
	line(mass1PositionX, mass1PositionY, anchorX, anchorY);
	ellipse(mass1PositionX, mass1PositionY, 20, 20);
	// Draw mass 2
	line(mass2PositionX, mass2PositionY, mass1PositionX, mass1PositionY);
	ellipse(mass2PositionX, mass2PositionY, 20, 20);
}


function pilot(){
	// console.log("pos from main",p1.pos)
	// console.log("pos from main",p2.pos)
	// console.log("springforce p1 -> p2 main", p1.calcSpringForce(p2))
	p1.calculateForce();
	p2.calculateForce();


	p1.acc.x = p1.force.x / p1.mass;
	p1.acc.y = p1.force.y / p1.mass;

	p2.acc.x = p2.force.x / p2.mass;
	p2.acc.y = p2.force.y / p2.mass;

	// console.log("p1 acc x", p1.acc.x, " y ", p1.acc.y);
	// console.log("p2 acc x", p2.acc.x, " y ", p2.acc.y);


	// console.log("pre vel 1 x ", p1.vel.x, " y ", p1.vel.y);
	// console.log("pre vel 2 x", p2.vel.x, " y ", p2.vel.y);

	let p1AccCopy = p1.acc.copy();
	p1AccCopy.mult(timeStep);
	p1.vel.add(p1AccCopy);
	//p1.acc.mult(timeStep);
	//p1.vel.add(p1.acc); //this.vel = this.vel + this.acc*h
	let p2AccCopy = p2.acc.copy();
	p2AccCopy.mult(timeStep);
	p2.vel.add(p2AccCopy);

	// p2.acc.mult(timeStep);
	// p2.vel.add(p2.acc); //this.vel = this.vel + this.acc*h

	// console.log("pos vel 1 x ", p1.vel.x, " y ", p1.vel.y);
	// console.log("pos vel 2 x", p2.vel.x, " y ", p2.vel.y);
	
	// console.log("pre pos 1 x ", p1.pos.x, " y ", p1.pos.y);
	// console.log("pre pos 2", p2.pos.x, " y ", p2.pos.y); 

	let p1VelCopy = p1.vel.copy();
	p1VelCopy.mult(timeStep);
	//p1.vel.mult(timeStep); //ÄKTA PRIMA VARA<3 EULER
	p1.pos.add(p1VelCopy);

	let p2VelCopy = p2.vel.copy();
	p2VelCopy.mult(timeStep);
	//p1.vel.mult(timeStep); //ÄKTA PRIMA VARA<3 EULER
	p2.pos.add(p2VelCopy);

	// console.log("pos pos 1 x ", p1.pos.x, " y ", p1.pos.y);
	// console.log("pos pos 2", p2.pos.x, " y ", p2.pos.y); 

}

function facit() {
// ----------------------------------------------------------------------------------

// Mass 1 Spring Force
var mass1SpringForceY = -k*(mass1PositionY - anchorY);
var mass1SpringForceX = -k*(mass1PositionX - anchorX);

// Mass 2 Spring Force
var mass2SpringForceY = -k*(mass2PositionY - mass1PositionY);
var mass2SpringForceX = -k*(mass2PositionX - mass1PositionX);

// console.log("spring force 1 x", mass1SpringForceX, " y ", mass1SpringForceY);
// console.log("spring force 2 x", mass2SpringForceX, " y ", mass2SpringForceY);


// Mass 1 daming
var mass1DampingForceY = damping * mass1VelocityY;
var mass1DampingForceX = damping * mass1VelocityX;

// Mass 2 daming
var mass2DampingForceY = damping * mass2VelocityY;
var mass2DampingForceX = damping * mass2VelocityX;

// console.log("damping force 1 x", mass1DampingForceX, " y ", mass1DampingForceY);
// console.log("damping force 2 x", mass2DampingForceX, " y ", mass2DampingForceY);


// Mass 1 net force
var mass1ForceY = mass1SpringForceY + mass * gravity - mass1DampingForceY - mass2SpringForceY + mass2DampingForceY;

var mass1ForceX = mass1SpringForceX - mass1DampingForceX - mass2SpringForceX + mass2DampingForceX;

// Mass 2 net force
var mass2ForceY = mass2SpringForceY + mass * gravity - mass2DampingForceY;
var mass2ForceX = mass2SpringForceX - mass2DampingForceX;

// Mass 1 acceleration
var mass1AccelerationY = mass1ForceY/mass;
var mass1AccelerationX = mass1ForceX/mass;

// Mass 2 acceleration
var mass2AccelerationY = mass2ForceY/mass;
var mass2AccelerationX = mass2ForceX/mass;


// console.log("netForceMass1 x: ", mass1ForceX, " y: ", mass1ForceY);
// console.log("netForceMass2 x: ", mass2ForceX, " y: ", mass2ForceY);

// console.log("Acceleration 1 x", mass1AccelerationX, " y ", mass1AccelerationY);
// console.log("Acceleration 2 x", mass2AccelerationX, " y ", mass2AccelerationY);


// console.log("Pre velocity 1 x", mass1VelocityX, " y ", mass1VelocityY);
// console.log("Pre velocity 2 x", mass2VelocityX, " y ", mass2VelocityY);


// Mass 1 velocity
mass1VelocityY = mass1VelocityY + mass1AccelerationY * timeStep;
mass1VelocityX = mass1VelocityX + mass1AccelerationX * timeStep;

// Mass 2 velocity
mass2VelocityY = mass2VelocityY + mass2AccelerationY * timeStep;
mass2VelocityX = mass2VelocityX + mass2AccelerationX * timeStep;

// console.log("Pos velocity 1 x", mass1VelocityX, " y ", mass1VelocityY);
// console.log("Pos velocity 2 x", mass2VelocityX, " y ", mass2VelocityY);

// console.log("Pre position 1 x", mass1PositionX, " y ", mass1PositionY);
// console.log("Pre position 2 x", mass2PositionX, " y ", mass2PositionY);
// Mass 1 position
mass1PositionY = mass1PositionY + mass1VelocityY * timeStep;
mass1PositionX = mass1PositionX + mass1VelocityX * timeStep;

// Mass 2 position
mass2PositionY = mass2PositionY + mass2VelocityY * timeStep;
mass2PositionX = mass2PositionX + mass2VelocityX * timeStep;

// console.log("Pos position 1 x", mass1PositionX, " y ", mass1PositionY);
// console.log("Pos position 2 x", mass2PositionX, " y ", mass2PositionY);



}
