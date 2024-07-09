let loaded = 0;
let MUTE = 1;
let SFXvolume = 1;
let musicVolume = 1;
let loadingComplete = false;
let imageCache = {};
let isCheckingPortrait = false;
let pathThroughToggleFullscreen = false;

loadImage('img/9_intro_outro_screens/game_over/you lost.png');
loadImage('img/9_intro_outro_screens/win/win_2.png');

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
 * This function mutes and unmutes all Sounds.
 */
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

/**
 * This function loads remaining images.
 */
function loadImages() {
    loadImagesFromArray(IMAGES_PATHS.throwableObject.IMAGES_ROTATE);
    loadImagesFromArray(IMAGES_PATHS.throwableObject.IMAGES_SPLASH);
    loadImagesFromArray(IMAGES_PATHS.endScreens.lose);
    loadImagesFromArray(IMAGES_PATHS.endScreens.win);
}

function loadImage(path) {
    if (!imageCache[path]) {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    }
}

/**
 * This function loads images of
 * 
 * @param {Array} arr and stores images in JSON image cache.
 */
function loadImagesFromArray(arr) {
    arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        imageCache[path] = img;
    });
}

/**
 * This function checks if sound is loaded and increases loaded counter if thats the case.
 * 
 * @param {string} key 
 * @param {string} nextKey 
 */
function addLoaded(key, nextKey) {
    if (SOUNDS[`${key}`][`${nextKey}`].SOUND.readyState > SOUNDS[`${key}`][`${nextKey}`].SOUND.HAVE_CURRENT_DATA) {
        loaded++;
    }
}

/**
 * This function sets SFX volume.
 * 
 * @param {string} key 
 * @param {string} nextKey 
 */
function setSFXVolume(key, nextKey) {
    let input = +document.getElementById('sfxSoundInput').value
    if (nextKey !== 'MUSIC') {
        SOUNDS[`${key}`][`${nextKey}`].SOUND.volume = SOUNDS[`${key}`][`${nextKey}`].VOLUME * (input / 100) * MUTE;
    }
}

/**
 * This function sets music volume.
 * 
 * @param {string} key 
 * @param {string} nextKey 
 */
function setMusicVolume(key, nextKey) {
    let input = +document.getElementById('musicInput').value
    if (nextKey === 'MUSIC') {
        SOUNDS[`${key}`][`${nextKey}`].SOUND.volume = SOUNDS[`${key}`][`${nextKey}`].VOLUME * (input / 100) * MUTE;
    }
}

/**
 * This function iterates through SOUNDS JSON and evals
 * 
 * @param {string} func .
 */
function iteraterThroughSounds(func) {
    Object.keys(SOUNDS).forEach((key) => {
        Object.keys(SOUNDS[`${key}`]).forEach((nextKey) => {
            eval(func);
        });
    });
}

/**
 * This function checks if
 * 
 * @param {Object} key is an array and
 * @returns {boolean} true if thats the case.
 */
function valueTypeIsArray(key) {
    return Array.isArray(key);
}

/**
 * This function checks if images and sounds are loaded.
 */
function checkReadyState() {
    setPause();
    let id = setInterval(() => {
        checkImagesLoaded();
        checkSoundsLoaded();
        document.getElementById('loadPercentage').innerHTML = Math.floor((100 / 151) * loaded);
        if (loaded === 151) {
            setLoaded(id);
        }
        loaded = 0;
    }, 25);
    activeIntervals.push(id);
}

/**
 * This function checks if sounds are loaded.
 */
function checkSoundsLoaded() {
    iteraterThroughSounds('addLoaded(key, nextKey);');
}

/**
 * This function sets values for loading is complete.
 */
function setLoaded(id) {
    clearInterval(id);
    activeIntervals.splice(activeIntervals.indexOf(id), 1);
    document.getElementById('loading-animation-overlay').classList.add('display-none');
    loadingComplete = true;
    setPlay();
}

/**
 * This function checks if images are loaded.
 */
function checkImagesLoaded() {
    Object.keys(imageCache).forEach((img) => {
        if (imageCache[`${img}`].complete) {
            loaded++;
        }
    });
}
let setedFullscreen = false;
let endedFullscreen = false;
/**
 * This function toggles fullscreen mode.
 */
function toggleFullscreen() {
    if (fullscreen) {
        endedFullscreen = true;
        endFullscreen();
    } else {
        setedFullscreen = true;
        setFullscreen();
    }
}

document.addEventListener('fullscreenchange', () => {
    if (setedFullscreen) {
        setedFullscreen = false;
    } else if (!endedFullscreen) {
        endFullscreen(true);
    } else {
        endedFullscreen = false;
    }
});

/**
 * This function ends full screen mode.
 */
function endFullscreen(alreadyEnded = false) {
    fullscreen = false;
    if (!alreadyEnded) {
        document.exitFullscreen();
    }
    document.getElementById('canvas').classList.remove('fullscreen');
    document.getElementById('controls').classList.remove('fullscreen');
    document.getElementById('iconsBox').style.width = '80%';
    document.activeElement.blur();
}

/**
 * This function sets full screen mode.
 */
function setFullscreen() {
    document.getElementById('fullscreenBox').requestFullscreen();
    document.getElementById('canvas').classList.add('fullscreen');
    document.getElementById('controls').classList.add('fullscreen');
    document.getElementById('iconsBox').style.width = '100%';
    document.activeElement.blur();
    setedFullscreen = true;
    fullscreen = true;
}

/**
 * This function toggles settings window.
 */
function toggleSettingsWindow() {
    resetKeyboard();
    element = document.getElementById('settingsBox');
    element.classList.toggle('display-none');
    document.querySelector('body').classList.toggle('overflow-hidden');
    if (!element.classList.contains('display-none') && start && !isPause && !gameEnded && !endbossAnimationRuns) {
        setPause();
    }
}

/**
 * This function toggels between settings option windows.
 */
function showOtherSettingsWindow() {
    document.getElementById('settingsSoundButton').classList.toggle('active-button');
    document.getElementById('settingsKeysButton').classList.toggle('active-button');
    document.getElementById('settingsSoundWindow').classList.toggle('display-none');
    document.getElementById('settingsKeysWindow').classList.toggle('display-none');
}

/**
 * This function checks if users divice is a mobil or desktop device.
 */
function isMobile() {
    mobileDivice = navigator.maxTouchPoints > 0 && /Android|iPhone|HUAWEI|huawei|phone/i.test(navigator.userAgent);
    if (mobileDivice) {
        setForMobile();
    }
    return mobileDivice;
}

/**
 * This function sets mobile view.
 */
function setForMobile() {
    document.querySelector('h1').classList.add('display-none');
    setMobile(document.getElementById('gameContainer'));
    setMobile(document.getElementById('canvas'));
    setMobile(document.getElementById('controls'));
    setMobile(document.getElementById('loading-animation-overlay'));
    document.getElementById('fullscreenButton').classList.add('display-none');
    document.getElementById('settingsButtonBox').classList.add('display-none');
}

/**
 * This function changes element style to fullscreen.
 * 
 * @param {Object} element 
 */
function setMobile(element) {
    element.style.width = '100%';
    element.style.height = '100vh';
    element.style.backgroundSize = 'contain';
}

/**
 * This function sets sounds volume.
 */
function setVolume() {
    iteraterThroughSounds('setSFXVolume(key, nextKey)');
    iteraterThroughSounds('setMusicVolume(key, nextKey)');
}

/**
     * This function checks if user dvice is mobil and in portrait mode.
     * If thats the case this function pauses the game and checks in an interval if uster turned his divice back.
     */
function checkForPortraitView() {
    if (mobileDivice && isPortrait() && !endbossAnimationRuns && !isCheckingPortrait) {
        let setedPause = setValuesForPortrait();
        let id = setInterval(() => {
            if (isPortrait()) {
                document.getElementById('portraitOverlay').style.zIndex = '1';
                document.getElementById('portraitOverlay').classList.remove('display-none');
            } else {
                stopCheckingPortraitView(id, setedPause);
                isCheckingPortrait = false;
            }
        }, 100);
    }
}

/**
 * This function disables a new entry into this function. Also checks if game started
 * and sets pause and
 * 
 * @returns {boolean} true if thats the case.
 */
function setValuesForPortrait() {
    isCheckingPortrait = true;
    if (start) {
        setPause();
        return true;
    } else {
        return false;
    }
}

/**
* This function stops checking for landscape mode.
* 
* @param {number} id 
*/
function stopCheckingPortraitView(id, setedPause) {
    document.getElementById('portraitOverlay').style.zIndex = '-1';
    clearInterval(id);
    if (setedPause) {
        resetKeyboard();
        setPlay();
    }
}

/**
 * This function sets sounds properties.
 */
async function setSounds() {
    setVolume();
    await playSound(SOUNDS.world.AMBIENTE.SOUND);
    SOUNDS.world.AMBIENTE.SOUND.loop = true;
    await playSound(SOUNDS.world.MUSIC.SOUND);
    SOUNDS.world.MUSIC.SOUND.loop = true;
    SOUNDS.character.LONG_IDLE.SOUND.loop = true;
}

/**
 * This function checks if user divice is mobile and turned in portrait view.
 * If thats the case the user gets a feedback to turn his device in landscape view.
 */
function checkForMobile() {
    if (mobileDivice) {
        if (isPortrait()) {
            document.getElementById('portraitOverlay').classList.remove('display-none');
            document.getElementById('footer').classList.add('display-none');
            checkForPortraitView();
        }
    }
}