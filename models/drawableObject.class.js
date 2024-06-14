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
    imageCache = {};
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
    sound_chickHit = new Audio('audio/chick-hit.mp3');
    sound_chickenHit = new Audio('audio/chicken-hit.mp3');
    sound_bossHit = new Audio('audio/boss-hit.mp3');
    collisionDetected = false;
    lastCollision = 0;
    hasHurt = false;
    isAlert = false;

    constructor() {
        this.sound_chickHit.load();
        this.sound_chickenHit.load();
        this.sound_bossHit.load();
    }

    registerInterval(intervalId, kind) {
        this.intervals[`${kind}`].push(intervalId);
        activeIntervals.push(intervalId);
    }

    deleteIntervals(kind) {
        this.intervals[`${kind}`].forEach((id) => {
            clearInterval(id);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
        });
        this.intervals[`${kind}`] = [];
    }

    deleteAllIntervals() {
        this.intervals.animations.forEach((id) => {
            clearInterval(id);
            this.intervals.animations.splice(this.intervals.animations.indexOf(id), 1);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
        });
        this.intervals.moves.forEach((id) => {
            clearInterval(id);
            this.intervals.moves.splice(this.intervals.moves.indexOf(id), 1);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
        });
        this.intervals.gravities.forEach((id) => {
            clearInterval(id);
            this.intervals.gravities.splice(this.intervals.gravities.indexOf(id), 1);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
        });
    }
    alertStated = false;
    alertDone = false;

    playAnimation(images) {
        if (this.currentImage >= images.length) {
            this.currentImage = 0;
        }
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
        if (this.isAlert && !this.isDead()) {
            if (!this.alertStated) {
                this.currentImage = 0;                
            }
            this.alertStated = true;
            if (this.currentImage >= images.length -1) {
                this.currentImage = images.length -1;
                this.alertDone = true;
            }

        } else if (this.isDead() && this.currentImage >= images.length - 1) {
            if (this.deathTime <= 0) {
                this.deathTime = new Date().getTime();
            }
            this.currentImage = images.length - 1;
            this.deathAnimationDone = true;
        } else if (!this.isDead() && this.currentImage >= images.length) {
            this.currentImage = 0;
        }
    }

    isDead() {
        return this.energy <= 0;
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableObject) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    drawColliderFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableObject || this instanceof Chick) {
            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offsetLeft, this.y + this.offsetTop, this.width - (this.offsetRight + this.offsetLeft), this.height - (this.offsetBottom + this.offsetTop));
            ctx.stroke();
        }
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.warn('Failed to load image in drawableObject.class.js. Error: ' + e);
            console.error('Can´t load image: ' + this.img.src);
        }
    }

    hit(energyAttack) {
        console.log('TREFFER!');
        if (this instanceof Chick) {
            this.sound_chickHit.play();
        }
        if (this instanceof Chicken) {
            this.sound_chickenHit.play();
        }
        if (this instanceof Endboss) {
            this.sound_bossHit.play();
        }
        if (this instanceof Enemy || this instanceof Endboss) {
            this.energy -= energyAttack;
        } else {
            this.energy -= energyAttack;
        }
        if (this.energy <= 0) {
            if (!this.sound_diePlayed && this.sound_die) {
                this.sound_die.play();
                this.sound_diePlayed = true;
            }
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isColliding(obj) {
        return this.rightSide() >= this.leftSide(obj) &&
            this.leftSide() <= this.rightSide(obj) &&
            this.bottomSide() >= this.topSide(obj) &&
            this.topSide() <= this.bottomSide(obj);
    }
    
    rightSide(obj = this) {
        if (obj.otherDirection) {
            return obj.x + obj.width - obj.offsetLeft;
        } else {
            return obj.x + obj.width - obj.offsetRight;
        }
    }

    leftSide(obj = this) {
        if (obj.otherDirection) {
            return obj.x + obj.offsetRight;
        } else {
            return obj.x + obj.offsetLeft;
        }
    }

    topSide(obj = this) {
        return obj.y + obj.offsetTop;
    }

    bottomSide(obj = this) {
        return obj.y + obj.height - obj.offsetBottom;
    }
}