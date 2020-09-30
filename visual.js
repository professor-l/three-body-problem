/**
 * Class providing an interface for drawing bodies/animations on a canvas
 * @typedef {Object} CanvasInterface
 * @property {Element} canvas - The canvas as a DOM element
 * @property {CanvasRenderingContext2D} ctx - The rendering context of the canvas
 * @property {number} width - The width of the canvas
 * @property {number} height - The height of the canvas
 */
class CanvasInterface {
    constructor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Origin is intuitive rather than Stupid[TM]
        this.originX = this.width / 2;
        this.originY = this.height / 2;
    }

    /**
     * Clears the canvas
     */
    async clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Draw a circle
     * @param {number} x - The x value of the coordinate
     * @param {number} y  - The y value of the coordinate
     * @param {number} radius - The radius in pixels of the circle
     * @param {string} color - The color to draw the circle
     */
    async drawCoords(x, y, radius, color) {
        // Translate coordinates to canvas coordiantes
        // Originally assume origin at center
        x += this.originX;
        y = this.originY - y;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * Draw a line
     * @param {number} x1 - The x value of the starting coordinate
     * @param {number} y1 - The y value of the starting coordinate
     * @param {number} x2 - The x value of the ending coordinate
     * @param {number} y2 - The y value of the ending coordinate
     * @param {string} color - The color to draw the line
     * @param {number} width - The width of the line in pixels
     */
    async drawLine(x1, y1, x2, y2, color, width) {
        // Again, translate coordinates accounting for center origin
        x1 += this.originX;
        y1 = this.originY - y1;
        x2 += this.originX;
        y2 = this.originY - y2;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    /**
     * Connect two coordinates with a line
     * @param {number[]} c1 - The first coordinate [x, y]
     * @param {number[]} c2 - The second coordinate [x, y]
     * @param {string} color - The color of the line
     */
    async connectCoordinates(c1, c2, color) {
        await this.drawLine(c1[0], c1[1], c2[0], c2[1], color);
    }

    /**
     * Connect two Position objects
     * @param {Position} pos1 - The first position
     * @param {Position} pos2 - The second position
     * @param {string} color - The color of the line
     */
    async connectPositions(pos1, pos2, color) {
        await this.drawLine([pos1.x, pos1.y], [pos2.x, pos2.y], color);
    }

    /**
     * 
     * @param {Position} position - The position to draw a circle at
     * @param {number} radius - The radius of the circle
     * @param {string} color - The color to draw the circle
     */
    async drawPosition(position, radius, color) {
        await this.drawCoords(position.x, position.y, radius, color);
    }

    /**
     * Draws the trail of motion of a body
     * @param {Body} body - The body to draw the trail of
     */
    async drawBodyTrail(body) {
        if (!body.trail.length)
            return;
        
        let x = body.x + this.originX;
        let y = this.originY - body.y;

        this.ctx.strokeStyle = body.color;
        this.ctx.lineWidth = body.trailThickness;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        for (let i = body.trail.length - 1; i >= 0; i--) {
            this.ctx.lineTo(
                body.trail[i][0] + this.originX,
                this.originY - body.trail[i][1]
            );
        }

        this.ctx.stroke();
    }
 
    /**
     * Draws a body on the canvas
     * @param {Body} body - The body to draw
     */
    async drawBody(body) {
        await this.drawCoords(
            body.x,
            body.y,
            body.radius,
            body.color
        );
        
        await this.drawBodyTrail(body);
    }
}