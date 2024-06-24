let canvas;
let ctx;
let world;
let keybord = new Keyboard();
let activeIntervals = [];
let pauseIntervals = [];
let intervals = [];
let comingEnemyId = 0;
let bossStatusbarIsShown = false;

let intervalValues = {
    character: {
        moves: 1000 / 60,
        animations: {
            default: 100,
            idle: 140
        },
        gravity: 1000 / 60
    },
    enemies: {
        moves: 1000 / 60,
        animations: 120
    },
    endboss: {
        moves: 1000 / 60,
        animations: 200,
        gravity: 1000 / 60
    },
    world: {
        run: 5
    },
    throwableObjects: {
        moves: 20,
        animations: 100,
        gravity: 1000 / 60
    },
    collectableObjects: {
        coins: {
            animations: 1000 / 3
        },
        bottles: {
            animations: 1000 / 2
        }
    }
};


function clearAllIntervals() {
    intervals.activeIntervals.forEach((interval) => {
        clearInterval(interval);
    });
}

function init() {
    canvas = document.getElementById('canvas');
    initLevel1();
    world = new World(canvas, keybord);
}

window.addEventListener('keydown', (e) => {
    if (start) {
        switch (e.code) {
            case (world.keyboard.jumpKeys[0]):
            case (world.keyboard.jumpKeys[1]):
            case (world.keyboard.jumpKeys[2]):
                keybord.jumpKeyPush = true;
                break;
            case (world.keyboard.moveLeftKeys[0]):
            case (world.keyboard.moveLeftKeys[1]):
            case (world.keyboard.moveLeftKeys[2]):
                keybord.moveLeftKeyPush = true;
                break;
            case (world.keyboard.moveRightKeys[0]):
            case (world.keyboard.moveRightKeys[1]):
            case (world.keyboard.moveRightKeys[2]):
                keybord.moveRightKeyPush = true;
                break;
            case (world.keyboard.throwKeys[0]):
            case (world.keyboard.throwKeys[1]):
            case (world.keyboard.throwKeys[2]):
                keybord.throwKeyPush = true;
                break;
            default:
                break;
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (start) {
        switch (e.code) {
            case (world.keyboard.jumpKeys[0]):
            case (world.keyboard.jumpKeys[1]):
            case (world.keyboard.jumpKeys[2]):
                keybord.jumpKeyPush = false;
                break;
            case (world.keyboard.moveLeftKeys[0]):
            case (world.keyboard.moveLeftKeys[1]):
            case (world.keyboard.moveLeftKeys[2]):
                keybord.moveLeftKeyPush = false;
                break;
            case (world.keyboard.moveRightKeys[0]):
            case (world.keyboard.moveRightKeys[1]):
            case (world.keyboard.moveRightKeys[2]):
                keybord.moveRightKeyPush = false;
                break;
            case (world.keyboard.throwKeys[0]):
            case (world.keyboard.throwKeys[1]):
            case (world.keyboard.throwKeys[2]):
                keybord.throwKeyPush = false;
                break;
            default:
                break;
        }
    }
});


let start = false;
function startPauseGame() {
    if (!start) {
        start = true;
        init();
    } else if (!world.endbossAnimationRuns) {
        pause();
    }
}

let isPause = false;
let endbossMoveWasOn = false;
let endbossAnimateWasOn = false;

function pause() {
    if (isPause) {
        world.level.enemies.forEach((enemy) => {
            enemy.animate();
            enemy.move();
        });
        world.character.animate();
        world.character.move();
        world.character.applyGravity(intervalValues.character.gravity);
        if (world.endbossAnimationHasRun) {
            world.endboss.applyGravity(intervalValues.endboss.gravity);
            if (endbossMoveWasOn) {
                world.endboss.move();
            }
            if (endbossAnimateWasOn) {
                world.endboss.animate();
            }
        }
        isPause = false;
    } else {
        isPause = true;
        world.level.enemies.forEach((enemy) => {
            enemy.deleteAllIntervals();
        });
        world.character.deleteAllIntervals();
        if (world.endbossAnimationHasRun) {
            if (world.endboss.intervals.moves.length === 0) {
                endbossMoveWasOn = false;
            } else {
                endbossMoveWasOn = true;
            }
            if (world.endboss.intervals.animations.length === 0) {
                endbossAnimateWasOn = false;
            } else {
                endbossAnimateWasOn = true;
            }

            world.endboss.deleteAllIntervals();

        }
    }
}


function restartGame() {
    world = null;
    resetGlobalVariables();
    deleteAllIntervals();
    init();
}

function resetGlobalVariables() {
    comingEnemyId = 0;
    bossStatusbarIsShown = false;
    animatinCount = 0;
    characterPosition = 3800;
}


function deleteAllIntervals() {
    activeIntervals.forEach(interval => {
        clearInterval(interval);
    });
}

// function registerInterval(pause, functionToRecall, interval, intervalFunction, className, callerId = null) {
//     let id = setInterval(() => {
//         eval(functionToRecall);
//     }, interval);

//     intervals.push({
//         id: id,
//         pause: pause,
//         recallFunction: functionToRecall, // Function to recall this interval
//         interval: interval,
//         className: className,
//         intervalFunction: intervalFunction, // Kind of function.
//         callerId: callerId,
//         isRunning: true
//     });
// }

// function deleteIntervals(pause) {
//     if (pause) {
//         intervals.forEach(interval => {
//             if (interval.pause) {
//                 clearInterval(interval.id);
//                 interval.isRunning = false;
//             }
//         });
//     } else {
//         intervals.forEach(interval => clearInterval(interval.id));
//         intervals = [];
//     }
// }

// function restartPauseIntervals() {
//     let i = 0;
//     intervals.forEach(interval => {
//         i++;
//         if (interval.pause) {
//             registerInterval(interval.pause, interval.functionToRecall, interval.interval, interval.intervalFunction, interval.className);
//             intervals.splice(i, 1);
//             i--
//         }
//     });
// }

// function deleteIntervalsByClassName(className) {
//     for (let i = 0; i < intervals.length; i++) {
//         if (intervals[i].className === className) {
//             clearInterval(intervals[i].id);
//             intervals.splice(i, 1);
//             i--;
//         }
//     }
// }

// function deleteIntervalsByClassAndFunctionNames(className, intervalFunction) {
//     for (let i = 0; i < intervals.length; i++) {
//         if (intervals[i].className === className && intervals[i].intervalFunction === intervalFunction) {
//             clearInterval(intervals[i].id);
//             intervals.splice(i, 1);
//             i--;
//         }
//     }
// }
// function deleteIntervalById(id) {
//     for (let i = 0; i < intervals.length; i++) {
//         if (intervals[i].callerId === id) {
//             clearInterval(intervals[i].id);
//             intervals.splice(i, 1);
//             i--;
//         }
//     }
// }
