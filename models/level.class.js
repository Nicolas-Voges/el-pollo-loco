class Level {
    enemies;
    cloudObjects;
    backgroundObjects;
    level_start_x = 50;
    level_end_x = 4310;
    collectableObjects;

    constructor(enemies, clouds, backgroundObjects, collectableObjects) {
        this.enemies = enemies;
        this.cloudObjects = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableObjects = collectableObjects;
    }
}