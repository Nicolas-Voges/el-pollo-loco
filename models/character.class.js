class Character extends MovableObject {
    x = 930;
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
    IMAGES_IDLE = IMAGES_PATHS.character.IMAGES_IDLE;
    IMAGES_LONG_IDLE = IMAGES_PATHS.character.IMAGES_LONG_IDLE;
    IMAGES_WALKING = IMAGES_PATHS.character.IMAGES_WALKING;
    IMAGES_JUMPING = IMAGES_PATHS.character.IMAGES_JUMPING;
    IMAGES_HURT = IMAGES_PATHS.character.IMAGES_HURT;;
    IMAGES_DEAD = IMAGES_PATHS.character.IMAGES_DEAD;
    sound_walking = SOUNDS.character.WALKING.SOUND;
    sound_hurt = SOUNDS.character.HURT.SOUND;
    sound_die = SOUNDS.character.DEAD.SOUND;
    sound_jump = SOUNDS.character.JUMPING.SOUND;
    reachedLevelEnd = false;
    idleTime = 0;
    tookIdleTime = false;

    /**
     * This first called function calls the constructor function in movable object class.
     * Than it loads all images, sets intervals for animation, moving and gravity.
     * Also it adjusts the volume of characters sound.
     */
    constructor() {
        super().loadImage(this.IMAGES_IDLE[0]);
        this.loadAllImages();
        this.isMoving();
        this.sound_walking.volume = 0.5;
        this.sound_jump.volume = 0.4;
        this.applyGravity(intervalValues.character.gravity);
        this.move();
        this.animate();
    }

    /**
     * This function loads all images of the character.
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * This function sets an interval to react when the user is pushing a key.
     * Also it moves the camera and register this interval.
     */
    move() {
        let id = setInterval(() => {
        // console.log('character move');
            this.sound_walking.pause();
            this.walk();
            this.checkForJump();
            this.checkForReachLevelEnd();
            this.moveCamera();
        }, intervalValues.character.moves);
        this.registerInterval(id, 'moves');
    }

    /**
     * This function checks if a key to jump is pushed and calls the jump function if thats the case.
     */
    checkForJump() {
        if ((this.world.keyboard.jumpKeyPush) && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * This function checks if character reached the end of level and sets the boolean
     * reachedLevelEnd to true if thats the case.
     */
    checkForReachLevelEnd() {
        if (this.x >= 3800) {
            this.reachedLevelEnd = true;
        }
    }

    /**
     * This function moves the camera if character didn´t reched end of lovel.
     */
    moveCamera() {
        if (this.x < this.world.level.level_end_x - 500 && !this.reachedLevelEnd) {
            this.world.camera_x = -this.x;
        }
    }

    /**
     * This function checks if a key is pushed to walk right or left and if character didn´t reached any level limits
     * it calls the function to walk right or left.
     */
    walk() {
        if (this.world.keyboard.moveRightKeyPush && this.notReachedLevelEnd()) {
            this.walkRight();
        }
        if ((this.world.keyboard.moveLeftKeyPush) && ((this.notReachedLevelStart() && !this.reachedLevelEnd) || (this.notReachedEndLevelStart() && this.reachedLevelEnd))) {
            this.walkLeft();
        }
    }

    /**
     * This function checks if character reched the start of the end level screen and
     * 
     * @returns {boolean} false if thats the case.
     */
    notReachedEndLevelStart() {
        return this.x > 3700;
    }

    /**
     * This function lets the character walk right and sets boolean otherDirection to false.
     * Also it plays walking sound if character is on the ground.
     */
    walkRight() {
        this.moveRight();
        this.otherDirection = false;
        if (!this.isAboveGround()) {
            playSound(this.sound_walking);
        }
    }

    /**
     * This function lets the character walk left and sets boolean otherDirection to true.
     * Also it plays walking sound if character is on the ground.
     */
    walkLeft() {
        this.moveLeft();
        this.otherDirection = true;
        if (!this.isAboveGround()) {
            playSound(this.sound_walking);
        }
    }

    /**
     * This function animates the character in an interval by considering characters conditions and
     * rigisters the interval. 
     */
    animate() {
        let id = setInterval(() => {
        // console.log('character animate');
            if (this.isDead()) {
                this.die();
            } else if (this.isHurt()) {
                this.hurt();
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if ((this.isMovingLeft || this.isMovingRight) && this.notReachedLevelStart() && this.notReachedLevelEnd()) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.noKeyPush) {
                this.deleteIntervals('animations');
                this.animateIdle();
            }
        }, intervalValues.character.animations.default);
        this.registerInterval(id, 'animations');
    }

    /**
     * This function plays the animation if character dies.
     */
    die() {
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * This function plays the animation if character is hurt and play hurt sound.
     */
    hurt() {
        this.playAnimation(this.IMAGES_HURT);
        playSound(this.sound_hurt);
    }

    /**
     * This function plays idle animation if no key is pushed and character is not dead and not hurt.
     * If thats not the case it calls break idle function.
     * Also it registers the interval.
     */
    animateIdle() {
        let id = setInterval(() => {
        // console.log('character animateIdle');
        if (this.noKeyPush() && !this.isHurt() && !this.isDead()) {
                this.doIdle();
            } else {
                this.breakIdle();
            }
        }, intervalValues.character.animations.idle);
        this.registerInterval(id, 'animations');
    }

    /**
     * This function sets idle time and plays idle animation.
     * If there has been no interaction for 10 seconds it plays long idle animation.
     */
    doIdle() {
        this.setIdleTime();
        if (new Date().getTime() - this.idleTime < 10000) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.animatLongIdle();
        }
    }

    /**
     * This function checks if no idle time has been taken.
     * If thats the case it turns boolean tookIdleTime to true and saves current time in idleTime.
     */
    setIdleTime() {
        if (!this.tookIdleTime) {
            this.tookIdleTime = true;
            this.idleTime = new Date().getTime();
        }
    }

    /**
     * This function animates long idle animation and brakes it if enemy or user ineracts with character.
     */
    animatLongIdle() {
        if (this.noKeyPush()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.breakIdle();
        }
    }

    /**
     * This function deletes characters animations interval and calls the animate function.
     * Also turns boolean toolIdleTime to false.
     */
    breakIdle() {
        this.deleteIntervals('animations');
        this.animate();
        this.tookIdleTime = false;
    }

    /**
     * This function checks if any key pushed and
     * 
     * @returns {boolean} false if thats the case.
     */
    noKeyPush() {
        return !this.world.keyboard.moveLeftKeyPush && !this.world.keyboard.moveRightKeyPush && !this.world.keyboard.jumpKeyPush && !this.world.keyboard.throwKeyPush;
    }

    /**
     * This function checks if character reached end of level and
     * 
     * @returns {boolean} false if thats the case.
     */
    notReachedLevelEnd() {
        return this.x < this.world.level.level_end_x;
    }

    /**
     * This function checks if a hit reaction already runs. If not this function starts the hit reaction.
     * 
     * @param {number} distance 
     * @param {number} braceUpTime 
     */
    hitRreaction(distance, braceUpTime) {
        let xStart = this.x;
        if (!this.hitReactionRuns) {
            this.hitReactionRuns = true;
            this.runHitReaction(distance, braceUpTime, xStart);
        }
    }

    /**
     * This function runs the hit reaction in an interval.
     * 
     * @param {number} distance 
     * @param {number} braceUpTime 
     * @param {number} xStart 
     */
    runHitReaction(distance, braceUpTime, xStart) {
        let id = setInterval(() => {
        // console.log('character runHitReaction');
        if (!this.reachedLevelEnd && this.notReachedLevelStart() && this.notReachedDistance(xStart, distance)) {
                this.x -= 5;
            } else if (this.reachedLevelEnd && this.onLeftScreenSide(xStart)) {
                endbossHitReactionLeft(xStart, distance, id, braceUpTime);
            } else if (this.reachedLevelEnd && !this.onLeftScreenSide(xStart)) {
                endbossHitReactionRight(xStart, distance, id, braceUpTime);
            } else {
                this.hitRreactionEnd(id, braceUpTime);
            }
        }, 10);
        activeIntervals.push(id);
    }

    /**
     * This function checks if xStart is lower or equal to screen middle and
     * 
     * @param {number} xStart 
     * @returns {boolean} true if thats the case.
     */
    onLeftScreenSide(xStart) {
        return xStart <= 4005
    }

    /**
     * This function checks if character position is greater than level start and
     * 
     * @returns {boolean} true if thats the case.
     */
    notReachedLevelStart() {
        return this.x > this.world.level.level_start_x;
    }

    /**
     * This function checks if character reached distance and
     * 
     * @param {number} xStart 
     * @param {number} distance 
     * @returns {boolean true if thats the case.}
     */
    notReachedDistance(xStart, distance) {
        return this.x > xStart - distance;
    }

    /**
     * This function clears the interval of the function to run the hit reaction and after a time out
     * it sets hitReactionRuns to false.
     * 
     * @param {number} id 
     * @param {number} braceUpTime 
     */
    hitRreactionEnd(id, braceUpTime) {
        clearInterval(id);
        activeIntervals.splice(activeIntervals.indexOf(id), 1);
        setTimeout(() => {
            this.hitReactionRuns = false;
        }, braceUpTime);
    }
}