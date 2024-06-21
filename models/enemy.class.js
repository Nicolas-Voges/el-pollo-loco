class Enemy extends MovableObject {
    id;
    constructor(x) {
        super();
        this.x = x + Math.random() * 500;
    }
}