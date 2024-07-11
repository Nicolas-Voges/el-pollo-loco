class StatusBarCoin extends StatusBar {
    percentage = 0;
    y = 45;
    IMAGES = IMAGES_PATHS.statusbars.coins.IMAGES;

    /**
     * This first called function calls the constructor function and loads images.
     * Also sets percentage.
     */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    /**
     * This function checks percentage and
     * 
     * @returns {number} .
     */
    resolveImageIndex() {
        if (this.percentage >= 99) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
