let mobileDivice = false;
let canvas;
let ctx;
let world;
let keybord = new Keyboard();
let activeIntervals = [];
let pauseIntervals = [];
let intervals = [];
let comingEnemyId = 0;
let bossStatusbarIsShown = false;
let isPause = false;
let endbossMoveWasOn = false;
let endbossAnimateWasOn = false;
let start = false;
let pauseSetted = true;
let loadingComplete = false;
let intervalValues = {
    character: {
        moves: 1000 / 60,
        animations: {
            default: 80,
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


/**
 * This function plays a sound if sound is fully loaded to play.
 * 
 * @param {Object} sound 
 */
async function playSound(sound) {
    sound.pause();
    try {
        let isPlaying = sound.currentTime > 0 && !sound.paused && !sound.ended && sound.readyState > sound.HAVE_CURRENT_DATA;
        if (!isPlaying) {
            await sound.play();
        } else {

        }
    } catch (error) {

    }
}


/**
 * This function
 */
function isMobile() {
    mobileDivice = navigator.maxTouchPoints > 0 && /Android|iPhone|HUAWEI|huawei/i.test(navigator.userAgent);
    if (mobileDivice) {
        setForMobile();
    }
    return mobileDivice;
}

/**
 * This function
 */
function setForMobile() {
    document.querySelector('h1').classList.add('display-none');
    setMobil(document.getElementById('gameContainer'));
    setMobil(document.getElementById('canvas'));
    setMobil(document.getElementById('controlls'));
    document.getElementById('mobileControlls').classList.remove('visibility-hidden');
    document.getElementById('fullscreenButton').classList.add('display-none');
}

/**
 * This function
 * 
 * @param {Object} element 
 */
function setMobil(element) {
    element.style.width = '100%';
    element.style.height = '100vh';
    element.style.backgroundSize = 'contain';
}


function setFullscreen() {
    document.getElementById('canvas').requestFullscreen();
    document.activeElement.blur();
}

/**
 * This function initializes the game by creating level and world and
 * gives the world canvas and keboard.
 */
function init() {
    document.getElementById('startButton').classList.add('display-none');
    canvas = document.getElementById('canvas');
    initLevel1();
    world = new World(canvas, keybord);
    if (!loadingComplete) {
        setSounds();
        checkReadyState();
    }
}

/**
 * This function listens for key down events and sets the right booleans to true. 
 */
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
                if (world.bottleCooledDown()) {
                    keybord.throwKeyPush = true;
                }
                break;
            case (world.keyboard.pauseKeys[0]):
            case (world.keyboard.pauseKeys[1]):
            case (world.keyboard.pauseKeys[2]):
                keybord.pauseKeyPush = true;
                if (pauseSetted) {
                    pauseSetted = false;
                    startPauseGame();
                }
                break;
            default:
                break;
        }
    }
});

/**
 * This function listens for key up events and sets the right booleans to false.
 */
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
            default:
                break;
        }
    }
});

window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
});

function addTouchEvents() {
    let throwButton = document.getElementById('throwButton');
    let leftButton = document.getElementById('leftButton');
    let rightButton = document.getElementById('rightButton');
    let jumpButton = document.getElementById('jumpButton');
    throwButton.addEventListener('touchstart', () => {
        if (world.bottleCooledDown()) {
            keybord.throwKeyPush = true;
        }
    });
    throwButton.addEventListener('touchend', () => {
        document.activeElement.blur();
    });
    leftButton.addEventListener('touchstart', () => {
        keybord.moveLeftKeyPush = true;
    });
    leftButton.addEventListener('touchend', () => {
        keybord.moveLeftKeyPush = false;
        document.activeElement.blur();
    });
    rightButton.addEventListener('touchstart', () => {
        keybord.moveRightKeyPush = true;
    });
    rightButton.addEventListener('touchend', () => {
        keybord.moveRightKeyPush = false;
        document.activeElement.blur();
    });
    jumpButton.addEventListener('touchstart', () => {
        keybord.jumpKeyPush = true;
    });
    jumpButton.addEventListener('touchend', () => {
        keybord.jumpKeyPush = false;
        document.activeElement.blur();
    });
}

/**
 * This function starts the game if it is not already started.
 * If game already runs this function pauses the game if also endboss entrence animation is not running now.
 */
function startPauseGame() {
    if (!start) {
        start = true;
        document.getElementById('loading-animation-overlay').classList.remove('display-none');
        document.getElementById('canvas').style.backgroundImage = 'unset';
        addTouchEvents();
        init();
    } else if (!endbossAnimationRuns) {
        pause();
    }
}

/**
 * This function checks if game is pausing. If thats the case it calls set play function.
 * Otherwise calls the set pause function.
 */
function pause() {
    if (isPause) {
        setPlay();
    } else {
        setPause();
    }
    pauseSetted = true;
}

/**
 * This function lets the game play.
 */
function setPlay() {
    document.getElementById('pauseButton').style.backgroundImage = `url('img/icons/pause.png')`;
    setEnemiesPlay();
    setCharacterPlay();
    setBossPlay();
    isPause = false;
}

/**
 * This function reactivates enemies intervals.
 */
function setEnemiesPlay() {
    world.level.enemies.forEach((enemy) => {
        enemy.animate();
        enemy.move();
    });
}

/**
 * This function reactivates characters intervals.
 */
function setCharacterPlay() {
    world.character.animate();
    world.character.move();
    world.character.applyGravity(intervalValues.character.gravity);
}

/**
 * This function reactivates boss intervals.
 */
function setBossPlay() {
    if (endbossAnimationHasRun) {
        world.endboss.applyGravity(intervalValues.endboss.gravity);
        if (endbossMoveWasOn) {
            world.endboss.move();
        }
        if (endbossAnimateWasOn) {
            world.endboss.animate();
        }
    }
}

/**
 * This function pauses the game.
 */
function setPause() {
    isPause = true;
    document.getElementById('pauseButton').style.backgroundImage = `url('img/icons/play.png')`;
    setEnemiesPause();
    setCharacterPause();
    setBossPause();
}

/**
 * This function clears all enemy intervals.
 */
function setEnemiesPause() {
    world.level.enemies.forEach((enemy) => {
        enemy.deleteAllIntervals();
    });
}

/**
 * This function clears all intervals of character.
 */
function setCharacterPause() {
    world.character.deleteAllIntervals();
}

/**
 * This function clears all intervals of endboss.
 */
function setBossPause() {
    if (endbossAnimationHasRun) {
        checkBossMoved();
        checkBossAnimated();
        world.endboss.deleteAllIntervals();
    }
}

/**
 * This function checks if boss animation interval is active and save it in a boolean.
 */
function checkBossAnimated() {
    if (world.endboss.intervals.animations.length === 0) {
        endbossAnimateWasOn = false;
    } else {
        endbossAnimateWasOn = true;
    }
}

/**
 * This function checks if boss move interval is active and save it in a boolean.
 */
function checkBossMoved() {
    if (world.endboss.intervals.moves.length === 0) {
        endbossMoveWasOn = false;
    } else {
        endbossMoveWasOn = true;
    }
}

/**
 * This function restarts the game.
 */
function restartGame() {
    world = null;
    resetGlobalVariables();
    deleteAllIntervals();
    init();
}

/**
 * This function resets global variables.
 */
function resetGlobalVariables() {
    comingEnemyId = 0;
    bossStatusbarIsShown = false;
    animatinCount = 0;
    characterPosition = 3800;
}

/**
 * This function clears all intervals registered in active intervals array.
 */
function deleteAllIntervals() {
    activeIntervals.forEach(interval => {
        clearInterval(interval);
    });
    activeIntervals = [];
}

/**
 * This function sets sounds properties.
 */
async function setSounds() {
    world.sound_glas.volume = 0.4;
    await playSound(world.sound_ambiente);
    world.sound_ambiente.loop = true;
    world.sound_ambiente.volume = 0.4;
    await playSound(world.sound_music);
    world.sound_music.loop = true;
    world.sound_music.volume = 0.25;
}

/**
 * This function adjusts background layer positions to create a 3D look.
 */
function adjustBackgroundPosition() {
    changeBackgroundPosition();
    changeCloudPosition();
}

/**
 * This function checks if character is moving and did not reached end level screen, and
 * moves the background in the right direction.
 */
function changeBackgroundPosition() {
    world.level.backgroundObjects.forEach((bgr) => {
        if (world.character.isMovingLeft && !endbossAnimationHasRun && world.character.x < 3696) {
            bgr.moveLeft();
        } else if (world.character.isMovingRight && !endbossAnimationHasRun && world.character.x < 3696) {
            bgr.moveRight();
        }
    });
}

/**
 * This function checks if character is moving and did not reached end level screen, and
 * moves the cloud in the right direction.
 */
function changeCloudPosition() {
    world.level.cloudObjects.forEach((cloud) => {
        if (world.character.isMovingLeft && !endbossAnimationHasRun && world.character.x < 3696) {
            cloud.speed = 1;
        } else if (world.character.isMovingRight && !endbossAnimationHasRun && world.character.x < 3696) {
            cloud.speed = -1;
        }
        else {
            cloud.speed = 0.03;
        }
    });
}

// function clearAllIntervals() {
//     intervals.activeIntervals.forEach((interval) => {
//         clearInterval(interval);
//     });
// }
// function registerInterval(pause, functionToRecall, interval, intervalFunction, className, callerId = null) {
//     let id = setInterval(() => {
//         eval(functionToRecall);
//     }, interval);

//     intervals.push({
//         id: id,
//         pause: pause,
//         recallFunction: functionToRecall, // Function to recall this interval with eval('functionToRecall').
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