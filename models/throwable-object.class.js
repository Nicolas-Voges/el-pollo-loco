class ThrowableObject extends MovableObject {
    width = 40;
    height = 70;
    offsetTop = 15;
    offsetRight = 10;
    offsetBottom = 15;
    offsetLeft = 10;
    IMAGES_ROTATE = IMAGES_PATHS.throwableObject.IMAGES_ROTATE;
    IMAGES_SPLASH = IMAGES_PATHS.throwableObject.IMAGES_SPLASH;

    /**
     * This first called function calls the constructor function of movable object class and loads images.
     * Also sets the position and speed values and makes a bottle moving and animated.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     */
    constructor(x, y, speed) {
        super().loadImage(this.IMAGES_ROTATE[0]);
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.throw();
        this.applyGravity(intervalValues.throwableObjects.gravity);
        this.animate();
        this.speedY = 15;
    }

    /**
     * This function moves the bottle in an interval and registers it.
     */
    throw() {
        let id = setInterval(() => {
                // console.log('throwabel throw');
            this.x += 10 + this.speed;
            if (this.isDead()) {
                clearInterval(id);
                activeIntervals.splice(activeIntervals.indexOf(id), 1);
                world.throwableObjects = [];
            }
        }, intervalValues.throwableObjects.moves);
        this.registerInterval(id, 'moves')
    }

    /**
     * This function animates the bottle in an interval and registers it.
     */
    animate() {
        let id = setInterval(() => {
                // console.log('throwabel animate');
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATE);
            }
        });
        this.registerInterval(id, 'animations');
    }
}