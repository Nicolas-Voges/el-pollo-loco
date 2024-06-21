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
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        // super();
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.move();
        // this.applyGravity();
    }

    animate() {
        if (this.intervals.animations.length === 0) {
            let intervalEndbossAnimate = setInterval(() => {
                if (this.isDead()) {
                    this.playAnimation(this.IMAGES_DEAD);
                } else if (this.isHurt()) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.isAlert) {
                    this.playAnimation(this.IMAGES_ALERT);
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }, 200);
            this.registerInterval(intervalEndbossAnimate, 'animations');
        }
    }

    move() {
        if (this.intervals.moves.length === 0) {
            let intervalEndbossMove = setInterval(() => {
                if (this.directionX === 'Right') {
                    this.moveRight();
                    this.otherDirection = true;
                }
                if (this.directionX === 'Left') {
                    this.moveLeft();
                    this.otherDirection = false;
                }
            }, 1000 / 60);
            this.registerInterval(intervalEndbossMove, 'moves');
        }
    }
}