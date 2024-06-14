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

    constructor() {
        super();
    }

    applyGravity() {
        // if (this instanceof Endboss) {
        //     debugger;
        // }
        let intervalMoveableObjectsGravity = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.ground;
                this.isJumping = false;
                this.speedY = 0;
            }
        }, 1000 / 60);
        this.registerInterval(intervalMoveableObjectsGravity, 'gravities');
    }

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

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.ground;
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 500;
    }

    moveRight() {
        if (!this.hitReactionRuns) {
            if (!this instanceof Endboss) {
                this.directionX = 'Right';
            }
            this.x += this.speed;
        }
    }

    moveLeft() {
        if (!this.hitReactionRuns) {
            if (!this instanceof Endboss) {
                this.directionX = 'Left';
            }
            this.x -= this.speed;
        }
    }

    jump() {
        if (this.jumpCooledDown()) {
            this.isJumping = true;
            this.currentImage = 0;
            this.speedY = 25;
            this.sound_jump.play();
            this.lastJump = new Date().getTime();
        }
    }

    jumpCooledDown() {
        let now = new Date().getTime();
        return now - this.jumpRate >= this.lastJump;
    }

    isComingFromTop(obj) { // drawableObjects bekommen Variable collisionDetected, die true wird, wenn eine collision stattfindet. Sie bewirkt, dass die collision nicht erneut durchgeführt wird. Erst wenn die nächste Collision länger als 50 ms her ist, wird die neue collision gezählt.
         // Linke Seite von Gegner größer als Charakter linke Seite.
            console.log('is coming from top');
            return this.isAboveGround() && this.speedY < 0; // Ist die Differenz zwischen Charakter Füßen und Gegner Kopf kleiner als die Differenz zwischen Charakter rechts und Gegener links.
        
    }
}