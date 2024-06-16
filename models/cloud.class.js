class Cloud extends MovableObject {

    width = 500;
    height = 200;
    y = 20 + Math.random() * 100;

    constructor(x) {
        let path = 1 + Math.round(Math.random() * 1);
        console.log(path);
        super().loadImage(`./img/5_background/layers/4_clouds/${path}.png`);
        this.x = x + Math.random() * 500;
        this.speed = 0.01 + Math.round(Math.random() * 1);
        this.animate();
    }

    animate() {
        let intervalCloudMove = setInterval(() => {
            this.moveLeft();
            if (this.x + this.width <= -500) {
                this.x = 5000;
            }
        }, 1000 / 200);
        this.registerInterval(intervalCloudMove, 'moves');
    }
}