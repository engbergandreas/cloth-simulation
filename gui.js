//-------- GUI settings --------
let massSlider;
let springSlider;
let dampingSlider;
let timestepSlider;
let resetButton;
let eulerIntegration, rk4Integration;
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
        this.y = 50;
        
        this.elements = [];
        this.circleOrigin = createVector(width - 200, height - 150);
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
        windCheckbox = createCheckbox("- Static wind",false).style("color", "white");;
        windCheckbox.changed(this.windChecked);
        connectionCheckbox = createCheckbox("- Show connections",false).style("color", "white");;
        connectionCheckbox.changed(this.showGrid);
        massCheckbox = createCheckbox("- Show masses",false).style("color", "white");;
        massCheckbox.changed(this.showMasses);
        textureCheckbox = createCheckbox("- Show texture",true).style("color", "white");;
        textureCheckbox.changed(this.showTexture);
        eulerIntegration = createCheckbox(" - Euler Integration").style("color", "white");;
        eulerIntegration.changed(this.EulerIntegration);
        rk4Integration = createCheckbox(" - RK4 Integration", true).style("color", "white");
        rk4Integration.changed(this.rk4Integration);

        this.elements.push(timestepSlider);
        this.elements.push(massSlider);
        this.elements.push(springSlider);
        this.elements.push(dampingSlider);
        this.elements.push(windCheckbox);
        this.elements.push(textureCheckbox);
        this.elements.push(connectionCheckbox);
        this.elements.push(massCheckbox);
        this.elements.push(eulerIntegration);
        this.elements.push(rk4Integration);
        this.elements.push(resetButton);

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
        console.log("Euler: ", EULER, " RK4: ", RK4);
    }
    EulerIntegration() {
        if(eulerIntegration.checked()) {
            EULER = true;
            RK4 = false;
            rk4Integration.checked(false);
        }
        else {
            EULER = false;
            RK4 = true;
            rk4Integration.checked(true);
        }
        console.log("Euler: ", EULER, " RK4: ", RK4);

    }
    rk4Integration() {
        if(rk4Integration.checked()) {
            EULER = false;
            RK4 = true;
            eulerIntegration.checked(false);
        } else {
            EULER = true;
            RK4 = false;
            eulerIntegration.checked(true);
        }
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

