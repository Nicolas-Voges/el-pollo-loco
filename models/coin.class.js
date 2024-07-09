class Coin extends CollectableObject {
    offsetTop = 37;
    offsetRight = 37;
    offsetBottom = 37;
    offsetLeft = 37;
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * This first called function calls the constructor function of collectable objects and hands over
     * 
     * @param {number} x 
     * @param {number} y 
     * 
     * Also loads coin images and animates the coin.
     */
    constructor(x, y) {
        super(x, y).loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    /**
     * This function animates the chick in an interval and registers it.
     */
    animate() {
        let id = setInterval(() => {
        this.playAnimation(this.IMAGES);
        }, 1000 / 3);
        this.registerInterval(id, 'animations');
    }
}