class Enemy extends MovableObject {
    id;

    /**
     * This first called function calls the constructor function of moveable object class.
     * Adds a random number to its x position and gives the object an id.
     */
    constructor(x) {
        super();
        this.x = x + Math.random() * 500;
        this.id = comingEnemyId;
        comingEnemyId++;
    }
}