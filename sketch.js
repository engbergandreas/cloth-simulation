let p1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	pstatic1 = new Point(100, 100, 10);
	pstatic2 = new Point(100, 500, 10);

	p1 = new Point(500, 100);


	p1.addNeighbors([pstatic1, pstatic2, p2]);
	p2.addNeighbors([pstatic1, pstatic2, p1]);

}

// THE PROBLEMS: SKITEN FUNKAR EJ
// THE PLAN: Jämför mot matlab på något bra sätt?
// 

function simulate() {
	const h = 0.01;
	const endTime = 10;
	let timeSteps =[];
	let count = 0;
	
	for(let t= 0; t < endTime; t+= h)	{
		timeSteps[count] = t;
		count++;
	}
	console.log(timeSteps);
}

function draw() {
	background(255)
	line(100, 100, 100, 700);
	//fill(255);
	p1.update();
	pstatic1.render();
	pstatic1.drawLine(p1);
}



