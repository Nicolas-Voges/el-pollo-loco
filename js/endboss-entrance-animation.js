let animatinCount = 0;
let characterPosition = 3800;
let yMax = 25;
let y = 0;
let quotient = 2;
let moveUp = true;
let translate = 0;
let endbossAnimationRuns = false;
let endbossAnimationHasRun = false;
let earthquakeDone = false;
let sound_earthquake = SOUNDS.endboss.ATTACK.SOUND;

/**
 * This function checks if character reached end of level and endboss animation wasn´t running yet and
 * runs endboss animation if thats the case.
 */
function checkForEndbossAnimation() {
    if (world.character.x > 3800 && !endbossAnimationRuns && !endbossAnimationHasRun) {
        endbossAnimationRuns = true;
        runEndbossAnimation();
    }
}

/**
 * This function deletes characters intervals and calls camera in function.
 */
function runEndbossAnimation() {
    world.character.deleteAllIntervals();
    cameraInAnimation();
}

/**
 * This function lets the camera drive into the end scene in an interval and deletes the interval if
 * camera reached end point and calls the boss enterence function.
 */
function cameraInAnimation() {
    SOUNDS.character.WALKING.SOUND.pause();
    let camaraAnimate = setInterval(() => {
        if (world.camera_x >= -4300) {
            world.camera_x -= 2;
        } else {
            clearInterval(camaraAnimate);
            activeIntervals.splice(activeIntervals.indexOf(camaraAnimate), 1);
            bossEntrenceAnimation();
        }
    }, 1000 / 60);
    activeIntervals.push(camaraAnimate);
}

/**
 * This function animates endboss into the scene in an interval and deletes the interval if
 * endboss reached position for first attack. Than it calls boss alert function.
 */
function bossEntrenceAnimation() {
    let bossEntrence = setInterval(() => {
        if (world.endboss.x > 4700) {
            world.endboss.x--;
        } else {
            clearInterval(bossEntrence);
            activeIntervals.splice(activeIntervals.indexOf(bossEntrence), 1);
            bossAlertAnimation();
            bossStatusbarIsShown = true;
        }
    }, 20);
    activeIntervals.push(bossEntrence);
}

/**
 * This function deletes all enemies but not the endboss.
 * It deletes endboss intervals for moving and animations.
 * Also it calls run alert animation function and hands over the gotten
 * 
 * @param {boolean} cameraOut .
 */
function bossAlertAnimation(cameraOut = false) {
    clearEnemies();
    world.endboss.deleteIntervals('animations');
    world.endboss.deleteIntervals('moves');
    runAlertAnimation(cameraOut);
}

/**
 * This function plays the alert animation in an interval a few times and than calls the function to end alert animation and
 * hands over the gotten 
 * 
 * @param {boolean} cameraOut .
 */
function runAlertAnimation(cameraOut) {
    playSound(SOUNDS.endboss.ALERT.SOUND);
    let alertAnimation = setInterval(() => {
        if (world.endboss.currentImage < world.endboss.IMAGES_ALERT.length - 1 || animatinCount < 2) {
            countAndPlayAlertAnimation();
        } else {
            endAlertAnimation(alertAnimation, cameraOut);
        }
    }, 1000 / 8);
    activeIntervals.push(alertAnimation);
}

/**
 * This function ends alert animation by resetting animation counter and clears the interval for alert animation.
 * By considering the boolean cameraOut it runs the move left function or the boss attack function.
 * 
 * @param {number} alertAnimation 
 * @param {boolean} cameraOut 
 */
function endAlertAnimation(alertAnimation, cameraOut) {
    animatinCount = 0;
    clearInterval(alertAnimation);
    activeIntervals.splice(activeIntervals.indexOf(alertAnimation), 1);
    if (cameraOut) {
        runMoveLeftAnimation();
    } else {
        bossAttackAnimation();
    }
}

/**
 * This function increases the counter when the alert animation has passed and plays the alert animation.
 */
function countAndPlayAlertAnimation() {
    if (world.endboss.currentImage === world.endboss.IMAGES_ALERT.length - 1) {
        animatinCount++;
    }
    world.endboss.playAnimation(world.endboss.IMAGES_ALERT);
}

/**
 * This function runs the move left animation for endboss in an interval and deletes the interval, 
 * stops endboss animation and calls boss attack animation function if endboss
 * reached point for second attack.
 * Also this function calls the camera out function.
 */
function runMoveLeftAnimation() {
    world.endboss.animate();
    let movingLeft = setInterval(() => {
        if (world.endboss.x >= 4000) {
            world.endboss.moveLeft();
        } else {
            stopMovingLeft(movingLeft);
        }
    }, 1000 / 60);
    activeIntervals.push(movingLeft);
    cameraOutAnimation();
}

/**
 * This function stops moving left interval and deletes it. Also calls boss attack animation function.
 */
function stopMovingLeft(movingLeft) {
    clearInterval(movingLeft);
    activeIntervals.splice(activeIntervals.indexOf(movingLeft), 1);
    world.endboss.deleteIntervals('animations');
    bossAttackAnimation(true);
}

/**
 * This function deletes every interval of every enemy and the enemy itself instat it is instance of endboss.
 */
function clearEnemies() {
    world.level.enemies.forEach(enemie => {
        if (!enemie instanceof Endboss) {
            enemie.deleteAllIntervals();
        }
    });
    world.level.enemies.splice(0, world.level.enemies.length - 1);
}

/**
 * This function runs boss attack animation by setting distance to cross,
 * calling boss jump function and playing the attack animation.
 * Also it hands over the gotten 
 * @param {boolean} end .
 */
function bossAttackAnimation(end = false) {
    resetCharacterPosition(end);
    bossJump(end);
    playAttackAnimation();
}

/**
 * This function resets the character position if is gets
 * 
 * @param {boolean} end false.
 */
function resetCharacterPosition(end) {
    characterPosition = 3800;
    if (!end) {
        world.endboss.applyGravity(intervalValues.endboss.gravity);
        characterPosition = 4500;
    }
}

/**
 * This function gives endboss a positive speedY value, sets current image to 0 and
 * lets endboss jump on character position in an interval.
 * This function decrease endboss x position as long as endboss didn´t reached character position or
 * endboss is above its ground.
 * Also it clears the jump interval, calls earthquake animation and hands over the gotten
 * 
 * @param {boolean} end .
 */
function bossJump(end) {
    world.endboss.speedY = 22;
    world.endboss.currentImage = 0;
    let jump = setInterval(() => {
        if (world.endboss.isAboveGround() || world.endboss.x >= characterPosition) {
            world.endboss.x -= 4;
        } else {
            clearInterval(jump);
            activeIntervals.splice(activeIntervals.indexOf(jump), 1);
            earthquakeAnimation(end);
        }
    }, 10);
    activeIntervals.push(jump);
}

/**
 * This function plays the attack animation in an interval and deletes the interval if
 * attack animation has passed.
 */
function playAttackAnimation() {
    let attack = setInterval(() => {
        if (world.endboss.currentImage < world.endboss.IMAGES_ATTACK.length - 1) {
            world.endboss.playAnimation(world.endboss.IMAGES_ATTACK);
        } else {
            clearInterval(attack);
            activeIntervals.splice(activeIntervals.indexOf(attack), 1);
        }
    }, 100);
    activeIntervals.push(attack);
}

/**
 * This function animates a fading shock in an interval.
 * It moves the camera up end down till camera y position reached amplitude.
 * Also this function clears the interval and calls earthquake end function if
 * amplitude is equal or lower to 0 and hands over the gotten
 * 
 * @param {boolean} end and
 * @param {boolean} attack .
 */
function earthquakeAnimation(end = false, attack = false) {
    setBeginEarthquake(attack);
    let earthquake = setInterval(() => {
        if (notReachedAmplitude() && moveUp) {
            moveCameraUp();
        } else if (notReachedAmplitude() && !moveUp) {
            moveCameraDown();
        }
        if (yMax <= 0) {
            endEarthquake(end, attack, earthquake);
        }
    }, 0.1);
    activeIntervals.push(earthquake);
}

/**
 * This function beginns the earthquake if the
 * 
 * @param {boolean} attack is true.
 */
function setBeginEarthquake(attack) {
    if (attack) {
        earthquakeDone = false;
    }
    if (mobileDivice) {
        window.navigator.vibrate([250]);
    }
    playSound(sound_earthquake);
}

/**
 * This function checks if camera reached amplitude of fading shock and
 * 
 * @returns {boolean} false if thats the case.
 */
function notReachedAmplitude() {
    return y <= yMax;
}

/**
 * This function moves the camera up as further camera moved as slower the camera moves and sum up translation values.
 * Also it sets values for next move if camera reached amplitude.
 */
function moveCameraUp() {
    y++;
    world.ctx.translate(0, 3 / (quotient / 10));
    translate -= 3 / (quotient / 10);
    quotient *= quotient;
    if (y == yMax) {
        moveUp = false;
        y = 0;
        yMax -= 5;
        quotient = 2;
    }
}

/**
 * This function moves the camera up as further camera moved as slower the camera moves and sum up translation values.
 * Also it sets values for next move if camera reached amplitude.
 */
function moveCameraDown() {
    y++;
    world.ctx.translate(0, -3.3 / (quotient / 10));
    translate += 3.3 / (quotient / 10);
    quotient *= quotient;
    if (y == yMax) {
        moveUp = true;
        y = 0;
        yMax -= 5;
        quotient = 2;
    }
}

/**
 * This function ends the earthquake animation by resetting earthquake values by considering the gotten
 * 
 * @param {boolean} end and
 * @param {boolean} attack .
 */
function endEarthquake(end, attack, earthquake) {
    clearInterval(earthquake);
    activeIntervals.splice(activeIntervals.indexOf(earthquake), 1);
    resetGlobalEarthquakeValues();
    if (!end && !attack) {
        resetDefaultEarthquakeValues();
    } else if (attack) {
        resetAttackEarthquakeValues();
    }
    world.endboss.isAttacking = false;
    if (end) {
        resetEndEarthquakeValues();
    }
}

/**
 * This function resets default earthquake values.
 */
function resetDefaultEarthquakeValues() {
    world.character.applyGravity(intervalValues.character.gravity);
    animatinCount = 1;
    bossAlertAnimation(true);
}

/**
 * This function resets earthquake values if this function is called by attack function.
 */
function resetAttackEarthquakeValues() {
    bossFightDone = true;
    bossFightStarted = false;
}

/**
 * This function resets earthquake values if this function is called by end boss entrence function.
 */
function resetEndEarthquakeValues() {
    endbossAnimationRuns = false;
    endbossAnimationHasRun = true;
}

/**
 * This function resets global earthquake values.
 */
function resetGlobalEarthquakeValues() {
    world.ctx.translate(0, translate);
    earthquakeDone = true;
    yMax = 25;
    y = 0;
    quotient = 2;
    moveUp = true;
    translate = 0;
}

/**
 * This function lets character sleep and moves the camera back to the character.
 * Also it deletes the interval and activate character moves if camera reached character position.
 */
function cameraOutAnimation() {
    letCharacterSleep();
    let camaraAnimate = setInterval(() => {
        if (world.camera_x <= -3800) {
            world.camera_x += 4;
        } else {
            clearInterval(camaraAnimate);
            activeIntervals.splice(activeIntervals.indexOf(camaraAnimate), 1);
            world.character.move();
            world.bossCameraActiv = true;
        }
    }, 1000 / 60);
    activeIntervals.push(camaraAnimate);
}

/**
 * This function sets character values to let him sleep.
 */
function letCharacterSleep() {
    world.character.otherDirection = true;
    world.character.tookIdleTime = true;
    world.character.idleTime = new Date().getTime() - 111000;
    world.character.animateIdle();
}