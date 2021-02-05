class Point {
    constructor(x,y,r = 20) {
        this.mass = 2;
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.radius = r;

        //bindings between
        this.k = 0.1;
        this.b = 1;
        this.L0 = createVector(0, ); //spring at rest
        this.neighbors = [];

        //Temporary
        this.positionvalues = []; // Logga värden?
    }

    calculateInternalForce() {
        let sum = createVector();
        for(let i = 0; i < this.neighbors.length; i++) {
            //spring force calculations
            let springForce = createVector();
            //p1p2  => p2 - p1 
            let L = p5.Vector.sub(this.neighbors[i].pos, this.pos);
            if(L.x == 0 && L.y == 0) { //potential bug, check for epsilon
                springForce.mult(0); // => force = [0;0]
            }
            else {
                let dist = p5.Vector.sub(abs(L),this.L0); // Måste göra p5.vector
                let normalized = L.normalize();
                springForce.x = this.k*dist.x*normalized.x;
                springForce.y = this.k*dist.y*normalized.y;
            }
            sum.add(springForce);
            //console.log("springForce: i", i, springForce);
            //force.add(this.k * (L.sub(this.L0)) * L / L.mag());

            //damping forces calc
            let dampForce = p5.Vector.sub(this.vel, this.neighbors[i].vel);
            dampForce.mult(this.b);
            //console.log("dampForce: i", i, dampForce);

            sum.add(dampForce);
        }
        //return -force ? 
        //console.log("summa : ", sum)
        sum.mult(-1);
        return sum;
    }

    addNeighbors(points) {
        for(let i = 0; i < points.length; i++) {
            this.neighbors.push(points[i]);
        }
    }

    eulerIntegration(x, dx){
        const h = 0.05;
        //timestep h = 1 frame?
        dx.mult(h);
        let y = x.add(dx); //h??
        return y;
    }
    calcForce () {

    }
    update() {
        this.render();
        this.acc.set(1/this.mass,1/this.mass); 
        let Fint = this.calculateInternalForce();
        //Fint.mult(0);
        const Fg = createVector(0,this.mass * 9.82);
        const F = createVector(0.0, 0.0);
        //a1(:,t + 1) = 1 / m * (-Fint(:,1) + F + Fg);
        let forceSum = p5.Vector.add(Fint,F);
        forceSum.add(Fg);
        //console.log("forcex: x", forceSum.x);
        //console.log("forcex: y", forceSum.y);
        //console.log("force sum", forceSum);

        this.acc.x = forceSum.x;
        this.acc.y = forceSum.y;

        this.vel = this.eulerIntegration(this.vel, this.acc);
        this.pos = this.eulerIntegration(this.pos, this.vel);

        //this.positionvalues.add([this.pos.x, this.pos.y]); // Logga värden?
        
        //console.log("position: ", this.pos);
        //console.log("velocity: ", this.pos);

    }

    drawLine(p2) {
        line(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y);
    }
    
    render() {
        fill(1);
        ellipse(this.pos.x, this.pos.y, this.radius);
    }
}