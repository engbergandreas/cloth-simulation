class Cloth {
    constructor(_rows, _cols, _x, _y, _z, _spacing) {
        this.matrix = [];
        this.rows = _rows;
        this.cols = _cols;
        this.spacing = _spacing;
        this.x = _x;
        this.y = _y;
        this.z = _z;
        
        //setup cloth grid, x,y starting point of grid, distance spacing between points
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            matrix[r] = []; //create nested array
            for(let c = 0; c < this.cols; c++) {
                //2 dimensional plane with ability to move in z direction, => z = 0
                matrix[r][c] = new Point(c * this.spacing + this.x, r * this.spacing + this.y, 0, color('black'));
            }   
        }
        this.connectNeighbors();
        this.setStaticPoints();
    }

    setStaticPoints(){
        matrix[0][0].static = true; //top left 
        //matrix[0][this.cols-1].static = true; //top right
        matrix[this.rows-1][0].static = true; //bottom left
        //matrix[this.rows-1][this.cols-1].static = true; //bottom right
        //lock top row
        // for(let c = 0; c < this.cols; c++) {
        //     matrix[0][c].static = true;
        // }

        for(let r = 0; r < this.rows; r++) {
            matrix[r][0].static = true;
        }
    }

    updateCloth() {
        this.calculateForce();
        this.stepForward();
        
        if(RENDERTEXTURE) 
            this.renderTexture();
        
        if(RENDERSPRINGS || RENDERFLEXSPRINGS || RENDERPOINTS)
            this.renderCloth();
    }
    
    calculateForce() {
        //Calculate all forces for the points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c].updateValues();
                // matrix[r][c].calculateForce();
                matrix[r][c].rk4Integration(TIMESTEP);
            }
        }
    }

    stepForward() {
        //Calculate the next step for all points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                // matrix[r][c].calculateNextStep();
                matrix[r][c].rk4NextStep(TIMESTEP);
            }
        }
    }

    renderCloth() {
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {

                if(RENDERSPRINGS) {
                    //draw spring lines between particles
                    if(r != 0 && c != this.cols -1) {
                        matrix[r][c].drawLine(matrix[r-1][c+1]); //diagonal upwards right
                    }
                    if(r != this.rows - 1 && c != this.cols - 1) {
                        matrix[r][c].drawLine(matrix[r+1][c+1]); //diagonal downwards right
                    }
                    if(r != this.rows-1) {
                        matrix[r][c].drawLine(matrix[r+1][c]); //downwards
                    }
                    if(c != this.cols -1) {
                        matrix[r][c].drawLine(matrix[r][c+1]); //right
                    }
                 }
                
                //renders flexion springs
                if(RENDERFLEXSPRINGS) {
                    if(r+2 < this.rows) {
                        matrix[r][c].drawLine(matrix[r+2][c], "red"); //right
                    }
                    if(c+2 < this.cols) {
                        matrix[r][c].drawLine(matrix[r][c+2], "red"); //right
                    }
                }
                //render points 
                if(RENDERPOINTS)
                    matrix[r][c].render();
            }
        }        
    }

    renderTexture() {
        push()
        for(let r = 0; r < this.rows-1; r++) {
            beginShape(TRIANGLE_STRIP);
            texture(flagimg);
            for(let c = 0; c < this.cols; c++) {
                let x1 = matrix[r][c].pos.x;
                let y1 = matrix[r][c].pos.y;
                let z1 = matrix[r][c].pos.z;
                let u = map(r, 0, this.rows-1, 0,1);
                let v = map(c, 0, this.cols-1, 0,1);
                //let w = map(c, 0, this.cols-1, 0,1);
                vertex(x1,y1,z1,v,u);
                
                let x2 = matrix[r+1][c].pos.x;
                let y2 = matrix[r+1][c].pos.y;
                let z2 = matrix[r+1][c].pos.z;
                let u2 = map(r+1,0,this.rows-1, 0,1);
                vertex(x2,y2,z2,v,u2);
            }
            endShape();
        }
        pop();
    }

    connectNeighbors() {
        this.connectStructuralNeighbors();
        this.connectShearNeighbors();
        this.connectFlexionNeighbors();
    }

    connectStructuralNeighbors() {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = {points: [], typeOfSpring : []};
                if(r-1 >= 0) {
                    neighbors.points.push(matrix[r-1][c]); //1 up
                    neighbors.typeOfSpring.push("structural");
                }
                if(r+1 < this.rows) {
                    neighbors.points.push(matrix[r+1][c]); //1 down
                    neighbors.typeOfSpring.push("structural");
                }
                if(c-1 >= 0) { 
                    neighbors.points.push(matrix[r][c-1]); //1 left
                    neighbors.typeOfSpring.push("structural");
                }
                if(c+1 < this.cols) {
                    neighbors.points.push(matrix[r][c+1]) //1 right
                    neighbors.typeOfSpring.push("structural");
                }
                matrix[r][c].addNeighbors(neighbors);
                nrSprings += neighbors.points.length;
            }
        }
    }

    connectShearNeighbors() {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = {points: [], typeOfSpring : []};
                if(r-1 >= 0 && c-1 >= 0) {
                    neighbors.points.push(matrix[r-1][c-1]); //1 up left diagonal
                    neighbors.typeOfSpring.push("shear");
                }
                if(r-1 >= 0 && c+1 < this.cols) {
                    neighbors.points.push(matrix[r-1][c+1]); //1 up right diagonal
                    neighbors.typeOfSpring.push("shear");
                }
                if(r+1 < this.rows && c-1 >= 0) { 
                    neighbors.points.push(matrix[r+1][c-1]); //1 down left diagonal
                    neighbors.typeOfSpring.push("shear");
                }
                if(r+1 < this.rows && c+1 < this.cols) {
                    neighbors.points.push(matrix[r+1][c+1]) //1 down right diagonal
                    neighbors.typeOfSpring.push("shear");
                }
                matrix[r][c].addNeighbors(neighbors);
                nrSprings += neighbors.points.length;
            }
        }
    }

    connectFlexionNeighbors(){
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = {points: [], typeOfSpring : []};

                if(r-2 >= 0) { 
                    neighbors.points.push(matrix[r-2][c]); //2 up
                    neighbors.typeOfSpring.push("flexion");
                }
                if(r+2 < this.rows) {
                    neighbors.points.push(matrix[r+2][c]); //2 down
                    neighbors.typeOfSpring.push("flexion");
                }
                if(c-2 >= 0) { 
                    neighbors.points.push(matrix[r][c-2]); //2 left
                    neighbors.typeOfSpring.push("flexion");
                }
                if(c+2 < this.cols) {
                    neighbors.points.push(matrix[r][c+2]) //2 right
                    neighbors.typeOfSpring.push("flexion");
                }
                matrix[r][c].addNeighbors(neighbors);
                nrSprings += neighbors.points.length;
            }
       }
    }
}