class Character extends MovableObject {
    x = 3800; // 930
    y = 250;
    width = 100;
    height = 150;
    offsetTop = 70;
    offsetRight = 30;
    offsetBottom = 8;
    offsetLeft = 16;
    world;
    energyAttack = 10;
    speed = 6;
    coins = 0;
    bottles = 0;
    IMAGES_IDLE = [
        './img/2_character_pepe/1_idle/idle/I-1.png',
        './img/2_character_pepe/1_idle/idle/I-2.png',
        './img/2_character_pepe/1_idle/idle/I-3.png',
        './img/2_character_pepe/1_idle/idle/I-4.png',
        './img/2_character_pepe/1_idle/idle/I-5.png',
        './img/2_character_pepe/1_idle/idle/I-6.png',
        './img/2_character_pepe/1_idle/idle/I-7.png',
        './img/2_character_pepe/1_idle/idle/I-8.png',
        './img/2_character_pepe/1_idle/idle/I-9.png',
        './img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png'
        // 'img/2_character_pepe/5_dead/D-57.png'
    ];

    walking_sound = new Audio('audio/walking.mp3');
    sound_hurt = new Audio('audio/hurt.mp3');
    sound_die = new Audio('audio/die.mp3');
    sound_jump = new Audio('audio/jump.mp3');

    walking_soundLoaded = false;

    constructor() {
        super().loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
        this.isMoving();
        this.walking_sound.volume = 0.5;
        this.sound_jump.volume = 0.4;
    }

    async playWalkingSound() {
        this.walking_sound.pause();
        try {
            var isPlaying = this.walking_sound.currentTime > 0 && !this.walking_sound.paused && !this.walking_sound.ended
                && this.walking_sound.readyState > this.walking_sound.HAVE_CURRENT_DATA;

            if (!isPlaying) {
                await this.walking_sound.play();
            } else {
                walking_soundLoaded = true;
            }
        } catch (error) {
            this.playWalkingSound();
        }
    }

    async animate() {
        let intervalCharacterMove = setInterval(() => {
            this.walking_sound.pause();

            if ((this.world.keyboard.D || this.world.keyboard.RIGHT) && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                if (!this.isAboveGround()) {
                    this.playWalkingSound();
                }
            }

            if ((this.world.keyboard.A || this.world.keyboard.LEFT) && this.x > 50) {
                this.moveLeft();
                this.otherDirection = true;
                if (!this.isAboveGround()) {
                    this.playWalkingSound();
                }
            }

            if ((this.world.keyboard.W || this.world.keyboard.SPACE || this.world.keyboard.UP) && this.y >= 280) {
                this.jump();
            }

            if (this.x < this.world.level.level_end_x) {
                this.world.camera_x = -this.x;
            }
        }, 1000 / 60);

        this.registerInterval(intervalCharacterMove, 'moves');

        let intervalCharacterAnimate = setInterval(() => {
            if (this.isDead()) {
                this.world.statusBarEnergy.setPercentage(this.energy);
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.playHurtSound();
                this.world.statusBarEnergy.setPercentage(this.energy);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.A || this.world.keyboard.D) && this.x > 50 && this.x < this.world.level.level_end_x) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (!this.world.keyboard.LEFT && !this.world.keyboard.RIGHT && !this.world.keyboard.SPACE && !this.world.keyboard.UP) {
                this.playAnimation(this.IMAGES_IDLE);
            }
            this.world.statusBarCoin.setPercentage(this.coins * 20 + 18);
            this.world.statusBarBottle.setPercentage(this.bottles * 20 + 18);
        }, 100);

        this.registerInterval(intervalCharacterAnimate, 'animations');
    }

    async playHurtSound() {
        await this.sound_hurt.play();
    }

    hitRreaction(distance, braceUpTime) {
        let xStart = this.x;
        let id = setInterval(() => {
            if (this.x > 50 && this.x > xStart - distance) {
                this.hitReactionRuns = true;
                this.x -= 5;
            } else {
                clearInterval(id);
                setTimeout(() => {
                    this.hitReactionRuns = false;
                }, braceUpTime);
            }
        }, 10);
    }
}