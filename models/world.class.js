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
    statusBarBoss = new StatusBarBoss();
    throwableObjects = [];
    lastBottleThrown = 0;
    firingRate = 1500;
    intervals = [];
    endbossAnimationRuns = false;
    endboss = this.level.enemies[this.level.enemies.length - 1];
    cameraToCharacter = 100;
    bossCameraActiv = false;
    lastAttack = 0;
    lastCollision = 0;
    characterEnemyCollisiondetected = false;
    collisionsReactionRuns = false;

    endbossAnimationHasRun = false; // in endboss-entrence und -fight.js auslagern.
    earthquakeDone = false; // in endboss-entrence und -fight.js auslagern.
    earthquakeSrarted = false; // in endboss-entrence und -fight.js auslagern.
    bossFightStarted = false; // in endboss-entrence und -fight.js auslagern.
    bossFightDone = true; // in endboss-entrence und -fight.js auslagern.
    bossAttackAnimationRuns = false; // in endboss-entrence und -fight.js auslagern.
    attackJumpStarted = false; // in endboss-entrence und -fight.js auslagern.


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.loadSounds();
        this.run();
        this.adjustBackgroundPosition();
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
            this.updateStatusBars();
            if (this.endbossAnimationHasRun) {
                bossFight();
            }
        }, 5);
        this.intervals.push(intervalWorldRun);
        activeIntervals.push(intervalWorldRun);
    }


    updateStatusBars() {
        this.statusBarCoin.setPercentage(this.character.coins * 20 + 18);
        this.statusBarBottle.setPercentage(this.character.bottles * 20 + 18);
        this.statusBarEnergy.setPercentage(this.character.energy);
        this.statusBarBoss.setPercentage(this.endboss.energy);
    }


    checkCollisions() {
        if (!this.endbossAnimationRuns) {
            this.checkEnemyCollisions();
            this.checkCollectableObjectCollisions();
        }
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.characterEnemyCollisiondetected && !enemy.isDead()) {
                this.detectCollision(enemy);
            } else {
                enemy.hasHurt = false;
            }
            if (new Date().getTime() - this.lastCollision > 500) {
                this.enableCollision(enemy);
            }
            this.checkBottleCollision(enemy);
        });
    }

    enableCollision(enemy) {
        this.characterEnemyCollisiondetected = false;
        this.collisionsReactionRuns = false;
        this.level.enemies.forEach(enemy => enemy.hasHurt = false);
        enemy.hasHurt = false;
    }

    checkBottleCollision(enemy) {
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
    }

    detectCollision(enemy) {
        this.characterEnemyCollisiondetected = true;
        this.lastCollision = new Date().getTime();
        if (!enemy.isDead() && !this.character.isComingFromTop(enemy)) {
            this.hurtCharacter(enemy);
        } else if (!enemy.hasHurt && this.character.isComingFromTop(enemy) && this.character.speedY < 0 && this.character.isJumping && !this.collisionsReactionRuns) {
            this.hurtEnemy(enemy);
        }
    }

    hurtCharacter(enemy) {
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
    }

    hurtEnemy(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(5);
            if (!enemy.isDead()) {
                this.character.hitRreaction(360, 20);
                this.character.speedY = 15;
            }
        } else {
            if (!enemy.isDead()) {
                this.character.speedY = 25;
            }
            enemy.energy = 0;
        }
    }

    checkCollectableObjectCollisions() {
        this.level.collectableObjects.forEach((obj, i) => {
            if (this.character.isColliding(obj)) {
                this.collectItem(obj, i);
            }
            i++;
        });
    }

    collectItem(obj, i) {
        if (obj instanceof Coin) {
            this.character.coins++;
            this.statusBarCoin.percentage += 20;
        } else {
            this.character.bottles++;
            this.statusBarBottle.percentage += 20;
        }
        this.level.collectableObjects.splice(i, 1);
    }

    checkForDeadEnemies() {
        let now = new Date().getTime();
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].deathTime > 0 && this.level.enemies[i].deathTime + 1000 <= now) {
                this.level.enemies[i].deleteAllIntervals();
                this.level.enemies.splice(i, 1);
            }
        }
    }

    checkThrowableObjects() {
        let now = new Date().getTime();
        if (this.keyboard.throwKeyPush && this.character.bottles > 0 && this.lastBottleThrown + this.firingRate < now) {
            this.throwBottle();
        }
        this.deleteBottle();
    }

    deleteBottle() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            if (this.throwableObjects[i].y >= 390) {
                this.throwableObjects[i].energy = 0;
                this.sound_glas.play();
                this.throwableObjects[i].deleteIntervals('gravities');
                this.throwableObjects[i].deleteIntervals('moves');
            }
            if (this.throwableObjects[i].deathAnimationDone) {
                this.throwableObjects[i].deleteAllIntervals();
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    throwBottle() {
        let bottle;
        if (this.keyboard.moveRightKeyPush) {
            bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), this.character.speed);
        } else if (this.keyboard.moveLeftKeyPushT) {
            bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), -this.character.speed);
        } else {
            bottle = new ThrowableObject(this.character.x + (this.character.width / 3), this.character.y + (this.character.height / 2), 0);
        }
        this.throwableObjects.push(bottle);
        this.lastBottleThrown = new Date().getTime();
        this.character.bottles--;
    }

    adjustBackgroundPosition() {
        let backgroundPosition = setInterval(() => {
            this.changeBackgroundPosition();
        }, 20);
        this.intervals.push(backgroundPosition);
        activeIntervals.push(backgroundPosition);
        let cloudPosition = setInterval(() => {
            this.changeCloudPosition();
        }, 20);
        this.intervals.push(cloudPosition);
        activeIntervals.push(cloudPosition);
    }

    changeBackgroundPosition() {
        this.level.backgroundObjects.forEach((bgr) => {
            if (this.character.isMovingLeft && !this.endbossAnimationHasRun && this.character.x < 3696) {
                bgr.moveLeft();
            } else if (this.character.isMovingRight && !this.endbossAnimationHasRun && this.character.x < 3696) {
                bgr.moveRight();
            }
        });
    }

    changeCloudPosition() {
        this.level.cloudObjects.forEach((cloud) => {
            if (this.character.isMovingLeft && !this.endbossAnimationHasRun && this.character.x < 3696) {
                cloud.speed = 1;
            } else if (this.character.isMovingRight && !this.endbossAnimationHasRun && this.character.x < 3696) {
                cloud.speed = -1;
            }
            else {
                cloud.speed = 0.03;
            }
        });
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
        if (bossStatusbarIsShown) {
            this.addToMap(this.statusBarBoss);
        }
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