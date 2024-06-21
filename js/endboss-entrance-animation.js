
function checkForEndbossAnimation() {
    if (world.character.x > 3800 && !world.endbossAnimationRuns && !world.endbossAnimationHasRun) {
        world.endbossAnimationRuns = true;
        runEndbossAnimation();
    }
}

function runEndbossAnimation() {
    world.character.deleteAllIntervals();
    cameraInAnimation();
}

function cameraInAnimation() {
    let camaraAnimate = setInterval(() => {
        if (world.camera_x >= -4300) {
            world.camera_x -= 2;
        } else {
            clearInterval(camaraAnimate);
            bossEntrenceAnimation();
        }
    }, 1000 / 60);
}

function bossEntrenceAnimation() {
    let bossEntrence = setInterval(() => {
        if (world.endboss.x > 4700) {
            world.endboss.x--;
        } else {
            clearInterval(bossEntrence);
            bossAlertAnimation();
        }
    }, 20);
}

function bossAlertAnimation(animatinCount = 0, cameraOut = false) {
    clearEnemies();

    world.endboss.deleteIntervals('animations');
    world.endboss.deleteIntervals('moves');
    let alertAnimation = setInterval(() => {
        if (world.endboss.currentImage < world.endboss.IMAGES_ALERT.length - 1 || animatinCount < 2) {
            if (world.endboss.currentImage === world.endboss.IMAGES_ALERT.length - 1) {
                animatinCount++;
            }
            world.endboss.playAnimation(world.endboss.IMAGES_ALERT);
        } else {
            clearInterval(alertAnimation);
            if (cameraOut) {
                world.endboss.animate();
                let movingLeft = setInterval(() => {
                    if (world.endboss.x >= 4000) {
                        world.endboss.moveLeft();
                    } else {
                        clearInterval(movingLeft);
                        world.endboss.deleteIntervals('animations');
                        bossAttackAnimation(true);
                    }
                }, 1000 / 60);
                cameraOutAnimation();
            } else {
                bossAttackAnimation();
            }
        }
    }, 1000 / 8);
}

function clearEnemies() {
    world.level.enemies.forEach(enemie => {
        if (!enemie instanceof Endboss) {
            enemie.deleteAllIntervals();
        }
    });
    world.level.enemies.splice(0, world.level.enemies.length - 1);
}

function bossAttackAnimation(end = false) {
    let distance = 3800;
    if (!end) {
        world.endboss.applyGravity(intervalValues.endboss.gravity);
        distance = 4500;
    }
    world.endboss.speedY = 22;
    world.endboss.currentImage = 0;
    let animatingCharacter = false;
    // deleteIntervalsByClassName('endboss');
    let jump = setInterval(() => {
        if (world.endboss.isAboveGround() || world.endboss.x >= distance) {
            world.endboss.x -= 4;
        } else {
            clearInterval(jump);
            earthquakeAnimation(end);
        }
    }, 10);
    let attack = setInterval(() => {
        if (world.endboss.currentImage < world.endboss.IMAGES_ATTACK.length - 1) {
            world.endboss.playAnimation(world.endboss.IMAGES_ATTACK);
            // console.log(world.endboss.currentImage + ' + ' + attack);
        } else {
            clearInterval(attack);
            // world.endboss.animate();
        }
    }, 100);
}

function earthquakeAnimation(end = false, attack = false) {
    if (attack) {
        world.earthquakeDone = false;
    }
    let yMax = 25;
    let y = 0;
    let quotient = 2;
    let moveUp = true;
    let translate = 0;
    let earthquake = setInterval(() => {
        if (y <= yMax && moveUp) {
            y++;
            world.ctx.translate(0, 3 / (quotient / 10));
            translate -= 3 / (quotient / 10);
            quotient *= quotient;
            // console.log(translate);
            if (y == yMax) {
                moveUp = false;
                y = 0;
                yMax -= 5;
                quotient = 2;
            }
        } else if (y <= yMax && !moveUp) {
            y++;
            world.ctx.translate(0, -3.3 / (quotient / 10));
            translate += 3.3 / (quotient / 10);
            quotient *= quotient;
            // console.log(translate);
            if (y == yMax) {
                moveUp = true;
                y = 0;
                yMax -= 5;
                quotient = 2;
            }
        }
        if (yMax <= 0) {
            clearInterval(earthquake);
            world.ctx.translate(0, translate);
            world.earthquakeDone = true;
            if (!end && !attack) {
                world.character.applyGravity(intervalValues.character.gravity);
                bossAlertAnimation(1, true);
            } else if (attack) {
                // bossAlertAnimation(1, true);
                world.bossFightDone = true;
                world.bossFightStarted = false;
            }
            world.endboss.isAttacking = false;
            if (end) {
                world.endbossAnimationRuns = false;
                world.endbossAnimationHasRun = true;
            }
        }
    }, 0.1);
}

function cameraOutAnimation() {
    world.character.otherDirection = true;
    world.character.tookIdleTime = true;
    world.character.idleTime = new Date().getTime() - 111000;
    world.character.animateIdle();
    let camaraAnimate = setInterval(() => {
        if (world.camera_x <= -3800) {
            world.camera_x += 4;
        } else {
            clearInterval(camaraAnimate);
            world.character.move();
            world.bossCameraActiv = true;
            // world.endbossAnimationHasRun = true;
        }
    }, 1000 / 60);
}
