class Chick extends Enemy {
    height = 50;
    width = 50;
    y = 380;
    offsetTop = 10;
    offsetRight = 10;
    offsetBottom = 10;
    offsetLeft = 10;
    energy = 5;
    energyAttack = 5;
    speed = 0.15 + Math.random() * 0.5;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

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
        this.animate();
        this.move();
    }

    /**
     * This function moves the chick in an interval and registers it.
     * Also respawn an enemy that reached level start.
     */
    move() {
        let id = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                if (this.x + this.width <= 0) {
                    this.x = 7500;
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
        if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, intervalValues.enemies.animations);
        this.registerInterval(id, 'animations');
    }
}