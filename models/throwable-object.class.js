class ThrowableObject extends MovableObject {
    width = 40;
    height = 70;
    offsetTop = 15;
    offsetRight = 10;
    offsetBottom = 15;
    offsetLeft = 10;

    IMAGES_ROTATE = IMAGES_PATHS.throwableObject.IMAGES_ROTATE;

    IMAGES_SPLASH = IMAGES_PATHS.throwableObject.IMAGES_SPLASH;

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

    throw() {
        let id = setInterval(() => {
            this.x += 10 + this.speed;
            if (this.isDead()) {
                deleteIntervalsByClassName('throwableObject');
                world.throwableObjects = [];
            }
        }, intervalValues.throwableObjects.moves);
        this.registerInterval(id, 'moves')
    }

    animate() {
        let id = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATE);
            }
        });
        this.registerInterval(id, 'animations');
    }
}