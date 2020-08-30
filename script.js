 class CanvasInterface {
     constructor(canvasName="draw") {
         this.canvas = document.getElementById(canvasName);
         this.ctx = this.canvas.getContext("2d");

         this.width = this.canvas.width;
         this.height = this.canvas.height;

         // Origin is intuitive rather than Stupid[TM]
         this.originX = this.width / 2;
         this.originY = this.height / 2;
     }

     clear() {
         this.ctx.clearRect(0, 0, this.width, this.height);
     }

     drawBody(body, color="black") {

        // Translate coordinates to canvas coordiantes
        // Originally assume origin at center
         let x = body.x + this.originX;
         let y = this.originY - body.y;

         console.log("DRAWN: " + x + " " + y);
         
         this.ctx.fillStyle = color;
         this.ctx.beginPath();
         this.ctx.arc(x, y, 10 * body.mass, 0, 2 * Math.PI);
         this.ctx.fill();
     }
 }
 
 class Body {
     constructor(mass, position, momentum) {
         // Float from 0 to 1
         this.mass = mass;

         // Instances of classes
         this.position = position;
         this.momentum = momentum;

         console.log("CREATED: " + position.x + " " + position.y);
     }

     get x() {
         return this.position.x;
     }
     get y() {
         return this.position.y;
     }

     // Adjust this body's vector based on gravitational attraction
     // taken from body passed as argument
     adjustVector(body) {
         let c = this.gravCoeff(body);
         
         let posDiff = this.position.difference(body.position);

         this.momentum.addCoords(c * posDiff.x, c * posDiff.y);
     }

     // Adjust position based on momentum
     adjustPosition() {
         this.position.addVector(this.momentum);
     }

     // Calculate gravity without Newton's pesky big G
     // Smh Isaac, clearly not a developer
     gravCoeff(body) {
         let radius = this.position.distance(body.position);
         console.log("RADIUS: " + radius);
         return (this.mass * body.mass) / (radius * radius) * 0.5;
     }
 }

 class MotionVector {
     constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
     }

     reset() {
         this.x = 0;
         this.y = 0;
     }

     addCoords(x, y) {
         this.x += x;
         this.y += y;
     }

 }

 class Position {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    // Return new position object indicating difference
    // Betwenn this one and the one passed as an argument
    difference(position) {
        return new Position(position.x - this.x, position.y - this.y);
    }

    // Pythagoras my man
    distance(position) {
        let p = this.difference(position);

        return Math.sqrt((p.x * p.x) + (p.y * p.y));
    }

}



// Temporary, for testing

// Add BodyInterface for color/other properties?
// Add color to Body class?
//shrug
let bodies = [];
let colors = [];

function addBody(color="black", mass=1, posx=0, posy=0, momx=0, momy=0) {
    let p = new Position(posx, posy);
    let m = new MotionVector(momx, momy);
    bodies.push(new Body(mass, p, m));
    colors.push(color);
}

 let interface = new CanvasInterface();
 
 addBody("red", 1, -8, 3);
 addBody("blue", 1, 11, -14);
 addBody("green", 1, -32, 19);

 function updateValues() {
     // Calculate updates to vectors
     // Each body influenced by all but itself
     for (let i = 0; i < bodies.length; i++) {
         for (let j = 0; j < bodies.length; j++) {
             if (i == j)
                continue;
             bodies[i].adjustVector(bodies[j]);
         }
     }
     
     // One-time (per loop) update to each body's actual position
     for (let i = 0; i < bodies.length; i++) {
         bodies[i].adjustPosition();
     }
 }

 // Allows parameter for calculations per loop
 // Circumvent setInterval's inherent crappiness
 function loopUpdate(n) {
     for (let i = 0; i < n; i++)
        updateValues();
 }

 let i = setInterval(loopUpdate, 100, 20);

 // Redraw independent for use of animation frames
 function redraw() {
    interface.clear();
    for (let i = 0; i < bodies.length; i++) {
        interface.drawBody(bodies[i], colors[i]);
    }
    requestAnimationFrame(redraw);
}

requestAnimationFrame(redraw);


