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
    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor(x) {
        super(x).loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        let intervalChickenMove = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                if (this.x + this.width <= 0) {
                    this.x = 5000;
                }
            }
        }, 1000 / 60);

        this.registerInterval(intervalChickenMove, 'moves');

        let intervalChickenAnimate = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 120);

        this.registerInterval(intervalChickenAnimate, 'animations');
    }
}