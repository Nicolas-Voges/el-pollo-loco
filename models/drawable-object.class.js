class DrawableObject {
    intervals = {
        animations: [],
        moves: [],
        gravities: []
    };
    x = 10;
    y = 10;
    width = 100;
    height = 100;
    img;
    currentImage = 0;
    otherDirection = false;
    offsetTop = 0;
    offsetRight = 0;
    offsetBottom = 0;
    offsetLeft = 0;
    deathTime = 0;
    deathAnimationDone = false;
    hited = false;
    energy = 100;
    lastHit = 0;
    energyAttack = 1;
    sound_chickHit = SOUNDS.chick.DEAD.SOUND;
    sound_chickenHit = SOUNDS.chicken.DEAD.SOUND;
    sound_bossHit = SOUNDS.endboss.HURT.SOUND;
    collisionDetected = false;
    hasHurt = false;
    isAlert = false;
    alertStated = false;
    alertDone = false;

    constructor() {
        drawableObjects.push(this);
    }

    /**
     * This function registers an incoming interval id in objects intervals array and global active intervals Array.
     * 
     * @param {number} intervalId 
     * @param {string} kind 
     */
    registerInterval(intervalId, kind) {
        this.intervals[`${kind}`].push(intervalId);
        activeIntervals.push(intervalId);
    }

    /**
     * This function clears all intervals of a kind and deletes the id form global interval array and from object intervals array.
     * 
     * @param {string} kind 
     */
    deleteIntervals(kind) {
        this.intervals[`${kind}`].forEach((id) => {
            clearInterval(id);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
        });
        this.intervals[`${kind}`] = [];
    }

    /**
     * This function clears all intervals of this object.
     */
    deleteAllIntervals() {
        this.deleteIntervals('animations');
        this.deleteIntervals('moves');
        this.deleteIntervals('gravities');
    }

    /**
     * This function plays the objects animations by showing images of
     * 
     * @param {Array} images 
     */
    playAnimation(images) {
        this.checkIndexRange(images);
        let path = images[this.currentImage];
        this.img = imageCache[path];
        this.currentImage++;
        if (this.isAlert && !this.isDead()) {
            this.playAlertAnimation(images);
        } else if (this.isDead() && this.currentImage >= images.length - 1) {
            this.playDeathAnimation(images);
        } else if (!this.isDead() && this.currentImage >= images.length) {
            this.currentImage = 0;
        }
    }

    /**
     * This function checks if current image index is lower than images array length.
     * Otherwise sets current image index to 0.
     * 
     * @param {Array} images 
     */
    checkIndexRange(images) {
        if (this.currentImage >= images.length) {
            this.currentImage = 0;
        }
    }

    /**
     * This function plays the alert animation.
     * 
     * @param {Array} images 
     */
    playAlertAnimation(images) {
        if (!this.alertStated) {
            this.currentImage = 0;
        }
        this.alertStated = true;
        if (this.currentImage >= images.length - 1) {
            this.currentImage = images.length - 1;
            this.alertDone = true;
        }
    }

    /**
     * This function plays the death animation.
     * 
     * @param {Array} images 
     */
    playDeathAnimation(images) {
        if (this.deathTime <= 0) {
            this.deathTime = new Date().getTime();
        }
        this.currentImage = images.length - 1;
        this.deathAnimationDone = true;
    }

    /**
     * This function checks if energy is lower or equal to 0 and
     * 
     * @returns {boolean} true if thats the case.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * This function loads an image from the incomeing
     * 
     * @param {string} path .
     */
    loadImage(path) {
        if (loadingComplete) {
            this.img = imageCache[path];
        } else {
            this.img = new Image();
            this.img.src = path;
            imageCache[path] = this.img;
        }
    }

    /**
     * This function creates a new image object for every path in the incomeing
     * 
     * @param {Array} arr .
     */
    loadImages(arr) {
        if (!loadingComplete) {
            arr.forEach((path) => {
                let img = new Image();
                img.src = path;
                imageCache[path] = img;
            });
        }
    }

    /**
     * This function draws the objects image on the handed over canvas context.
     * 
     * @param {Object} ctx 
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.warn('Failed to load image in drawableObject.class.js. Error: ' + e);
            console.error('Can´t load image: ' + this.img.src);
        }
    }

    /**
     * This function decreases life by
     * 
     * @param {number} energyAttack and chooses a sound to play.
     * 
     * Also sets last hit to now.
     */
    hit(energyAttack) {
        this.playEnemyHitSound();
        this.energy -= energyAttack;
        if (this.energy <= 0) {
            if (!this.sound_diePlayed && this.sound_die) {
                playSound(this.sound_die);
                this.sound_diePlayed = true;
            }
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * This function checks instance of object and plays its sound.
     */
    playEnemyHitSound() {
        if (this instanceof Chick) {
            playSound(this.sound_chickHit);
        }
        if (this instanceof Chicken) {
            playSound(this.sound_chickenHit);
        }
        if (this instanceof Endboss && this.energy > 0) {
            playSound(this.sound_bossHit);
        }
    }

    /**
     * This function checks if this object is colliding with
     * 
     * @param {Object} obj and
     * @returns {boolean} true if thats the case.
     */
    isColliding(obj) {
        return this.rightSide() >= this.leftSide(obj) &&
            this.leftSide() <= this.rightSide(obj) &&
            this.bottomSide() >= this.topSide(obj) &&
            this.topSide() <= this.bottomSide(obj);
    }

    /**
     * This function checks direction of
     * 
     * @param {Object} obj and
     * @returns {number} x position of right side.
     */
    rightSide(obj = this) {
        if (obj.otherDirection) {
            return obj.x + obj.width - obj.offsetLeft;
        } else {
            return obj.x + obj.width - obj.offsetRight;
        }
    }

    /**
     * This function checks direction of
     * 
     * @param {Object} obj and
     * @returns {number} x position of left side.
     */
    leftSide(obj = this) {
        if (obj.otherDirection) {
            return obj.x + obj.offsetRight;
        } else {
            return obj.x + obj.offsetLeft;
        }
    }

    /**
     * This function checks direction of
     * 
     * @param {Object} obj and
     * @returns {number} y position of top side.
     */
    topSide(obj = this) {
        return obj.y + obj.offsetTop;
    }

    /**
     * This function checks direction of
     * 
     * @param {Object} obj and
     * @returns {number} y position of bottom side.
     */
    bottomSide(obj = this) {
        return obj.y + obj.height - obj.offsetBottom;
    }

    // /**
    //  * This function 
    //  * 
    //  * @param {Object} ctx 
    //  */
    // drawFrame(ctx) {
    //     if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableObject) {
    //         ctx.beginPath();
    //         ctx.lineWidth = '2';
    //         ctx.strokeStyle = 'blue';
    //         ctx.rect(this.x, this.y, this.width, this.height);
    //         ctx.stroke();
    //     }
    // }

    // /**
    //  * This function 
    //  * 
    //  * @param {*} ctx 
    //  */
    // drawColliderFrame(ctx) {
    //     if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableObject || this instanceof Chick) {
    //         ctx.beginPath();
    //         ctx.lineWidth = '1';
    //         ctx.strokeStyle = 'red';
    //         ctx.rect(this.x + this.offsetLeft, this.y + this.offsetTop, this.width - (this.offsetRight + this.offsetLeft), this.height - (this.offsetBottom + this.offsetTop));
    //         ctx.stroke();
    //     }
    // }
}

