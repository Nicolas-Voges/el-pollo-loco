class BackgroungObject extends MovableObject {
    width = 720;
    height = 480;
    speed;

    /**
     * This first called function calls the consructor function of moveable object class and calls its load image function.
     * Also this function sets the background position and speed.
     * 
     * @param {string} imagePath 
     * @param {number} x 
     * @param {number} speed 
     */
    constructor(imagePath, x, speed) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
        this.speed = speed;
    }
}