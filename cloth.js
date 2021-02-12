class Cloth {
    constructor(_rows, _cols, _x, _y, _distance) {
        this.matrix = [];
        this.rows = _rows;
        this.cols = _cols;
        this.distance = _distance;
        this.x = _x;
        this.y = _y;
        
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            matrix[r] = []; //create nested array
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c] = new Point(c * this.distance + this.x, r * this.distance + this.y, 5, color('black'));
            }   
        }
        this.connectNeighbors();
        //this.connectFlexionNeighbors();
        this.checkStaticPoints();
    }

    checkStaticPoints(){
        matrix[0][0].static = true;
        matrix[0][this.cols-1].static = true;

        // for(let c = 0; c < this.cols; c++) {
        //     matrix[0][c].static = true;
        // }
    }

    updateCloth() {
        //Calculate all forces for the points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c].calculateForce();
            }
        }
        //Calculate the next step for all points in cloth
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                matrix[r][c].calculateNextStep();
            }
        }
        this.renderCloth();
    }

    renderCloth() {
        //access index[row][col]
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
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
            }
        }        
    }

    connectNeighbors() {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = [];
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
                            neighbors.push(matrix[i][j]);
                        }
                    }
                }
                matrix[r][c].addNeighbors(neighbors);
            }
        }
    }


    connectFlexionNeighbors(){
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                let neighbors = [];

                if(r-2 > 0)
                    neighbors.push(matrix[r-2][c]); //2 up
                if(r+2 < this.rows)
                    neighbors.push(matrix[r+2][c]); //2 down
                if(c-2 > 0) 
                    neighbors.push(matrix[r][c-2]); //2 left
                if(c+2 < this.cols)
                    neighbors.push(matrix[r][c+2]) //2 right

                matrix[r][c].addNeighbors(neighbors);
            }
       }
    }
}