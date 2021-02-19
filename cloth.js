class Cloth {
    constructor(_rows, _cols, _x, _y, _spacing) {
        this.matrix = [];
        this.rows = _rows;
        this.cols = _cols;
        this.spacing = _spacing;
        this.x = _x;
        this.y = _y;
        
        //setup cloth grid, x,y starting point of grid, distance spacing between points
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            matrix[r] = []; //create nested array
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c] = new Point(c * this.spacing + this.x, r * this.spacing + this.y, 5, color('black'));
            }   
        }
        this.connect8Neighbors();
        this.connectFlexionNeighbors();
        this.setStaticPoints();
    }

    setStaticPoints(){
        matrix[0][0].static = true; //top left 
        matrix[0][this.cols-1].static = true; //top right
        //matrix[this.rows-1][0].static = true; //bottom left
        //matrix[this.rows-1][this.cols-1].static = true; //bottom right

        for(let c = 0; c < this.cols; c++) {
            matrix[0][c].static = true;
        }
    }

    updateCloth() {
        this.calculateForce();
        this.stepForward();
        this.renderCloth();
    }

    calculateForce() {
        //Calculate all forces for the points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c].calculateForce();
            }
        }
    }

    stepForward() {
        //Calculate the next step for all points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c].calculateNextStep();
            }
        }
    }

    renderCloth() {
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                if(RENDERPOINTS)
                    matrix[r][c].render();
                
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
                
                if(RENDERFLEX) {
                    if(r+2 < this.rows) {
                        matrix[r][c].drawLine(matrix[r+2][c], "red"); //right
                    }
                    if(c+2 < this.cols) {
                        matrix[r][c].drawLine(matrix[r][c+2], "red"); //right
                    }
                }
            }
        }        
    }

    connect8Neighbors() {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = {points: [], typeOfSpring : []};
                //console.log("row", r, "col", c);
                for(let i = r - 1; i <= r + 1; i++) {
                    for(let j = c - 1; j <= c + 1; j++) {
                        //console.log("i", i, "j", j);					
                        //Check edge
                        if(i < 0 || i > this.rows - 1) {
                            //console.log("continues rows");
                        }
                        else if(j < 0 || j > this.cols - 1)
                        {
                            //console.log("continues cols");
                        }
                        //Check for self
                        else if (i == r && j == c) {
                            //console.log("continues self");
                        }
                        //Else add neighbor
                        else {
                            //console.log("pushing"); 
                            neighbors.points.push(matrix[i][j]);
                            neighbors.typeOfSpring.push("structural");
                        }
                    }
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

                if(r-2 > 0) { 
                    neighbors.points.push(matrix[r-2][c]); //2 up
                    neighbors.typeOfSpring.push("flexion");
                }
                if(r+2 < this.rows) {
                    neighbors.points.push(matrix[r+2][c]); //2 down
                    neighbors.typeOfSpring.push("flexion");
                }
                if(c-2 > 0) { 
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