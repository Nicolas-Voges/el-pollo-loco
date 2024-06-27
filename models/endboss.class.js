class Endboss extends MovableObject {
    x = 5000;
    y = 235;
    ground = 235;
    width = 200;
    height = 200;
    offsetTop = 50;
    offsetRight = 30;
    offsetBottom = 40;
    offsetLeft = 30;
    directionX = 'Stay';
    energy = 50;
    energyAttack = 50;
    speed = 4;
    isAlert = false;
    isAttacking = false;
    attackIsDone = false;
    IMAGES_WALKING = IMAGES_PATHS.endboss.IMAGES_WALKING;
    IMAGES_ALERT = IMAGES_PATHS.endboss.IMAGES_ALERT;
    IMAGES_ATTACK = IMAGES_PATHS.endboss.IMAGES_ATTACK;
    IMAGES_HURT = IMAGES_PATHS.endboss.IMAGES_HURT;
    IMAGES_DEAD = IMAGES_PATHS.endboss.IMAGES_DEAD;

    /**
     * This first called function calls the constructor function of moveable object class and load images.
     * Also makes the boss animated and moving. 
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.move();
    }

    /**
     * This function animates the chick in an interval and registers it.
     */
    animate() {
        if (this.intervals.animations.length === 0) {
            let intervalEndbossAnimate = setInterval(() => {
                this.checkConditions();
            }, 200);
            this.registerInterval(intervalEndbossAnimate, 'animations');
        }
    }

    /**
     * This function checks endboss conditions and chooses images to play.
     */
    checkConditions() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAlert) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * This function makes endboss moving in an interval and registers the interval.
     */
    move() {
        if (this.intervals.moves.length === 0) {
            let intervalEndbossMove = setInterval(() => {
                this.checkDirection();
            }, 1000 / 60);
            this.registerInterval(intervalEndbossMove, 'moves');
        }
    }

    /**
     * This function checks the direktion to move to and changes boolean otherDirection.
     */
    checkDirection() {
        if (this.directionX === 'Right') {
            this.moveRight();
            this.otherDirection = true;
        }
        if (this.directionX === 'Left') {
            this.moveLeft();
            this.otherDirection = false;
        }
    }
}