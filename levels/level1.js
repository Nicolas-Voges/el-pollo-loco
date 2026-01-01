let level1;
let collectableObjects;
let backgrounds = [];

/**
 * This function creates the backgrounds for the game and hands over layer and optional speed.
 */
function createBackgrounds() {
    createAir();
    createBackground(3, 1);
    createBackground(2, 0.5);
    createBackground(1);
}

/**
 * This function creates new background objects by considering layer and speed.
 * 
 * @param {number} layer 
 * @param {number} speed 
 */
function createBackground(layer, speed = 0) {
    for (let i = 0, px = -719; i < 7; i++, px += 1438) {
        backgrounds.push(new BackgroungObject(IMAGES_PATHS.backgrounds[`layer${layer}`][0], px, speed));
        backgrounds.push(new BackgroungObject(IMAGES_PATHS.backgrounds[`layer${layer}`][1], 719 + px, speed));
    }
}

/**
 * This function creates the background air.
 */
function createAir() {
    for (let i = 0, px = -719; i < 14; i++, px += 719) {
        backgrounds.push(new BackgroungObject(IMAGES_PATHS.backgrounds.air[0], px, 0));
    }
}

/**
 * This function initializes level1 with enemies, clouds, backgrounds and collectable objects.
 */
function initLevel1() {
    createBackgrounds();
    level1 = new Level([
        new Chick(1500),
        new Chick(1500),
        new Chick(1500),
        new Chick(2300),
        new Chick(2300),
        new Chicken(2500),
        new Chicken(2500),
        new Chicken(2500),
        new Chicken(2700),
        new Chicken(2750),
        new Chicken(2800),
        new Chicken(2850),
        new Chicken(2900),
        new Chicken(3000),
        new Chicken(3050),
        new Chicken(3100),
        new Chicken(3200),
        new Chicken(3300),
        new Chicken(3300),
        new Chicken(3300),
        new Endboss()
    ],
        cloudObjects = [
            new Cloud(600),
            new Cloud(1100),
            new Cloud(2020),
            new Cloud(3333),
            new Cloud(4000),
            new Cloud(5000)
        ],
        backgrounds,
        collectableObjects = [
            new Coin(100, 100),
            new Coin(1200, 140),
            new Coin(1250, 130),
            new Coin(2000, 100),
            new Coin(2400, 50),
            new Bottle(1550, 325, 0),
            new Bottle(2940, 390, 1),
            new Bottle(3740, 100, 2),
            new Bottle(4300, 380, 0),
            new Bottle(2370, 310, 1)
        ]);
}