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

    /**
     * Dramatischere Musik abspielen, sobald der Endboss in Erscheinung tritt und eine kleine Videosequenz, die damit anfängt,
     * das Pepe ein fragendes "Hö?" von sich gibt und der Charakter stehen bleibt und der User nicht mehr steuern kann, außer springen.
     * Dann fährt die Kamera weiter nach Rechts und der Endboss geht normal da lang in Richtung Pepe, aber der Endboss ist noch nicht
     * auf einem Bildschirm mit Pepe. Dann kommt das Metal Gear Solid Geräusch, wenn der Gegner einen entdeckt. Bzw. ein ähnliches Geräusch.
     * Die Animation Alerta wird sogleich abgespielt und dann macht der Endboss eine Attacke ins Leere, um seine Kraft zu demonstrieren
     * und die Kamera soll so wackeln, wie bei einer erschütterung. Dann kommt ein Kampfschrei und der Endboss rennt los und springt.
     * Sobald der Endboss springt, fährt die Kamera zurück auf Pepe und dann muss der User schnell reagieren, weil die Sequenz damit endet
     * und sobald die Kamera ihn wieder fixiert hat, ist Pepe wieder steuerbar. Der User soll entkommen können, wenn er innerhalb von
     * bspw. 250ms reagiert. Dann geht der Kampf los und das Huhn muss Pepe verfolgen
     *  
     * */


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
            this.checkForEndbossAnimation();
            if (this.bossCameraActiv) {
                this.bossCamera();
            }
            if (this.endbossAnimationHasRun) {
                this.bossFight();
            }
        }, 10);
        this.intervals.push(intervalWorldRun);
        activeIntervals.push(intervalWorldRun);
    }

    bossFightStarted = false;
    bossFightDone = true;
    bossFight() {
        this.endboss.animate();
        let xPlayer = this.character.x;
        if (!this.bossFightStarted && this.bossFightDone && new Date().getTime() - this.lastAttack > 2000) {
            this.bossFightDone = false;
            this.endboss.isAlert = true;
            this.bossFightStarted = true;
        }
        if (this.endboss.alertDone) {
            this.endboss.isAlert = false;
            if (this.endboss.width + this.endboss.x < xPlayer - 200 && !this.endboss.isAttacking) {
                // gehe zum Charaker
                this.endboss.directionX = 'Right';
                console.log(this.endboss.directionX + 'bei RIGHT');
            } else if (this.endboss.x > xPlayer + this.character.width + 200 && !this.endboss.isAttacking) {
                // gehe zum Charaker
                this.endboss.directionX = 'Left';
                console.log(this.endboss.directionX + 'bei LEFT');
            } else {
                this.endboss.directionX = 'Stay';
                console.log(this.endboss.directionX + 'bei STAY');
                // attackiere
                if (!this.endboss.isAttacking && this.endboss.alertDone && !this.endboss.isAboveGround() && new Date().getTime() - this.lastAttack > 2000) {
                    this.endboss.alertDone = false;
                    this.bossAttack();
                }


                // warte Erschütterung ab
                // if (this.earthquakeDone) {
                //     this.endboss.alertDone = false;
                //     this.endboss.isAlert = true;
                //     this.earthquakeDone = false;
                // }

                // starte alert erneut.

            }
        }
    }

    checkForEndbossAnimation() {
        if (this.character.x > 3800 && !this.endbossAnimationRuns && !this.endbossAnimationHasRun) {
            this.endbossAnimationRuns = true;
            this.runEndbossAnimation();
        }
    }

    runEndbossAnimation() {
        this.character.deleteAllIntervals();
        this.cameraInAnimation();
    }

    cameraInAnimation() {
        let camaraAnimate = setInterval(() => {
            if (this.camera_x >= -4300) {
                this.camera_x -= 2;
            } else {
                clearInterval(camaraAnimate);
                this.bossEntrenceAnimation();
            }
        }, 1000 / 60);
    }

    bossEntrenceAnimation() {
        let bossEntrence = setInterval(() => {
            if (this.endboss.x > 4700) {
                this.endboss.x--;
            } else {
                clearInterval(bossEntrence);
                this.bossAlertAnimation();
            }
        }, 20);
    }

    bossAlertAnimation(animatinCount = 0, cameraOut = false) {
        this.clearEnemies();
        this.endboss.deleteIntervals('animations');
        this.endboss.deleteIntervals('moves');
        let alertAnimation = setInterval(() => {
            if (this.endboss.currentImage < this.endboss.IMAGES_ALERT.length - 1 || animatinCount < 2) {
                if (this.endboss.currentImage === this.endboss.IMAGES_ALERT.length - 1) {
                    animatinCount++;
                }
                this.endboss.playAnimation(this.endboss.IMAGES_ALERT);
            } else {
                clearInterval(alertAnimation);
                if (cameraOut) {
                    this.endboss.animate();
                    let movingLeft = setInterval(() => {
                        if (this.endboss.x >= 4000) {
                            this.endboss.moveLeft();
                        } else {
                            clearInterval(movingLeft);
                            // this.endboss.deleteIntervals('animations');
                            this.bossAttackAnimation(true);
                        }
                    }, 1000 / 60);
                    this.cameraOutAnimation();
                } else {
                    this.bossAttackAnimation();
                }
            }
        }, 1000 / 8);
    }

    clearEnemies() {
        this.level.enemies.forEach(enemie => {
            if (!enemie instanceof Endboss) {
                enemie.deleteAllIntervals();
            }
        });
        this.level.enemies.splice(0, this.level.enemies.length - 1);
    }
    attackJumpStarted = false;
    bossAttack() {
        if (!this.endboss.isAttacking) {
            this.endboss.isAttacking = true;
            this.endboss.speedY = 22;
            this.lastAttack = new Date().getTime();
            this.earthquakeStarted = false;
        }
        let xPlayer = this.character.x;
        let jump = setInterval(() => {
            if (this.endboss.isAboveGround()) {
                this.attackJumpStarted = true;
                if ((this.endboss.width / 2) + this.endboss.x < xPlayer + (this.character.width / 2) - 4) {
                    this.endboss.otherDirection = true;
                    this.endboss.x += 4;

                } else if ((this.endboss.width / 2) + this.endboss.x > xPlayer + (this.character.width / 2) + 4) {

                    this.endboss.otherDirection = false;
                    this.endboss.x -= 4;
                }
            } else if (this.attackJumpStarted) {
                clearInterval(jump);
                this.attackJumpStarted = false;
                this.earthquakeAnimation(false, true);
            }


            if (!this.earthquakeStarted && this.endboss.speedY <= 0 && !this.endboss.isAboveGround() && this.earthquakeDone) {
                this.earthquakeStarted = true;
                // this.earthquakeAnimation(false, true);
            }
        }, 10);
    }

    bossAttackAnimation(end = false) {
        let distance = 3800;
        if (!end) {
            this.endboss.applyGravity();
            distance = 4500;
        }
        this.endboss.speedY = 22;
        this.endboss.currentImage = 0;
        let animatingCharacter = false;
        this.endboss.deleteIntervals('animations');
        this.endboss.deleteIntervals('moves');
        let jump = setInterval(() => {
            if (this.endboss.isAboveGround() || this.endboss.x >= distance) {
                this.endboss.x -= 4;
            } else {
                clearInterval(jump);
                this.earthquakeAnimation(end);
            }
        }, 10);
        let attack = setInterval(() => {
            if (this.endboss.currentImage < this.endboss.IMAGES_ATTACK.length - 1) {
                this.endboss.playAnimation(this.endboss.IMAGES_ATTACK);
                console.log(this.endboss.currentImage + ' + ' + attack);
            } else {
                clearInterval(attack);
                // this.endboss.animate();
            }
        }, 100);
    }

    earthquakeAnimation(end = false, attack = false) {
        if (attack) {
            this.earthquakeDone = false;
        }
        let yMax = 25;
        let y = 0;
        let quotient = 2;
        let moveUp = true;
        let translate = 0;
        let earthquake = setInterval(() => {
            if (y <= yMax && moveUp) {
                y++;
                this.ctx.translate(0, 3 / (quotient / 10));
                translate -= 3 / (quotient / 10);
                quotient *= quotient;
                console.log(translate);
                if (y == yMax) {
                    moveUp = false;
                    y = 0;
                    yMax -= 5;
                    quotient = 2;
                }
            } else if (y <= yMax && !moveUp) {
                y++;
                this.ctx.translate(0, -3.3 / (quotient / 10));
                translate += 3.3 / (quotient / 10);
                quotient *= quotient;
                console.log(translate);
                if (y == yMax) {
                    moveUp = true;
                    y = 0;
                    yMax -= 5;
                    quotient = 2;
                }
            }
            if (yMax <= 0) {
                clearInterval(earthquake);
                this.ctx.translate(0, translate);
                this.earthquakeDone = true;
                if (!end && !attack) {
                    this.character.applyGravity();
                    this.bossAlertAnimation(1, true);
                } else if (attack) {
                    // this.bossAlertAnimation(1, true);
                    this.bossFightDone = true;
                    this.bossFightStarted = false;
                }
                this.endboss.isAttacking = false;
                if (end) {
                    this.endbossAnimationRuns = false;
                    this.endbossAnimationHasRun = true;
                }
            }
        }, 0.1);
    }

    cameraOutAnimation() {
        let camaraAnimate = setInterval(() => {
            if (this.camera_x <= -3800) {
                this.camera_x += 4;
            } else {
                clearInterval(camaraAnimate);
                this.character.animate();
                this.bossCameraActiv = true;
                // this.endbossAnimationHasRun = true;
            }
        }, 1000 / 60);
    }

    cameraIsMoving = false;

    bossCamera() {
        if (this.endboss.x > this.character.x + 200) {
            this.cameraIsMoving = false;
            if (this.cameraToCharacter > 100) {
                this.cameraToCharacter -= 2;
            }
        } else if (this.endboss.x < this.character.x - 140 - this.endboss.width) {
            if (this.cameraToCharacter < 600) {
                this.cameraIsMoving = true;
                this.cameraToCharacter += 2;
            }
        } else {
            this.cameraIsMoving = false;
            if (this.cameraToCharacter > 328 && this.cameraToCharacter < 332) {
                this.cameraToCharacter = 330;
            } else if (this.cameraToCharacter > 330) {
                this.cameraToCharacter -= 2;
            } else if (this.cameraToCharacter < 330) {
                this.cameraToCharacter += 2;
            }
        }
    }

    checkCollisions() {
        if (!this.endbossAnimationRuns) {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    if (!enemy.isDead() && !this.character.isComingFromTop(enemy)) { // Hier gucken, von wo der Enemy auf den Character trifft.
                        if (!enemy.hasHurt) {
                            enemy.hasHurt = true;
                            this.character.hit(enemy.energyAttack);
                            this.character.hitRreaction(100, 400);
                        }
                    } else if (!enemy.hasHurt && this.character.isComingFromTop(enemy) && this.character.speedY < 0 && this.character.isJumping) {
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
                    console.log(this.character.energy);
                } else {
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
                if (this.character.isMovingLeft) {
                    bgr.moveLeft();
                } else if (this.character.isMovingRight) {
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
                    if (this.character.isMovingLeft) {
                        cloud.speed = 1;
                    } else if (this.character.isMovingRight) {
                        cloud.speed = -1;
                    }
                    else {
                        cloud.speed = 0.03;
                    }
                });
            } else {
                this.level.cloudObjects.forEach((cloud) => {
                    cloud.speed = 0.03;
                });
                // clearInterval(cloudPosition);
            }
        }, 20);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x + this.cameraToCharacter, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.cloudObjects);
        this.addObjectsToMap(this.level.collectableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x - this.cameraToCharacter, 0);

        this.addToMap(this.statusBarEnergy);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);

        this.ctx.translate(this.camera_x + this.cameraToCharacter, 0);

        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x - this.cameraToCharacter, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

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

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width + 2 * object.x, 0);
        this.ctx.scale(-1, 1);
    }

    flipImageBack() {
        this.ctx.restore();
    }
}