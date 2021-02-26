class GuiContainer{
	constructor(x, y, w, h){
	this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.rollover = false;
	}

	show(px, py){
		if(this.dragging){
			this.x = px + this.offsetX;
			this.y = py + this.offsetY;

			timestepSlider.position(this.x + 65, this.y + 50);
            massSlider.position(this.x + 65,this.y + 100);
            springSlider.position(this.x + 65,this.y + 150);
            dampingSlider.position(this.x + 65,this.y + 200);
			
	        resetButton.position(this.x + 65 ,this.y + 300 - marginY);
		}

		stroke(255);
		fill(0);
		rect(this.x, this.y, this.w, this.h);

		uiText.draw("Timestep: " + TIMESTEP, this.x + 100, this.y + 43);
        uiText.draw("Mass: " + ParticleMass, this.x + 100, this.y + 93);
        uiText.draw("Spring: " + SpringConstant, this.x + 100, this.y + 143);
        uiText.draw("Damping: " + DampingConstant, this.x + 100, this.y + 193);
	}

	pressed(px, py) {
		//Check if mouse is in container (top part)
		//
		if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + 20) {
		  //print("clicked on rect");
		  this.dragging = true;
		  this.offsetX = this.x - px;
		  // print(this.offsetX);
		  this.offsetY = this.y - py;
		  // print(this.offsetY);
		}
	}
	
	notPressed() {
		//print("mouse was released");
		this.dragging = false;
	}
}