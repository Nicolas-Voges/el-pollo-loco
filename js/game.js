let canvas;
let ctx;
let world;
let keybord = new Keyboard();
let activeIntervals = [];

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
        case ('Space'):
            keybord.SPACE = true;
            break;
        case ('KeyA'):
            keybord.A = true;
            break;
        case ('ArrowLeft'):
            keybord.LEFT = true;
            break;
        case ('KeyD'):
            keybord.D = true;
            break;
        case ('ArrowRight'):
            keybord.RIGHT = true;
            break;
        case ('KeyW'):
            keybord.W = true;
            break;
        case ('ArrowUp'):
            keybord.UP = true;
            break;
        case ('KeyS'):
            keybord.S = true;
            break;
        case ('KeyF'):
            keybord.F = true;
            break;
        case ('ArrowDown'):
            keybord.DOWN = true;
            break;
        case ('Enter'):
            keybord.ENTER = true;
            break;
        default:
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case ('Space'):
            keybord.SPACE = false;
            break;
        case ('KeyA'):
            keybord.A = false;
            break;
        case ('ArrowLeft'):
            keybord.LEFT = false;
            break;
        case ('KeyD'):
            keybord.D = false;
            break;
        case ('ArrowRight'):
            keybord.RIGHT = false;
            break;
        case ('KeyW'):
            keybord.W = false;
            break;
        case ('ArrowUp'):
            keybord.UP = false;
            break;
        case ('KeyS'):
            keybord.S = false;
            break;
        case ('KeyF'):
            keybord.F = false;
            break;
        case ('ArrowDown'):
            keybord.DOWN = false;
            break;
        case ('Enter'):
            keybord.ENTER = false;
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
    } else {
        console.log('Gibt noch keine Pausefunktion.');
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
        isPause = false;
    } else {
        world.level.enemies.forEach((enemy) => {
            enemy.deleteAllIntervals();
        });
        world.character.deleteAllIntervals();
        isPause = true;
    }
}