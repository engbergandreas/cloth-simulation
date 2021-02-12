class Point {
    constructor(x,y,r = 10, color)  {
        this.mass = ParticleMass; //kg
        this.pos = createVector(x, y);
        this.vel = createVector(0,0); // m/s^2 
        this.acc = createVector(0,0); //m per s
        this.radius = ParticleRadius;
        this.c = color;

        this.static = false;
        this.force = createVector();

        //bindings between
        this.k = SpringConstant;
        this.b = DampingConstant; 
        this.L0 = SpringAtRest; 
        this.neighbors = []; 
    }

    calculateForce() {
        if(!this.static) {
        const Fg = createVector(0,this.mass * 9.82);
        //const F = createVector(10, -25);
        let Fint = this.calculateInternalForce();

        let forceSum = p5.Vector.add(Fint,WIND);
        forceSum.add(Fg);
        this.force.set(forceSum);
        }
    }
        
    calculateInternalForce() {
        let sum = createVector();
       
        for(let i = 0; i < this.neighbors.length; i++) {
            //spring force calculations
            let springForce = createVector();
            //p1p2  => p2 - p1 
            let L = p5.Vector.sub(this.pos, this.neighbors[i].pos);
            let length = L.mag();

            if(length <= 0.000001) { //check for epsilon, avoid dividing by 0
                springForce.mult(0); // => force = [0;0]
            }
            else {
                let normalized = L.normalize();
                let displacement = length - this.L0;

                springForce.x = this.k * displacement*normalized.x;
                springForce.y = this.k * displacement*normalized.y;
            }
            sum.add(springForce);

            //damping forces calc
            let dampForce = p5.Vector.sub(this.vel, this.neighbors[i].vel);
            dampForce.mult(this.b);
            sum.add(dampForce);
        }
        sum.mult(-1);
        return sum;
    }

    addNeighbors(points) {
        for(let i = 0; i < points.length; i++) {
            this.neighbors.push(points[i]);
        }
    }

    eulerIntegration(x, xDerivate, h) {
        let derivateCopy = xDerivate.copy();
        derivateCopy.mult(h);
        x.add(derivateCopy);
    }

    calculateNextStep() {
        this.acc.x = this.force.x / this.mass;
        this.acc.y = this.force.y / this.mass;

        this.eulerIntegration(this.vel, this.acc, TIMESTEP);
        this.eulerIntegration(this.pos, this.vel, TIMESTEP);
    }

    drawLine(p2) {
        line(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y);
    }
    
    render() {
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.radius);
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