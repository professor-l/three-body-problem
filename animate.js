/**
 * Class providing methods to help animate a BodyCollection
 * @typedef {Object} Animator
 * @property {BodyCollection} collection - The collection of bodies
 * @property {CanvasInterface} interface - The interface of the target canvas
 * @property {number} speed - The speed of the animation, default 1
 * @property {boolean} isRunning - Whether or not the animation is running
 * @property {number} frame - The requestAnimationFrame return value (or 0)
 */
class Animator {
    constructor(collection, canvasId) {
        this.collection = collection;
        this.interface = new CanvasInterface(canvasId);

        this.speed = 1;

        this.isRunning = false;
        this.frame = 0;
    }

    /**
     * Get a particular body from the collection
     * @param {number} i - The index of the body to retrieve
     * @returns {Body} The requested body
     */
    body(i) {
        return this.collection.bodies[i];
    }

    /**
     * Updates all numerical values in the simulation
     */
    calculate() {
        for (let i = 0; i < this.speed; i++)
            this.collection.updateSimulation();
    }

    /**
     * Run the entire animation loop, calculation and drawing
     */
    loop() {
        this.calculate();
        this.interface.clear();

        // Draw bodies
        for (let i = 0; i < this.collection.bodies.length; i++)
            this.interface.drawBody(this.body(i));

        // Draw center of mass
        this.interface.drawPosition(
            this.collection.centerOfMass(), 2, "black"
        );

        if (this.isRunning)
            requestAnimationFrame(() => this.loop());
    }

    /**
     * Start the animation
     */
    start() {
        this.frame = requestAnimationFrame(() => this.loop());
        this.isRunning = true;
    }

    /**
     * Stop the animation
     */
    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.frame);
    }

    /**
     * Toggle the animation
     */
    toggle() {
        if (this.isRunning)
            this.stop();
        else
            this.start();
    }

}