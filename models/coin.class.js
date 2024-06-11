class Coin extends CollectableObject {
    offsetTop = 37;
    offsetRight = 37;
    offsetBottom = 37;
    offsetLeft = 37;

    constructor(x, y) {
        super(x, y).loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES);
        this.animate();
    }

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    
    animate() {
        let intervalCoinAnimate = setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 1000 / 3);
        this.registerInterval(intervalCoinAnimate, 'animations');
    }
}