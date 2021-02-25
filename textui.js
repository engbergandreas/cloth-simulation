class TextUI {
    constructor(text) {
        this.height = 16;
        this.t = createGraphics(150,this.height);
        this.t.background(50);
        this.t.fill(255);
        this.t.textAlign(LEFT,TOP);
        this.t.textSize(this.height);
        this.t.text(text,0,0);
    }

    draw(text,x,y) {
        push()
        this.t.background(1);
        this.t.text(text,0,0);
        texture(this.t);
        translate(x,y)
        plane(150,this.height)
        pop();
    }
}