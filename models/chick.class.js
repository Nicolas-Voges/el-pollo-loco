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
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(x) {
        super(x).loadImage('./img/3_enemies_chicken/chicken_small/1_walk/2_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.move();
    }

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