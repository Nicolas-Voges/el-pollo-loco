class Cloud extends MovableObject {
    width = 500;
    height = 200;
    y = 20 + Math.random() * 100;

    /**
     * This first called function chooses a random image path and calls the constructor function of moveable object class.
     * Also loads the image and makes a random position for the cloud.
     * After that this function sets a random speed and animates the cloud.
     * 
     * @param {number} x 
     */
    constructor(x) {
        let path = Math.round(Math.random() * 1);
        super().loadImage(IMAGES_PATHS.backgrounds.clouds[`${path}`]);
        this.x = x + Math.random() * 500;
        this.speed = 0.01 + Math.round(Math.random() * 1);
        this.speed /= 4;
        this.animate();
    }

    /**
     * This function animates the chick in an interval and registers it.
     */
    animate() {
        let intervalCloudMove = setInterval(() => {
            this.moveLeft();
            if (this.x + this.width <= -500) {
                this.x = 5000;
            }
        }, 1000 / 200);
        this.registerInterval(intervalCloudMove, 'moves');
    }
}