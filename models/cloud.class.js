class Cloud extends MovableObject {
    
    width = 500;
    height = 200;
    y = 20 + Math.random() * 100;
    speed = 0.03;

    constructor(x) {
        let path = 1 + Math.round(Math.random() * 1);
        console.log(path);
        super().loadImage(`./img/5_background/layers/4_clouds/${path}.png`);
        this.x = x + Math.random() * 500;
        this.animate();
    }

    animate() {
        let intervalCloudMove = setInterval(() => {
            this.moveLeft();
        }, 1000 / 200);
        this.registerInterval(intervalCloudMove, 'moves');
    }
}