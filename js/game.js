let canvas;
let ctx;
let world;
let keybord = new Keyboard();
let activeIntervals = [];
let pauseIntervals = [];
let intervals = [];

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
});

window.addEventListener('keyup', (e) => {
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

function pause() {
    if (isPause) {
        world.level.enemies.forEach((enemy) => {
            enemy.animate();
        });
        world.character.animate();
        world.character.applyGravity();
        if (world.endbossAnimationHasRun) {
            world.endboss.applyGravity();
        }
        isPause = false;
    } else {
        world.level.enemies.forEach((enemy) => {
            enemy.deleteAllIntervals();
        });
        world.character.deleteAllIntervals();
        isPause = true;
    }
}

function registerInterval(pause, functionToRecall, interval, name) {
    let id = setInterval(() => {
        eval(functionToRecall);
    }, interval);

    intervals.push({
        id: id,
        pause: pause,
        recallFunction: functionToRecall,
        interval: interval,
        name: name
    });
}

function deleteIntervals(pause) {
    if (pause) {
        intervals.forEach(interval => {
            if (interval.pause) {
                clearInterval(interval.id);
            }
        });
    } else {
        intervals.forEach(interval => clearInterval(interval.id));
    }
}

function restartPauseIntervals() {
    intervals.forEach(interval => {
        if (interval.pause) {
            registerInterval(interval.pause, interval.functionToRecall, interval.interval);
        }
    });
}

function restartGame() {

}