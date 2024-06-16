class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    camera_x = 0;
    keyboard;
    sound_ambiente = new Audio('audio/ambiente.mp3');
    sound_music = new Audio('audio/music.mp3');
    sound_glas = new Audio('audio/bottle-broken.mp3');
    statusBarEnergy = new StatusBarEnergy();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    throwableObjects = [];
    lastBottleThrown = 0;
    firingRate = 1500;
    intervals = [];
    endbossAnimationRuns = false;
    endboss = this.level.enemies[this.level.enemies.length - 1];
    cameraToCharacter = 100;
    bossCameraActiv = false;
    endbossAnimationHasRun = false;
    earthquakeDone = false;
    lastAttack = 0;
    earthquakeSrarted = false;

    bossFightStarted = false;
    bossFightDone = true;

    bossAttackAnimationRuns = false;
    attackJumpStarted = false;

    lastCollision = 0;
    characterEnemyCollisiondetected = false;
    collisionsReactionRuns = false;

    cameraIsMoving = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.loadSounds();
        this.run();
        this.checkBackgroundPosition();
    }

    async loadSounds() {
        this.sound_music.load();
        this.sound_ambiente.load();
        this.sound_glas.load();
        this.sound_glas.volume = 0.4;
        await this.sound_ambiente.play();
        this.sound_ambiente.loop = true;
        this.sound_ambiente.volume = 0.4;
        await this.sound_music.play();
        this.sound_music.loop = true;
        this.sound_music.volume = 0.25;
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        let intervalWorldRun = setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObjects();
            this.checkForDeadEnemies();
            checkForEndbossAnimation();
            if (this.endbossAnimationHasRun) {
                bossFight();
            }
        }, 5);
        this.intervals.push(intervalWorldRun);
        activeIntervals.push(intervalWorldRun);
    }

    checkCollisions() {
        if (!this.endbossAnimationRuns) {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.characterEnemyCollisiondetected && !enemy.isDead()) {
                    this.characterEnemyCollisiondetected = true;
                    this.lastCollision = new Date().getTime();
                    if (!enemy.isDead() && !this.character.isComingFromTop(enemy)) { // Hier gucken, von wo der Enemy auf den Character trifft.
                        if (!enemy.hasHurt && !this.collisionsReactionRuns) {
                            this.collisionsReactionRuns = true;
                            enemy.hasHurt = true;
                            this.character.hit(enemy.energyAttack);
                            if (enemy instanceof Endboss) {
                                this.character.hitRreaction(220, 400);                                
                            } else {                                
                                this.character.hitRreaction(100, 400);
                            }
                        }
                    } else if (!enemy.hasHurt && this.character.isComingFromTop(enemy) && this.character.speedY < 0 && this.character.isJumping && !this.collisionsReactionRuns) {
                        if (enemy instanceof Endboss) { // Kollision nur einmal checken
                            enemy.hit(5);
                            if (!enemy.isDead()) {
                                this.character.hitRreaction(360, 20);
                                this.character.speedY = 15;
                            }
                        } else {
                            if (!enemy.isDead()) {
                                // this.character.hitRreaction();
                                this.character.speedY = 25;
                            }
                            enemy.energy = 0;
                        }
                    }
                    // console.log(this.character.energy);
                } else {
                    enemy.hasHurt = false;
                }
                if (new Date().getTime() - this.lastCollision > 500) {
                    this.characterEnemyCollisiondetected = false;
                    this.collisionsReactionRuns = false;
                    this.level.enemies.forEach(enemy => enemy.hasHurt = false);
                    enemy.hasHurt = false;
                }
                this.throwableObjects.forEach((bottle) => {
                    if (bottle.isColliding(enemy)) {
                        if (!bottle.hited) {
                            enemy.hit(this.character.energyAttack);
                            bottle.hited = true;
                        }
                        bottle.deleteIntervals('gravities');
                        bottle.deleteIntervals('moves');
                        bottle.energy = 0;
                    }
                })
            });
            let i = 0;
            this.level.collectableObjects.forEach((obj) => {
                if (this.character.isColliding(obj)) {
                    if (obj instanceof Coin) {
                        this.character.coins++;
                        this.statusBarCoin.percentage += 20;
                    } else {
                        this.character.bottles++;
                        this.statusBarBottle.percentage += 20;
                    }
                    this.level.collectableObjects.splice(i, 1);
                }
                i++;
            })
        }
    }

    checkForDeadEnemies() {
        let now = new Date().getTime();
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].deathTime > 0 && this.level.enemies[i].deathTime + 1000 <= now) {
                this.level.enemies.splice(i, 1);
            }
        }
    }

    checkThrowableObjects() {
        let now = new Date().getTime();
        if (this.keyboard.F && this.character.bottles > 0 && this.lastBottleThrown + this.firingRate < now) {
            let bottle;
            if (this.keyboard.D || this.keyboard.RIGHT) {
                bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), this.character.speed);
            } else if (this.keyboard.A || this.keyboard.LEFT) {
                bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), -this.character.speed);
            } else {
                bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), 0);
            }
            this.throwableObjects.push(bottle);
            this.lastBottleThrown = new Date().getTime();
            this.character.bottles--;
        }
        for (let i = 0; i < this.throwableObjects.length; i++) {
            if (this.throwableObjects[i].y >= 390) {
                this.throwableObjects[i].energy = 0;
                this.sound_glas.play();
                this.throwableObjects[i].deleteIntervals('gravities');
                this.throwableObjects[i].deleteIntervals('moves');
                // this.throwableObjects.splice(i, 1);
            }
            if (this.throwableObjects[i].deathAnimationDone) {
                this.throwableObjects[i].deleteAllIntervals();
                this.throwableObjects.splice(i, 1);
            }
        }

    }

    checkBackgroundPosition() {
        let backgroundPosition = setInterval(() => {
            // if (!this.endbossAnimationHasRun) {
            this.level.backgroundObjects.forEach((bgr) => {
                if (this.character.isMovingLeft && this.character.x < 3690) {
                    bgr.moveLeft();
                } else if (this.character.isMovingRight && this.character.x < 3690) {
                    bgr.moveRight();
                }
            });
            // } else {
            //     clearInterval(backgroundPosition);
            // }
        }, 20);
        let cloudPosition = setInterval(() => {
            if (!this.cameraIsMoving) {
                this.level.cloudObjects.forEach((cloud) => {
                    if (this.character.isMovingLeft && this.character.x < 3696) {
                        cloud.speed = 1;
                    } else if (this.character.isMovingRight && this.character.x < 3696) {
                        cloud.speed = -1;
                    }
                    else {
                        cloud.speed = 0.03;
                    }
                });
            } else {
                this.level.cloudObjects.forEach((cloud) => {
                    if (this.character.isMovingLeft) {
                        cloud.speed = 1;
                    } else if (this.character.isMovingRight) {
                        cloud.speed = -1;
                    }
                    else {
                        cloud.speed = 0.03;
                    }
                });
                // clearInterval(cloudPosition);
            }
        }, 20);
    }
    
    /**
     * 
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x + this.cameraToCharacter, 0);
        this.drawScene();
        this.ctx.translate(-this.camera_x - this.cameraToCharacter, 0);
        this.drawHUD();
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * 
     */
    drawScene() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.cloudObjects);
        this.addObjectsToMap(this.level.collectableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * 
     */
    drawHUD() {
        this.addToMap(this.statusBarEnergy);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
    }

    /**
     * 
     * @param {Array} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
        try {
            object.draw(this.ctx);
            // object.drawFrame(this.ctx);
            // object.drawColliderFrame(this.ctx);
        } catch (e) {
            console.warn('Failed to load image in world.class.js. Error: ' + e);
            console.error('Can not load image: ' + this.img.src);
        }
        if (object.otherDirection) {
            this.flipImageBack();
        }
    }

    /**
     * 
     * @param {Object} object 
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width + 2 * object.x, 0);
        this.ctx.scale(-1, 1);
    }

    /**
     * 
     */
    flipImageBack() {
        this.ctx.restore();
    }
}