class MovableObject extends DrawableObject {
    speedY = 0;
    acceleration = 1;
    speed;
    sound_die;
    sound_diePlayed = false;
    jumpRate = 850;
    lastJump = 0;
    directionX;
    directionY;
    hitReactionRuns = false; // Only for Charakter.
    isJumping = false;
    ground = 280;
    isMovingRight = false;
    isMovingLeft = false;

    /**
     * This first called function goes to the constuctor function in DrawableObject class.
     */
    constructor() {
        super();
    }

    /**
     * This function applies gravity to this object by decracing its speedY value if this object
     * is above its ground or its speedY value is positive.
     * Else this function sets this y position to its ground, ist speedY value to 0 and isJumping to false.
     */
    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = this.ground;
            this.isJumping = false;
            this.speedY = 0;
        }
    }

    /**
     * This function checks in an intervall of 20ms if this x position changed and sets
     * the values isMovingRight and isMovingLeft to false or true.
     */
    isMoving() {
        let x = this.x
        setInterval(() => {
            if (this.x > x) {
                this.isMovingRight = true;
                this.isMovingLeft = false;
                x = this.x;
            }
            else if (this.x < x) {
                this.isMovingLeft = true;
                this.isMovingRight = false;
                x = this.x;
            } else if (this.x === x) {
                this.isMovingLeft = false;
                this.isMovingRight = false;
            }
        }, 20);
    }

    /**
     * This function checks if this object is above its ground.
     * 
     * @returns {boolean} true if this y position is lower as its ground position or if this
     * object is instance of ThrowableObject class.
     */
    isAboveGround() {
        return this.y < this.ground || this instanceof ThrowableObject;
    }

    /**
     * This function checks if this object is hurt.
     * 
     * @returns {boolean} true if last time something hit this object is longer ago than 500ms.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 500;
    }

    /**
     * This function moves this object left by adding the value of its speed to its x position.
     * This function also sets this direktionX to 'Right' if this is not instance of endboss class.
     */
    moveRight() {
        if (!this.hitReactionRuns) {
            if (!this instanceof Endboss) {
                this.directionX = 'Right';
            }
            this.x += this.speed;
        }
    }

    /**
     * This function moves this object left by adding the negative value of its speed to its x position.
     * This function also sets this direktionX to 'Left' if this is not instance of endboss class.
     */
    moveLeft() {
        if (!this.hitReactionRuns) {
            if (!this instanceof Endboss) {
                this.directionX = 'Left';
            }
            this.x -= this.speed;
        }
    }

    /**
     * This function makes this object to jump by adding a positive value to this speedY.
     * Also it resets the current image value for animation, updates the last jump time and
     * sets value is Jumping to true.
     */
    jump() {
        if (this.jumpCooledDown()) {
            this.isJumping = true;
            this.currentImage = 0;
            this.speedY = 25;
            this.sound_jump.play();
            this.lastJump = new Date().getTime();
        }
    }

    /**
     * This function checks if the jump cooled down.
     * 
     * @returns {boolean} true if last time value the user jumped is greater or equal to
     * the time value of now minus jump rate.
     */
    jumpCooledDown() {
        let now = new Date().getTime();
        return now - this.jumpRate >= this.lastJump;
    }

    /**
     * This function checks if this object is coming from top in relation to the colliding object.
     * 
     * @param {Object} obj 
     * @returns {boolean} ture if the differnce between this object bottom side and the colliding objects
     * top side is lower than the difference between this object right Side and the colliding objects left side
     * and if this object is above its ground.
     */
    isComingFromTop(obj) {
        return this.rightSide() - obj.leftSide() > this.bottomSide() - obj.topSide() && this.isAboveGround();
    }
}