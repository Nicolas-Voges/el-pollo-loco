class ThrowableObject extends MovableObject {
    width = 40;
    height = 70;
    offsetTop = 15;
    offsetRight = 10;
    offsetBottom = 15;
    offsetLeft = 10;

    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    constructor(x, y, speed) {
        super().loadImage('./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 15;
        this.applyGravity();
        let intervalThrowableObjectsThrow = setInterval(() => {
            this.x += 10 + this.speed;
        }, 20);
        this.registerInterval(intervalThrowableObjectsThrow, 'moves');
    }

    animate() {
        let intervalId = setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATE);
            }
        }, 1000 / 10);
        this.registerInterval(intervalId, 'animations');
    }
}