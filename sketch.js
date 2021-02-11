let p1, p2, p3, p4;

function setup() {
	createCanvas(1200, 900);
	pstatic1 = new Point(width/2, 100, 5, color('black'));
	pstatic2 = new Point(width/2 + 100, 100, 5, color('black'));

	// pstatic1 = new Point(100, height/2-100, 10);
	// pstatic2 = new Point(100, height/2, 10);
	


	p1 = new Point(width/2, 300, 10, color('magenta'));
	p2 = new Point(width/2, 400, 10, color('green'));
	p3 = new Point(width/2 + 200, 300, 10, color('red'));
	p4 = new Point(width/2 + 200, 400, 10, color('blue'));

	// p1 = new Point(300, height/2 -100);
	// p2 = new Point(400, height/2);
	// p3 = new Point(350, height/2 - 100);
	// p4 = new Point(450, height/2);


	p1.addNeighbors([pstatic1, p2, p3, p4]);
	p2.addNeighbors([p1, p4, p3]);
	p3.addNeighbors([pstatic2, p1,p3, p4]);
	p4.addNeighbors([p2, p3, p1]);

	console.log("pstatic:", pstatic1.pos);
	console.log("p1",p1.pos);
	console.log("width", width)
	console.log("height",height)
}

// THE PROBLEMS: SKITEN FUNKAR EJ
// THE PLAN: Jämför mot matlab på något bra sätt?
// 

function mousePressed() {
	for(let i = 0; i < 50; i++) {
	p1.update();
	p2.update();
	p3.update();
	p4.update();
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
	pstatic2.drawLine(p3);
	// p1.drawLine(p2);
	// p3.drawLine(p1);
	// p3.drawLine(p2);
	// p4.drawLine(p2);
	// p4.drawLine(p3);
	// p4.drawLine(p1);

	p1.update();
	p2.update();
	p3.update();
	p4.update();

	p1.render();
	p2.render();
	p3.render();
	p4.render();
}



