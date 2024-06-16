function bossFight() {
    world.endboss.animate();
    let xPlayer = world.character.x;
    if (!world.bossFightStarted && world.bossFightDone && new Date().getTime() - world.lastAttack > 1000) {
        world.bossFightDone = false;
        world.endboss.isAlert = true;
        world.bossFightStarted = true;
    }
    if (world.endboss.alertDone) {
        world.endboss.isAlert = false;
        if (world.endboss.width + world.endboss.x < xPlayer - 200 && !world.endboss.isAttacking) {
            // gehe zum Charaker
            world.endboss.directionX = 'Right';
            // console.log(world.endboss.directionX + 'bei RIGHT');
        } else if (world.endboss.x > xPlayer + world.character.width + 200 && !world.endboss.isAttacking) {
            // gehe zum Charaker
            world.endboss.directionX = 'Left';
            // console.log(world.endboss.directionX + 'bei LEFT');
        } else {
            world.endboss.directionX = 'Stay';
            // console.log(world.endboss.directionX + 'bei STAY');
            // attackiere
            if (!world.endboss.isAttacking && world.endboss.alertDone && !world.endboss.isAboveGround() && new Date().getTime() - world.lastAttack > 2000) {
                world.endboss.alertDone = false;
                bossAttack();
            }


            // warte Erschütterung ab
            // if (world.earthquakeDone) {
            //     world.endboss.alertDone = false;
            //     world.endboss.isAlert = true;
            //     world.earthquakeDone = false;
            // }

            // starte alert erneut.

        }
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
            world.attackJumpStarted = false;
            earthquakeAnimation(false, true);
        }


        if (!world.earthquakeStarted && world.endboss.speedY <= 0 && !world.endboss.isAboveGround() && world.earthquakeDone) {
            world.earthquakeStarted = true;
            // world.earthquakeAnimation(false, true);
        }
    }, 10);

    world.endboss.deleteIntervals('animations');
    world.endboss.deleteIntervals('moves');
    if (!world.bossAttackAnimationRuns) {
        let attack = setInterval(() => {
            world.bossAttackAnimationRuns = true;
            if (world.endboss.currentImage < world.endboss.IMAGES_ATTACK.length - 1 && world.attackJumpStarted) {
                world.endboss.playAnimation(world.endboss.IMAGES_ATTACK);
                // console.log(world.endboss.currentImage + ' + ' + attack);
            } else if (world.attackJumpStarted && !world.endboss.isAboveGround()) {
                clearInterval(attack);
                world.bossAttackAnimationRuns = false;
            }
        }, 90);
    }
}

