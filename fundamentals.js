/** 
 * Class representing a position in the x/y plane 
 * @typedef {Object} Position
 * @property {number} x - The x value
 * @property {number} y - The y value
*/
class Position {
    /**
     * Create a Position
     * @param {number} [x=0] - The x value
     * @param {number} [y=0] - The y value
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adjust this position based on a motion vector
     * @param {MotionVector} vector - The vector being used to adjust this position
     */
    async addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    /**
     * 
     * @param {Position} position - The position from which to calculate
     * @returns {Position} A position representing the difference between the two
     * @example
     * let a = Position(-5, 7);
     * let b = Position(2, 3);
     * // returns new Position(7, -4)
     * a.difference(b);
     */
    async difference(position) {
        return new Position(position.x - this.x, position.y - this.y);
    }

    /**
     * Calculate the distance between two {@link Position} objects.
     * @param {Position} position - Position from which to calculate
     * @returns {number} The distance between the positions
     * @example
     * let a = Position(0, 0);
     * let b = Position(12, 5);
     * // Both return 13
     * a.distance(b);
     * b.distance(a);
     */
    async distance(position) {
        let p = await this.difference(position);

        return Math.sqrt((p.x * p.x) + (p.y * p.y));
    }

    exportCoordinates() {
        return [this.x, this.y];
    }

    /**
     * @returns A string of the form "[ x, y ]" for logging
     */
    get string() {
        return "[ " + this.x + ", " + this.y + " ]";
    }

}

/**
 * Class respresenting a motion vector
 * @typedef {Object} MotionVector
 * @property {number} x - The x component
 * @property {number} y - The y component
 */
class MotionVector {

    /**
     * Create a MotionVector
     * @param {number} [x=0] - The x component of the vector
     * @param {number} [y=0] - The y component of the vector
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Reset this MotionVector to [ 0, 0 ]
     */
    async reset() {
        this.x = 0;
        this.y = 0;
    }

    /**
     * Adds the (x, y) values passed to their constituent components
     * @param {number} x - Value to add to x component
     * @param {number} y - Value to add to y component
     */
    async addCoords(x, y) {
        this.x += x;
        this.y += y;
    }

    /**
     * @returns A string of the form "[ x, y ]" for logging
     */
    get string() {
        return "[ " + this.x + ", " + this.y + " ]";
    }

}