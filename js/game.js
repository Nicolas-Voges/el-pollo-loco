let mobileDivice = false;
let canvas;
let ctx;
let world;
let keybord = new Keyboard();
let activeIntervals = [];
let SFXvolume = 1;
let musicVolume = 1;
// let pauseIntervals = [];
// let intervals = [];
let comingEnemyId = 0;
let bossStatusbarIsShown = false;
let isPause = false;
let endbossMoveWasOn = false;
let endbossAnimateWasOn = false;
let start = false;
let pauseSetted = true;
let loadingComplete = false;
let imageCache = {};
let gameEnded = false;
let gameEndedTime;
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

function showOtherSettingsWindow() {
    document.getElementById('settingsSoundButton').classList.toggle('active-button');
    document.getElementById('settingsKeysButton').classList.toggle('active-button');
    document.getElementById('settingsSoundWindow').classList.toggle('display-none');
    document.getElementById('settingsKeysWindow').classList.toggle('display-none');
}

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
    mobileDivice = navigator.maxTouchPoints > 0 && /Android|iPhone|HUAWEI|huawei|phone/i.test(navigator.userAgent);
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
    setMobile(document.getElementById('gameContainer'));
    setMobile(document.getElementById('canvas'));
    setMobile(document.getElementById('controlls'));
    setMobile(document.getElementById('loading-animation-overlay'));
    document.getElementById('fullscreenButton').classList.add('display-none');
}

/**
 * This function
 * 
 * @param {Object} element 
 */
function setMobile(element) {
    element.style.width = '100%';
    element.style.height = '100vh';
    element.style.backgroundSize = 'contain';
}


function setFullscreen() {
    document.getElementById('canvas').requestFullscreen();
    document.activeElement.blur();
}

function toggleSettingsWindow() {
    element = document.getElementById('settingsBox');
    element.classList.toggle('display-none');
    document.querySelector('body').classList.toggle('overflow-hidden');
    if (!element.classList.contains('display-none') && start && !isPause && !gameEnded && !endbossAnimationRuns) {
        setPause();
    }
}

/**
 * This function initializes the game by creating level and world and
 * gives the world canvas and keboard.
 */
function init() {
    document.getElementById('settingsBox').classList.add('display-none');
    document.getElementById('restartButton').classList.add('display-none');
    document.getElementById('closeButton').classList.add('display-none');
    document.getElementById('startButton').classList.add('display-none');
    if (mobileDivice) {
        document.getElementById('footer').classList.add('display-none');
        document.getElementById('mobileControlls').classList.remove('visibility-hidden');
    }
    canvas = document.getElementById('canvas');
    canvas.style.backgroundColor = 'black';
    canvas.style.backgroundImage = 'unset';
    gameEnded = false;
    initLevel1();
    world = new World(canvas, keybord);
    if (!loadingComplete) {
        setSounds();
        checkReadyState();
    }
}

/**
 * This function sets sounds properties.
 */
async function setSounds() {
    setVolume();
    await playSound(world.sound_ambiente);
    world.sound_ambiente.loop = true;
    await playSound(world.sound_music);
    world.sound_music.loop = true;
}

function setVolume() {
    iteraterThroughSounds('setSFXVolume(key, nextKey)');
    iteraterThroughSounds('setMusicVolume(key, nextKey)');
}

function closeGame() {
    document.getElementById('footer').classList.remove('display-none');
}
let keyToChange = 0;
function changeKey(key) {
    document.removeEventListener('keydown', keyDown);
    document.addEventListener('keydown', takeKey);
    keyToChange = key;
}

function takeKey(e) {
    console.log(e.code);
    let output = e.code;
    if (e.code === 'Delete') {
        output = 'unset';
    }
    switch (keyToChange) {
        case 1:
            keybord.moveRightKeys[0] = output;
            document.getElementById('rightKey1').innerHTML = output;
            break;
        case 2:
            keybord.moveRightKeys[1] = output;
            document.getElementById('rightKey2').innerHTML = output;
            break;
        case 3:
            keybord.moveRightKeys[2] = output;
            document.getElementById('rightKey3').innerHTML = output;
            break;
        case 4:
            keybord.moveLeftKeys[0] = output;
            document.getElementById('leftKey1').innerHTML = output;
            break;
        case 5:
            keybord.moveLeftKeys[1] = output;
            document.getElementById('leftKey2').innerHTML = output;
            break;
        case 6:
            keybord.moveLeftKeys[2] = output;
            document.getElementById('leftKey3').innerHTML = output;
            break;
        case 7:
            keybord.jumpKeys[0] = output;
            document.getElementById('jumpKey1').innerHTML = output;
            break;
        case 8:
            keybord.jumpKeys[1] = output;
            document.getElementById('jumpKey2').innerHTML = output;
            break;
        case 9:
            keybord.jumpKeys[2] = output;
            document.getElementById('jumpKey3').innerHTML = output;
            break;
        case 10:
            keybord.throwKeys[0] = output;
            document.getElementById('throwKey1').innerHTML = output;
            break;
        case 11:
            keybord.throwKeys[1] = output;
            document.getElementById('throwKey2').innerHTML = output;
            break;
        case 12:
            keybord.throwKeys[2] = output;
            document.getElementById('throwKey3').innerHTML = output;
            break;
        case 13:
            keybord.buyKeys[0] = output;
            document.getElementById('buyKey1').innerHTML = output;
            break;
        case 14:
            keybord.buyKeys[1] = output;
            document.getElementById('buyKey2').innerHTML = output;
            break;
        case 15:
            keybord.buyKeys[2] = output;
            document.getElementById('buyKey3').innerHTML = output;
            break;
        case 16:
            keybord.pauseKeys[0] = output;
            document.getElementById('pauseKey1').innerHTML = output;
            break;
        case 17:
            keybord.pauseKeys[1] = output;
            document.getElementById('pauseKey2').innerHTML = output;
            break;
        case 18:
            keybord.pauseKeys[2] = output;
            document.getElementById('pauseKey3').innerHTML = output;
            break;

        default:
            break;
    }
    document.removeEventListener('keydown', takeKey);
    document.addEventListener('keydown', keyDown);
}

/**
 * This function listens for key down events and sets the right booleans to true. 
 */
window.addEventListener('keydown', keyDown);
function keyDown(e) {
    if (start && !gameEnded) {
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
};

/**
 * This function listens for key up events and sets the right booleans to false.
 */
window.addEventListener('keyup', (e) => {
    if (start && !gameEnded) {
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
        if (world.bottleCooledDown() && start && !gameEnded) {
            keybord.throwKeyPush = true;
        }
    });
    throwButton.addEventListener('touchend', () => {
        document.activeElement.blur();
    });
    leftButton.addEventListener('touchstart', () => {
        if (start && !gameEnded) {
            keybord.moveLeftKeyPush = true;
        }
    });
    leftButton.addEventListener('touchend', () => {
        if (start && !gameEnded) {
            keybord.moveLeftKeyPush = false;
        }
        document.activeElement.blur();
    });
    rightButton.addEventListener('touchstart', () => {
        if (start && !gameEnded) {
            keybord.moveRightKeyPush = true;
        }
    });
    rightButton.addEventListener('touchend', () => {
        if (start && !gameEnded) {
            keybord.moveRightKeyPush = false;
        }
        document.activeElement.blur();
    });
    jumpButton.addEventListener('touchstart', () => {
        if (start && !gameEnded) {
            keybord.jumpKeyPush = true;
        }
    });
    jumpButton.addEventListener('touchend', () => {
        if (start && !gameEnded) {
            keybord.jumpKeyPush = false;
        }
        document.activeElement.blur();
    });
}

/**
 * This function starts the game if it is not already started.
 * If game already runs this function pauses the game if also endboss entrence animation is not running now.
 */
function startPauseGame() {
    if (!start) {
        checkForMobile();
        start = true;
        document.getElementById('loading-animation-overlay').classList.remove('display-none');
        document.getElementById('canvas').style.backgroundImage = 'unset';
        addTouchEvents();
        loadImages();
        init();
    } else if (!endbossAnimationRuns && !gameEnded) {
        pause();
    }
}

function checkForMobile() {
    if (mobileDivice) {
        if (isPortrait()) {
            document.getElementById('portraitOverlay').classList.remove('display-none');
            document.getElementById('footer').classList.add('display-none');
            return;
        }
    }
}


function isPortrait() {
    return screen.availHeight > screen.availWidth;
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
    document.getElementById('settingsBox').classList.add('display-none');
    document.getElementById('pauseButton').style.backgroundImage = `url('img/icons/pause.png')`;
    setEnemiesPlay();
    setCharacterPlay();
    setBossPlay();
    world.run();
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
    clearInterval(world.intervals[0]);
    activeIntervals.splice(activeIntervals.indexOf(world.intervals[0]), 1);
    world.intervals = [];
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

function showEndScreen(gameStatus) {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.getElementById('canvas').style.backgroundSize = 'contain';
    document.getElementById('restartButton').classList.remove('display-none');
    if (mobileDivice) {
        document.getElementById('closeButton').classList.remove('display-none');
        document.getElementById('mobileControlls').classList.add('visibility-hidden');
    }
    if (gameStatus === 'lose') {
        ctx.drawImage(imageCache['img/9_intro_outro_screens/game_over/you lost.png'], 50, 50, this.canvas.width - 100, this.canvas.height - 100);
    } else if (gameStatus === 'win') {
        ctx.drawImage(imageCache['img/9_intro_outro_screens/win/win_2.png'], 50, 50, this.canvas.width - 100, this.canvas.height - 100);
    }
}

/**
 * This function restarts the game.
 */
function restartGame() {
    stopGame();
    init();
}

function stopGame() {
    cancelAnimationFrame(world.requestId);
    world = null;
    resetGlobalVariables();
    deleteAllIntervals();
}

/**
 * This function resets global variables.
 */
function resetGlobalVariables() {
    comingEnemyId = 0;
    bossStatusbarIsShown = false;
    animatinCount = 0;
    characterPosition = 3800;
    backgrounds = [];
    endbossAnimationRuns = false;
    endbossAnimationHasRun = false;
    earthquakeDone = false;
    bossFightStarted = false;
    bossFightDone = true;
    attackJumpStarted = false;
    bossAttackAnimationRuns = false;
    endbossMoveWasOn = false;
    endbossAnimateWasOn = false;
    keybord.jumpKeyPush = false;
    keybord.moveLeftKeyPush = false;
    keybord.moveRightKeyPush = false;
    keybord.throwKeyPush = false;
    keybord.pauseKeyPush = false;
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