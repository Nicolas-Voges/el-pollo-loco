class Chicken extends Enemy {
    height = 50;
    width = 50;
    y = 380;
    offsetTop = 1;
    offsetRight = 1;
    offsetBottom = 4;
    offsetLeft = 2;
    energy = 10;
    energyAttack = 10;
    speed = 0.15 + Math.random() * 0.5;
    IMAGES_WALKING = IMAGES_PATHS.chicken.IMAGES_WALKING;
    IMAGES_DEAD = IMAGES_PATHS.chicken.IMAGES_DEAD;

    /**
     * This first called function calls the constructor function of enemy class and hands over the number for enemy positioin.
     * Also loads images and makes the chick animated and moving.
     * 
     * @param {number} x 
     */
    constructor(x) {
        super(x).loadImage(this.IMAGES_WALKING[1]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.move();
        this.animate();
    }

    /**
     * This function moves the chick in an interval and registers it.
     * Also respawn an enemy that reached level start.
     */
    move() {
        let id = setInterval(() => {
        // console.log('chicken move');
            if (!this.isDead()) {
                this.moveLeft();
                if (this.x + this.width <= 0) {
                    this.x = 5000;
                }
            }
        }, intervalValues.enemies.moves);
        this.registerInterval(id, 'moves');
    }

    /**
     * This function animates the chick in an interval and registers it.
     */
    animate() {
        let id = setInterval(() => {
        // console.log('chicken animate');
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, intervalValues.enemies.animations);
        this.registerInterval(id, 'animations');
    }
}