class Enemy extends MovableObject {
    constructor(x) {
        super();
        this.x = x + Math.random() * 500;
    }
}