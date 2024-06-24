function bossFight() {
    if (!isPause) {
        world.endboss.animate();
        let xPlayer = world.character.x;
        if (!world.bossFightStarted && world.bossFightDone && new Date().getTime() - world.lastAttack > 1000) {
            world.bossFightDone = false;
            world.endboss.isAlert = true;
            world.bossFightStarted = true;
        }
        if (world.endboss.alertDone) {
            world.endboss.isAlert = false;
            world.endboss.move();
            if (world.endboss.width + world.endboss.x < xPlayer - 200 && !world.endboss.isAttacking) {
                world.endboss.directionX = 'Right';
            } else if (world.endboss.x > xPlayer + world.character.width + 200 && !world.endboss.isAttacking) {
                world.endboss.directionX = 'Left';
            } else {
                world.endboss.directionX = 'Stay';
                if (!world.endboss.isAttacking && world.endboss.alertDone && !world.endboss.isAboveGround() && new Date().getTime() - world.lastAttack > 2000) {
                    world.endboss.alertDone = false;
                    bossAttack();
                }
            }
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


function bossAttack() {
    if (!world.endboss.isAttacking) {
        world.endboss.isAttacking = true;
        world.endboss.speedY = 22;
        world.lastAttack = new Date().getTime();
        world.earthquakeStarted = false;
    }
    let xPlayer = world.character.x;
    let jump = setInterval(() => {
        if (!isPause) {
            if (world.endboss.isAboveGround()) {
                world.attackJumpStarted = true;
                if ((world.endboss.width / 2) + world.endboss.x < xPlayer + (world.character.width / 2) - 4) {
                    world.endboss.otherDirection = true;
                    world.endboss.x += 4;
                } else if ((world.endboss.width / 2) + world.endboss.x > xPlayer + (world.character.width / 2) + 4) {
                    world.endboss.otherDirection = false;
                    world.endboss.x -= 4;
                }
            } else if (world.attackJumpStarted) {
                clearInterval(jump);
                activeIntervals.splice(activeIntervals.indexOf(jump), 1);
                world.attackJumpStarted = false;
                earthquakeAnimation(false, true);
            }
            if (!world.earthquakeStarted && world.endboss.speedY <= 0 && !world.endboss.isAboveGround() && world.earthquakeDone) {
                world.earthquakeStarted = true;
            }
        }
    }, 10);
    activeIntervals.push(jump);
    world.endboss.deleteIntervals('animations');
    world.endboss.deleteIntervals('moves');
    if (!world.bossAttackAnimationRuns) {
        let attack = setInterval(() => {
            if (!isPause) {
                world.bossAttackAnimationRuns = true;
                if (world.endboss.currentImage < world.endboss.IMAGES_ATTACK.length - 1 && world.attackJumpStarted) {
                    world.endboss.playAnimation(world.endboss.IMAGES_ATTACK);
                } else if (world.attackJumpStarted && !world.endboss.isAboveGround()) {
                    clearInterval(attack);
                    activeIntervals.splice(activeIntervals.indexOf(attack), 1);
                    world.bossAttackAnimationRuns = false;
                }
            }
        }, 90);
        activeIntervals.push(attack);
    }
}