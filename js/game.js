let mobileDivice = false;
let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let activeIntervals = [];
let comingEnemyId = 0;
let bossStatusbarIsShown = false;
let isPause = false;
let endbossMoveWasOn = false;
let endbossAnimateWasOn = false;
let start = false;
let pauseSetted = true;
let gameEnded = false;
let gameEndedTime;
let fullscreen = false;

/**
 * This function initializes the game by creating level and world and
 * gives the world canvas and keboard.
 */
function init() {
    removeNotNeededElements();
    initMobile();
    canvas = document.getElementById('canvas');
    canvas.style.backgroundColor = 'black';
    canvas.style.backgroundImage = 'unset';
    gameEnded = false;
    initLevel1();
    world = new World(canvas, keyboard);
    if (!loadingComplete) {
        setSounds();
        checkReadyState();
    }
}

/**
 * This function removes elements which may block the view.
 */
function removeNotNeededElements() {
    document.getElementById('settingsBox').classList.add('display-none');
    document.getElementById('restartButton').classList.add('display-none');
    document.getElementById('closeButton').classList.add('display-none');
    document.getElementById('startButton').classList.add('display-none');
    document.getElementById('endgameButtonBox').classList.add('display-none');
}

/**
 * This function hides the footer and shows mobile controls.
 */
function initMobile() {
    if (mobileDivice) {
        document.getElementById('footer').classList.add('display-none');
        document.getElementById('mobileControls').classList.remove('visibility-hidden');
        document.getElementById('mobileControls').classList.remove('display-none');
    }
}

/**
 * This function shows the footer.
 */
function closeGame() {
    document.getElementById('footer').classList.remove('display-none');
}

/**
 * This function starts the game if it is not already started.
 * If game already runs this function pauses the game if also endboss entrence animation is not running now.
 */
function startPauseGame() {
    if (!start) {
        if (checkForMobile()) {
            return;
        }
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
    changeCloudPosition(0);
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

/**
 * This function shows the endscreen and hides mobile controls.
 * 
 * @param {string} gameStatus 
 */
function showEndScreen(gameStatus) {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.getElementById('canvas').style.backgroundSize = 'contain';
    document.getElementById('endgameButtonBox').classList.remove('display-none');
    document.getElementById('mobileControls').classList.add('display-none');
    document.getElementById('restartButton').classList.remove('display-none');
    showMobileEndScreen();
    chooseEndScreenImmage(gameStatus);
}

/**
 * This function shows the mobile end screen.
 */
function showMobileEndScreen() {
    if (mobileDivice) {
        document.getElementById('closeButton').classList.remove('display-none');
        document.getElementById('mobileControls').classList.add('visibility-hidden');
    }
}

/**
 * This function chooses the background image by considering 
 * 
 * @param {string} gameStatus .
 */
function chooseEndScreenImmage(gameStatus) {
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

/**
 * THis function stops the game and resets global variables and intervals.
 */
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
    animatinCount = 0;
    characterPosition = 3800;
    comingEnemyId = 0;
    soundCounter = 0;
    resetBossValues();
    resetKeyboard();
}

/**
 * This function resets global variables for end boss.
 */
function resetBossValues() {
    earthquakeDone = false;
    endbossAnimationHasRun = false;
    endbossAnimationRuns = false;
    endbossMoveWasOn = false;
    endbossAnimateWasOn = false;
    attackJumpStarted = false;
    bossAttackAnimationRuns = false;
    bossFightStarted = false;
    bossFightDone = true;
    bossStatusbarIsShown = false;
}

/**
 * This function resetskeyboard values.
 */
function resetKeyboard() {
    keyboard.jumpKeyPush = false;
    keyboard.moveLeftKeyPush = false;
    keyboard.moveRightKeyPush = false;
    keyboard.throwKeyPush = false;
    keyboard.pauseKeyPush = false;
    keyToChange = 0;
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
function changeCloudPosition(factor = 1) {
    world.level.cloudObjects.forEach((cloud) => {
        if (world.character.isMovingLeft && !endbossAnimationHasRun && world.character.x < 3696) {
            cloud.speed = 1 * factor;
        } else if (world.character.isMovingRight && !endbossAnimationHasRun && world.character.x < 3696) {
            cloud.speed = -1 * factor;
        }
        else {
            cloud.speed = 0.03 * factor;
        }
    });
}

/**
 * This function updates the status bars.
 */
function updateStatusBars() {
    world.statusBarCoin.setPercentage(world.character.coins * 20 + 18);
    world.statusBarBottle.setPercentage(world.character.bottles * 20 + 18);
    world.statusBarEnergy.setPercentage(world.character.energy);
    world.statusBarBoss.setPercentage(world.endboss.energy);
}

/**
 * This function checks if the game is over and sets values for win or lose.
 */
function checkForEndingGame() {
    if (world.endboss.energy <= 0 && world.endboss.deathAnimationDone && earthquakeDone) {
        setGameEnd('win');
        SOUNDS.endboss.ALERT.SOUND.pause();
        SOUNDS.endboss.HURT.SOUND.pause();
        playSound(SOUNDS.endboss.DEAD.SOUND);
    } else if (world.character.energy <= 0 && world.character.deathAnimationDone) {
        setGameEnd('lose');
    }
}

/**
 * This function sets values to ending gane.
 */
function setGameEnd(gameResult) {
    if (!gameEnded) {
        gameEnded = true;
        gameEndedTime = new Date().getTime();
    }
    if (new Date().getTime() - gameEndedTime > 1000) {
        stopGame();
        showEndScreen(gameResult);
    }
}