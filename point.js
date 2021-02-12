class Point {
    constructor(x,y,r = 10, color)  {
        this.mass = 30; //kg
        this.pos = createVector(x, y);
        this.vel = createVector(0,0); // m per s squared
        this.acc = createVector(0,0); //m per s
        this.radius = r;
        this.c = color;

        //bindings between
        this.k = 2;
        this.b = 2; 
        this.L0 = 0; //spring at rest
        this.neighbors = [];

        //Temporary
        this.positionvalues = []; // Logga värden?

        this.log = false;

        this.oldPosition = this.pos;
        this.force = createVector();
    }

    calculateForce() {
        const Fg = createVector(0,this.mass * 9.82);
        const F = createVector(0.0, 0.0);
        let Fint = this.calculateInternalForce();

        let forceSum = p5.Vector.add(Fint,F);
        forceSum.add(Fg);

        this.force.set(forceSum);
        console.log("netForce x", forceSum.x, " y ", forceSum.y);
    }

    calcRest() {
        const Fg = createVector(0,this.mass * 9.82);
        const F = createVector(0.0, 0.0);
    }

    calcSpringForce(neighbor) {
        // console.log("neighbor pos in calc spring force", neighbor.pos)
        let springForce = createVector();
        let L = p5.Vector.sub(this.pos, neighbor.pos);
        let length = L.mag();
        let normalized = L.normalize();
        let displacement = length - this.L0;

        springForce.x = this.k * displacement*normalized.x;
        springForce.y = this.k * displacement*normalized.y;

        return springForce;        
    }
    
    calculateInternalForce() {
        let sum = createVector();
        // console.log(this.neighbors)
        for(let i = 0; i < this.neighbors.length; i++) {
            //spring force calculations
            let springForce = createVector();
            //p1p2  => p2 - p1 
            let L = p5.Vector.sub(this.pos, this.neighbors[i].pos);
            let length = L.mag();

            if(length <= 0.000001) { //potential bug, check for epsilon
                springForce.mult(0); // => force = [0;0]
            }
            else {
                let normalized = L.normalize();
                
                let displacement = length - this.L0;

                springForce.x = this.k * displacement*normalized.x;
                springForce.y = this.k * displacement*normalized.y;
            }
            sum.add(springForce);
            this.log ? console.log("springForce: i", i, springForce) : 0;
            // console.log("springForce: i", i, " x ", springForce.x, " y ", springForce.y);

            //damping forces calc
            let dampForce = p5.Vector.sub(this.vel, this.neighbors[i].vel);
            dampForce.mult(this.b);
            // console.log("damping force i", i, " x ", dampForce.x, " y ", dampForce.y);
            
            sum.add(dampForce);
        }
        //let dampForce = this.vel.copy();
        this.log ? console.log("dampForce: i", i, dampForce) : 0;



        sum.mult(-1);
        this.log ? console.log("summa : ", sum) : 0 ;
        //console.log("total sum: ", sum);
        return sum;
    }

    addNeighbors(points) {
        for(let i = 0; i < points.length; i++) {
            this.neighbors.push(points[i]);
        }
    }

    eulerIntegration(x, xDerivate){
        const h = 0.1;
        //timestep h = 1 frame?
        xDerivate.mult(h);
        let y = x.add(xDerivate); //h??
        return y;
    }
    calcForce () {

    }
    update() {

        /* This will be calculated in the main
        this.acc.x = 1/this.mass * forceSum.x;
        this.acc.y = 1/this.mass * forceSum.y;

        let h = 0.28;
        this.acc.mult(h);
        this.vel.add(this.acc); //this.vel = this.vel + this.acc*h
        
        this.vel.mult(h); //ÄKTA PRIMA VARA<3 EULER
        this.pos.add(this.vel);

        */
        //this.vel = this.eulerIntegration(this.vel, this.acc);
        //this.pos = this.eulerIntegration(this.pos, this.vel);
        //this.positionvalues.add([this.pos.x, this.pos.y]); // Logga värden?
        if(this.log) {
        console.log("acceleration: ", this.acc);
        console.log("velocity: ", this.vel);
        console.log("position: ", this.pos);
        }


        this.render();
    }

    drawLine(p2) {
        line(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y);
    }
    
    render() {
        fill(this.c);
        for(let n in this.neighbors) {
            this.drawLine(this.neighbors[n]);
        }
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