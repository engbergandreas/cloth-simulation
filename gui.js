//-------- GUI settings --------
let massSlider;
let springSlider;
let dampingSlider;
let timestepSlider;
let resetButton;
let eulerButton, rk4Button;
//let windButton;
let windCheckbox;
let connectionCheckbox;
let massCheckbox;
let textureCheckbox;

let guiContainer;
const CONTAINERWIDTH = 200;
const CONTAINERHEIGHT = 350;

const elementWidth = 160;
const elementHeight = 25;

let marginY;
let marginX = 65;

let uiText;

class GUI {
    constructor() {
	    uiText = new TextUI('');

        this.x = width - CONTAINERWIDTH - 100;
        this.y = 200;
        
        this.elements = [];
        this.circleOrigin = createVector(width - 200, height - 200);
        this.circleEndPoint = createVector(this.circleOrigin.x + 50, this.circleOrigin.y - 20);

        this.createGUI();

        guiContainer = new GuiContainer(this.x, this.y, CONTAINERWIDTH, CONTAINERHEIGHT, this.elements); //x, y, w, h       
    }
    createGUI() {

        timestepSlider = createSlider(0, 0.4, DEFAULTTIMESTEP, 0.01);
        massSlider = createSlider(0.1, 2.5, DEFAULTMASS, 0.05);
        springSlider = createSlider(0.1, 15, DEFAULTSPRING, 0.05);
        dampingSlider = createSlider(0, 1, DEFAULTDAMPING, 0.01);
        resetButton = createButton("Reset");
        resetButton.mousePressed(this.resetButtonPressed);
        windCheckbox = createCheckbox("",false);
        windCheckbox.changed(this.windChecked);
        connectionCheckbox = createCheckbox("",false);
        connectionCheckbox.changed(this.showGrid);
        massCheckbox = createCheckbox("",false);
        massCheckbox.changed(this.showMasses);
        textureCheckbox = createCheckbox("",true);
        textureCheckbox.changed(this.showTexture);
        eulerButton = createButton("Euler Integration");
        eulerButton.mousePressed(this.EulerIntegration);
        rk4Button = createButton("RK4 Integration");
        rk4Button.mousePressed(this.rk4Integration);

        this.elements.push(timestepSlider);
        this.elements.push(massSlider);
        this.elements.push(springSlider);
        this.elements.push(dampingSlider);
        this.elements.push(windCheckbox);
        this.elements.push(textureCheckbox);
        this.elements.push(connectionCheckbox);
        this.elements.push(massCheckbox);
        this.elements.push(resetButton);
        this.elements.push(eulerButton);
        this.elements.push(rk4Button);

        this.setElements();
    }
    setElements() {
        marginY = CONTAINERHEIGHT / (this.elements.length + 1);
        for(let i = 0; i <this.elements.length; i++){
            this.elements[i].size(elementWidth, elementHeight);
            this.elements[i].position(this.x + marginX, this.y + (i + 1)*marginY);
        }
    }

    renderGUI() {
        //gui background container
	    guiContainer.show(mouseX, mouseY);
        //wind circle
        fill(50)
        stroke(255);
        let radius = 100;
        ellipse(this.circleOrigin.x, this.circleOrigin.y, 2 * radius);
        
        if (draggingArrow) {
            if (abs(this.circleOrigin.x - mouseX) < radius && abs(this.circleOrigin.y - mouseY) < radius) {
                this.circleEndPoint.set(mouseX, mouseY);
            }
        }
        // Only affect x and y from arrow
	    drawArrow(this.circleOrigin, this.circleEndPoint.copy().sub(this.circleOrigin.x, this.circleOrigin.y), 'white');

        DIR.x = (this.circleEndPoint.x - this.circleOrigin.x);
        DIR.y = (this.circleEndPoint.y - this.circleOrigin.y);
        DIR.x = map(DIR.x, 0, 100, 0,1);
        DIR.y = map(DIR.y, 0, 100, 0,1);

    }

    resetButtonPressed() {
        nrSprings = 0;
        cloth = new Cloth(ROWS, COLS, INITIAL_X, INITIAL_Y, INITIAL_Z, SPACING);
        RENDERSPRINGS = false;
        RENDERTEXTURE = true;
        RENDERPOINTS = false;
        console.log("Euler: ", EULER, " RK4: ", RK4);
    }
    EulerIntegration() {
        EULER = true;
        RK4 = false;
        console.log("Euler: ", EULER, " RK4: ", RK4);
    }
    rk4Integration() {
        EULER = false;
        RK4 = true;
        console.log("Euler: ", EULER, " RK4: ", RK4);
    }
    
    windChecked() {
        STATIC_WIND = !STATIC_WIND;
        console.log("WIND CHANGED TO: ", STATIC_WIND);
    }
    showGrid() {
        RENDERSPRINGS = !RENDERSPRINGS;
    }
    showMasses() {
        RENDERPOINTS = !RENDERPOINTS;
    }
    showTexture() {
        RENDERTEXTURE = !RENDERTEXTURE;
    }
}

