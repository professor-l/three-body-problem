/**
 * Class representing a gravitationally interacting "body" in space
 * @typedef {Object} Body
 * @property {number} mass - A value in (0, 1] representing the body's mass
 * @property {Position} position - The body's position in space
 * @property {MotionVector} momentum - The body's momentumin space
 * @property {number} trailLength - The number of previous positions stored
 * @property {number[][]} trail - The body's previous positions as a 2d array
 * 
 * @property {string} color - The CSS-permissible color of the body
 * @property {number} trailThickness - The thickness of the trail in pixels
 */
class Body {
    static colorOptions = [
        "#ffffff",  // White
        "#f44336",  // Red
        "#E91E63",  // Pink
        "#9C27B0",  // Purple
        "#673AB7",  // Deep Purple
        "#3F51B5",  // Indigo
        "#2196F3",  // Blue
        "#00BCD4",  // Cyan
        "#009688",  // Teal
        "#4CAF50",  // Green
        "#CDDC39",  // Lime
        "#FFEB3B",  // Yellow
        "#FFC107",  // Amber
        "#FF9800",  // Orange
        "#FF5722",  // Deep Orange
    ];
    
    /**
     * 
     * @param {number} mass - The body's mass, some float in (0, 1]
     * @param {Position} position - The body's position in space
     * @param {MotionVector} momentum - The body's momentum in space
     */
    constructor(mass, position, momentum) {
        this.mass = mass;
        this.position = position;
        this.momentum = momentum;

        this.trailLength = 0;
        this.trail = [];

        // Visual properties
        this.colorIndex = 0;
        this.trailThickness = 2;

        this.setRandomColor();
    }

    /**
     * @returns {number} - The body's position in the x dimension
     */
    get x() {
        return this.position.x;
    }
    /**
     * @returns {number} - The body's position in the y direction
     */
    get y() {
        return this.position.y;
    }
    /**
     * @returns {number} - The body's radius in pixels
     */
    get radius() {
        return this.mass * 10;
    }
    get color() {
        return Body.colorOptions[this.colorIndex];
    }

    /**
     * 
     * @param {number} n - The desired length of the trail 
     */
    setTrailLength(n) {
        if (n < 0 || n > 100000)
            throw new Error("Invalid trail length");

        this.trailLength = n;
    }

    /**
     * Alter this body's momentum based on the gravitaional attraction of 
     * another body using Newton's equation, the product of two bodies' masses
     * divided by the square of the distance between them.
     * @param {Body} body - The body influencing this one
     */
    async adjustVector(body) {
        let c = await this.gravCoeff(body);

        let posDiff = await this.position.difference(body.position);

        await this.momentum.addCoords(c * posDiff.x, c * posDiff.y);
    }

    /**
     * Alter this body's position based on its momentum, updating
     * the trail array if necessary
     */
    async adjustPosition() {
        if (this.trailLength != 0 && this.trailLength >= this.trail.length)
            this.trail.push(this.position.exportCoordinates());
        
        if (this.trail.length > this.trailLength)
            this.trail.splice(0, this.trail.length - this.trailLength);
            
        await this.position.addVector(this.momentum);
    }

    /**
     * Calculates the strength of the gravitational attraction of this body to
     * another, a value that is used as a coefficient for subsequent alterations
     * to motion vector components (coefficients distribute)
     * @param {Body} body - The body to which the gravitational attraction is calculated
     * @returns {number} The strength of the gravitational attraction
     */
    async gravCoeff(body) {
        let radius = await this.position.distance(body.position);
        return (this.mass * body.mass) / (radius * radius) * 0.5;
    }



    // VISUAL METHODS
    
    /**
     * Sets color of body to a random color from the options
     * @returns {number} The index of the color in the options list
     */
    setRandomColor() {
        this.colorIndex = Math.floor(Math.random() * Body.colorOptions.length);
        this.colorIndex;
    }

    /**
     * Sets color of body to the specified index
     * @param {number} i - The index of the color selected 
     * @returns {number} The index of the color in the options list    
     */
    setColor(i) {
        if (i < 0 || i >= Body.colorOptions.length)
            throw new Error("Invalid color index");
        this.colorIndex = i;
        return i;
    }

    /**
     * Sets the trail thickness of the body
     * @param {number} pixels - The new thickness, in pixels
     * @returns {number} The thickness, in pixels, of the body
     */
    setTrailThickness(pixels) {
        if (pixels <= 0 || pixels > this.radius)
            throw new Error("Invalid trail thickness");

        this.trailThickness = pixels;
        return this.trailThickness;
    }



    /**
     * A short informative string for logging
     */
    get string() {
        let p = "  Position: " + this.position.string;
        let m = "  Motion vector: " + this.momentum.string;
        return "BODY SNAPSHOT\n" + p + "\n" + m + "\n";
    }

    /**
     * Logs the position of the body in space
     */
    logPosition() {
        console.log("Position snapshot: " + this.position.string);
    }

    /**
     * Logs the momentum of the body in space
     */
    logMomentum() {
        console.log("Momentum snapshot: " + this.momentum.string);
    }
}

/**
 * Class representing a collection of bodies that interact with one another
 * @typedef {Object} BodyCollection 
 * @property {Body[]=[]} bodies - An array of the bodies in the collection
 */
class BodyCollection {

    static MAX_BODIES = 10;

    constructor(bodies=[]) {
        this.bodies = bodies;
    }

    /**
     * Calculates the center of mass of the body collection
     * @returns {Position} The center of mass
     */
    centerOfMass() {
        let xComp = 0;
        let yComp = 0;
        let mass = 0;

        for (let i = 0; i < this.bodies.length; i++) {
            let b = this.bodies[i];
            xComp += (b.x * b.mass);
            yComp += (b.y * b.mass);
            mass += b.mass;
        }

        return new Position(xComp / mass, yComp / mass);
    }

    /**
     * Adds a body to the collection with no momentum and mass 1
     * @param {number} posx - The x position of the body
     * @param {number} posy - The y position of the body
     * @returns {Body} The Body object that was added to the collection
     */
    addBody(posx=0, posy=0) {
        return this.addBodyCustom(1, posx, posy, 0, 0);
    }

    /**
     * Adds a body to the collection with all custom properties
     * @param {number} mass - The mass of the body 
     * @param {number} posx - The x position of the body
     * @param {number} posy - The y position of the body
     * @param {number} momx - The x component of the body's momentum
     * @param {number} momy - The y component of the body's momentum
     * @returns {Body} The body object that was added to the collection
     */
    addBodyCustom(mass, posx, posy, momx, momy) {
        if (this.bodies.length >= BodyCollection.MAX_BODIES) {
            throw new Error("Body count limit reached.");
        }

        let p = new Position(posx, posy);
        let m = new MotionVector(momx, momy);

        let b = new Body(mass, p, m);
        this.bodies.push(b);
        return b;
    }

    /**
     * Remove a body from this collection
     * @param {number} index - The index of the body in this.bodies
     * @returns {Body} The body that was removed
     */
    removeBody(index) {
        return this.bodies.splice(index, 1)[0];
    }
    
    /**
     * Updates the motion vectors of all bodies in the collection
     * by calculating each of their influences on all the others
     * at a static point in time
     */
    async updateVectors() {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = 0; j < this.bodies.length; j++) {
                if (i == j)
                    continue;
                await this.bodies[i].adjustVector(this.bodies[j]);
            }
        }
    }

    /**
     * Updates the positions of all the bodies based on their
     * current momentum vectors.
     */
    async updatePositions() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].adjustPosition();
        }
    }

    /**
     * Updates the entire simulation, consecutively rather
     * than concurrently to avoid miscalculations
     */
    async updateSimulation() {
        await this.updateVectors();
        await this.updatePositions();
    }

    /**
     * Logs the momentums of each body to the console
     */
    logMomentums() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].logMomentum(i);
        }
    }

    /**
     * Logs the positions of each body to the console
     */
    logPositions() {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].logPosition(i);
        }
    }

    /**
     * Logs full information, both position and momentum,
     * on all bodies in the collection, as well as the
     * collection's center of mass, to the console
     */
    log() {
        console.log("CENTER OF MASS: " + this.centerOfMass().string);
        console.log("\nBODIES: ");
        for (let i = 0; i < this.bodies.length; i++) {
            console.log(this.bodies[i].string);
        }
    }

}