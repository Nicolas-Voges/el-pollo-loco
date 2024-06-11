class Bottle extends CollectableObject {
    offsetTop = 10;
    offsetRight = 15;
    offsetBottom = 8;
    offsetLeft = 22;
    width = 60;
    height = 60;
    constructor(x, y, imgIndex) {
        super(x, y).loadImage(this.IMAGES[imgIndex]);
        this.loadImages(this.IMAGES);
        this.chooseOffset(imgIndex);
        // this.registerInterval('bottle', this.animate, 1000 / 2);
        // this.animate();
    }

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/salsa_bottle.png'
    ];

    chooseOffset(imgIndex) {
        switch (imgIndex) {
            case 0:
                this.offsetTop = 10;
                this.offsetRight = 13;
                this.offsetBottom = 8;
                this.offsetLeft = 27;
                break;
            case 1:
                this.offsetTop = 10;
                this.offsetRight = 19;
                this.offsetBottom = 8;
                this.offsetLeft = 19;
                break;
            case 2:
                this.offsetTop = 10;
                this.offsetRight = 23;
                this.offsetBottom = 8;
                this.offsetLeft = 23;
                break;

            default:
                break;
        }
    }

    animate() {
        let intervalBottleAnimate = setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 1000 / 2);
        this.registerInterval(intervalBottleAnimate, 'animations');
    }
}