class Point {
    constructor(x,y,color)  {
        this.mass = ParticleMass; //kg
        this.pos = createVector(x, y);
        this.oldPos = this.pos.copy();
        this.vel = createVector(0,0); // m/s 
        this.acc = createVector(0,0); // m/s^2
        this.radius = ParticleRadius;
        this.c = color;

        this.static = false;
        this.force = createVector();

        //bindings between
        this.k = SpringConstant;
        this.b = DampingConstant; 
        this.restLength = SpringAtRest; 
        this.neighbors = {points: [], typeOfSpring: []}; 
    }
    
    calculateForce() {
        if(!this.static) {
        const Fg = createVector(0,this.mass * 9.82);
        //const F = createVector(10, -25);
        let Fint = this.calculateInternalForce();

        let forceSum = p5.Vector.add(Fint,WIND).add(Fg);
        this.force.set(forceSum);
        }
    }
        
    calculateInternalForce() {
        let sum = createVector();
        let displacement;
        for(let i = 0; i < this.neighbors.points.length; i++) {
            //spring force calculations
            let springForce = createVector();
            //p1p2  => p2 - p1
            let L = p5.Vector.sub(this.pos, this.neighbors.points[i].pos);
            let currentLength = L.mag();

            if(currentLength <= 0.000001) { //check for epsilon, avoid dividing by 0
                springForce.mult(0); // => force = [0;0]
            }
            else {
                if(this.neighbors.typeOfSpring[i] === "structural") {
                    displacement = currentLength - this.restLength;
                    this.k = SpringConstant;
                }
                else if (this.neighbors.typeOfSpring[i] === "shear") {
                    displacement = currentLength - 1.414 * this.restLength;
                    this.k = SpringConstant / 2;
                }
                else if(this.neighbors.typeOfSpring[i] === "flexion") {
                    displacement = currentLength -  2 * this.restLength;
                    this.k = SpringConstant / 6;
                }
                
                let normalized = L.normalize();
                //let displacement = le ngth - this.L0;
                //springForce.set(normalized.mult(displacement).mult(this.k));
                springForce.x = this.k * displacement*normalized.x;
                springForce.y = this.k * displacement*normalized.y;
            }
            sum.add(springForce);

            //damping forces calc
            let dampForce = p5.Vector.sub(this.vel, this.neighbors.points[i].vel);
            dampForce.mult(this.b);
            sum.add(dampForce);
        }
        sum.mult(-1);
        return sum;
    }

    addNeighbors(obj) {
        for(let i = 0; i < obj.points.length; i++) {
            this.neighbors.points.push(obj.points[i]);
            this.neighbors.typeOfSpring.push(obj.typeOfSpring[i]);

        }
    }

    updateValues(){
        this.mass = ParticleMass;
        this.k = SpringConstant;
        this.b = DampingConstant;
    }

    eulerIntegration(x, xDerivate, h) {
        let derivateCopy = xDerivate.copy();
        derivateCopy.mult(h);
        x.add(derivateCopy);
    }

    // Run twice as long as corresponding euler integration
    // NOT WORKING
    verletIntegration(dt) {
        let x_dt = 2 * this.pos.x - this.oldPos.x + this.acc.x*(dt*dt); //Baseras på (6)
        let y_dt = 2 * this.pos.y - this.oldPos.y + this.acc.y*(dt*dt); //Baseras på (6)
        
        this.vel.x = (x_dt - this.oldPos.x)/(2*dt); // Baseras på (7)
        this.vel.y = (y_dt - this.oldPos.y)/(2*dt);
        //console.log(this.vel);
        this.pos.x = x_dt; //steg 8
        this.pos.y = y_dt; //steg 8
    }



    calculateNextStep() {
        this.acc.set(this.force.div(this.mass));
        this.eulerIntegration(this.vel, this.acc, TIMESTEP);
        this.eulerIntegration(this.pos, this.vel, TIMESTEP);

        this.oldPos = this.pos.copy(); //part for verlet integration

        //this.verletIntegration(TIMESTEP);
    }

    drawLine(p2, color) {
        color = color ? color : 'white' // if(!color) color ="red" else color = color;
        stroke(color)
        fill(255)
        strokeWeight(1)
        line(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y);
    }
    
    render() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        fill(this.c);
        ellipse(0,0,this.radius);
        pop();
    }

    renderHelperArrows() {
        const b = createVector(400,400);
        let t = 'velocity';
        textSize(15)
        text(t, 300, 400)
        this.drawArrow(b, this.vel.copy(), 0);
        t = "acceleration"
        text(t, 550, 400)
        this.drawArrow(b.add(100), this.acc.copy(), 0);
    }

    drawArrow(base, vec, myColor) {
        push();
        stroke(myColor);
        strokeWeight(3);
        fill(myColor);
        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        let arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
      }
}