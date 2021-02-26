class GuiContainer{
	constructor(x, y, w, h, elements){
	this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
	
	this.elements = elements;
	}

	show(px, py){
		if(this.dragging){
			this.x = px + this.offsetX;
			this.y = py + this.offsetY;

			this.setElements();
		}

		stroke(255);
		fill(0);
		rect(this.x, this.y, this.w, this.h);

		uiText.draw("Timestep: " + TIMESTEP, this.x + 100, this.y + marginY);
		uiText.draw("Mass: " + ParticleMass, this.x + 100, this.y + 2 *marginY);
		uiText.draw("Spring: " + SpringConstant, this.x + 100, this.y + 3 * marginY);
		uiText.draw("Damping: " + DampingConstant, this.x + 100, this.y + 4 * marginY);
		uiText.draw("- Static wind " , this.x + 115, this.y + 5 * marginY + 11);
		uiText.draw("- Show texture " , this.x + 115, this.y + 6 * marginY + 11);
		uiText.draw("- Show connections " , this.x + 115, this.y + 7 * marginY + 11);
		uiText.draw("- Show masses " , this.x + 115, this.y + 8 * marginY + 11);
	
	}

	setElements() {
        marginY = CONTAINERHEIGHT / (this.elements.length + 1);
        for(let i = 0; i <this.elements.length; i++){
            this.elements[i].position(this.x + marginX, this.y + (i + 1)*marginY);
        }	
    }

	pressed(px, py) {
		//Check if mouse is in container (top part)
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