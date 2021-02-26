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

        //Rk4
        this.k1 = createVector();
        this.k2 = createVector();
        this.k3 = createVector();
        this.k4 = createVector();

        //bindings between
        this.k = SpringConstant;
        this.b = DampingConstant; 
        this.restLength = SpringAtRest; 
        this.neighbors = {points: [], typeOfSpring: []}; 
    }
    
    calculateForce(velocity) {
        if(!this.static) {
        const Fg = createVector(0,this.mass * 9.82);
        //const F = createVector(10, -25);
        let Fint = this.calculateInternalForce(velocity);

        let forceSum = p5.Vector.add(Fint,WIND).add(Fg);
        this.force.set(forceSum);
        }
    }
        
    calculateInternalForce(velocity) {
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
            // let dampForce = p5.Vector.sub(this.vel.copy().add(velocity), this.neighbors.points[i].vel.copy());
            // dampForce.mult(this.b);
            // sum.add(dampForce);
        }
        
        //damping forces calc
        let dampForce = this.vel.copy().add(velocity);
        dampForce.mult(this.b);
        sum.add(dampForce);

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

    rk4Integration(dt) {
        this.calculateForce(createVector());
        this.acc.set(this.force.div(this.mass)); //a = F/m
        this.k1.set(this.acc.mult(dt)); //k = dt*a

        this.calculateForce(this.k1.copy().mult(0.5));
        this.acc.set(this.force.div(this.mass)); //a = F/m
        this.k2.set(this.acc.mult(dt));

        this.calculateForce(this.k2.copy().mult(0.5));
        this.acc.set(this.force.div(this.mass)); //a = F/m
        this.k3.set(this.acc.mult(dt));
        
        this.calculateForce(this.k3.copy());
        this.acc.set(this.force.div(this.mass)); //a = F/m
        this.k4.set(this.acc.mult(dt));


        //console.log(this.k1, this.k2, this.k3, this.k4);
    }

    rk4NextStep(dt){
        let newVelocity = this.vel.copy().add(this.k1.div(6)).add(this.k2.div(3)).add(this.k3.div(3)).add(this.k4.div(6));
        // Vnew =  V + (k1 + 2k2 + 2k3 + k4 ) / 6
        
        let newPosition = this.pos.copy().add(newVelocity.copy().mult(dt));
        
        this.vel.set(newVelocity);
        this.pos.set(newPosition);
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