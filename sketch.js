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
	pstatic1 = new Point(209, 53, 5, color('black'));
	pstatic2 = new Point(width/2 + 100, 100, 5, color('black'));

	// pstatic1 = new Point(100, height/2-100, 10);
	// pstatic2 = new Point(100, height/2, 10);

	p1 = new Point(238, 89, 10, color('magenta'));
	p2 = new Point(106,85, 10, color('green'));
	//p3 = new Point(width/2 + 200, 300, 10, color('red'));
	//p4 = new Point(width/2 + 200, 400, 10, color('blue'));

	// p1 = new Point(300, height/2 -100);
	// p2 = new Point(400, height/2);
	// p3 = new Point(350, height/2 - 100);
	// p4 = new Point(450, height/2);


	p1.addNeighbors([pstatic1, p2]);
	p2.addNeighbors([p1]);
	//p3.addNeighbors([pstatic2, p1,p3, p4]);
	//p4.addNeighbors([p2, p3, p1]);

	console.log("pstatic:", pstatic1.pos);
	console.log("p1",p1.pos);
	console.log("width", width)
	console.log("height",height)
}

// THE PROBLEMS: SKITEN FUNKAR EJ
// THE PLAN: Jämför mot matlab på något bra sätt?
// 

function mousePressed() {
	for(let i = 0; i < 1; i++) {
	p1.update();
	p2.update();
	//p3.update();
	//p4.update();
	}
}

function draw() {
	background(230)
	line(0, 100, width, 100);
	line(100, 50, 100, height);

	pstatic1.render();
	pstatic2.render();
	//p1.renderHelperArrows();
	


	pstatic1.drawLine(p1);
	//pstatic2.drawLine(p3);
	// p1.drawLine(p2);
	// p3.drawLine(p1);
	// p3.drawLine(p2);
	// p4.drawLine(p2);
	// p4.drawLine(p3);
	// p4.drawLine(p1);

	//p1.update();
	//p2.update();

	//p3.update();
	//p4.update();

	p1.render();
	p2.render();
	//p3.render();
	//p4.render();
	
	//let Fint1 = p1.calculateInternalForce();
	//let Fint2 = p2.calculateInternalForce();
	

	const Fg = createVector(0, p1.mass * 9.82);
	const F = createVector(0.0, 0.0);
	
	let forceSum1 = p5.Vector.add(Fint1,F);
	forceSum1.add(Fg);
	
	let forceSum2 = p5.Vector.add(Fint2,F);
	forceSum2.add(Fg);
	
	p1.acc.x = 1/this.mass * forceSum1.x;
	p1.acc.y = 1/this.mass * forceSum1.y;

	p2.acc.x = 1/this.mass * forceSum2.x;
	p2.acc.y = 1/this.mass * forceSum2.y;

	let h = 0.28;
	
	p1.acc.mult(h);
	p1.vel.add(p1.acc); 
	
	p1.vel.mult(h); 
	p1.pos.add(p1.vel);
	
	p2.acc.mult(h);
	p2.vel.add(p2.acc); //this.vel = this.vel + this.acc*h
	
	p2.vel.mult(h); //ÄKTA PRIMA VARA<3 EULER
	p2.pos.add(p2.vel);
	


// ----------------------------------------------------------------------------------

// Mass 1 Spring Force
var mass1SpringForceY = -k*(mass1PositionY - anchorY);
var mass1SpringForceX = -k*(mass1PositionX - anchorX);

// Mass 2 Spring Force
var mass2SpringForceY = -k*(mass2PositionY - mass1PositionY);
var mass2SpringForceX = -k*(mass2PositionX - mass1PositionX);

// Mass 1 daming
var mass1DampingForceY = damping * mass1VelocityY;
var mass1DampingForceX = damping * mass1VelocityX;

// Mass 2 daming
var mass2DampingForceY = damping * mass2VelocityY;
var mass2DampingForceX = damping * mass2VelocityX;

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

// Mass 1 velocity
mass1VelocityY = mass1VelocityY + mass1AccelerationY * timeStep;
mass1VelocityX = mass1VelocityX + mass1AccelerationX * timeStep;

// Mass 2 velocity
mass2VelocityY = mass2VelocityY + mass2AccelerationY * timeStep;
mass2VelocityX = mass2VelocityX + mass2AccelerationX * timeStep;

// Mass 1 position
mass1PositionY = mass1PositionY + mass1VelocityY * timeStep;
mass1PositionX = mass1PositionX + mass1VelocityX * timeStep;

// Mass 2 position
mass2PositionY = mass2PositionY + mass2VelocityY * timeStep;
mass2PositionX = mass2PositionX + mass2VelocityX * timeStep;


line(mass1PositionX, mass1PositionY, anchorX, anchorY);
ellipse(mass1PositionX, mass1PositionY, 20, 20);
// Draw mass 2
line(mass2PositionX, mass2PositionY, mass1PositionX, mass1PositionY);
ellipse(mass2PositionX, mass2PositionY, 20, 20);
}



