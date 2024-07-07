let keyToChange = 0;

/**
 * This function adds a new key down event to change an input key.
 * 
 * @param {number} key 
 */
function changeKey(key) {
    document.removeEventListener('keydown', keyDown);
    document.addEventListener('keydown', takeKey);
    document.getElementById('chooseKeyOverlay').classList.remove('display-none');
    keyToChange = key;
}

/**
 * This function changes a key to control the game and reactivats the key down event.
 * 
 * @param {Object} e 
 */
function takeKey(e) {
    let output = e.code;
    if (e.code === 'Delete') {
        output = 'unset';
    }
    switch (keyToChange) {
        case 1:
            keyboard.moveRightKeys[0] = output;
            document.getElementById('rightKey1').innerHTML = output;
            break;
        case 2:
            keyboard.moveRightKeys[1] = output;
            document.getElementById('rightKey2').innerHTML = output;
            break;
        case 3:
            keyboard.moveRightKeys[2] = output;
            document.getElementById('rightKey3').innerHTML = output;
            break;
        case 4:
            keyboard.moveLeftKeys[0] = output;
            document.getElementById('leftKey1').innerHTML = output;
            break;
        case 5:
            keyboard.moveLeftKeys[1] = output;
            document.getElementById('leftKey2').innerHTML = output;
            break;
        case 6:
            keyboard.moveLeftKeys[2] = output;
            document.getElementById('leftKey3').innerHTML = output;
            break;
        case 7:
            keyboard.jumpKeys[0] = output;
            document.getElementById('jumpKey1').innerHTML = output;
            break;
        case 8:
            keyboard.jumpKeys[1] = output;
            document.getElementById('jumpKey2').innerHTML = output;
            break;
        case 9:
            keyboard.jumpKeys[2] = output;
            document.getElementById('jumpKey3').innerHTML = output;
            break;
        case 10:
            keyboard.throwKeys[0] = output;
            document.getElementById('throwKey1').innerHTML = output;
            break;
        case 11:
            keyboard.throwKeys[1] = output;
            document.getElementById('throwKey2').innerHTML = output;
            break;
        case 12:
            keyboard.throwKeys[2] = output;
            document.getElementById('throwKey3').innerHTML = output;
            break;
        default:
            break;
    }
    resetKeydownEvntListener();
}

/**
 * This function resets the key down event listener.
 */
function resetKeydownEvntListener() {
    document.removeEventListener('keydown', takeKey);
    document.addEventListener('keydown', keyDown);
    document.getElementById('chooseKeyOverlay').classList.add('display-none');
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
                keyboard.jumpKeyPush = true;
                break;
            case (world.keyboard.moveLeftKeys[0]):
            case (world.keyboard.moveLeftKeys[1]):
            case (world.keyboard.moveLeftKeys[2]):
                keyboard.moveLeftKeyPush = true;
                break;
            case (world.keyboard.moveRightKeys[0]):
            case (world.keyboard.moveRightKeys[1]):
            case (world.keyboard.moveRightKeys[2]):
                keyboard.moveRightKeyPush = true;
                break;
            case (world.keyboard.throwKeys[0]):
            case (world.keyboard.throwKeys[1]):
            case (world.keyboard.throwKeys[2]):
                if (world.bottleCooledDown()) {
                    keyboard.throwKeyPush = true;
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
                keyboard.jumpKeyPush = false;
                break;
            case (world.keyboard.moveLeftKeys[0]):
            case (world.keyboard.moveLeftKeys[1]):
            case (world.keyboard.moveLeftKeys[2]):
                keyboard.moveLeftKeyPush = false;
                break;
            case (world.keyboard.moveRightKeys[0]):
            case (world.keyboard.moveRightKeys[1]):
            case (world.keyboard.moveRightKeys[2]):
                keyboard.moveRightKeyPush = false;
                break;
            case (world.keyboard.throwKeys[0]):
            case (world.keyboard.throwKeys[1]):
            case (world.keyboard.throwKeys[2]):
                keyboard.throwKeyPush = false;
                break;
            default:
                break;
        }
    }
});

/**
 * This function disables contexmenu on right click.
 */
window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
});

/**
 * This function adds touch evens for mobil.
 */
function addTouchEvents() {
    let throwButton = document.getElementById('throwButton');
    let leftButton = document.getElementById('leftButton');
    let rightButton = document.getElementById('rightButton');
    let jumpButton = document.getElementById('jumpButton');
    addThrowTouchEvent(throwButton);
    addTouchEvent(leftButton, 'moveLeftKeyPush');
    addTouchEvent(rightButton, 'moveRightKeyPush');
    addTouchEvent(jumpButton, 'jumpKeyPush');
}

/**
 * This function adds touch event listeners to the throw button.
 * 
 * @param {Object} throwButton 
 */
function addThrowTouchEvent(throwButton) {
    throwButton.addEventListener('touchstart', () => {
        if (world.bottleCooledDown() && start && !gameEnded && world.character.bottles > 0) {
            keyboard.throwKeyPush = true;
        }
    });
    throwButton.addEventListener('touchend', () => {
        document.activeElement.blur();
    });
}

/**
 * This function adds touch event listeners to the handed over element.
 * 
 * @param {Object} element 
 * @param {string} keyboardBoolean 
 */
function addTouchEvent(element, keyboardBoolean) {
    element.addEventListener('touchstart', () => {
        if (start && !gameEnded) {
            keyboard[`${keyboardBoolean}`] = true;
        }
    });
    element.addEventListener('touchend', () => {
        if (start && !gameEnded) {
            keyboard[`${keyboardBoolean}`] = false;
        }
        document.activeElement.blur();
    });
}