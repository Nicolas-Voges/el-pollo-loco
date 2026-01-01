let bossFightStarted = false;
let bossFightDone = true;
let attackJumpStarted = false;
let bossAttackAnimationRuns = false;
let soundCounter = 0;

/**
 * This function checks if end boss animation has run and calls boss fight if thats the case.
 * Otherwise it adjusts the positions of backgrounds.
 */
function checkForEndbossFight() {
    if (endbossAnimationHasRun) {
        bossFight();
    } else {
        changeBackgroundPosition();
    }
}

/**
 * This function checks whether the game is paused. If thats not the case this function animates boss.
 * Also it checks if alert animation should run and starts animation, or
 * if alert animation is done and starts attack.
 */
function bossFight() {
    if (!isPause) {
        world.endboss.animate();
        if (!bossFightStarted && bossFightDone && bossAttackCooledDown()) {
            alertBoss();
        }
        if (world.endboss.alertDone) {
            world.endboss.isAlert = false;
            world.endboss.move();
            changeDirectionOrAttack();
        }
    }
}

/**
 * This function checks if boss attack cooled down and
 * 
 * @returns {boolean} true if thats the case.
 */
function bossAttackCooledDown() {
    return new Date().getTime() - world.lastAttack > 1000;
}

/**
 * This function sets booleans to start alert animation.
 */
function alertBoss() {
    bossFightDone = false;
    world.endboss.isAlert = true;
    bossFightStarted = true;
    if (soundCounter > 3) {
        playSound(SOUNDS.endboss.ALERT.SOUND);
        soundCounter = 0;
    } else {
        soundCounter++;
    }
}

/**
 * This function checks the boss position relative to the character and changes the direction of the boss
 * or starts the attack.
 */
function changeDirectionOrAttack() {
    if (world.endboss.width + world.endboss.x < world.character.x - 200 && !world.endboss.isAttacking) {
        world.endboss.directionX = 'Right';
    } else if (world.endboss.x > world.character.x + world.character.width + 200 && !world.endboss.isAttacking) {
        world.endboss.directionX = 'Left';
    } else {
        world.endboss.directionX = 'Stay';
        if (!world.endboss.isAttacking && world.endboss.alertDone && !world.endboss.isAboveGround() && new Date().getTime() - world.lastAttack > 2000) {
            world.endboss.alertDone = false;
            bossAttack();
        }
    }
}

/**
 * This function checks if character reached distance and increaces characters x value if thats not the case.
 * If character reached screen end this function sets characters x value to screen end on the right.
 * If character reached distance, after a time out it calls function to ending hit reaction.
 * 
 * @param {number} xStart 
 * @param {number} distance 
 * @param {number} id 
 * @param {number} braceUpTime 
 */
function endbossHitReactionLeft(xStart, distance, id, braceUpTime) {
    if (world.character.x < xStart + distance) {
        world.character.x += 5;
        if (world.character.x > 4318) {
            world.character.x = 4318;
            world.character.hitRreactionEnd(id, braceUpTime);
        }
    } else {
        world.character.hitRreactionEnd(id, braceUpTime);
    }
}

/**
 * This function checks if character reached distance and decreaces characters x value if thats not the case.
 * If character reached screen end this function sets characters x value to screen end on the left.
 * If character reached distance, after a time out it calls function to ending hit reaction.
 * 
 * @param {number} xStart 
 * @param {number} distance 
 * @param {number} id 
 * @param {number} braceUpTime 
 */
function endbossHitReactionRight(xStart, distance, id, braceUpTime) {
    if (world.character.x > xStart - distance) {
        world.character.hitReactionRuns = true;
        world.character.x -= 5;
        if (world.character.x < 3696) {
            world.character.x = 3696;
            world.character.hitRreactionEnd(id, braceUpTime);
        }
    } else {
        world.character.hitRreactionEnd(id, braceUpTime);
    }
}

/**
 * This function makes the boss jump and plays attack animation.
 */
function bossAttack() {
    if (!world.endboss.isAttacking) {
        initAttack();
    }
    bossJumpAttack();
    world.endboss.deleteIntervals('animations');
    world.endboss.deleteIntervals('moves');
    bossFightAttackAnimation();
}

/**
 * This function sets the parameters to start the boss attack.
 */
function initAttack() {
    world.endboss.isAttacking = true;
    world.endboss.speedY = 22;
    world.lastAttack = new Date().getTime();
    world.earthquakeStarted = false;
}

/**
 * This function gets th current character position. In an interval it checks whether the game is paused and checks jump progress.
 * Also alows the earthquake to restart.
 */
function bossJumpAttack() {
    let xPlayer = world.character.x;
    let jump = setInterval(() => {
        if (!isPause) {
            checkJumpProgress(xPlayer, jump);
            if (!world.earthquakeStarted && world.endboss.speedY <= 0 && !world.endboss.isAboveGround() && earthquakeDone) {
                world.earthquakeStarted = true;
            }
        }
    }, 10);
    activeIntervals.push(jump);
}

/**
 * This function checks if boss is above ground and moves it to gotten character position if thats the case.
 * Also ends the jump when the boss has landed.
 * 
 * @param {number} xPlayer 
 * @param {number} jump 
 */
function checkJumpProgress(xPlayer, jump) {
    if (world.endboss.isAboveGround()) {
        moveToCharacter(xPlayer);
    } else if (attackJumpStarted) {
        endJump(jump);
    }
}

/**
 * This function clears the jump interval and starts earthquake.
 * 
 * @param {number} jump 
 */
function endJump(jump) {
    clearInterval(jump);
    activeIntervals.splice(activeIntervals.indexOf(jump), 1);
    attackJumpStarted = false;
    earthquakeAnimation(false, true);
}

/**
 * This functiion moves the boss to the gotten character position.
 * 
 * @param {number} xPlayer 
 */
function moveToCharacter(xPlayer) {
    attackJumpStarted = true;
    if ((world.endboss.width / 2) + world.endboss.x < xPlayer + (world.character.width / 2) - 4) {
        world.endboss.otherDirection = true;
        world.endboss.x += 4;
    } else if ((world.endboss.width / 2) + world.endboss.x > xPlayer + (world.character.width / 2) + 4) {
        world.endboss.otherDirection = false;
        world.endboss.x -= 4;
    }
}

/**
 * This function plays the attack animation in an interval and saves intervals id.
 */
function bossFightAttackAnimation() {
    if (!bossAttackAnimationRuns) {
        let attack = setInterval(() => {
            if (!isPause) {
                checkAttackAnimationProgress(attack);
            }
        }, 90);
        activeIntervals.push(attack);
    }
}

/**
 * This function checks attack animation progress and clears interval if its done.
 * 
 * @param {number} attack 
 */
function checkAttackAnimationProgress(attack) {
    bossAttackAnimationRuns = true;
    if (world.endboss.currentImage < world.endboss.IMAGES_ATTACK.length - 1 && attackJumpStarted) {
        world.endboss.playAnimation(world.endboss.IMAGES_ATTACK);
    } else if (attackJumpStarted && !world.endboss.isAboveGround()) {
        clearInterval(attack);
        activeIntervals.splice(activeIntervals.indexOf(attack), 1);
        bossAttackAnimationRuns = false;
    }
}