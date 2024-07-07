let drawableObjects = [];
let loaded = 0;
let MUTE = 1;

function muteSounds() {
    if (MUTE === 1) {
        document.getElementById('muteButton').style.backgroundImage = "url('img/icons/mute.png')";
        MUTE = 0;
        setVolume();
    } else {
        document.getElementById('muteButton').style.backgroundImage = "url('img/icons/loud.png')";
        MUTE = 1;
        setVolume();
    }
}

function loadImages() {
    IMAGES_PATHS.throwableObject.IMAGES_ROTATE.forEach((path) => {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    });
    IMAGES_PATHS.throwableObject.IMAGES_SPLASH.forEach((path) => {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    });
    IMAGES_PATHS.endScreens.lose.forEach((path) => {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    });
    IMAGES_PATHS.endScreens.win.forEach((path) => {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    });
}

function addLoaded(key, nextKey) {
    if (SOUNDS[`${key}`][`${nextKey}`].SOUND.readyState > SOUNDS[`${key}`][`${nextKey}`].SOUND.HAVE_CURRENT_DATA) {
        loaded++;
    }
}

function setSFXVolume(key, nextKey) {
    let input = +document.getElementById('sfxSoundInput').value
    if (nextKey !== 'MUSIC') {
        SOUNDS[`${key}`][`${nextKey}`].SOUND.volume = SOUNDS[`${key}`][`${nextKey}`].VOLUME * (input / 100) * MUTE;
    }
}


function setMusicVolume(key, nextKey) {
    let input = +document.getElementById('musicInput').value
    if (nextKey === 'MUSIC') {
        SOUNDS[`${key}`][`${nextKey}`].SOUND.volume = SOUNDS[`${key}`][`${nextKey}`].VOLUME * (input / 100) * MUTE;
    }
}

function iteraterThroughSounds(func) {
    Object.keys(SOUNDS).forEach((key) => {
        Object.keys(SOUNDS[`${key}`]).forEach((nextKey) => {
            eval(func);
        });
    });
}

function valueTypeIsArray(key) {
    return Array.isArray(key);
}

function checkReadyState() {
    setPause();
    let id = setInterval(() => {
        // console.log('data checkReadyState');
        checkImagesLoaded();
        checkSoundsLoaded();
        document.getElementById('loadPercentage').innerHTML = Math.floor((100 / 151) * loaded);
        if (loaded === 151) {
            clearInterval(id);
            activeIntervals.splice(activeIntervals.indexOf(id), 1);
            document.getElementById('loading-animation-overlay').classList.add('display-none');
            loadingComplete = true;
            setPlay();
        }
        // console.log(loaded);
        loaded = 0;
    }, 25);
    activeIntervals.push(id);
}

function checkSoundsLoaded() {
    iteraterThroughSounds('addLoaded(key, nextKey);');
}

function checkImagesLoaded() {
    Object.keys(imageCache).forEach((img) => {
        if (imageCache[`${img}`].complete) {
            loaded++;
        }
    });
}