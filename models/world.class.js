class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    camera_x = 0;
    keyboard;
    statusBarEnergy = new StatusBarEnergy();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarBoss = new StatusBarBoss();
    throwableObjects = [];
    lastBottleThrown = 0;
    firingRate = 1500;
    intervals = [];
    endboss = this.level.enemies[this.level.enemies.length - 1];
    cameraToCharacter = 100;
    bossCameraActiv = false;
    lastAttack = 0;
    lastCollision = 0;
    characterEnemyCollisiondetected = false;
    collisionsReactionRuns = false;
    requestId;

    /**
     * This first called function gets the canvas, its context and keyboard.
     * Also calls the draw function, sets the world to the charakter property and
     * runs the game.
     * 
     * @param {Object} canvas 
     * @param {Object} keyboard 
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    /**
     * This function runs the game in an interval and registers the interval.
     * It checks all collisions and let the endboss come. Also starts boss fight and
     * adjust background positions.
     */
    run() {
        let id = setInterval(() => {
            checkForPortraitView();
            this.checkCollisions();
            this.checkThrowableObjects();
            this.checkForDeadEnemies();
            checkForEndbossAnimation();
            updateStatusBars();
            checkForEndbossFight();
            checkForEndingGame();
        }, 5);
        this.intervals.push(id);
        activeIntervals.push(id);
    }

    /**
     * This function checks the collisions of the game.
     */
    checkCollisions() {
        if (!endbossAnimationRuns) {
            this.checkEnemyCollisions();
            this.checkCollectableObjectCollisions();
        }
    }

    /**
     * This function checks for collisions with enemies and disables another collision till the next 500ms.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.characterEnemyCollisiondetected && !enemy.isDead()) {
                this.detectCollisionKind(enemy);
            } else {
                enemy.hasHurt = false;
            }
            if (new Date().getTime() - this.lastCollision > 500) {
                this.enableCollision(enemy);
            }
            this.checkBottleCollision(enemy);
        });
    }

    /**
     * This function enables next collision.
     * 
     * @param {Object} enemy 
     */
    enableCollision(enemy) {
        this.characterEnemyCollisiondetected = false;
        this.collisionsReactionRuns = false;
        this.level.enemies.forEach(enemy => enemy.hasHurt = false);
        enemy.hasHurt = false;
    }

    /**
     * This function checks for collisions between bottles and enemies and hit the enemy if a bottle is
     * thrown on the enemy. Also sets the bottles energy to 0.
     * 
     * @param {Object} enemy 
     */
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
                SOUNDS.throwableObject.ROTATE.SOUND.pause();
            }
        })
    }

    /**
     * This function disables new collisions and checks kind of collision. Also hits enemy or character.
     * 
     * @param {Object} enemy 
     */
    detectCollisionKind(enemy) {
        this.characterEnemyCollisiondetected = true;
        this.lastCollision = new Date().getTime();
        if (!enemy.isDead() && !this.character.isComingFromTop(enemy)) {
            this.hurtCharacter(enemy);
        } else if (!enemy.hasHurt && this.character.isComingFromTop(enemy) && this.character.speedY < 0 && this.character.isJumping && !this.collisionsReactionRuns) {
            this.hurtEnemy(enemy);
        }
    }

    /**
     * This function hurts the character and makes him react differently when an anemy or the boss attacks.
     * 
     * @param {Object} enemy 
     */
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

    /**
     * This function hurts the enemy if enemy is instance of endboss class or kill the enemy if he is not.
     * 
     * @param {Object} enemy 
     */
    hurtEnemy(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(5);
            if (!enemy.isDead()) {
                this.character.hitRreaction(360, 20);
                this.character.speedY = 15;
            }
        } else {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        enemy.playEnemyHitSound();
        if (!enemy.isDead()) {
            this.character.speedY = 20;
        }
        enemy.energy = 0;
        this.character.countEnemies();
    }

    /**
     * This function checks if character collides with a collectable object and lets the character collect.
     */
    checkCollectableObjectCollisions() {
        this.level.collectableObjects.forEach((obj, i) => {
            if (this.character.isColliding(obj)) {
                this.collectItem(obj, i);
                if (obj instanceof Coin) {
                    this.collectCoin();
                } else if (obj instanceof Bottle && this.character.bottles < 5) {
                    playSound(SOUNDS.bottle.COLLECT.SOUND);
                }
            }
            i++;
        });
    }

    /**
     * This function collects a coin. If user collects 5 Coins this function gets his coins and gives a bottle to the character.
     */
    collectCoin() {
        playSound(SOUNDS.coins.COLLECT.SOUND);
        if (this.character.coins === 5 && this.character.bottles < 5) {
            this.character.bottles++;
            this.character.coins = 0;
            SOUNDS.coins.COLLECT.SOUND.pause();
            playSound(SOUNDS.bottle.COLLECT.SOUND);
        }
    }

    /**
     * This function makes the character collecting a bottel o a coin and deletes the item in level.
     * 
     * @param {Object} obj 
     * @param {number} i 
     */
    collectItem(obj, i) {
        if (obj instanceof Coin) {
            this.character.coins++;
            this.statusBarCoin.percentage += 20;
            this.level.collectableObjects.splice(i, 1);
        } else if (this.character.bottles < 5) {
            this.character.bottles++;
            this.statusBarBottle.percentage += 20;
            this.level.collectableObjects.splice(i, 1);
        }
    }

    /**
     * This function checks for dead enemies and deletes them after 1s.
     */
    checkForDeadEnemies() {
        let now = new Date().getTime();
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].deathTime > 0 && this.level.enemies[i].deathTime + 1000 <= now) {
                this.level.enemies[i].deleteAllIntervals();
                this.level.enemies.splice(i, 1);
            }
        }
    }

    /**
     * This function checks if character collected a bottle and throw cooled down and throw key is pushed.
     * If thats the case this function throwes a bottle and calls the delete bottle function.
     */
    checkThrowableObjects() {
        if (this.keyboard.throwKeyPush && this.character.bottles > 0 && this.bottleCooledDown()) {
            this.throwBottle();
            this.keyboard.throwKeyPush = false;
        }
        this.deleteBottle();
    }

    bottleCooledDown() {
        return this.lastBottleThrown + this.firingRate < new Date().getTime();
    }

    /**
     * This function let the bottle stay if bottle hits enemy or the ground and deletes the bottle if splash animation is done.
     */
    deleteBottle() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            if (this.throwableObjects[i].y >= 390) {
                this.throwableObjects[i].energy = 0;
                playSound(SOUNDS.throwableObject.SPLASH.SOUND);
                this.throwableObjects[i].deleteIntervals('gravities');
                this.throwableObjects[i].deleteIntervals('moves');
                SOUNDS.throwableObject.ROTATE.SOUND.pause();
            }
            if (this.throwableObjects[i].deathAnimationDone) {
                this.throwableObjects[i].deleteAllIntervals();
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    /**
     * This function throws a bottle and gives the bottle a different speed value depending on character moves.
     */
    throwBottle() {
        let bottle;
        if (this.keyboard.moveRightKeyPush) {
            bottle = new ThrowableObject(this.bottleSpawnX(), this.bottleSpawnY(), this.character.speed);
        } else if (this.keyboard.moveLeftKeyPush) {
            bottle = new ThrowableObject(this.bottleSpawnX(), this.bottleSpawnY(), -this.character.speed);
        } else {
            bottle = new ThrowableObject(this.bottleSpawnX(), this.bottleSpawnY(), 0);
        }
        this.throwableObjects.push(bottle);
        this.lastBottleThrown = new Date().getTime();
        this.character.bottles--;
        playSound(SOUNDS.throwableObject.ROTATE.SOUND);
    }

    bottleSpawnX() {
        return this.character.x + (this.character.width / 3);
    }

    bottleSpawnY() {
        return  this.character.y + (this.character.height / 2);
    }

    /**
     * This function clears the canvas context moves the context to character and draws the scene.
     * After that translating context back and draw HUD. Also repeats this function every frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x + this.cameraToCharacter, 0);
        this.drawScene();
        this.ctx.translate(-this.camera_x - this.cameraToCharacter, 0);
        this.drawHUD();
        let self = this;
        this.requestId = requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * This function draws the scene including character, backgrounds and items.
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
     * This function draws the HUD and lets boss status bar become visible when it is needed.
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
     * This function gets an array of objects and add each to the canvas context.
     * 
     * @param {Array} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * This function draws an object on the canvas and flips it if its property other direction is true. Also flips back after drawing fliped image.
     * 
     * @param {Object} object 
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
        try {
            object.draw(this.ctx);
        } catch (e) {
            console.warn('Failed to load image in world.class.js. Error: ' + e);
            console.error('Can not load image: ' + this.img.src);
        }
        if (object.otherDirection) {
            this.flipImageBack();
        }
    }

    /**
     * This function saves the context and flips it.
     * 
     * @param {Object} object 
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width + 2 * object.x, 0);
        this.ctx.scale(-1, 1);
    }

    /**
     * This function restores canvas context so it flips back.
     */
    flipImageBack() {
        this.ctx.restore();
    }
}